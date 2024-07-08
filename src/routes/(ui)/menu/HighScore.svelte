<script lang="ts">
	import { user } from '$lib/firebase/auth';
	import { db } from '$lib/firebase/firestore';
	import type { GameEntry } from '$lib/firebase/types';
	import { formatTime } from '$lib/util/timer';
	import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
	import { afterUpdate } from 'svelte';

	export let id: string;
	let previousId: string | null = null;
	let scores: GameEntry[] | null = null;

	const updateHighScores = async () => {
		if (previousId === id) return;
		if (!$user.user) return;
		scores = null;
		try {
			const gamesCollection = collection(db, 'games');

			const q = query(
				gamesCollection,
				where('gameId', '==', id),
				where('playerId', '==', $user.user.uid),
				orderBy('accuracy', 'desc'),
				orderBy('time', 'asc')
			);

			const querySnapshot = await getDocs(q);

			scores = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data() as GameEntry;
				scores?.push(data);
			});
			scores = scores;
		} catch (e) {
			console.error('Error querying documents: ', e);
		}
		previousId = id;
	};

	afterUpdate(updateHighScores);
</script>

<div class="container">
	{#if scores}
		{#each { length: 10 } as _, i}
			<div class="row {i % 2 == 0 ? 'even' : 'odd'}">
				<span class="placement">{i + 1}.</span>
				{#if scores[i]}
					<span class="timestamp">
						{scores[i].timestamp?.toDate?.()?.toLocaleDateString?.() ?? ''}
					</span>
					<span class="accuracy">{Math.round(scores[i].accuracy * 100)}%</span>
					<span class="time">{formatTime(scores[i].time)}</span>
				{/if}
			</div>
		{/each}
	{:else}
		{#each { length: 10 } as _, i}
			<div class="row {i % 2 == 0 ? 'even' : 'odd'}"><span>&nbsp;</span></div>
		{/each}
	{/if}
</div>

<style>
	.container {
		font-size: 1rem;
		width: 100%;
		border-top: 1px solid #404040;
	}

	.row {
		/* border-bottom: 1px solid #404040; */
		display: flex;
		padding: 0.25rem;
	}

	.odd {
		background-color: #282828;
	}

	.placement {
		width: 2rem;
	}

	.timestamp {
		flex: 1;
	}

	.accuracy {
		width: 4rem;
		text-align: right;
	}

	.time {
		width: 4rem;
		text-align: right;
	}
</style>
