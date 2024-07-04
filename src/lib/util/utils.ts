export const equatorialToCartesian = (ra: number, dec: number) => {
	const x = Math.cos(dec) * Math.cos(ra);
	const z = Math.cos(dec) * Math.sin(ra);
	const y = Math.sin(dec);
	return new Float32Array([x, y, z]);
};

const day = 86164091;
const offset = 22906350;

export const sidereal = (time: number, long: number) => {
	const sidereal = (time + offset + (long * day) / 360) % day;
	return sidereal / day;
};

export const starSize = (magnitude: number, fov: number) =>
	((1.5 ** (-magnitude - 10) * 1000 * 45) / fov) * ((fov / 45 - 1) * 0.6 + 1) * Math.min(fov, 1);
