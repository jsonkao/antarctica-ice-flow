/**
 * Vertex shader receives vertex position from attribute aVertexPosition.
 * We provide uModelViewMatrix and uProjectionMatrix.
 * We set gl_Position as a result.
 */
const vsSource = glsl`
  attribute vec4 aVertexPosition;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }
`;

/**
 * Fragment shader is called once for every pixel on each shape to be drawn,
 * after the shape's vertices have been processed by the vertex shader.
 */
const fsSource = glsl`
  void main() {
    gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
  }
`;

function main() {
  const canvas = document.querySelector('#glCanvas');
  const gl = canvas.getContext('webgl'); // Initialize the GL context

  if (gl === null) {
    return console.error('Unable to initialize WebGL.');
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);
}

window.onload = main;

function glsl(x) {
  return x;
}

/**
 * Initialize a shader program, so WebGL knows how to draw our data
 */
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program and attach the shaders

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // Check if program successfully made
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    return console.error(
      'Unable to initialize shader program:',
      gl.getProgramInfoLog(shaderProgram),
    );
  }

  return shaderProgram;
}

/**
 * Creates a shader of the given type, uploads the source and compiles it
 */
function loadShader(gl, type, source) {
  const shader = gl.createShader(type); // Make a new shader

  gl.shaderSource(shader, source); // Send the source code to the shader object
  gl.compileShader(shader); // Compile the shader

  // Check if the shader was successfully compiled
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
    return gl.deleteShader(shader);
  }
  return shader;
}
