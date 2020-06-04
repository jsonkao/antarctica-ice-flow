import reglFn from 'regl';
const regl = reglFn();

regl.clear({
  color: [0, 0, 0, 1],
  depth: 1,
});

const drawTriangle = regl({
  // Fragment shader sets the color for each fragment/pixel by setting the
  // gl_FragColor global on each call.
  frag: `
    precision mediump float;
    uniform vec4 color;
    void main() {
      gl_FragColor = color;
    }`,

  // Vertex shader positions each vertex by setting the gl_Position global
  // on each call.
  vert: `
    precision mediump float;
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0, 1);
    }`,

  // Here we define the vertex attributes for the above shader
  attributes: {
    // regl.buffer creates a new array buffer object
    position: regl.prop('position'),
    // regl automatically infers sane defaults for the vertex attribute pointers
  },

  uniforms: {
    // This defines the color of the triangle to be a dynamic variable
    color: regl.prop('color'),
  },

  // This tells regl the number of vertices to draw in this command
  count: 3,
});

// regl.frame() wraps requestAnimationFrame and also handles viewport changes
regl.frame(({ tick }) => {
  // clear contents of the drawing buffer
  regl.clear({
    color: [0, 0, 0, 0],
    depth: 1,
  });

  // draw a triangle using the command defined above
  drawTriangle({
    color: [
      Math.cos(tick * 0.05),
      Math.sin(tick * 0.05),
      Math.cos(tick * 0.05),
      1,
    ],
    position: regl.buffer([
      [-1 * Math.cos(tick / 100), 0],
      [Math.sin(tick / 100), -1],
      [Math.sin(tick / 100), 1],
    ]),
  });
});
