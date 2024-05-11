precision highp float;
uniform int kernelSize;
uniform float sigma;
uniform sampler2D image;
uniform vec2 resolution;

varying vec2 vUv;

void main() {
    vec2 texelSize = 1.0 / resolution;
    vec2 uv = vUv;

    vec4 finalColor = vec4(0.0);
    int halfKernelSize = (kernelSize - 1) / 2;
    float weightSum = 0.0;

    // Apply the Gaussian blur horizontally
    for (int i = -halfKernelSize; i <= halfKernelSize; i++) {
        float weight = exp(-float(i * i) / (2.0 * sigma * sigma)) / (sqrt(2.0 * 3.141592653589793) * sigma);
        weightSum += weight;
        vec2 offset = vec2(texelSize.x * float(i), 0.0);
        finalColor += texture2D(image, uv + offset) * weight;
    }

    // Normalize the final color by the sum of weights
    finalColor /= weightSum;

    // Output the final color
    gl_FragColor = finalColor;
}
