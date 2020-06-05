import { range } from 'd3-array';
import { randomNormal } from 'd3-random';
import createREGL from 'regl';
const regl = createREGL();

import frag from './shaders/dots.frag';
import vert from './shaders/dots.vert';

// the size of the points we draw on screen
const pointWidth = 4;

// dimensions of the viewport we are drawing in
const width = window.innerWidth;
const height = window.innerHeight;

// create initial set of points
const numPoints = 30000;
const points = range(numPoints).map(() => ({
  tx: width / 2,
  ty: height / 2,
  colorEnd: [0, 0, 0],
}));

function dataPropMap(func, property = 'points') {
  return function (_, props) {
    return regl.buffer(props[property].map(func));
  };
}

const drawPoints = regl({
  frag,
  vert,

  // Attributes are only provided to the vertex shader.
  // A vertex shader is executed `count` times. Each time, the next value from
  // a specified buffer is pulled out and assigned to an attribute.
  attributes: {
    positionStart: dataPropMap(d => [d.sx, d.sy]),
    positionEnd: dataPropMap(d => [d.tx, d.ty]),
    colorStart: dataPropMap(d => d.colorStart),
    colorEnd: dataPropMap(d => d.colorEnd),
  },

  // Uniforms are constant during each frame rendered and are accessible
  // in both frag andvert
  uniforms: {
    pointWidth,
    stageWidth: width,
    stageHeight: height,

    duration: regl.prop('duration'), // animation duration
    elapsed: ({ time }, { startTime = 0 }) => (time - startTime) * 1000,
  },

  // specify the number of points to draw
  count: points.length,

  // specify that each vertex is a point (not part of a mesh)
  primitive: 'points',
});

const duration = 1500;

const layouts = [blueNormalLayout, greenCircleLayout];
let currentLayout = 0;

function animate(setNewLayout) {
  // Make previous end the new beginning
  points.forEach(d => {
    d.sx = d.tx;
    d.sy = d.ty;
    d.colorStart = d.colorEnd;
  });

  // Set the new end states
  setNewLayout(points);

  // Start an animation loop

  let startTime = null;

  const frameLoop = regl.frame(({ time }) => {
    // Keep track of start time
    if (startTime === null) {
      startTime = time;
    }

    // clear the buffer, resetting background color to black
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1,
    });

    // draw the points using our created regl func
    drawPoints({
      points,
      duration,
      startTime,
    });
    if (time - startTime > duration / 1000) {
      frameLoop.cancel();
      setTimeout(doNextAnimation, 500);
    }
  });
}

function doNextAnimation() {
  animate(layouts[currentLayout++ % layouts.length]);
}

doNextAnimation();

// A layout algorithm can be any function that sets the x and y attribute on our
// point objects.

const radius = Math.min(width, height);

// Randomly (normally) places points around the origin.
export function blueNormalLayout(points) {
  const rng = randomNormal(0, 0.15);
  points.forEach(d => {
    // set the new x and y attributes
    d.tx = rng() * radius + width / 2;
    d.ty = rng() * radius + height / 2;

    // blue-green color
    d.colorEnd = [0, 0.5, 0.9];
  });
}

// helper to layout points in a green fuzzy circle
export function greenCircleLayout(points) {
  const rng = randomNormal(0, 0.05);
  points.forEach((d, i) => {
    d.tx = (rng() + Math.cos(i)) * (radius / 2.5) + width / 2;
    d.ty = (rng() + Math.sin(i)) * (radius / 2.5) + height / 2;
    d.colorEnd = [0, Math.random(), 0]; // random amount of green
  });
}
