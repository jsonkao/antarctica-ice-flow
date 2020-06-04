function main() {
  const canvas = document.querySelector('#glCanvas');
  const gl = canvas.getContext('webgl'); // Initialize the GL context

  if (gl === null) {
    return console.error('Unable to initialize WebGL.');
  }
  console.log('gl :>> ', gl);
  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);
}

window.onload = main;
