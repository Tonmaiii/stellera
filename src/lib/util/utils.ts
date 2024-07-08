export const altazimuthToCartesian = (alt: number, az: number) => {
	const x = Math.cos(alt) * Math.cos(az);
	const z = Math.cos(alt) * Math.sin(az);
	const y = Math.sin(alt);
	return new Float32Array([x, y, z]);
};

const day = 86164091;
const offset = 22906350;

export const sidereal = (time: number, longDeg: number) => {
	const ms = (time + offset + (longDeg * day) / 360) % day;
	return (ms / day) * Math.PI * 2;
};

const degToRad = (deg: number) => deg * (Math.PI / 180);

export const equatorialToAltAz = (
	ra: number,
	dec: number,
	lat: number,
	long: number,
	time: number
) => {
	// Convert RA and Dec from degrees to radians
	const raRad = degToRad(ra);
	const decRad = degToRad(dec);
	const latRad = degToRad(lat);

	const lst = sidereal(time, long);

	// Hour Angle (HA) in radians
	const ha = lst - raRad;

	// Altitude calculation
	const sinAlt =
		Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(ha);
	const alt = Math.asin(sinAlt);

	// Azimuth calculation
	const cosAz =
		(Math.sin(decRad) - Math.sin(alt) * Math.sin(latRad)) / (Math.cos(alt) * Math.cos(latRad));
	let az = Math.acos(cosAz);
	if (0 < ha && ha < Math.PI) az = -az;

	return { alt, az };
};

export const starSize = (magnitude: number, fov: number) =>
	((1.5 ** (-magnitude - 10) * 1000 * 45) / fov) * ((fov / 45 - 1) * 0.6 + 1) * Math.min(fov, 1);
