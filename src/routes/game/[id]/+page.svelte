<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { data as starsData } from '$lib/util/data';
	import { geolocation } from '$lib/util/geolocation';
	import Game from './Game.svelte';

	export let data;
	const map = data.map;
	if (!map) goto('/');

	const useDesignationParam = $page.url.searchParams.get('useDesignation');
	const showConstellationParam = $page.url.searchParams.get('showConstellations');
	const latitudeParam = $page.url.searchParams.get('lat');
	const longitudeParam = $page.url.searchParams.get('long');

	const useDesignation = useDesignationParam ? useDesignationParam === 'true' : false;
	const showConstellation = showConstellationParam ? showConstellationParam === 'true' : true;
	let latitude = latitudeParam ? parseFloat(latitudeParam) : NaN;
	if (!Number.isFinite(latitude)) latitude = $geolocation?.latitude ?? 0;
	let longitude = longitudeParam ? parseFloat(longitudeParam) : NaN;
	if (!Number.isFinite(longitude))
		longitude = $geolocation?.longitude ?? new Date().getTimezoneOffset() / -4;
</script>

{#if $starsData && map && $geolocation}
	<Game {map} {useDesignation} {showConstellation} {latitude} {longitude} />
{/if}
