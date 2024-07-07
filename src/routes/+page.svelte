<script lang="ts">
	import { page } from '$app/stores';
	import maps from '$lib/data/maps.json';
	import { getJson, setJson } from '$lib/localstorage/utils';
	import { geolocation } from '$lib/util/geolocation';
	import { afterUpdate, onMount } from 'svelte';
	import Toggle from '../components/Toggle.svelte';
	import GameSelectorElement from './GameSelectorElement.svelte';

	let defaultSettings: boolean;
	let showConstellations: boolean;
	let useDesignation: boolean;
	let latitude: number | null;
	let longitude: number | null;

	const hash = $page.url.hash.slice(1);
	let selected = maps.find(({ id }) => id === hash) ?? null;

	let latitudeInput = '';
	let longitudeInput = '';
	let gameParams = new URLSearchParams();

	$: defaultLongitude = $geolocation?.longitude ?? new Date().getTimezoneOffset() / -4;
	$: {
		latitude = parseFloat(latitudeInput);
		if (!Number.isFinite(latitude)) latitude = null;
		longitude = parseFloat(longitudeInput);
		if (!Number.isFinite(longitude)) longitude = null;

		if (selected) {
			gameParams = new URLSearchParams();
			if (defaultSettings) {
				gameParams.append('showConstellations', 'true');
				gameParams.append('useDesignation', 'false');
			} else {
				gameParams.append('showConstellations', `${showConstellations}`);
				gameParams.append('useDesignation', `${useDesignation}`);
			}
			if (latitude) gameParams.append('lat', `${latitude}`);
			if (longitude) gameParams.append('long', `${longitude}`);
			gameParams = gameParams;
		}
	}

	onMount(() => {
		if (!selected) {
			location.hash = '';
		}
		({ defaultSettings, showConstellations, useDesignation, latitude, longitude } = getJson(
			'game_settings',
			{
				defaultSettings: true,
				showConstellations: true,
				useDesignation: false,
				latitude: null as number | null,
				longitude: null as number | null
			}
		));

		latitudeInput = latitude ? `${latitude}` : '';
		longitudeInput = longitude ? `${longitude}` : '';
	});

	afterUpdate(() => {
		setJson('game_settings', {
			defaultSettings,
			showConstellations,
			useDesignation,
			latitude,
			longitude
		});
	});
</script>

<div class="container">
	<div class="game-selector">
		{#each maps as map}
			<GameSelectorElement
				{map}
				selected={map === selected}
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
			<div class="setting default-setting">
				<span class="toggle-text"
					><span>Default Settings:</span><span class="small-text"
						>(current location, show constellations, use common name)</span
					></span
				>
				<Toggle bind:toggled={defaultSettings} />
			</div>
			<div class="advanced-settings">
				{#if !defaultSettings}
					<div class="setting">
						<span class="toggle-text">Show Constellation Lines:</span>
						<Toggle bind:toggled={showConstellations} />
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
				{/if}
			</div>
			<a class="play" href={`/game/${selected.id}?${gameParams}`}><span>PLAY</span></a>
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
		font-size: 1.25rem;
	}

	h1 {
		text-align: center;
		margin: none;
		margin-top: 3rem;
		font-size: 2rem;
	}

	.default-setting {
		margin-top: 4rem;
		margin-bottom: 1rem;
		min-width: 80%;
	}
	.advanced-settings {
		margin-top: 1rem;
		min-width: 70%;
	}

	.setting {
		display: flex;
		justify-content: space-between;
		height: 2.5rem;
		align-items: center;
	}

	.small-text {
		font-size: 1rem;
		margin-left: 1rem;
	}

	.toggle-text {
		margin-right: 1rem;
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
