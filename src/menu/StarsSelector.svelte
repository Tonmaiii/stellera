<script lang="ts">
    import Toggle from '../components/Toggle.svelte'
    import greekLetters from '../util/greekLetters'

    let showAllDesignations = false
    export let starWithName: boolean
    export let identifiers: Array<boolean>
</script>

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
            <button class="more" on:click={() => (showAllDesignations = true)}
                >More</button
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

<style>
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

    .more {
        margin: 0;
    }
</style>
