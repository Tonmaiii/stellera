import { writable } from 'svelte/store';

export const location = writable<{
	latitude: number | null;
	longitude: number | null;
} | null>(null);

export const getLocation = () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				location.set({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				});
				console.log('got location');
			},
			() => {
				location.set({ latitude: null, longitude: null });
				console.log('failed to get location');
			}
		);
	}
};
