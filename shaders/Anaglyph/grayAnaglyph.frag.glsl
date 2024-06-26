
// Set the precision of floating-point numbers to highp
precision highp float;

// Declare a uniform variable that represents a 2D texture sampler
uniform sampler2D image;

// Declare a varying variable that represents the texture coordinates
varying vec2 vUv;

void main (void) {
    // Get the UV coordinates of the current fragment
    vec2 uv = vUv.xy;

    // Define transformation matrices
    mat3 transformMat = mat3(
        0.299,  0.587,  0.114,
        0.0,    0.0,    0.0,
        0.0,    0.0,    0.0
    );
    mat3 rightMat = mat3 (
        0.0,    0.0,    0.0,
        0.299,  0.587,  0.114,
        0.299,  0.587,  0.114
    );

    // Sample the texture twice, once from the left half and once from the right half
    vec3 color1 = texture2D(image, vec2(uv.x / 2.0, uv.y)).rgb;
    vec3 color2 = texture2D(image, vec2(uv.x / 2.0 + 0.5, uv.y)).rgb;

    // Apply the transformations to the colors
    vec3 transformedColor = color1 * transformMat + color2 * rightMat;

    // Output the final color
    gl_FragColor = vec4(transformedColor, 1.0);
}
