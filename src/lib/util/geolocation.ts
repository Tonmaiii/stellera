import { writable } from 'svelte/store'

export const location = writable<{ latitude: number; longitude: number }>(null)

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        position => {
            location.set({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
        },
        () => {
            location.set({ latitude: null, longitude: null })
        }
    )
} else {
    location.set({ latitude: null, longitude: null })
}
