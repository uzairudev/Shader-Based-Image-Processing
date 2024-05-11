precision highp float;
uniform sampler2D image;
uniform vec2 resolution;
varying vec2 vUv;

void main() {
    vec2 offset = 1.0 / resolution;
    vec4 sum = vec4(0.0);
    vec4 texel = texture2D(image, vUv);

    float kernel[9];
    kernel[0] = -1.0; kernel[1] = -1.0; kernel[2] = -1.0;
    kernel[3] = -1.0; kernel[4] = 8.0;  kernel[5] = -1.0;
    kernel[6] = -1.0; kernel[7] = -1.0; kernel[8] = -1.0;

    
    for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
            vec4 neighbor = texture2D(image, vUv + vec2(i, j) * offset);
            sum += neighbor * kernel[(i + 1) * 3 + (j + 1)];
        }
    }

    sum /= 9.0;
    sum += texel;

    gl_FragColor = sum;
}


