
# Color Filtered Anaglyph 3D Environment with Three.js

## Overview

This project demonstrates the creation of color filtered anaglyph images using various image processing techniques. Utilizing Three.js, the project features an interactive 3D environment where users can manipulate stereoscopic videos and apply different anaglyph methods. The implementation includes convolution, separable filters, denoising, and edge processing to enhance the visual experience.

## Features

- **Interactive 3D Environment**:
  - Control playback of stereoscopic videos: pause, start, and stop.
  - Zoom in/out and pan within the right image and the processed anaglyph.
  - Switch between different image processing methods and adjust their parameters in real-time.

- **Anaglyph Methods**:
  - Various anaglyph techniques implemented to create 3D stereo images by processing color channels.

- **Image Processing Techniques**:
  1. **Convolution**:
     - Gaussian filter with adjustable kernel size and sigma.
     - Laplacian filter with options for color results or the norm of the color.
  2. **Separable Filter**:
     - Gaussian filter with adjustable kernel size and sigma.
  3. **Denoising**:
     - Median filtering with adjustable kernel size.
  4. **Combined Filters**:
     - Gaussian filter followed by a Laplacian filter, combining their effects with adjustable parameters.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/color-filtered-anaglyph.git
    cd color-filtered-anaglyph
    ```

2. Install dependencies and start a local web server:
    ```bash
    npm install -g http-server
    http-server
    ```

3. Open the project in your browser:
    ```bash
    http://localhost:8080
    ```

## Usage

### Setting Up the Environment

- **Initialize the Scene**: Set up the Three.js scene, camera, and renderer.
- **Load and Control Videos**: Use the interface to load stereoscopic videos from sources like [YouTube video 1](https://www.youtube.com/watch?v=fs_Uw4qL2O8) and [YouTube video 2](https://www.youtube.com/watch?v=_FgCK6CdR8s).
- **Apply Anaglyph Methods**: Experiment with different anaglyph methods to create 3D images.
- **Use Image Processing Techniques**: Utilize shaders for convolution, separable filters, denoising, and edge processing.

### Example Code

**Vertex Shader**:
```glsl
varying vec2 vUv;
void main() {
    vUv = vec2( uv.x, 1.0-uv.y );
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

**Fragment Shader Example (Laplacian Filter)**:
```glsl
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
```

**HTML Setup**:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
    <style>
      body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background-color: #aaaaaa;
        overflow: hidden;
      }
      body {
        font-family: Monospace;
        margin: 0px;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <script id="vertShader" type="shader">
      varying vec2 vUv;
      void main() {
          vUv = vec2( uv.x, 1.0-uv.y );
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    </script>

    <script async src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>
    <script type="importmap">
      {
        "imports": {
          "three": "https://unpkg.com/three@0.149.0/build/three.module.js",
          "three/addons/": "https://unpkg.com/three@0.149.0/examples/jsm/"
        }
      }
    </script>

    <script type="module" src="sanfrancisco.js"> </script>
  </body>
</html>
```

## References

- [Anaglyph Comparison](https://3dtv.at/Knowhow/AnaglyphComparison_en.aspx)
- [YouTube Video 1](https://www.youtube.com/watch?v=fs_Uw4qL2O8)
- [YouTube Video 2](https://www.youtube.com/watch?v=_FgCK6CdR8s)


