precision mediump float;
uniform sampler2D texture;
uniform float offset;
varying vec2 uv;

void main() {
  vec4 black = vec4(0, 0, 0, 1);
  vec4 textureColor = texture2D(texture, uv);
  float alpha = textureColor.a;

  if (alpha != 1.0) // Alpha is either 0 or
    discard;

  gl_FragColor = vec4(mod(float(textureColor.x) + offset, 1.0),
                      mod(float(textureColor.y) + offset, 1.0),
                      mod(float(textureColor.z) + offset, 1.0), alpha);
}
