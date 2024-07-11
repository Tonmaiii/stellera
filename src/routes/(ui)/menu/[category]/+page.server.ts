import categories from '$lib/data/categories.json';
import maps from '$lib/data/maps.json';

export const load = ({ params }) => {
	const categoryId = params.category;
	const category = categories.find(({ id }) => id === categoryId);
	if (!category) return { maps: null, name: null, id: null };
	const map = category.maps.map((id) => maps.find((map) => map.id === id));
	return { maps: map, name: category.name, id: category.id };
};
