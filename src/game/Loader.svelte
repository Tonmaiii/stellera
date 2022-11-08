<script lang="ts">
    import Game from './Game.svelte'
    import data from '../util/data'
    import greekLetters from '../util/greekLetters'
    import constellationNames from '../util/constellations'
    import type { star } from '../util/types'
    import { location } from '../util/geolocation'

    export let params
    const gameCode = BigInt(params.gameCode)
    const showConstellation = Boolean(gameCode & 1n)
    const useDesignation = Boolean((gameCode >> 1n) & 1n)
    const starWithName = (gameCode >> 2n) & 1n
    const constellations = constellationNames.filter(
        (_, i) => (gameCode >> (BigInt(i) + 3n)) & 1n
    )
    const constellationAbbreviations = constellations.map(
        ({ abbreviation }) => abbreviation
    )
    const identifiers = greekLetters.filter(
        (_, i) =>
            (gameCode >> (BigInt(i) + 3n + BigInt(constellationNames.length))) &
            1n
    )
    const identifierAbbreviations = identifiers.map(
        ({ abbreviation }) => abbreviation
    )

    let startGame = false

    const validGameCode =
        gameCode <
            1n <<
                (3n +
                    BigInt(constellationNames.length) +
                    BigInt(greekLetters.length)) &&
        (starWithName || identifiers.length > 0) &&
        constellations.length > 0

    const generateIncludedStars = (stars: star[]) =>
        stars
            .filter(
                star =>
                    constellationAbbreviations.includes(star.constellation) &&
                    ((starWithName &&
                        star.display_name !== star.designation_name) ||
                        identifierAbbreviations.includes(star.identifier))
            )
            .map(star => star.HIC)
    let starData

    $: latitude = Number.isFinite(numberLatitude)
        ? numberLatitude
        : $location?.latitude ?? 0
    $: longitude = Number.isFinite(numberLongitude)
        ? numberLongitude
        : $location?.longitude ?? new Date().getTimezoneOffset() / -4

    let inputLatitude: string
    let inputLongitude: string

    $: numberLatitude = parseFloat(inputLatitude)
    $: numberLongitude = parseFloat(inputLongitude)
</script>

{#if validGameCode}
    {#if !startGame}
        <main>
            <a href="/">back</a><br />
            {#await data}
                Loading Stars Data...
            {:then value}
                {#if $location}
                    <button
                        class="start"
                        on:click={() => {
                            starData = value
                            startGame = true
                        }}>Start</button
                    >
                {:else}
                    Loading Location...
                {/if}
            {/await}
            <br />
            <br />

            Game Settings <br />
            <br />
            {#if $location}
                {#if $location.latitude === null}
                    <strong
                        >Allow browser to access location for real time stars</strong
                    ><br />
                {/if}
                Latitude:
                <input
                    type="text"
                    placeholder={`${latitude}`}
                    bind:value={inputLatitude}
                /><br />
                Longitude:
                <input
                    type="text"
                    placeholder={`${longitude}`}
                    bind:value={inputLongitude}
                /><br />
                Time: realtime<br />
                <br />
            {/if}
            Use Designation: {useDesignation}<br />
            Show Constellation: {showConstellation}<br />
            <br />
            Included constellations:<br />
            {#each constellations as { name }}
                {name}<br />
            {/each}
            <br />
            Included stars:<br />
            {#if starWithName}
                All stars with name<br />
            {/if}
            {#each identifiers as { name }}
                {name}<br />
            {/each}
        </main>
    {:else}
        <Game
            answers={generateIncludedStars(starData[0])}
            stars={starData[0]}
            starsIndexed={starData[1]}
            constellationship={starData[3]}
            {useDesignation}
            {showConstellation}
            {latitude}
            {longitude}
            on:exit={() => (startGame = false)}
        />
    {/if}
{:else}
    Invalid Game Code
{/if}

<style>
    button {
        font-size: 4rem;
    }
</style>
