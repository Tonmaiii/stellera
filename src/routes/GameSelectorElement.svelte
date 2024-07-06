<script lang="ts">
	import { getJson } from '$lib/localstorage/utils';
	import { formatTime } from '$lib/util/timer';
	import type { GameMap } from '$lib/util/types';
	import { createEventDispatcher, onMount } from 'svelte';

	export let map: GameMap;
	export let selected = false;

	let best: { time: number; accuracy: number } | null = null;

	const eventDispatcher = createEventDispatcher();
	onMount(() => {
		const data = getJson<{ [key: string]: { time: number; accuracy: number }[] }>('games', {});
		const games = data[map.id];
		if (games) {
			best = games.reduce((a, b) => {
				if (a.accuracy > b.accuracy) return a;
				if (b.accuracy > a.accuracy) return b;

				if (a.time < b.time) return a;
				return b;
			});
		}
	});
</script>

<button
	class="container {selected ? 'selected' : 'unselected'}"
	on:click={() => eventDispatcher('click')}
>
	<span>
		{map.name}
	</span>
	{#if best}
		<div>
			<span>
				{Math.round(best.accuracy * 100)}%
			</span>
			<span>{formatTime(best.time)}</span>
		</div>
	{/if}
</button>

<style>
	.container {
		width: 100%;
		min-height: 4rem;
		border: none;
		border-bottom: 1px solid #404040;
		background: none;
		font: inherit;
		color: inherit;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		padding: 1rem;
	}

	.container:hover,
	.selected {
		background-color: #2c2c2c;
	}
</style>
