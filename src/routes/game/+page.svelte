<script>
	import data from '$lib/util/data';
	import Game from './Game.svelte';
</script>

{#if $data}
	<Game
		answers={['1', '2', '3']}
		useDesignation={false}
		showConstellation={true}
		latitude={13}
		longitude={100}
	/>
{/if}
