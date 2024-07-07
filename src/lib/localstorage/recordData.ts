import { USER_STATE, user as userStore } from '$lib/firebase/auth';
import { get } from 'svelte/store';
import { updateJson } from './utils';

type GameRecord = {
	time: number;
	accuracy: number;
	showConstellation: boolean;
	useDesignation: boolean;
	timestamp: number;
};

export const saveGame = (
	id: string,
	time: number,
	accuracy: number,
	showConstellation: boolean,
	useDesignation: boolean
) => {
	updateJson<{ [key: string]: GameRecord[] }>('games', {}, (games) => {
		if (!(id in games)) games[id] = [];
		games[id].push({ time, accuracy, showConstellation, useDesignation, timestamp: Date.now() });
		return games;
	});

	const user = get(userStore);
	if (user.state === USER_STATE.SIGNED_IN) {
		// save game to firestore
	}
};
