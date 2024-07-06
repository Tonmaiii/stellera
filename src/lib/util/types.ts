export type Star = {
	index: number;
	HIC: string;
	magnitude: number;
	color: [number, number, number];
	pos: [number, number, number];
	identifier: string;
	constellation: string;
	designation_name: string;
	display_name: string;
	number: string;
	letter: string;
};

export type GameMap = {
	id: string;
	name: string;
	answers: string[];
};
