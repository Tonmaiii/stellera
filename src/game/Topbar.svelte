<script lang="ts">
    import { formatTime, timer } from '../util/timer'

    export let name: string
    export let percentage: number
    export let completed: number
    export let total: number
</script>

<div class="name">{name}</div>

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
        right: 0;
    }

    .name {
        position: absolute;
        font-size: 2rem;
        color: white;
        margin-top: 0.5rem;
        width: 100%;
        text-align: center;
    }

    .item {
        margin-right: 0.5rem;
    }

    .right .item {
        margin-right: 0rem;
        margin-left: 0.5rem;
    }
</style>
