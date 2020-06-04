import reglFn from 'regl';
const regl = reglFn();

import frag from './shaders/dots.frag';
import vert from './shaders/dots.vert';

// Helper function to create a random float between some defined range. This
// is used to create some fake data. In a real setting, you would probably
// use D3 to map data to display coordinates.
function randomFromInterval(min, max) {
  return Math.random() * (max - min + 1) + min;
}

// Helper function to create a random integer between some defined range.
// Again, you would want to use D3 for mapping real data to display
// coordinates.
function randomIntFromInterval(min, max) {
  return Math.floor(randomFromInterval(min, max));
}

// Some constants to use
const MAX_WIDTH = 2 * document.documentElement.clientWidth;
const MAX_HEIGHT = 2 * document.documentElement.clientHeight;
const MAX_SPEED = 25;
const POINT_SIZE = 10;
const POINT_COUNT = 400;

// Helper function to generate some fake data.
// Each data point has an x and y and a 'speed'
// value that indicates how fast it travels
function createData(dataCount) {
  const data = [];
  for (let i = 0; i < dataCount; i++) {
    data.push({
      id: i,
      speed: randomFromInterval(1, MAX_SPEED),
      y: randomIntFromInterval(POINT_SIZE, MAX_HEIGHT),
      x: 0,
      size: randomIntFromInterval(POINT_SIZE, POINT_SIZE * 3),
    });
  }
  return data;
}

// Helper function, goes through each
// element in the fake data and updates
// its x position.
function updateData(data) {
  data.forEach(d => {
    d.x += d.speed;
    // reset x if its gone past max width
    d.x = d.x > MAX_WIDTH ? 0 : d.x;
  });
}

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

  attributes: {
    // There will be a position value for each point we pass in
    position: (_, { points }) => points.map(p => [p.x, p.y]),

    // pointWidth should also be an array
    pointWidth: (_, { points }) => points.map(p => p.size),
  },

  uniforms: {
    // This defines the color of the triangle to be a dynamic variable
    color: regl.prop('color'),
    pointWidth: regl.prop('pointWidth'),

    stageWidth: regl.context('drawingBufferWidth'),
    stageHeight: regl.context('drawingBufferHeight'),
  },

  // This tells regl the number of vertices to draw in this command
  count: (_, { points }) => points.length,

  // Set primitives to points
  primitive: 'points',
});

const points = createData(POINT_COUNT);

// regl.frame() wraps requestAnimationFrame and also handles viewport changes
regl.frame(({ tick }) => {
  // clear contents of the drawing buffer
  regl.clear({
    color: [0, 0, 0, 0],
    depth: 1,
  });

  updateData(points);

  // draw dots using the command defined above
  drawDots({
    points,
    color: [
      Math.cos(tick * 0.05),
      Math.sin(tick * 0.05),
      Math.cos(tick * 0.05),
      1,
    ],
  });
});
