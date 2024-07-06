import { writable } from 'svelte/store';
import type { star } from './types';

export const data = writable<{
	stars: star[];
	starsIndexed: { [key: string]: star };
	constellationship: { [key: string]: [string, string][] };
} | null>(null);

export const fetchData = async () => {
	const [stars, starsIndexed, constellationship] = await Promise.all(
		['stars', 'stars_indexed', 'constellationship'].map(async (file) => {
			return await (await fetch(`/data/${file}.json`)).json();
		})
	);
	data.set({ stars, starsIndexed, constellationship });
	console.log('finished loading data');
};
