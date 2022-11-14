<script lang="ts">
    import constellations, {
        circumpolarNorth,
        circumpolarSouth,
        northernHemisphere,
        southernHemisphere,
        zodiac
    } from '../util/constellations'

    let includeAll = true
    let selected = Array<boolean>(constellations.length).fill(false)
    export let included: Array<boolean>
    $: included = includeAll
        ? Array(constellations.length).fill(true)
        : selected

    const selectAll = () => {
        selected = Array(constellations.length).fill(true)
    }

    const deselectAll = () => {
        selected = Array(constellations.length).fill(false)
    }

    const select = (con: string[]) => {
        selected = selected.map(
            (b, i) => b || con.includes(constellations[i].abbreviation)
        )
    }
</script>

<div class="section">
    <h1>Include Constellations</h1>
    <div class="select">
        <div><strong>Include all constellations</strong></div>
        <input type="checkbox" bind:checked={includeAll} />
    </div>

    {#if !includeAll}
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
            {#each constellations as { name }, i}
                <div>{name}</div>
                <input type="checkbox" bind:checked={selected[i]} />
            {/each}
        </div>
    {/if}
</div>

<style>
    h1 {
        margin: 0;
        margin-bottom: 1rem;
        text-align: center;
    }

    .section {
        flex: 1.5;
        overflow: auto;
        margin: 1rem;
        display: flex;
        flex-direction: column;
        height: 100%;
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

    button {
        font-size: 1rem;
        text-align: left;
        border: none;
        border-radius: 1rem;
        padding: 0.5rem;
        margin: 0.25rem;
        color: black;
    }
</style>
