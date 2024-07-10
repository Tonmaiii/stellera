<script lang="ts">
	import { user } from '$lib/firebase/auth';
	import { getHighScores, highScores } from '$lib/util/store';
	import { formatTime } from '$lib/util/timer';
	import type { GameMap } from '$lib/util/types';
	import { createEventDispatcher } from 'svelte';

	export let map: GameMap;
	export let selected = false;

	$: best = $highScores.get(map.id)?.[0] ?? null;

	const eventDispatcher = createEventDispatcher();
	$: if ($user.user) getHighScores(map.id, $user.user.uid);
</script>

<button
	class="container {selected ? 'selected' : 'unselected'}"
	on:click={() => eventDispatcher('click')}
>
	<div class="row">
		<span>{map.name}</span>
	</div>
	<div class="row">
		{#if best}
			<div>
				<span>{Math.round(best.accuracy * 100)}%</span>
				<span>{formatTime(best.time)}</span>
			</div>
		{/if}
	</div>
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
		padding-left: 0.75rem;
	}

	.row {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.container:hover,
	.selected {
		background-color: #2c2c2c;
	}
</style>
