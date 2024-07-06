<script lang="ts">
	import Topbar from './Topbar.svelte';

	import { goto } from '$app/navigation';
	import { Overlay } from '$lib/engine/overlay';
	import { PlayerController } from '$lib/engine/playerController';
	import { Engine } from '$lib/engine/webglEngine';
	import { data } from '$lib/util/data';
	import shuffle from '$lib/util/shuffle';
	import { formatTime, resetTimer, stopTimer, timer } from '$lib/util/timer';
	import type { star } from '$lib/util/types';
	import { starSize } from '$lib/util/utils';
	import { onMount } from 'svelte';

	if (!$data) throw new Error('stars data not loaded');
	const { stars, starsIndexed, constellationship } = $data;

	export let map: { id: string; name: string; answers: string[] };
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
		playerController.reset();
		resetTimer();
	};

	const correct = (hic: string) => {
		round++;
		tries = 0;
		correctClicks++;
		overlay.addStarLabel(hic, true);
		overlay.flashFrame = 0;
		if (round >= rounds) {
			completed = true;
			stopTimer();
		}
	};

	const wrong = (hic: string) => {
		tries++;
		wrongClicks++;
		overlay.addStarLabel(hic, false);
	};

	let click = false;
	const clickRange = 30;
	const handleClick = (e: MouseEvent) => {
		if (!playerController.playing) return;
		if (!click) return;

		const mouseX = e.clientX;
		const mouseY = e.clientY;

		let closest = Infinity;
		let closestStar: star | null = null;

		for (let i = 0; i < stars.length; i++) {
			const star = stars[i];
			if (!star.display_name) continue;
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
		}

		if (!closestStar) return;
		if (closestStar.HIC === answers[round]) {
			correct(closestStar.HIC);
		} else {
			wrong(closestStar.HIC);
		}
	};

	const update = () => {
		if (!playerController.playing) return;
		engine.update(playerController);
		overlay.update(
			engine.starScreenPos,
			playerController,
			answers[round],
			useDesignation,
			tries >= 3
		);
		requestAnimationFrame(update);
	};

	onMount(() => {
		const gl = canvas.getContext('webgl2');
		if (!gl) return;
		engine = new Engine(gl, canvas, stars, lines, latitude, longitude, showConstellation);
		overlay = new Overlay(overlayCanvas, starsIndexed);
		resetGame();

		overlay.resize();
		window.addEventListener('resize', () => {
			overlay.resize();
			engine.resize();
		});
		document.addEventListener('pointerup', handleClick);
		document.addEventListener('pointerdown', () => (click = true));
		document.addEventListener('pointermove', () => (click = false));
		playerController.addEventListeners(canvas);

		requestAnimationFrame(update);
	});

	const exitGame = () => {
		playerController.exit();
		goto(`/#${map.id}`);
	};
</script>

<canvas bind:this={canvas} />
<canvas bind:this={overlayCanvas} />

{#if !completed}
	<Topbar
		name={useDesignation
			? starsIndexed[answers[round]].designation_name
			: starsIndexed[answers[round]].display_name}
		percentage={correctClicks + wrongClicks === 0
			? 0
			: Math.round((100 * correctClicks) / (correctClicks + wrongClicks))}
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
