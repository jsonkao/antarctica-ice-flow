import { range } from 'd3-array';
import { randomNormal } from 'd3-random';
import createREGL from 'regl';
const regl = createREGL();

import frag from './shaders/dots.frag';
import vert from './shaders/dots.vert';

const numPoints = 100000;

// the size of the points we draw on screen
const pointWidth = 4;

// dimensions of the viewport we are drawing in
const width = window.innerWidth;
const height = window.innerHeight;

// random number generator from d3-random
const rng = randomNormal(0, 0.15);

// create initial set of points
const points = range(numPoints).map(_ => ({
  x: (rng() * width) + (width / 2),
  y: (rng() * height) + (height / 2),
  color: [0, Math.random(), 0],
}));

const drawPoints = regl({
  frag,
  vert,

  attributes: {
    // each of these gets mapped to a single entry for each of
    // the points. this means the vertex shader will receive
    // just the relevant value for a given point.
    position: points.map(d => [d.x, d.y]),
    color: points.map(d => d.color),
  },

  uniforms: {
    // by using `regl.prop` to pass these in, we can specify
    // them as arguments to our drawPoints function
    pointWidth: regl.prop('pointWidth'),

    // regl actually provides these as viewportWidth and
    // viewportHeight but I am using these outside and I want
    // to ensure they are the same numbers, so I am explicitly
    // passing them in.
    stageWidth: regl.prop('stageWidth'),
    stageHeight: regl.prop('stageHeight'),
  },

  // specify the number of points to draw
  count: points.length,

  // specify that each vertex is a point (not part of a mesh)
  primitive: 'points',
});

// start the regl draw loop
regl.frame(() => {
  // clear the buffer
  regl.clear({
    // background color (black)
    color: [0, 0, 0, 1],
    depth: 1,
  });

  // draw the points using our created regl func
  // note that the arguments are available via `regl.prop`.
  drawPoints({ // we'll get to this function in a moment!
    pointWidth,
    stageWidth: width,
    stageHeight: height,
  });
});