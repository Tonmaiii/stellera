import categories from '$lib/data/categories.json';
import maps from '$lib/data/maps.json';

export const load = ({ params }) => {
	const category = params.category;
	if (!(category in categories)) return { maps: null };
	const mapIds = categories[category as keyof typeof categories];
	const map = mapIds.map((id) => maps.find((map) => map.id === id));
	return { maps: map };
};
