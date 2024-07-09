<script lang="ts">
	import { user, userData } from '$lib/firebase/auth';
	import { db } from '$lib/firebase/firestore';
	import type { GameEntry, UserEntry } from '$lib/firebase/types';
	import { formatTime } from '$lib/util/timer';
	import { collection, getDocs, query, where } from 'firebase/firestore';
	import { afterUpdate } from 'svelte';

	type LeaderboardEntry = { time: number; accuracy: number; name: string; playerId: string };

	export let id: string;
	let previousId: string | null = null;
	let scores: LeaderboardEntry[] | null = null;

	let placement = -1;
	let userScore: GameEntry | null = null;

	const updateLeaderboard = async () => {
		if (previousId === id) return;
		scores = null;
		try {
			const gamesCollection = collection(db, 'games');
			const q = query(gamesCollection, where('gameId', '==', id), where('anonymous', '==', false));
			const querySnapshot = await getDocs(q);

			const bestScoresMap = new Map<string, GameEntry>();

			querySnapshot.forEach((doc) => {
				const data = doc.data() as GameEntry;
				const currentPlayerBestScore = bestScoresMap.get(data.playerId);

				if (
					!currentPlayerBestScore ||
					data.accuracy > currentPlayerBestScore.accuracy ||
					(data.accuracy === currentPlayerBestScore.accuracy &&
						data.time < currentPlayerBestScore.time)
				) {
					bestScoresMap.set(data.playerId, data);
				}
			});

			const entries = Array.from(bestScoresMap.values());
			if (entries.length === 0) {
				scores = [];
				return;
			}

			entries.sort((a, b) => {
				if (a.accuracy !== b.accuracy) {
					return b.accuracy - a.accuracy;
				} else {
					return a.time - b.time;
				}
			});

			placement = entries.findIndex((score) => score.playerId === $user.user?.uid);
			userScore = entries.find((score) => score.playerId === $user.user?.uid) ?? null;

			const topScores = entries.slice(0, 10);

			const uids = topScores.map((score) => score.playerId);

			const usersCollection = collection(db, 'users');
			const usersQuery = query(usersCollection, where('__name__', 'in', uids));
			const usersQuerySnapshot = await getDocs(usersQuery);

			const userDisplayNamesMap = new Map<string, string>();

			usersQuerySnapshot.forEach((doc) => {
				const data = doc.data() as UserEntry;
				userDisplayNamesMap.set(doc.id, data.name);
			});

			scores = topScores.map(({ playerId, time, accuracy }) => ({
				time,
				accuracy,
				name: userDisplayNamesMap.get(playerId) ?? '',
				playerId
			}));
		} catch (e) {
			console.error('Error querying documents: ', e);
		}
		previousId = id;
	};

	afterUpdate(updateLeaderboard);
</script>

<div class="container">
	{#if scores}
		{#each { length: 10 } as _, i}
			<div
				class="row {i % 2 == 0 ? 'even' : 'odd'} {scores[i] &&
				$user.user?.uid === scores[i].playerId
					? 'user-score'
					: ''}"
			>
				<span class="placement">{i + 1}.</span>
				{#if scores[i]}
					<span class="name">{scores[i].name}</span>
					<span class="accuracy">{Math.round(scores[i].accuracy * 100)}%</span>
					<span class="time">{formatTime(scores[i].time)}</span>
				{/if}
			</div>
		{/each}
		{#if placement >= 10 && userScore}
			<div class="row user-placement">
				<span class="placement">{placement + 1}.</span>
				<span class="name">{$userData?.name}</span>
				<span class="accuracy">{Math.round(userScore.accuracy * 100)}</span>
				<span class="time">{formatTime(userScore.time)}</span>
			</div>
		{/if}
		{#if $user.user?.isAnonymous}
			<div class="row user-placement">
				<span><a href="/login">Sign up</a> to get your name on the leaderboard</span>
			</div>
		{/if}
	{:else}
		{#each { length: 10 } as _, i}
			<div class="row {i % 2 == 0 ? 'even' : 'odd'}"><span>&nbsp;</span></div>
		{/each}
	{/if}
</div>

<style>
	a {
		color: inherit;
	}

	.container {
		font-size: 1rem;
		width: 100%;
		border-top: 1px solid #404040;
	}

	.row {
		display: flex;
		padding: 0.25rem;
	}

	.odd {
		background-color: #282828;
	}

	.user-score {
		background-color: #383838;
	}

	.user-placement {
		background-color: #383838;
		border-top: 1px solid #404040;
		border-bottom: 1px solid #404040;
	}

	.placement {
		width: 2rem;
	}

	.name {
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
