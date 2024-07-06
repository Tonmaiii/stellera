export class PlayerController {
	mouseX = 0;
	mouseY = 0;
	azimuth = 0;
	altitude = 0;
	fov = 45;
	zoom = 0;
	zoomFactor = 1.001;
	sensitivity = 1;
	zooming = false;
	zoomDistance = 0;
	playing = false;
	useDeviceOrientation = false;

	deltaX = 0;
	deltaY = 0;

	addEventListeners(canvas: HTMLCanvasElement) {
		document.addEventListener('mousemove', (e) => {
			if (!this.playing) return;
			if (!this.useDeviceOrientation && e.buttons & 1) {
				this.deltaX = e.clientX - this.mouseX;
				this.deltaY = e.clientY - this.mouseY;
				this.azimuth -=
					(this.deltaX / canvas.height) * this.sensitivity * this.zoomFactor ** this.zoom;
				this.altitude +=
					(this.deltaY / canvas.height) * this.sensitivity * this.zoomFactor ** this.zoom;
				this.altitude = Math.min(Math.PI / 2, this.altitude);
				this.altitude = Math.max(-Math.PI / 2, this.altitude);
			}

			this.mouseX = e.clientX;
			this.mouseY = e.clientY;
		});

		document.addEventListener('wheel', (e) => {
			if (!this.playing) return;
			this.zoom += e.deltaY;
			this.zoom = Math.min(Math.max(this.zoom, -8000), 500);
			this.fov = this.zoomFactor ** this.zoom * 45;
		});

		document.addEventListener('touchstart', (e) => {
			if (!this.playing) return;
			this.mouseX = e.touches[0].clientX;
			this.mouseY = e.touches[0].clientY;
		});

		document.addEventListener(
			'touchmove',
			(e) => {
				if (!this.playing) return;
				e.preventDefault();
				if (e.touches.length === 1 && !this.zooming && !this.useDeviceOrientation) {
					this.deltaX = e.touches[0].clientX - this.mouseX;
					this.deltaY = e.touches[0].clientY - this.mouseY;
					this.azimuth -=
						(this.deltaX / canvas.height) * this.sensitivity * this.zoomFactor ** this.zoom;
					this.altitude +=
						(this.deltaY / canvas.height) * this.sensitivity * this.zoomFactor ** this.zoom;
					this.altitude = Math.min(Math.PI / 2, this.altitude);
					this.altitude = Math.max(-Math.PI / 2, this.altitude);

					this.mouseX = e.touches[0].clientX;
					this.mouseY = e.touches[0].clientY;
				}
				if (e.touches.length === 2) {
					const touch1 = e.touches[0];
					const touch2 = e.touches[1];

					const currentZoomDistance = Math.sqrt(
						(touch1.clientX - touch2.clientX) ** 2 + (touch1.clientY - touch2.clientY) ** 2
					);
					if (!this.zooming) {
						this.zooming = true;
						this.zoomDistance = currentZoomDistance;
						return;
					}

					const deltaZoom = this.zoomDistance - currentZoomDistance;
					this.zoom += deltaZoom * 5;
					this.zoom = Math.min(Math.max(this.zoom, -8000), 500);
					this.fov = this.zoomFactor ** this.zoom * 45;

					this.zoomDistance = currentZoomDistance;
				}
			},
			{ passive: false }
		);

		document.addEventListener('touchend', (e) => {
			if (!this.playing) return;
			if (e.touches.length === 0) this.zooming = false;
		});
	}

	reset = () => {
		this.azimuth = 0;
		this.altitude = 0;
		this.fov = 45;
		this.zoom = 0;
		this.zooming = false;
		this.zoomDistance = 0;
		this.playing = true;
	};

	exit() {
		this.playing = false;
	}
}
