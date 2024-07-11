import { goto } from '$app/navigation';
import { db } from '$lib/firebase/firestore';
import type { GameEntry } from '$lib/firebase/types';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { writable } from 'svelte/store';

export const initialized = writable(false);

export const highScores = writable<Map<string, GameEntry[]>>(new Map());

export const returnLocation = writable<string | null>(null);
export const setReturnLocation =
	(name: string) => (e: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement }) => {
		e.preventDefault();
		returnLocation.set(name);
		goto(e.currentTarget.href);
	};
export const clearReturnLocation = () => {
	returnLocation.set(null);
};

export const getHighScores = async (gameId: string, playerId: string) => {
	try {
		const gamesCollection = collection(db, 'games');

		const q = query(
			gamesCollection,
			where('gameId', '==', gameId),
			where('playerId', '==', playerId),
			orderBy('accuracy', 'desc'),
			orderBy('time', 'asc')
		);

		const querySnapshot = await getDocs(q);
		const scores = querySnapshot.docs.map((entry) => entry.data() as GameEntry);

		highScores.update((highScores) => {
			highScores.set(gameId, scores);
			return highScores;
		});
	} catch (e) {
		console.error('Error querying documents: ', e);
	}
};
