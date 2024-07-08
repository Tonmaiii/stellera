import { user as userStore } from '$lib/firebase/auth';
import { db } from '$lib/firebase/firestore';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { get } from 'svelte/store';

type GameRecord = {
	time: number;
	accuracy: number;
	showConstellation: boolean;
	useDesignation: boolean;
	timestamp: number;
};

export const saveGame = async (
	id: string,
	time: number,
	accuracy: number,
	showConstellation: boolean,
	useDesignation: boolean
) => {
	const user = get(userStore);
	if (user.user) {
		try {
			const gamesCollection = collection(db, 'games');
			await addDoc(gamesCollection, {
				playerId: user.user.uid,
				gameId: id,
				time,
				accuracy,
				showConstellation,
				useDesignation,
				timestamp: serverTimestamp(),
				anonymous: user.user.isAnonymous
			});
		} catch (e) {
			console.error('Error adding document: ', e);
		}
	}
};
