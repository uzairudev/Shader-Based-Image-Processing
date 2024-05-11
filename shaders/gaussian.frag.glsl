// // Gaussian Filter

precision highp float;
uniform int kernelSize;
uniform float sigma;
uniform sampler2D image;
uniform vec2 resolution;
varying vec2 vUv;

void main() {
    vec2 cellSize = 1.0 / resolution.xy;
    vec2 uv = vUv.xy;

    // Initialize texture value components
    float red = 0.0;
    float green = 0.0;
    float blue = 0.0;
    float alpha = 0.0;

    int halfKernel = (kernelSize - 1) / 2;
    float normalization = 0.0;
    float twoSigmaSquared = sigma * sigma;
    
    // Loop over the kernel
    for (int i = -halfKernel; i <= halfKernel; i++) {
        for (int j = -halfKernel; j <= halfKernel; j++) {
            int index = (i + halfKernel) * kernelSize + (j + halfKernel);
            float distance = float(i * i + j * j);
            float gaussianWeight = exp(-distance / twoSigmaSquared);

            vec4 texel = texture2D(image, uv + vec2(cellSize.x * float(i), cellSize.y * float(j)));
            red += texel.r * gaussianWeight;
            green += texel.g * gaussianWeight;
            blue += texel.b * gaussianWeight;
            alpha += texel.a * gaussianWeight;

            // Accumulate the normalization factor
            normalization += gaussianWeight;
        }
    }
    // Normalize the texture value by dividing by the normalization factor
    red /= normalization;
    green /= normalization;
    blue /= normalization;
    alpha /= normalization;

    // Output the final texture value
    gl_FragColor = vec4(red, green, blue, alpha);
}