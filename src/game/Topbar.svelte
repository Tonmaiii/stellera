<script lang="ts">
    export let name: string
    export let percentage: number
    const time = 0
</script>

<div class="container">
    <div class="item">{percentage}%</div>
    <!-- <div class="item">{time}</div> -->
    <div class="item">{name}</div>
</div>

<style>
    .container {
        position: fixed;
        display: flex;
        font-size: 2rem;
        color: white;
        margin: 0.5rem;
    }

    .item {
        margin-right: 0.5rem;
    }
</style>
