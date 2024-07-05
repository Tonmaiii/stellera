<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let name: string;

	const eventDispatcher = createEventDispatcher();
</script>

<button class="container" on:click={() => eventDispatcher('click')}>{name}</button>

<style>
	.container {
		width: 100%;
		min-height: 3rem;
		border: none;
		border-bottom: 1px solid #000000;
		background: none;
		font: inherit;
	}
</style>
