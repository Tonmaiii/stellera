<script lang="ts">
	import { initializeAuth, signOut, user } from '$lib/firebase/auth';
	import { fetchData } from '$lib/util/data';
	import { getLocation } from '$lib/util/geolocation';
	import { onMount } from 'svelte';

	onMount(() => {
		fetchData();
		getLocation();
		initializeAuth();
	});
</script>

<div class="main">
	<header>
		<div class="left">
			<a href="/">Home</a>
			<a href="/">Leaderboard</a>
		</div>

		<div class="right">
			{#if !$user.user || $user.user?.isAnonymous}
				<a href="/login">Sign In</a>
			{:else}
				<button on:click={signOut}>Sign Out</button>
			{/if}
		</div>
	</header>
	<div class="content">
		<slot></slot>
	</div>
</div>

<style>
	header {
		display: flex;
		min-height: 2rem;
		background-color: #141414;
		border-bottom: 1px solid #404040;
	}

	button {
		border: inherit;
		font: inherit;
		color: inherit;
		background: inherit;
	}

	.main {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.content {
		flex: 1;
		overflow: auto;
	}

	a {
		text-decoration: inherit;
		color: inherit;
		margin-left: 1rem;
		margin-right: 1rem;
	}

	.left,
	.right {
		display: flex;
		align-items: center;
	}

	.right {
		margin-left: auto;
	}
</style>
