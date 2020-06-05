precision mediump float;
uniform sampler2D texture;
uniform float offset;
varying vec2 uv;

vec3 rgb2hsb(in vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

float mod1(float x) { return mod(x, 1.0); }

vec3 modColor(vec4 c) { return vec3(mod1(c.r), mod1(c.g), mod1(c.b)); }

void main() {
  vec4 black = vec4(0, 0, 0, 1);
  vec4 textureColor = texture2D(texture, uv);

  if (textureColor.a != 1.0) // Alpha is either 0 or 1
    discard;

  vec4 color = vec4(modColor(textureColor + offset), 1);

  vec3 hsb = rgb2hsb(color.rgb);
  hsb[0] = 0.0; // hue controls the color
  hsb[1] = hsb[2]; // saturation starts at 0 always because input is grayscale
  hsb[2] = 1.0;
  color = vec4(hsb2rgb(hsb), 1);

  gl_FragColor = color;
}
