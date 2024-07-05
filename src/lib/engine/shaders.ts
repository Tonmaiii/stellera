export const vertexShaderSource = `
precision mediump float;

attribute vec3 vertPosition;
attribute float magnitude;
attribute vec3 color;
uniform float fov;
uniform mat4 transform;

varying vec3 fragColor;
varying float size;
varying vec3 screenPos;

float glowSize = 7.0/5.0;

void main()
{   
    vec4 projected = transform * vec4(vertPosition, 1.0);
    size = (pow(1.5, -magnitude - 10.0) * 1000.0 * 45.0 / fov) * ((fov / 45.0 - 1.0) * 0.6 + 1.0) * min(fov, 1.0);
    gl_Position = projected;
    gl_PointSize = size * glowSize;

    screenPos = vec3(projected.xy / projected.w, projected.w);
    fragColor = color;
}`;
export const fragmentShaderSource = `
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
}`;
export const lineVertexShader = `
precision mediump float;

attribute vec3 vertPosition;
uniform mat4 transform;

void main()
{   
    gl_Position = transform * vec4(vertPosition, 1.0);
}`;
export const lineFragmentShader = `
precision mediump float;

void main()
{   
    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.15);
}`;
