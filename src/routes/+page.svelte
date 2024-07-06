<script lang="ts">
	import { page } from '$app/stores';
	import maps from '$lib/data/maps.json';
	import { geolocation } from '$lib/util/geolocation';
	import { onMount } from 'svelte';
	import Toggle from '../components/Toggle.svelte';
	import GameSelectorElement from './GameSelectorElement.svelte';

	const hash = $page.url.hash.slice(1);
	let selected = maps.find(({ id }) => id == hash) ?? null;
	let defaultSettings = true;
	let showConstellation = true;
	let useDesignation = false;
	let latitudeInput = '';
	let longitudeInput = '';

	let defaultLongitude = $geolocation?.longitude ?? new Date().getTimezoneOffset() / -4;

	let latitude: number;
	let longitude: number;
	$: {
		latitude = parseFloat(latitudeInput);
		if (!Number.isFinite(latitude)) latitude = $geolocation?.latitude ?? 0;
		longitude = parseFloat(longitudeInput);
		if (!Number.isFinite(longitude)) longitude = defaultLongitude;
	}

	onMount(() => {
		if (!selected) {
			location.hash = '';
		}
	});
</script>

<div class="container">
	<div class="game-selector">
		{#each maps as map}
			<GameSelectorElement
				id={map.name}
				selected={map == selected}
				on:click={() => {
					selected = map;
					location.hash = `#${map.id}`;
				}}
			/>
		{/each}
	</div>
	<div class="game-settings">
		{#if selected}
			<h1>{selected.name}</h1>
			<div class="default-settings">
				<span class="toggle-text">Default Settings:</span>
				<Toggle bind:toggled={defaultSettings} />
			</div>
			{#if !defaultSettings}
				<div class="advanced-settings">
					<div class="setting">
						<span class="toggle-text">Show Constellations:</span>
						<Toggle bind:toggled={showConstellation} />
					</div>
					<div class="setting">
						<span class="toggle-text">Use Designation Names:</span>
						<Toggle bind:toggled={useDesignation} />
					</div>
					<div class="setting">
						<span class="toggle-text">Latitude:</span>
						<input
							type="text"
							name="latitude"
							id="latitude"
							placeholder={`${$geolocation?.latitude ?? 0}`}
							bind:value={latitudeInput}
						/>
					</div>
					<div class="setting">
						<span class="toggle-text">Longitude:</span>
						<input
							type="text"
							name="longitude"
							id="longitude"
							placeholder={`${defaultLongitude}`}
							bind:value={longitudeInput}
						/>
					</div>
				</div>
			{/if}
			<a
				class="play"
				href={`/game/${selected.id}?showConstellation=${showConstellation}&useDesignation=${useDesignation}&lat=${parseFloat(latitudeInput)}&long=${parseFloat(longitudeInput)}`}
				><span>PLAY</span></a
			>
		{/if}
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
		border-right: 1px solid #404040;
		background-color: #1a1a1a;
	}

	.game-settings {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 2;
		font-size: 1.5rem;
	}

	h1 {
		text-align: center;
		margin: none;
		margin-top: 3rem;
		font-size: 2rem;
	}

	.default-settings {
		margin-top: 4rem;
	}
	.advanced-settings {
		margin-top: 4rem;
	}

	.setting {
		display: flex;
		justify-content: space-between;
		height: 2.5rem;
	}

	.toggle-text {
		margin-right: 2rem;
	}

	input {
		font: inherit;
		background: none;
		border: inherit;
		border-radius: 0;
		border-bottom: 2px solid #3ac7ff;
		width: 10rem;
		color: inherit;
	}

	a {
		background-color: #3ac7ff;
		color: #000000;
		text-decoration: none;
		font-size: 2.5rem;
		width: 12rem;
		height: 5rem;
		text-align: center;
		border-radius: 5rem;
		padding: none;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.play {
		margin-top: auto;
		margin-bottom: 5rem;
	}
</style>
