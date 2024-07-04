<script lang="ts">
	import { fetchData } from '$lib/util/data';
	import { getLocation } from '$lib/util/geolocation';
	import { onMount } from 'svelte';

	onMount(() => {
		fetchData();
		getLocation();
	});
</script>

<slot></slot>
