const createShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
	const shader = gl.createShader(type);
	if (!shader) throw new Error('Error creating shader');
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const info = gl.getShaderInfoLog(shader);
		gl.deleteShader(shader);
		throw new Error(`Shader compilation failed: ${info}`);
	}
	return shader;
};

export const createProgram = (
	gl: WebGL2RenderingContext,
	vertexShaderSource: string,
	fragmentShaderSource: string,
	transformFeedbacks?: string[]
) => {
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

	const program = gl.createProgram();
	if (!program) throw new Error('Error creating program');

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);

	if (transformFeedbacks) {
		gl.transformFeedbackVaryings(program, transformFeedbacks, gl.INTERLEAVED_ATTRIBS);
	}

	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(`ERROR linking program! ${gl.getProgramInfoLog(program)}`);
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		throw new Error(`ERROR validating program! ${gl.getProgramInfoLog(program)}`);
	}
	return program;
};
