// import imageUrl from './images/ross-thin.png';
import imageUrl from './images/basic-paths.png';
import createREGL from 'regl';
const regl = createREGL();

import frag from './shaders/image.frag';
import vert from './shaders/image.vert';

let imageTexture;

const image = new Image();
image.src = imageUrl;
image.onload = function () {
  imageTexture = regl.texture(image);
  main();
};

function main() {
  const drawImage = regl({
    frag,
    vert,

    attributes: {
      // Draws a triangle that covers the whole clip space
      position: [-2, 0, 0, -2, 2, 2],
    },

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
