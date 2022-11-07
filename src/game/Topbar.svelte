<script lang="ts">
    import { formatTime, timer } from '../util/timer'

    export let name: string
    export let percentage: number
    export let completed: number
    export let total: number
</script>

<div class="container">
    <div class="item">{name}</div>
</div>

<div class="container right">
    <div class="item">{formatTime($timer)}</div>
    <div class="item">{percentage}%</div>
    <div class="item">{completed}/{total}</div>
</div>

<style>
    .container {
        position: absolute;
        display: flex;
        font-size: 2rem;
        color: white;
        margin: 0.5rem;
    }

    .right {
        right: 0;
    }

    .item {
        margin-right: 0.5rem;
    }

    .right .item {
        margin-right: 0rem;
        margin-left: 0.5rem;
    }
</style>
