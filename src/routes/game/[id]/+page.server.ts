import maps from '$lib/data/maps.json';

export const load = ({ params }) => {
	const map = maps.find(({ id }) => id == params.id);
	return { map };
};
