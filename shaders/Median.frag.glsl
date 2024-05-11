precision highp float;
uniform int kernelSize;
uniform sampler2D image;
uniform vec2 resolution;
varying vec2 vUv;

void main() {
    vec2 cellSize = 1.0 / resolution.xy;
    vec2 uv = vUv.xy;

    vec4 colorValues[6*6];
    int k = (kernelSize - 1) / 2;
    int index = 0;
    for (int i = -k; i <= k; i++) {
        for (int j = -k; j <= k; j++) {
            colorValues[index++] = texture2D(image, uv + vec2(cellSize.x * float(i), cellSize.y * float(j)));
        }
    }

    for (int i = 0; i < kernelSize * kernelSize; i++) {
        for (int j = i + 1; j < kernelSize * kernelSize; j++) {
            if (colorValues[j].r < colorValues[i].r) {
                vec4 temp = colorValues[i];
                colorValues[i] = colorValues[j];
                colorValues[j] = temp;
            }
        }
    }

    gl_FragColor = colorValues[(kernelSize * kernelSize - 1) / 2];
}
