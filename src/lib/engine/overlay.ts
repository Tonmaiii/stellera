import type { Star } from '$lib/util/types';
import { starSize } from '$lib/util/utils';
import type { PlayerController } from './playerController';

type Label = {
	hic: string;
	frame: number;
	correct: boolean;
	showAllNames: boolean;
	useDesignationName: boolean;
};

export class Overlay {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	labelDuration = 120;

	flashFrame = 0;
	starsIndexed: { [key: string]: Star };
	starLabels: Label[];

	constructor(
		canvas: HTMLCanvasElement,
		starsIndexed: {
			[key: string]: Star;
		}
	) {
		this.canvas = canvas;
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('error getting canvas context');
		this.ctx = ctx;
		this.starsIndexed = starsIndexed;
		this.starLabels = Array<Label>();
	}

	update(
		starScreenPos: Float32Array,
		playerController: PlayerController,
		answer: string,
		reveal: boolean
	) {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.starLabels = this.starLabels.filter(({ frame }) => frame < this.labelDuration);
		this.starLabels.forEach((label) => {
			this.drawStarLabel(starScreenPos, label, playerController.fov);
			label.frame++;
		});

		if (reveal) this.flashStar(this.starsIndexed[answer], starScreenPos, playerController.fov);

		this.drawCompass(playerController.azimuth);
	}

	addStarLabel(hic: string, correct: boolean, showAllNames: boolean, useDesignationName = false) {
		this.starLabels.push({
			hic,
			frame: 0,
			correct,
			showAllNames,
			useDesignationName
		});
	}

	removeStarLabels() {
		this.starLabels = [];
	}

	resize() {
		this.canvas.width = this.canvas.clientWidth;
		this.canvas.height = this.canvas.clientHeight;
	}

	drawCompass(ra: number) {
		this.ctx.translate(40, this.canvas.height - 40);

		this.ctx.beginPath();
		this.ctx.arc(0, 0, 30, 0, Math.PI * 2);
		this.ctx.fillStyle = '#ffffffb0';
		this.ctx.fill();
		this.ctx.rotate(-ra);

		this.ctx.beginPath();
		this.ctx.moveTo(-6, 0);
		this.ctx.lineTo(0, -30);
		this.ctx.lineTo(6, 0);
		this.ctx.fillStyle = '#ff0000';
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.moveTo(-6, 0);
		this.ctx.lineTo(0, 30);
		this.ctx.lineTo(6, 0);
		this.ctx.fillStyle = '#ffffff';
		this.ctx.fill();

		this.ctx.resetTransform();
	}

	flashStar(star: Star, starScreenPos: Float32Array, fov: number) {
		const i = star.index;
		let x = starScreenPos[3 * i];
		let y = -starScreenPos[3 * i + 1];
		const w = starScreenPos[3 * i + 2];

		if (w > 0 && this.flashFrame % 60 < 30) {
			const size = starSize(star.magnitude, fov);
			const screenX = ((x + 1) * this.canvas.width) / 2;
			const screenY = ((y + 1) * this.canvas.height) / 2;
			this.ctx.beginPath();
			this.ctx.arc(screenX, screenY, Math.max(10, size / 2), 0, Math.PI * 2);
			this.ctx.fillStyle = '#ff0000';
			this.ctx.fill();
		}

		if (w < 0 || x < -1 || x > 1 || y < -1 || y > 1) {
			this.flashFrame = 0;
			x *= this.canvas.width;
			y *= this.canvas.height;
			if (w < 0) {
				x = -x;
				y = -y;
			}

			const mag = Math.sqrt(x ** 2 + y ** 2);
			x /= mag;
			y /= mag;

			const angle = Math.atan2(y, x);
			const distance = Math.min(
				Math.abs(this.canvas.width / 2 / Math.cos(angle)),
				Math.abs(this.canvas.height / 2 / Math.sin(angle))
			);

			this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
			this.ctx.rotate(angle - Math.PI / 2);
			this.ctx.translate(0, distance - 20);
			this.ctx.beginPath();
			this.ctx.moveTo(-30, -50);
			this.ctx.lineTo(0, 0);
			this.ctx.lineTo(30, -50);
			this.ctx.strokeStyle = '#ff0000';
			this.ctx.lineWidth = 5;
			this.ctx.stroke();
			this.ctx.resetTransform();
		} else this.flashFrame = (this.flashFrame + 1) % 60;
	}

	drawStarLabel(starScreenPos: Float32Array, label: Label, fov: number) {
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.font = '1.2rem Arial';
		const star = this.starsIndexed[label.hic];
		const i = star.index;
		if (starScreenPos[3 * i + 2] > 1) return;
		const x = ((starScreenPos[3 * i] + 1) / 2) * this.canvas.width;
		const y = -((starScreenPos[3 * i + 1] - 1) / 2) * this.canvas.height;
		const size = starSize(star.magnitude, fov);

		const alpha = 1 - label.frame / this.labelDuration;

		if (label.correct) this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
		else this.ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
		let yOffset = (size / 2) * (7 / 5) + 16;
		if (label.showAllNames || !label.useDesignationName) {
			this.ctx.fillText(star.display_name, x, y + yOffset);
			yOffset += 20;
		}
		if (
			label.useDesignationName ||
			(label.showAllNames && star.display_name !== star.designation_name && star.designation_name)
		) {
			this.ctx.fillText(star.designation_name, x, y + yOffset);
		}
	}
}
