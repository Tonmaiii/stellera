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
};
