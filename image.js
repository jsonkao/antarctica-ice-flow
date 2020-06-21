// import imageUrl from './images/ross-thin.png';
import imageUrl from './images/basic-paths.png';
import createREGL from 'regl';
const regl = createREGL();

import dat from './20200123.dat';
// console.log('dat :>> ', dat);

import frag from './shaders/image.frag';
import vert from './shaders/image.vert';

let imageTexture;

const image = new Image();
image.src = imageUrl;
image.onload = function () {
  imageTexture = regl.texture({ data: image, flipY: false });
  main();
};

function main() {
  const drawImage = regl({
    frag,
    vert,

    // attributes are per-vertex parameters
    attributes: {
      // Draws a triangle that covers the whole clip space
      // (it doesn't actually; these are further transformed in vertex shader)
      position: [-2, 0, 0, -2, 2, 2],
    },

    // uniforms are per-primitive parameters (constant during an entire draw call)
    uniforms: {
      texture: imageTexture,
      offset: regl.prop('offset'),
    },

    count: 3,
  });

  regl.frame(({ tick }) => {
    drawImage({
      offset: tick * 0.01,
    });
  });
}
