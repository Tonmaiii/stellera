import { updateJson } from './utils';

export const saveGame = (id: string, time: number, accuracy: number) => {
	updateJson<{ [key: string]: { time: number; accuracy: number }[] }>('games', {}, (games) => {
		if (!(id in games)) games[id] = [];
		games[id].push({ time, accuracy });
		return games;
	});
};
