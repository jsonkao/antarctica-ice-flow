import createREGL from 'regl';
const regl = createREGL();

import {
  width,
  height,
  points,
  blueNormalLayout,
  greenCircleLayout,
} from './helpers';
import frag from './shaders/dots.frag';
import vert from './shaders/dots.vert';

// the size of the points we draw on screen
const pointWidth = 4;

function dataPropMap(func, property = 'points') {
  return function (_, props) {
    return props[property].map(func);
  };
}

const drawPoints = regl({
  frag,
  vert,

  // Attributes are only provided to the vertex shader. Each value gets mapped
  // to a vertex being displayed
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
