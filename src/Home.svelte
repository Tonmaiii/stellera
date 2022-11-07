<script lang="ts">
    import Toggle from './components/Toggle.svelte'
    import constellations from './util/constellationNames'
    import greekLetters from './util/greekLetters'

    let includeAllConstellations = true
    let showAllDesignations = false

    let useDesignation = false
    let showConstellation = false

    let starWithName = true

    const includedConstellation = Array(constellations.length).fill(false)
    const identifiers = Array(greekLetters.length)
        .fill(false)
        .map((_, i) => i < 3)

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
    <div class="section">
        <h1>Include Constellations</h1>
        <div class="select">
            <div><strong>Include all</strong></div>
            <input type="checkbox" bind:checked={includeAllConstellations} />
        </div>

        {#if !includeAllConstellations}
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
                {#each greekLetters.slice(0, 5) as { abbreviation, name }, i}
                    <div>
                        {[name[0].toUpperCase(), ...name.slice(1)].join('')}
                    </div>
                    <Toggle bind:checked={identifiers[i]} />
                {/each}
            </div>
            <button on:click={() => (showAllDesignations = true)}>More</button>
        {:else}
            <div class="grid">
                {#each greekLetters as { abbreviation, name }}
                    <div>
                        {[name[0].toUpperCase(), ...name.slice(1)].join('')}
                    </div>
                    <Toggle />
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
    }
</style>
