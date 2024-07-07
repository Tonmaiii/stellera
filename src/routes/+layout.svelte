<script lang="ts">
	import { initializeAuth } from '$lib/firebase/auth';
	import { fetchData } from '$lib/util/data';
	import { getLocation } from '$lib/util/geolocation';
	import { onMount } from 'svelte';

	onMount(() => {
		fetchData();
		getLocation();
		initializeAuth();
	});
</script>

<slot></slot>
