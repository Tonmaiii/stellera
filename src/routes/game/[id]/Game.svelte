<script lang="ts">
	import Topbar from './Topbar.svelte';

	import { goto } from '$app/navigation';
	import { Overlay } from '$lib/engine/overlay';
	import { PlayerController } from '$lib/engine/playerController';
	import { Engine } from '$lib/engine/webglEngine';
	import { saveGame } from '$lib/localstorage/recordData';
	import { data } from '$lib/util/data';
	import shuffle from '$lib/util/shuffle';
	import { clearReturnLocation, initialized, returnLocation } from '$lib/util/store';
	import { formatTime, resetTimer, stopTimer, timer } from '$lib/util/timer';
	import type { GameMap, Star } from '$lib/util/types';
	import { equatorialToAltAz, starSize } from '$lib/util/utils';
	import { onDestroy, onMount } from 'svelte';

	if (!$data) throw new Error('stars data not loaded');
	const { stars, starsIndexed, constellationship } = $data;

	export let map: GameMap;
	let answers = map.answers;
	export let useDesignation: boolean;
	export let showConstellation: boolean;

	export let latitude: number;
	export let longitude: number;

	let canvas: HTMLCanvasElement;
	let overlayCanvas: HTMLCanvasElement;

	const lines = Object.values(constellationship)
		.flat(2)
		.map((hic) => starsIndexed[hic].index);

	const rounds = answers.length;

	let completed = false;

	let round = 0;
	let tries = 0;

	let wrongClicks = 0;
	let correctClicks = 0;
	$: accuracy = correctClicks === 0 ? 0 : correctClicks / (correctClicks + wrongClicks);

	let engine: Engine;
	let overlay: Overlay;

	const playerController = new PlayerController();

	const resetGame = () => {
		completed = false;
		round = 0;
		tries = 0;
		wrongClicks = 0;
		correctClicks = 0;
		overlay.removeStarLabels();
		answers = shuffle(answers);
		if (map.initialRotation) {
			const { alt, az } = equatorialToAltAz(
				map.initialRotation.ra,
				map.initialRotation.dec,
				latitude,
				longitude,
				Date.now()
			);
			playerController.reset(alt, az, map.initialRotation.zoom ?? 0);
		} else playerController.reset();
		resetTimer();
	};

	const completedGame = () => {
		completed = true;
		stopTimer();
		accuracy = correctClicks / (correctClicks + wrongClicks);
		saveGame(map.id, $timer, accuracy, showConstellation, useDesignation);
	};

	const correct = (hic: string) => {
		round++;
		tries = 0;
		correctClicks++;
		overlay.addStarLabel(hic, true, true);
		overlay.flashFrame = 0;
		if (round >= rounds) completedGame();
	};

	const wrong = (hic: string) => {
		tries++;
		wrongClicks++;
		overlay.addStarLabel(hic, false, false, useDesignation);
	};

	let click = false;
	const clickRange = 30;
	const handleClick = (e: MouseEvent) => {
		if (!playerController.playing) return;
		if (!click) return;

		const mouseX = e.clientX;
		const mouseY = e.clientY;

		let closest = Infinity;
		let closestStar: Star | null = null;

		let closestAnswer = Infinity;
		let closestAnswerStar: Star | null = null;

		for (let i = 0; i < stars.length; i++) {
			const star = stars[i];
			if (!star.display_name && !answers.includes(star.HIC)) continue;
			if (engine.starScreenPos[3 * i + 2] < 0) continue;

			const starX = ((engine.starScreenPos[3 * i] + 1) / 2) * canvas.width;
			const starY = -((engine.starScreenPos[3 * i + 1] - 1) / 2) * canvas.height;
			const delta = (mouseX - starX) ** 2 + (mouseY - starY) ** 2;

			if (
				delta < closest &&
				(delta <= clickRange ** 2 ||
					delta <= (starSize(star.magnitude, playerController.fov) / 2) ** 2)
			) {
				closest = delta;
				closestStar = star;
			}

			if (
				answers.includes(star.HIC) &&
				delta < closestAnswer &&
				(delta <= clickRange ** 2 ||
					delta <= (starSize(star.magnitude, playerController.fov) / 2) ** 2)
			) {
				closestAnswer = delta;
				closestAnswerStar = star;
			}
		}

		const clickedStar = closestAnswerStar ?? closestStar;

		if (!clickedStar) return;
		if (completed) {
			overlay.addStarLabel(clickedStar.HIC, true, true);
			return;
		}
		if (clickedStar.HIC === answers[round]) {
			correct(clickedStar.HIC);
		} else {
			wrong(clickedStar.HIC);
		}
	};

	const update = () => {
		if (!playerController.playing) return;
		engine.update(playerController);
		overlay.update(engine.starScreenPos, playerController, answers[round], tries >= 3);
		requestAnimationFrame(update);
	};

	onMount(() => {
		engine = new Engine(canvas, stars, lines, latitude, longitude, showConstellation);
		overlay = new Overlay(overlayCanvas, starsIndexed);
		overlay.resize();
		engine.resize();

		resetGame();
		requestAnimationFrame(update);

		// if ($initialized) return;
		window.addEventListener('resize', () => {
			overlay.resize();
			engine.resize();
		});
		document.addEventListener('pointerup', handleClick);
		document.addEventListener('pointerdown', () => (click = true));
		document.addEventListener('pointermove', () => (click = false));
		playerController.addEventListeners(canvas);
		$initialized = true;
	});

	const exitGame = () => {
		playerController.exit();
		if ($returnLocation) {
			const returnUrl = `/menu/${$returnLocation}#${map.id}`;
			clearReturnLocation();
			goto(returnUrl);
			return;
		}
		goto('/menu/recommended');
	};
	onDestroy(() => playerController?.exit?.());
</script>

<canvas bind:this={canvas} />
<canvas bind:this={overlayCanvas} />

{#if !completed}
	<Topbar
		name={useDesignation
			? starsIndexed[answers[round]].designation_name
			: starsIndexed[answers[round]].display_name}
		percentage={Math.round(100 * accuracy)}
		completed={round}
		total={rounds}
	/>
	<button class="back" on:click={exitGame}>
		<i class="fas fa-angle-left" />
	</button>
{:else}
	<div class="container">
		<div class="result">
			<h1>Result</h1>
			<div>
				<h2>
					{Math.round((100 * correctClicks) / (correctClicks + wrongClicks))}%
				</h2>
				<h2>{formatTime($timer)}</h2>
			</div>
			<div>
				<button on:click={resetGame}>Play Again</button>
				<button on:click={exitGame}>Exit</button>
			</div>
		</div>
	</div>
{/if}

<style>
	canvas {
		position: fixed;
		width: 100%;
		height: 100%;
	}

	div.container {
		position: absolute;
		color: white;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	h1,
	h2 {
		margin: 0.25rem;
		display: inline;
	}
	button {
		font-size: 1rem;
	}

	.back {
		position: absolute;
		width: 3rem;
		height: 3rem;
		background-color: transparent;
		border: none;
		margin: 0.5rem;
		color: white;
		font-size: 2rem;
		padding: 0;
		cursor: pointer;
	}

	div.result {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
