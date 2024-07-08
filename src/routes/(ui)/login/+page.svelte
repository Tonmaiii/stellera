<script lang="ts">
	import { goto } from '$app/navigation';
	import { signInWithGoogle, user } from '$lib/firebase/auth';
	import { db } from '$lib/firebase/firestore';
	import { doc, getDoc, setDoc } from 'firebase/firestore';

	let allowRedirect = true;
	let askName = false;
	let displayName: string;

	const signIn = async () => {
		allowRedirect = false;
		const user = await signInWithGoogle();
		const userDocRef = doc(db, 'users', user.uid);
		const userDoc = await getDoc(userDocRef);
		if (!userDoc.exists()) {
			setDisplayName($user.user?.displayName ?? 'default');
			displayName = $user.user?.displayName ?? '';
			askName = true;
			return;
		}
		goto('/menu');
	};

	const setDisplayName = async (name: string) => {
		if (!$user.user) return;
		const userDocRef = doc(db, 'users', $user.user.uid);
		await setDoc(userDocRef, { name });
	};

	$: if ($user.user && !$user.user.isAnonymous && allowRedirect) {
		goto('/');
	}
</script>

<div class="wrapper">
	<div class="container">
		{#if !askName}
			<span>Sign in</span>
			<button on:click={signIn}><i class="fab fa-google"></i> Google</button>
		{:else}
			<span>Enter your display name</span>
			<input type="text" name="name" id="name" placeholder="Your name" bind:value={displayName} />
			<button
				on:click={() => {
					const name = displayName.trim();
					if (!name) return;
					setDisplayName(name);
					goto('/');
				}}>Submit</button
			>
		{/if}
	</div>
</div>

<style>
	.wrapper {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.container {
		width: 12rem;
		display: flex;
		flex-direction: column;
	}

	button {
		border: none;
		background-color: #363636;
		font: inherit;
		color: inherit;
		border-radius: 0.5rem;
		margin-top: 0.5rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}

	button:hover {
		background-color: #404040;
	}

	span {
		text-align: center;
	}

	input {
		margin-top: 0.5rem;
		padding-top: 0.25rem;
		padding-bottom: 0.25rem;
		font: inherit;
		border: inherit;
		border-radius: 0;
		border-bottom: 2px solid #3ac7ff;
		color: inherit;
		background-color: #262626;
		text-align: center;
	}
</style>
