
# Shader Experiments with Three.js

## Overview

This project demonstrates various shader effects using Three.js. The shaders are written in GLSL and include different types of filters and transformations applied to textures. The project includes vertex and fragment shaders, as well as an implementation using Three.js for rendering the scene.

## Features

- **Custom Shaders**: Various shaders including Gaussian blur, Laplacian filter, and other transformations.
- **Interactive 3D Scene**: Integration with Three.js to create an interactive 3D scene.
- **Responsive Design**: Adapts to different screen sizes.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/shader-experiments.git
    cd shader-experiments
    ```

2. Ensure you have a local web server to run the project. You can use `http-server` for this purpose:
    ```bash
    npm install -g http-server
    http-server
    ```

3. Open the project in your browser:
    ```bash
    http://localhost:8080
    ```

## Usage

- **Vertex Shader**: Defines the position of each vertex in the scene.
- **Fragment Shaders**: Apply various effects to the textures.
  - Laplacian filter
  - Gaussian blur
  - Custom color transformations
  - Edge detection

- **Three.js Integration**: Uses Three.js to set up the scene, camera, and renderer.

### Example Usage

1. **Vertex Shader**: 
    ```glsl
    varying vec2 vUv;
    void main() {
        vUv = vec2( uv.x, 1.0-uv.y );
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    ```

2. **Fragment Shader Example**:
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

3. **HTML File**: 
    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
        />
        <style>
          body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            overflow: hidden;
            background-color: #aaaaaa;
            background-attachment: fixed !important;
          }
        </style>
        <style>
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
              gl_Position = projectionMatrix *
                            modelViewMatrix * vec4(position, 1.0 );
          }
        </script>

        <script
          async
          src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"
        ></script>
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

## Dependencies

- [Three.js](https://threejs.org/)
- [es-module-shims](https://github.com/guybedford/es-module-shims)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or enhancements.

## Contact

For any questions or feedback, please reach out to [your-email@example.com](mailto:your-email@example.com).

---

Feel free to customize this README further based on your specific needs and preferences.
