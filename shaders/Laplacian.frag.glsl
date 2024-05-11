// //  Laplacian Filter 
precision highp float;
uniform int kernelSize;
uniform float sigma;
uniform sampler2D image;
uniform vec2 resolution;
varying vec2 vUv;

void main() {
    
    vec4 sum = vec4(0.0);
    vec4 texel = texture2D(image, vUv);

    vec4 colorTopLeft = texture2D(image, vUv + vec2(-1.0, -1.0) / resolution);
    vec4 colorTop = texture2D(image, vUv + vec2(0.0, -1.0) / resolution);
    vec4 colorTopRight = texture2D(image, vUv + vec2(1.0, -1.0) / resolution);
    vec4 colorLeft = texture2D(image, vUv + vec2(-1.0, 0.0) / resolution);
    vec4 colorRight = texture2D(image, vUv + vec2(1.0, 0.0) / resolution);
    vec4 colorBottomLeft = texture2D(image, vUv + vec2(-1.0, 1.0) / resolution);
    vec4 colorBottom = texture2D(image, vUv + vec2(0.0, 1.0) / resolution);
    vec4 colorBottomRight = texture2D(image, vUv + vec2(1.0, 1.0) / resolution);

    sum += colorTopLeft * -1.0;
    sum += colorTop * -2.0;
    sum += colorTopRight * -1.0;
    sum += colorLeft * -2.0;
    sum += colorRight * -2.0;
    sum += colorBottomLeft * -1.0;
    sum += colorBottom * -2.0;
    sum += colorBottomRight * -1.0;

    sum += texel * 10.0;

    gl_FragColor = sum;
}

