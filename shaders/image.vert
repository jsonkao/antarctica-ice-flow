precision mediump float;
attribute vec2 position;

// varyings are per-fragment (or per-pixel) parameters: they vary from pixels to pixels.
varying vec2 uv;

void main() {
  uv = position;
  gl_Position = vec4(2.0 * position.x - 1.0, 1.0 - 2.0 * position.y, 0, 1);
}
