<script lang="ts">
	import { signOut, user } from '$lib/firebase/auth';
</script>

<div class="main">
	<header>
		<div class="left">
			<a href="/">
				<svg>
					<image xlink:href="/images/stellera.svg" />
				</svg>
			</a>
			<a href="/license.txt">License</a>
		</div>

		<div class="right">
			{#if !$user.user || $user.user?.isAnonymous}
				<a href="/li">Sign In</a>
			{:else}
				<button on:click={signOut}>Sign Out</button>
			{/if}
		</div>
	</header>
	<slot></slot>
</div>

<style>
	header {
		display: flex;
		min-height: 2.2rem;
		background-color: #141414;
		border-bottom: 1px solid #404040;
	}

	image,
	svg {
		height: 1rem;
		width: 5rem;
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
