// Uniforms that are the same for all vertices and fragments
uniform float pointWidth;
uniform float stageWidth;
uniform float stageHeight;
uniform float duration;
uniform float elapsed;

// Attributes passed to each vertex
attribute vec2 positionStart;
attribute vec2 positionEnd;
attribute vec3 colorStart;
attribute vec3 colorEnd;

// Varyings are sent to all the pixels interpolated from just one vertex
varying vec3 fragColor;

// Transforms pixel space (canvas) to clip space:
//   [0, stageWidth] x [0, stageHeight] --> [-1, 1] x [1, -1]
vec2 normalizeCoords(vec2 position) {
  return vec2(2.0 * (position.x / stageWidth) - 1.0,
              -2.0 * (position.y / stageHeight) + 1.0);
}

float easeInOutCubic(float x) {
  return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
}

void main() {
  // update the size of a point based on the prop pointWidth
  gl_PointSize = pointWidth;

  // number from 0 to 1 indicating how far through the animation this vertex is
  float t = easeInOutCubic(elapsed / duration);

  // inteprolate position
  vec2 position = mix(positionStart, positionEnd, t);

  // interpolate and send color to frag shader
  fragColor = mix(colorStart, colorEnd, t);

  // gl_Position is a special variable that holds the position of a vertex
  gl_Position = vec4(normalizeCoords(position), 0.0, 1.0);
}
