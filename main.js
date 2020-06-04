import reglFn from 'regl';
const regl = reglFn();

import frag from './dots.frag';
import vert from './dots.vert';

regl.clear({
  color: [0, 0, 0, 1],
  depth: 1,
});

const drawDots = regl({
  // Fragment shader sets the color for each fragment/pixel by setting the
  // gl_FragColor global on each call.
  frag,

  // Vertex shader positions each vertex by setting the gl_Position global
  // on each call.
  vert,

  // Here we define the vertex attributes for the above shader
  attributes: {
    // regl.buffer creates a new array buffer object
    position: regl.prop('position'),
    // regl automatically infers sane defaults for the vertex attribute pointers
  },

  uniforms: {
    // This defines the color of the triangle to be a dynamic variable
    color: regl.prop('color'),
    pointWidth: regl.prop('pointWidth'),
  },

  // This tells regl the number of vertices to draw in this command
  count: 3,

  // Set primitives to points
  primitive: 'points',
});

// regl.frame() wraps requestAnimationFrame and also handles viewport changes
regl.frame(({ tick }) => {
  // clear contents of the drawing buffer
  regl.clear({
    color: [0, 0, 0, 0],
    depth: 1,
  });

  // draw dots using the command defined above
  drawDots({
    color: [
      Math.cos(tick * 0.05),
      Math.sin(tick * 0.05),
      Math.cos(tick * 0.05),
      1,
    ],
    position: [
      [-1 * Math.cos(tick / 100), 0.2],
      [Math.sin(tick / 100), -0.8],
      [Math.sin(tick / 100), 0.8],
    ],
    pointWidth: 100.0 + 50 * Math.cos(tick / 10),
  });
});
