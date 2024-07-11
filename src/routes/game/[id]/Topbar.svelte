<script lang="ts">
	import { formatTime, timer } from '$lib/util/timer';

	export let name: string;
	export let percentage: number;
	export let completed: number;
	export let total: number;
</script>

<div class="name">{name}</div>

<div class="container right">
	<div class="item">{formatTime($timer)}</div>
	<div class="item">{percentage}%</div>
	<div class="item">{completed}/{total}</div>
</div>

<style>
	div {
		user-select: none;
	}

	.container {
		position: absolute;
		display: flex;
		font-size: 1.7rem;
		color: white;
		margin: 0.25rem;
		right: 0;
	}

	.name {
		position: absolute;
		font-size: 1.7rem;
		color: white;
		margin-top: 0.25rem;
		width: 100%;
		text-align: center;
	}
	.item {
		margin-right: 0rem;
		margin-left: 0.5rem;
	}

	@media only screen and (max-width: 550px) {
		.name,
		.container {
			font-size: 1.2rem;
		}
	}
</style>
