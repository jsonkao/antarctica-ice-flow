// per vertex attributes
attribute vec2 positionStart;
attribute vec2 positionEnd;
attribute vec3 colorStart;
attribute vec3 colorEnd;

// variables to send to the fragment shader
varying vec3 fragColor;

// values that are the same for all vertices
uniform float pointWidth;
uniform float stageWidth;
uniform float stageHeight;
uniform float duration;
uniform float elapsed;

// Helper function to transform from pixel space to normalized device coords.
// Transformation:  [0, stageWidth] x [0, stageHeight] --> [-1, 1] x [1, -1]
vec2 normalizeCoords(vec2 position) {
  return vec2(2.0 * (position.x / stageWidth) - 1.0,
              -2.0 * (position.y / stageHeight) + 1.0);
}

void main() {
  // update the size of a point based on the prop pointWidth
  gl_PointSize = pointWidth;

  // number from 0 to 1 indicating how far through the animation this vertex is
  float t = min(1.0, elapsed / duration);

  // inteprolate position
  vec2 position = mix(positionStart, positionEnd, t);

  // interpolate and send color to frag shader
  fragColor = mix(colorStart, colorEnd, t);

  // gl_Position is a special variable that holds the position of a vertex
  gl_Position = vec4(normalizeCoords(position), 0.0, 1.0);
}
