<script lang="ts">
    import Game from './Game.svelte'
    import data from '../util/data'
    import greekLetters from '../util/greekLetters'
    import constellationNames from '../util/constellationNames'
    import type { star } from '../util/types'
    import shuffle from '../util/shuffle'

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
</script>

{#if validGameCode}
    {#if !startGame}
        <main>
            {#await data}
                Loading Stars Data...
            {:then value}
                <button
                    on:click={() => {
                        starData = value
                        startGame = true
                    }}>Start</button
                >
            {/await}
            <br />
            <br />

            Game Settings <br />
            <br />
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
            answers={shuffle(generateIncludedStars(starData[0]))}
            stars={starData[0]}
            starsIndexed={starData[1]}
            constellationship={starData[3]}
            {useDesignation}
            {showConstellation}
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
