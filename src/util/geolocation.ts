export let location = null

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        position => {
            location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
        },
        () => {
            location = { latitude: 0, longitude: 0 }
        }
    )
} else {
    location = { latitude: 0, longitude: 0 }
}
