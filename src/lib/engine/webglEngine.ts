import type { Star } from '$lib/util/types';
import { equatorialToCartesian, sidereal } from '$lib/util/utils';
import { glMatrix, mat4 } from 'gl-matrix';
import { PlayerController } from './playerController';
import {
	fragmentShaderSource,
	lineFragmentShader,
	lineVertexShader,
	vertexShaderSource
} from './shaders';
import { createProgram } from './webglUtils';

export class Engine {
	gl: WebGL2RenderingContext;
	canvas: HTMLCanvasElement;
	program!: WebGLProgram;
	lineProgram!: WebGLProgram;
	transformMatrixUniformLocation!: WebGLUniformLocation | null;
	transformMatrixLocationLine!: WebGLUniformLocation | null;
	fovUniformLocation!: WebGLUniformLocation | null;
	screenUniformLocation!: WebGLUniformLocation | null;
	transformMatrix!: Float32Array;
	latitude: number;
	longitude: number;
	drawLines: boolean;
	projectedVerticesBuffer!: WebGLBuffer | null;
	starScreenPos: Float32Array;
	numStars: number;
	numLines: number;
	latitudeRadians!: number;

	constructor(
		canvas: HTMLCanvasElement,
		stars: Star[],
		lines: number[],
		latitude: number,
		longitude: number,
		drawLines: boolean
	) {
		const gl = canvas.getContext('webgl2');
		if (!gl) throw new Error('failed to get webgl2 context');
		this.gl = gl;
		this.canvas = canvas;
		this.latitude = latitude;
		this.longitude = longitude;
		this.drawLines = drawLines;
		this.starScreenPos = new Float32Array(stars.length * 3);

		this.numStars = stars.length;
		this.numLines = lines.length;
		this.initializePrograms(stars, lines);

		this.resize();

		gl.clearColor(0, 0, 0, 1);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}

	update(playerController: PlayerController) {
		this.updateMatrices(playerController);

		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		if (this.drawLines) {
			this.gl.useProgram(this.lineProgram);
			this.gl.uniformMatrix4fv(this.transformMatrixLocationLine, false, this.transformMatrix);
			this.gl.drawElements(this.gl.LINES, this.numLines, this.gl.UNSIGNED_INT, 0);
		}

		this.gl.useProgram(this.program);

		this.gl.uniformMatrix4fv(this.transformMatrixUniformLocation, false, this.transformMatrix);
		this.gl.uniform1f(this.fovUniformLocation, playerController.fov);
		this.gl.uniform2f(this.screenUniformLocation, this.canvas.width, this.canvas.height);

		this.gl.bindBufferBase(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.projectedVerticesBuffer);
		this.gl.beginTransformFeedback(this.gl.POINTS);
		this.gl.drawArrays(this.gl.POINTS, 0, this.numStars);
		this.gl.endTransformFeedback();

		this.gl.bindBuffer(this.gl.TRANSFORM_FEEDBACK_BUFFER, this.projectedVerticesBuffer);
		this.gl.getBufferSubData(this.gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.starScreenPos);
	}

	updateMatrices(playerController: PlayerController) {
		const siderealAngle = sidereal(Date.now(), this.longitude) * -Math.PI * 2 + Math.PI;

		mat4.identity(this.transformMatrix);
		mat4.rotateZ(this.transformMatrix, this.transformMatrix, -this.latitudeRadians);
		mat4.rotateY(this.transformMatrix, this.transformMatrix, siderealAngle);

		const viewMatrix = new Float32Array(16);
		mat4.lookAt(
			viewMatrix,
			[0, 0, 0],
			equatorialToCartesian(playerController.azimuth, playerController.altitude),
			[0, 1, 0]
		);
		mat4.multiply(this.transformMatrix, viewMatrix, this.transformMatrix);

		const projMatrix = new Float32Array(16);
		mat4.perspective(
			projMatrix,
			glMatrix.toRadian(playerController.fov),
			this.canvas.width / this.canvas.height,
			0.1,
			1000.0
		);
		mat4.multiply(this.transformMatrix, projMatrix, this.transformMatrix);
	}

	initializePrograms(stars: Star[], lines: number[]) {
		this.program = createProgram(this.gl, vertexShaderSource, fragmentShaderSource, ['screenPos']);
		this.lineProgram = createProgram(this.gl, lineVertexShader, lineFragmentShader);

		const verticesData = stars.map((star) => [...star.pos, star.magnitude, ...star.color]);
		const vertexSize = verticesData[0].length;

		const starPositionBufferObject = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, starPositionBufferObject);
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array(verticesData.flat()),
			this.gl.STATIC_DRAW
		);
		this.setStarsVertexPointer(vertexSize);
		this.setLineVertexPointer(vertexSize);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

		const linesBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, linesBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(lines), this.gl.STATIC_DRAW);
		this.transformMatrixUniformLocation = this.gl.getUniformLocation(this.program, 'transform');
		this.transformMatrixLocationLine = this.gl.getUniformLocation(this.lineProgram, 'transform');
		this.fovUniformLocation = this.gl.getUniformLocation(this.program, 'fov');
		this.screenUniformLocation = this.gl.getUniformLocation(this.program, 'screen');

		this.transformMatrix = new Float32Array(16);

		this.latitudeRadians = ((-this.latitude + 90) / 180) * Math.PI;
		// this.gl.useProgram(this.program);
		// this.gl.uniformMatrix4fv(this.transformMatrixUniformLocation, false, this.transformMatrix);
		// this.gl.useProgram(this.lineProgram);
		// this.gl.uniformMatrix4fv(this.transformMatrixLocationLine, false, this.transformMatrix);

		this.projectedVerticesBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.projectedVerticesBuffer);
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			verticesData.length * Float32Array.BYTES_PER_ELEMENT * 3,
			this.gl.DYNAMIC_READ
		);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	}

	resize() {
		this.canvas.width = this.canvas.clientWidth;
		this.canvas.height = this.canvas.clientHeight;
	}

	setStarsVertexPointer(vertexSize: number) {
		const positionAttribLocation = this.gl.getAttribLocation(this.program, 'vertPosition');
		this.gl.vertexAttribPointer(
			positionAttribLocation,
			3,
			this.gl.FLOAT,
			false,
			vertexSize * Float32Array.BYTES_PER_ELEMENT,
			0
		);
		this.gl.enableVertexAttribArray(positionAttribLocation);

		const magnitudeAttribLocation = this.gl.getAttribLocation(this.program, 'magnitude');
		this.gl.vertexAttribPointer(
			magnitudeAttribLocation,
			1,
			this.gl.FLOAT,
			false,
			vertexSize * Float32Array.BYTES_PER_ELEMENT,
			3 * Float32Array.BYTES_PER_ELEMENT
		);
		this.gl.enableVertexAttribArray(magnitudeAttribLocation);

		const colorAttribLocation = this.gl.getAttribLocation(this.program, 'color');
		this.gl.vertexAttribPointer(
			colorAttribLocation,
			3,
			this.gl.FLOAT,
			false,
			vertexSize * Float32Array.BYTES_PER_ELEMENT,
			4 * Float32Array.BYTES_PER_ELEMENT
		);
		this.gl.enableVertexAttribArray(colorAttribLocation);
	}

	setLineVertexPointer(vertexSize: number) {
		const positionAttribLocation = this.gl.getAttribLocation(this.program, 'vertPosition');
		this.gl.vertexAttribPointer(
			positionAttribLocation,
			3,
			this.gl.FLOAT,
			false,
			vertexSize * Float32Array.BYTES_PER_ELEMENT,
			0
		);
		this.gl.enableVertexAttribArray(positionAttribLocation);
	}
}
