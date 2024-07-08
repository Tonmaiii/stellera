<script lang="ts">
	import HighScore from './HighScore.svelte';
	import Leaderboard from './Leaderboard.svelte';

	export let id: string;

	let state: 'leaderboard' | 'highscore' = 'leaderboard';

	const showLeaderboard = () => {
		state = 'leaderboard';
	};

	const showHighScore = () => {
		state = 'highscore';
	};
</script>

<div class="container">
	<div class="head">
		<button class={state === 'leaderboard' ? 'selected' : ''} on:click={showLeaderboard}>
			<span>LEADERBOARD</span>
		</button>
		<button class={state === 'highscore' ? 'selected' : ''} on:click={showHighScore}>
			<span>MY HIGHSCORES</span>
		</button>
	</div>
	{#if state === 'leaderboard'}
		<Leaderboard {id} />
	{:else}
		<HighScore {id} />
	{/if}
</div>

<style>
	.container {
		width: min(80%, 32rem);
	}

	.head {
		display: flex;
	}

	button {
		border: 1px solid #00000000;
		border-bottom: none;
		background-color: inherit;
		font: inherit;
		font-size: 1rem;
		color: inherit;
		margin: 0;
	}

	.selected {
		border: 1px solid #404040;
		border-bottom: none;
	}

	button:hover {
		background-color: #2c2c2c;
	}
</style>
