<script lang="ts">
    import Toggle from './components/Toggle.svelte'
    import constellations, {
        circumpolarNorth,
        circumpolarSouth,
        northernHemisphere,
        southernHemisphere,
        zodiac
    } from './util/constellations'
    import greekLetters from './util/greekLetters'

    let includeAllConstellations = true
    let showAllDesignations = false

    let useDesignation = false
    let showConstellation = false

    let starWithName = false

    let includedConstellation = Array<boolean>(constellations.length).fill(
        false
    )
    const identifiers = Array(greekLetters.length)
        .fill(false)
        .map((_, i) => i < 1)

    const generateGameCode = (
        showConstellation: boolean,
        useDesignation: boolean,
        starWithName: boolean,
        constellations: boolean[],
        identifiers: boolean[]
    ) =>
        BigInt(showConstellation) |
        (BigInt(useDesignation) << 1n) |
        (BigInt(starWithName) << 2n) |
        (constellations.reduceRight(
            (sum, value) => (sum << 1n) | BigInt(value),
            0n
        ) <<
            3n) |
        (identifiers.reduceRight(
            (sum, value) => (sum << 1n) | BigInt(value),
            0n
        ) <<
            (3n + BigInt(constellations.length)))

    const selectAll = () => {
        includedConstellation = Array(constellations.length).fill(true)
    }

    const deselectAll = () => {
        includedConstellation = Array(constellations.length).fill(false)
    }

    const select = (con: string[]) => {
        includedConstellation = includedConstellation.map(
            (b, i) => b || con.includes(constellations[i].abbreviation)
        )
    }
</script>

<main>
    <div class="section">
        <h1>Gameplay Settings</h1>
        <div class="grid">
            <div>Use designation name</div>
            <input type="checkbox" bind:checked={useDesignation} />
            <div>Show constellations</div>
            <input type="checkbox" bind:checked={showConstellation} />
        </div>
        <div class="play">
            <a
                href={`/#/play/${generateGameCode(
                    showConstellation,
                    useDesignation,
                    starWithName,
                    includeAllConstellations
                        ? Array(constellations.length).fill(true)
                        : includedConstellation,
                    identifiers
                )}`}>Play</a
            >
        </div>
    </div>
    <div class="section constellation">
        <h1>Include Constellations</h1>
        <div class="select">
            <div><strong>Include all constellations</strong></div>
            <input type="checkbox" bind:checked={includeAllConstellations} />
        </div>

        {#if !includeAllConstellations}
            <div>
                <button on:click={selectAll}>Select All</button>
                <button on:click={deselectAll}>Deselect All</button>
                <button on:click={() => select(zodiac)}>Zodiac</button>
                <button on:click={() => select(circumpolarNorth)}
                    >Northern Circumpolar</button
                >
                <button on:click={() => select(circumpolarSouth)}
                    >Southern Circumpolar</button
                >
                <button on:click={() => select(northernHemisphere)}
                    >Northern Hemisphere</button
                >
                <button on:click={() => select(southernHemisphere)}
                    >Southern Hemisphere</button
                >
            </div>
            <div class="grid">
                {#each constellations as { abbreviation, name }, i}
                    <div>{name}</div>
                    <input
                        type="checkbox"
                        bind:checked={includedConstellation[i]}
                    />
                {/each}
            </div>
        {/if}
    </div>
    <div class="section">
        <h1>Include Stars</h1>
        <div class="select">
            <div>Stars with name</div>
            <input type="checkbox" bind:checked={starWithName} />
        </div>
        {#if !showAllDesignations}
            <div class="grid">
                {#each greekLetters.slice(0, 5) as { name }, i}
                    <div>
                        {[name[0].toUpperCase(), ...name.slice(1)].join('')}
                    </div>
                    <Toggle bind:checked={identifiers[i]} />
                {/each}
            </div>
            <div>
                <button
                    class="more"
                    on:click={() => (showAllDesignations = true)}>More</button
                >
            </div>
        {:else}
            <div class="grid">
                {#each greekLetters as { name }, i}
                    <div>
                        {[name[0].toUpperCase(), ...name.slice(1)].join('')}
                    </div>
                    <Toggle bind:checked={identifiers[i]} />
                {/each}
            </div>
        {/if}
    </div>
</main>

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

    .constellation {
        flex: 1.5;
    }

    .select {
        display: flex;
        margin-bottom: 1rem;
    }

    .grid {
        display: grid;
        grid-template-columns: auto auto;
        column-gap: 1rem;
        justify-content: start;
    }

    .play {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    a {
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

    .more {
        margin: 0;
    }
</style>
