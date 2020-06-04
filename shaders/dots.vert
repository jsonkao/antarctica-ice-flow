// per vertex attributes
attribute vec2 position;
attribute vec3 color;

// variables to send to the fragment shader
varying vec3 fragColor;

// values that are the same for all vertices
uniform float pointWidth;
uniform float stageWidth;
uniform float stageHeight;

// Helper function to transform from pixel space to normalized device coords.
// Transformation:  [0, stageWidth] x [0, stageHeight] --> [-1, 1] x [1, -1]
vec2 normalizeCoords(vec2 position) {
  return vec2(2.0 * (position.x / stageWidth) - 1.0,
              -2.0 * (position.y / stageHeight) + 1.0);
}

void main() {
  // update the size of a point based on the prop pointWidth
  gl_PointSize = pointWidth;

  // send color to the fragment shader since it can't access attributes
  fragColor = color;

  // gl_Position is a special variable that holds the position
  // of a vertex.
  gl_Position = vec4(normalizeCoords(position), 0.0, 1.0);
}
