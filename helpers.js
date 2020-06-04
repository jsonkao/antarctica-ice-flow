import { range } from 'd3-array';
import { randomNormal } from 'd3-random';

// random number generator from d3-random
export const randomFloat = randomNormal(0, 0.15);

// dimensions of the viewport we are drawing in
export const width = window.innerWidth;
export const height = window.innerHeight;

// create initial set of points
const numPoints = 10000;
export const points = range(numPoints).map(() => ({
  tx: width / 2,
  ty: height / 2,
  colorEnd: [0, 0, 0],
}));

// A layout algorithm can be any function that sets the x and y attribute on our
// point objects.

// Randomly (normally) places points around the origin.
export function blueNormalLayout(points) {
  points.forEach(d => {
    // set the new x and y attributes
    d.tx = randomFloat() * width + width / 2;
    d.ty = randomFloat() * height + height / 2;

    // blue-green color
    d.colorEnd = [0, 0.5, 0.9];
  });
}

// helper to layout points in a green fuzzy circle
export function greenCircleLayout(points) {
  const length = Math.min(height, width);
  const rng = randomNormal(0, 0.05);
  points.forEach((d, i) => {
    d.tx = (rng() + Math.cos(i)) * (length / 2.5) + width / 2;
    d.ty = (rng() + Math.sin(i)) * (length / 2.5) + length / 2;
    d.colorEnd = [0, Math.random(), 0]; // random amount of green
  });
}
