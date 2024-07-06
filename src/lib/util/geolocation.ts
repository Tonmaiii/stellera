import { writable } from 'svelte/store';

export const geolocation = writable<{
	latitude: number | null;
	longitude: number | null;
} | null>(null);

export const getLocation = () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				geolocation.set({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				});
				console.log('got location');
			},
			() => {
				geolocation.set({ latitude: null, longitude: null });
				console.log('failed to get location');
			}
		);
	}
};
