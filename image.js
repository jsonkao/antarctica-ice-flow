import imageUrl from './images/basic-paths.png';
import createREGL from 'regl';
const regl = createREGL();

import frag from './shaders/image.frag';
import vert from './shaders/image.vert';

let imageTexture;

const image = new Image();
image.src = imageUrl;
image.addEventListener(
  'load',
  function () {
    imageTexture = regl.texture(image);
    main();
  },
  false,
);

function main() {
  const drawImage = regl({
    frag,
    vert,

    attributes: {
      position: [-2, 0, 0, -2, 2, 2],
    },

    uniforms: {
      texture: imageTexture,
      offset: regl.prop('offset'),
    },

    count: 3,
  });

  regl.frame(({ time }) => {
    // clear the buffer, resetting background color to black
    regl.clear({
      color: [255, 0, 0, 0],
      depth: 1,
    });

    // draw the points using our created regl func
    drawImage({
      offset: time * 0.8,
    });
  });
}
