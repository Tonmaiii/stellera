import { mat4, glMatrix } from 'gl-matrix'
import sidereal from '../util/sidereal'
import type { star } from '../util/types'

let mouseX = 0
let mouseY = 0
let ra = 0
let dec = 0
let rotate = 0
let fov = 45
let zoom = 0
const zoomFactor = 1.001
const sensitivity = 0.0015
let zooming = false
let zoomDistance = 0
let playing = true
let useDeviceOrientation = false

export const reset = () => {
    ra = 0
    dec = 0
    rotate = 0
    fov = 45
    zoom = 0
    zooming = false
    zoomDistance = 0
    playing = true
}

export const exit = () => {
    playing = false
}

export default (
    gl: WebGL2RenderingContext,
    canvas: HTMLCanvasElement,
    stars: star[],
    lines: number[],
    data: Float32Array,
    drawLines: boolean,
    callback: (fov: number, ra: number) => void,
    latitude: number,
    longitude: number,
    deviceOrientation: boolean
) => {
    const latitudeRadians = ((-latitude + 90) / 180) * Math.PI
    useDeviceOrientation = deviceOrientation

    gl.clearColor(0, 0, 0, 1)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const program = createProgram(gl, vertexShaderText, fragmentShaderText, [
        'screenPos'
    ])
    const lineProgram = createProgram(gl, lineVertexShader, lineFragmentShader)

    const verticesData = stars.map(star => [
        ...star.pos,
        star.magnitude,
        ...star.color
    ])
    const vertexSize = verticesData[0].length

    const starPositionBufferObject = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, starPositionBufferObject)
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(verticesData.flat()),
        gl.STATIC_DRAW
    )
    setStarsVertexPointer(gl, program, vertexSize)
    setLineVertexPointer(gl, lineProgram, vertexSize)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    const linesBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, linesBuffer)
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint32Array(lines),
        gl.STATIC_DRAW
    )

    const matViewUniformLocation = gl.getUniformLocation(program, 'mView')
    const matProjUniformLocation = gl.getUniformLocation(program, 'mProj')
    const matRotateUniformLocation = gl.getUniformLocation(program, 'mRotate')
    const matRotateTimeUniformLocation = gl.getUniformLocation(
        program,
        'mRotateTime'
    )
    const matViewUniformLocationLine = gl.getUniformLocation(
        lineProgram,
        'mView'
    )
    const matProjUniformLocationLine = gl.getUniformLocation(
        lineProgram,
        'mProj'
    )
    const matRotateUniformLocationLine = gl.getUniformLocation(
        lineProgram,
        'mRotate'
    )
    const matRotateTimeUniformLocationLine = gl.getUniformLocation(
        lineProgram,
        'mRotateTime'
    )
    const fovUniformLocation = gl.getUniformLocation(program, 'fov')
    const screenUniformLocation = gl.getUniformLocation(program, 'screen')

    const identity = new Float32Array(16)
    const viewMatrix = new Float32Array(16)
    const projMatrix = new Float32Array(16)
    const latitudeRotateMatrix = new Float32Array(16)
    const timeRotateMatrix = new Float32Array(16)

    mat4.identity(identity)
    mat4.rotateZ(latitudeRotateMatrix, identity, -latitudeRadians)
    gl.useProgram(program)
    gl.uniformMatrix4fv(matRotateUniformLocation, false, latitudeRotateMatrix)
    gl.useProgram(lineProgram)
    gl.uniformMatrix4fv(
        matRotateUniformLocationLine,
        false,
        latitudeRotateMatrix
    )

    const projectedVerticesBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, projectedVerticesBuffer)
    gl.bufferData(
        gl.ARRAY_BUFFER,
        verticesData.length * Float32Array.BYTES_PER_ELEMENT * 3,
        gl.DYNAMIC_READ
    )
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    const update = () => {
        if (!playing) return
        fov = zoomFactor ** zoom * 45
        const siderealAngle =
            sidereal(Date.now(), longitude) * -Math.PI * 2 + Math.PI

        mat4.lookAt(
            viewMatrix,
            [0, 0, 0],
            equatorialToCartesian(ra, dec),
            [0, 1, 0]
        )
        mat4.perspective(
            projMatrix,
            glMatrix.toRadian(fov),
            canvas.width / canvas.height,
            0.1,
            1000.0
        )
        mat4.rotateZ(projMatrix, projMatrix, rotate)
        mat4.rotateY(timeRotateMatrix, identity, siderealAngle)

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.viewport(0, 0, canvas.width, canvas.height)
        if (drawLines) {
            gl.useProgram(lineProgram)

            gl.uniformMatrix4fv(matViewUniformLocationLine, false, viewMatrix)
            gl.uniformMatrix4fv(matProjUniformLocationLine, false, projMatrix)
            gl.uniformMatrix4fv(
                matRotateTimeUniformLocationLine,
                false,
                timeRotateMatrix
            )

            gl.drawElements(gl.LINES, lines.length, gl.UNSIGNED_INT, 0)
        }

        gl.useProgram(program)

        gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix)
        gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix)
        gl.uniformMatrix4fv(
            matRotateTimeUniformLocation,
            false,
            timeRotateMatrix
        )
        gl.uniform1f(fovUniformLocation, fov)
        gl.uniform2f(screenUniformLocation, canvas.width, canvas.height)

        gl.bindBufferBase(
            gl.TRANSFORM_FEEDBACK_BUFFER,
            0,
            projectedVerticesBuffer
        )
        gl.beginTransformFeedback(gl.POINTS)
        gl.drawArrays(gl.POINTS, 0, verticesData.length)
        gl.endTransformFeedback()

        gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, projectedVerticesBuffer)
        gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, data)
        callback(fov, ra)
        requestAnimationFrame(update)
    }
    requestAnimationFrame(update)

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    window.addEventListener('resize', () => {
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight
    })
}
let deltaX = 0
let deltaY = 0
document.addEventListener('mousemove', e => {
    if (!useDeviceOrientation && e.buttons & 1) {
        deltaX = e.clientX - mouseX
        deltaY = e.clientY - mouseY
        ra -= deltaX * sensitivity * zoomFactor ** zoom
        dec += deltaY * sensitivity * zoomFactor ** zoom
        dec = Math.min(Math.PI / 2, dec)
        dec = Math.max(-Math.PI / 2, dec)
    }

    mouseX = e.clientX
    mouseY = e.clientY
})

document.addEventListener('wheel', e => {
    zoom += e.deltaY
    zoom = Math.min(Math.max(zoom, -8000), 500)
})

document.addEventListener('touchstart', e => {
    mouseX = e.touches[0].clientX
    mouseY = e.touches[0].clientY
})

document.addEventListener(
    'touchmove',
    e => {
        e.preventDefault()
        if (e.touches.length === 1 && !zooming && !useDeviceOrientation) {
            deltaX = e.touches[0].clientX - mouseX
            deltaY = e.touches[0].clientY - mouseY
            ra -= deltaX * sensitivity * zoomFactor ** zoom
            dec += deltaY * sensitivity * zoomFactor ** zoom
            dec = Math.min(Math.PI / 2, dec)
            dec = Math.max(-Math.PI / 2, dec)

            mouseX = e.touches[0].clientX
            mouseY = e.touches[0].clientY
        }
        if (e.touches.length === 2) {
            const touch1 = e.touches[0]
            const touch2 = e.touches[1]

            const currentZoomDistance = Math.sqrt(
                (touch1.clientX - touch2.clientX) ** 2 +
                    (touch1.clientY - touch2.clientY) ** 2
            )
            if (!zooming) {
                zooming = true
                zoomDistance = currentZoomDistance
                return
            }

            const deltaZoom = zoomDistance - currentZoomDistance
            zoom += deltaZoom * 5
            zoom = Math.min(Math.max(zoom, -8000), 500)

            zoomDistance = currentZoomDistance
        }
    },
    { passive: false }
)

document.addEventListener('touchend', e => {
    if (e.touches.length === 0) zooming = false
})

window.addEventListener('deviceorientation', e => {
    ra = (e.alpha * Math.PI) / 180
    dec = ((Math.abs(e.gamma) - 90) * Math.PI) / 180
    rotate = (e.beta * Math.PI) / 180
})

const setStarsVertexPointer = (gl, program, vertexSize) => {
    const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition')
    gl.vertexAttribPointer(
        positionAttribLocation,
        3,
        gl.FLOAT,
        false,
        vertexSize * Float32Array.BYTES_PER_ELEMENT,
        0
    )
    gl.enableVertexAttribArray(positionAttribLocation)

    const magnitudeAttribLocation = gl.getAttribLocation(program, 'magnitude')
    gl.vertexAttribPointer(
        magnitudeAttribLocation,
        1,
        gl.FLOAT,
        false,
        vertexSize * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    )
    gl.enableVertexAttribArray(magnitudeAttribLocation)

    const colorAttribLocation = gl.getAttribLocation(program, 'color')
    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        false,
        vertexSize * Float32Array.BYTES_PER_ELEMENT,
        4 * Float32Array.BYTES_PER_ELEMENT
    )
    gl.enableVertexAttribArray(colorAttribLocation)
}

const setLineVertexPointer = (gl, program, vertexSize) => {
    const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition')
    gl.vertexAttribPointer(
        positionAttribLocation,
        3,
        gl.FLOAT,
        false,
        vertexSize * Float32Array.BYTES_PER_ELEMENT,
        0
    )
    gl.enableVertexAttribArray(positionAttribLocation)
}

const createProgram = (
    gl: WebGL2RenderingContext,
    vertexShaderText: string,
    fragmentShaderText: string,
    transformFeedbacks?: string[]
) => {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(vertexShader, vertexShaderText)
    gl.shaderSource(fragmentShader, fragmentShaderText)

    gl.compileShader(vertexShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error(
            'ERROR compiling vertex shader!',
            gl.getShaderInfoLog(vertexShader)
        )
        return null
    }

    gl.compileShader(fragmentShader)
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error(
            'ERROR compiling fragment shader!',
            gl.getShaderInfoLog(fragmentShader)
        )
        return null
    }

    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)

    if (transformFeedbacks) {
        gl.transformFeedbackVaryings(
            program,
            transformFeedbacks,
            gl.INTERLEAVED_ATTRIBS
        )
    }

    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program))
        return null
    }
    gl.validateProgram(program)
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error(
            'ERROR validating program!',
            gl.getProgramInfoLog(program)
        )
        return null
    }
    return program
}

const equatorialToCartesian = (ra: number, dec: number) => {
    const x = Math.cos(dec) * Math.cos(ra)
    const z = Math.cos(dec) * Math.sin(ra)
    const y = Math.sin(dec)
    return new Float32Array([x, y, z])
}

const vertexShaderText = `
precision mediump float;

attribute vec3 vertPosition;
attribute float magnitude;
attribute vec3 color;
uniform float fov;
uniform mat4 mView;
uniform mat4 mProj;
uniform mat4 mRotate;
uniform mat4 mRotateTime;

varying vec3 fragColor;
varying float size;
varying vec3 screenPos;

float glowSize = 7.0/5.0;

void main()
{   
    vec4 projected = mProj * mView * mRotate * mRotateTime * vec4(vertPosition, 1.0);
    size = (pow(1.5, -magnitude - 10.0) * 1000.0 * 45.0 / fov) * ((fov / 45.0 - 1.0) * 0.6 + 1.0) * min(fov, 1.0);
    gl_Position = projected;
    gl_PointSize = size * glowSize;

    screenPos = vec3(projected.xy / projected.w, projected.w);
    fragColor = color;
}`

const fragmentShaderText = `
precision mediump float;
varying vec3 fragColor;
varying float size;

float glowSize = 5.0/7.0;
float glowSizeSquared = glowSize * glowSize;

void main()
{   
    float r = 0.0;
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    r = dot(cxy, cxy);
    if (r > glowSizeSquared && size >= 1.0) {
        gl_FragColor = vec4(fragColor,  min(1.0, size - 1.0) * (1.0 - (r - glowSizeSquared) / (1.0 - glowSizeSquared)));
    } else {
        gl_FragColor = vec4(fragColor, min(1.0, size - 1.0));
    }
}`

const lineVertexShader = `
precision mediump float;

attribute vec3 vertPosition;
uniform mat4 mView;
uniform mat4 mProj;
uniform mat4 mRotate;
uniform mat4 mRotateTime;

float TAU = 6.283;

void main()
{   
    gl_Position = mProj * mView * mRotate * mRotateTime * vec4(vertPosition, 1.0);
}`

const lineFragmentShader = `
precision mediump float;

void main()
{   
    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5);
}`
