
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
    git clone https://github.com/uzairudev/Shader-Based-Image-Processing.git
    cd Shader-Based-Image-Processing
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

1. **Initialize the Scene**: The Three.js scene, camera, and renderer are set up in the `sanfrancisco.js` file. You don't need to manually initialize them; it's done automatically when you open the project in your browser.

2. **Load and Control Videos**: The interface allows you to load stereoscopic videos from sources like [YouTube video 1](https://www.youtube.com/watch?v=fs_Uw4qL2O8) and [YouTube video 2](https://www.youtube.com/watch?v=_FgCK6CdR8s).

    - **Pause/Start/Stop**: Use the provided GUI controls to manage video playback.

3. **Zoom and Pan**: The environment allows you to zoom in/out and pan inside the right image and the processed anaglyph using mouse controls or GUI sliders.

4. **Switch Between Image Processing Methods**: The GUI includes options to switch between different image processing methods and adjust their parameters in real-time.


## References

- [Anaglyph Comparison](https://3dtv.at/Knowhow/AnaglyphComparison_en.aspx)
- [YouTube Video 1](https://www.youtube.com/watch?v=fs_Uw4qL2O8)
- [YouTube Video 2](https://www.youtube.com/watch?v=_FgCK6CdR8s)


