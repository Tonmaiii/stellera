<script lang="ts">
    import StarsSelector from './StarsSelector.svelte'
    import ConstellationSelector from './ConstellationSelector.svelte'
    import { decode, encode, generateIncludedStars } from '../util/gameCode'
    import constellations from '../util/constellations'
    import greekLetters from '../util/greekLetters'
    import Game from '../game/Game.svelte'
    import data from '../util/data'
    import { location as geolocation } from '../util/geolocation'
    import { requestDeviceOrientation } from '../util/deviceOrientation'

    export let params: { gameCode: string }
    let gameCode: bigint
    try {
        gameCode = BigInt(params.gameCode)
    } catch {
        gameCode = encode(
            true,
            false,
            false,
            Array(constellations.length).fill(true),
            Array<boolean>(greekLetters.length).fill(false).fill(true, 0, 1)
        )
    }
    $: location.hash = `/${gameCode}`

    let {
        useDesignation,
        showConstellation,
        constellations: includedConstellations,
        starWithName,
        identifiers
    } = decode(gameCode)

    $: gameCode = encode(
        showConstellation,
        useDesignation,
        starWithName,
        includedConstellations,
        identifiers
    )

    let inputLatitude: string
    let inputLongitude: string

    $: latitudeNumber = parseFloat(inputLatitude)
    $: latitude = Number.isFinite(latitudeNumber)
        ? latitudeNumber
        : $geolocation?.latitude ?? 0
    $: longitudeNumber = parseFloat(inputLongitude)
    $: longitude = Number.isFinite(longitudeNumber)
        ? longitudeNumber
        : $geolocation?.longitude ?? new Date().getTimezoneOffset() / -4

    let startGame = false

    let useDeviceOrientation = false

    $: if (useDeviceOrientation) {
        requestDeviceOrientation()
    }
</script>

{#if !startGame}
    <main>
        <div class="section">
            <h1>Gameplay Settings</h1>
            <div class="grid">
                <div>Use designation name</div>
                <input type="checkbox" bind:checked={useDesignation} />
                <div>Show constellations</div>
                <input type="checkbox" bind:checked={showConstellation} />
            </div>
            <div class="grid">
                <div>Latitude</div>
                <input
                    type="text"
                    placeholder={`${latitude}`}
                    bind:value={inputLatitude}
                />
                <div>Longitude</div>
                <input
                    type="text"
                    placeholder={`${longitude}`}
                    bind:value={inputLongitude}
                />
            </div>
            <div class="grid">
                <div>Use device orientation</div>
                <input type="checkbox" bind:checked={useDeviceOrientation} />
            </div>
            <div class="start">
                {#if $data && $geolocation}
                    <button on:click={() => (startGame = true)}>Start</button>
                {:else}
                    Loading stars data...
                {/if}
            </div>
        </div>
        <ConstellationSelector bind:included={includedConstellations} />
        <StarsSelector bind:starWithName bind:identifiers />
    </main>
{:else}
    <Game
        answers={generateIncludedStars(
            $data.stars,
            starWithName,
            includedConstellations,
            identifiers
        )}
        {useDesignation}
        {showConstellation}
        {latitude}
        {longitude}
        {useDeviceOrientation}
        on:exit={() => (startGame = false)}
    />
{/if}

<style>
    main {
        display: flex;
        flex-direction: row;
        height: 100%;
        font-size: 1.5rem;
    }

    h1 {
        margin: 0;
        margin-bottom: 1rem;
        text-align: center;
    }

    .section {
        flex: 1;
        overflow: auto;
        margin: 1rem;
        display: flex;
        flex-direction: column;
    }

    .grid {
        display: grid;
        grid-template-columns: auto auto;
        column-gap: 1rem;
        justify-content: start;
        margin-bottom: 2rem;
    }

    .start {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .start button {
        font-size: 4rem;
        background-color: #eee;
        padding: 1rem;
        border-radius: 1rem;
        text-decoration: none;
        color: #0b44ff;
    }

    button {
        font-size: 1rem;
        text-align: left;
        border: none;
        border-radius: 1rem;
        padding: 0.5rem;
        margin: 0.25rem;
        color: black;
    }

    input {
        font-size: 1rem;
        min-width: 0;
    }
</style>
