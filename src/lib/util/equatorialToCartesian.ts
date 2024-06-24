export const equatorialToCartesian = (ra: number, dec: number) => {
	const x = Math.cos(dec) * Math.cos(ra);
	const z = Math.cos(dec) * Math.sin(ra);
	const y = Math.sin(dec);
	return new Float32Array([x, y, z]);
};
