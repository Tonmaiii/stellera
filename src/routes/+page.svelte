<script lang="ts">
	import GameSelectorElement from './GameSelectorElement.svelte';

	let selected: string;
</script>

<div class="container">
	<div class="game-selector">
		{#each 'abcdefghi' as name}
			<GameSelectorElement {name} on:click={() => (selected = name)} />
		{/each}
	</div>
	<div class="game-settings">
		<a href="/game/{selected}">Play {selected}</a>
	</div>
</div>

<style>
	.container {
		display: flex;
		width: 100%;
		height: 100%;
	}
	.game-selector {
		flex: 1;
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow-y: auto;
		border-right: 1px solid #000000;
	}

	.game-settings {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
</style>
