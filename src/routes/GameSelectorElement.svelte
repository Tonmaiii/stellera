<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let id: string;
	export let selected = false;

	const eventDispatcher = createEventDispatcher();
</script>

{#if selected}
	<button class="container selected" on:click={() => eventDispatcher('click')}>{id}</button>
{:else}
	<button class="container unselected" on:click={() => eventDispatcher('click')}>{id}</button>
{/if}

<style>
	.container {
		width: 100%;
		min-height: 3rem;
		border: none;
		border-bottom: 1px solid #404040;
		background: none;
		font: inherit;
		color: inherit;
	}

	.container:hover,
	.selected {
		background-color: #2c2c2c;
	}
</style>
