<script lang="ts">
	import { goto } from '$app/navigation';
	import { signInWithGoogle } from '$lib/firebase/auth';

	const signIn = async () => {
		await signInWithGoogle();
		goto('/');
	};
</script>

<button on:click={signIn}>Google</button>

<style>
	button {
		border: none;
		background-color: #363636;
		font: inherit;
		font-size: 2rem;
		color: inherit;
		border-radius: 0.5rem;
	}
</style>
