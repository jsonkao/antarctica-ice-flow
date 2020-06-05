precision mediump float;
uniform sampler2D texture;
uniform float offset;
varying vec2 uv;

// From Sam Hocevar and Emil Persson
vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
  vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);

  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// From Iñigo Quiles via The Book of Shaders
vec3 hsv2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
                   0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
  vec4 black = vec4(0, 0, 0, 1);
  vec4 textureColor = texture2D(texture, uv);

  if (textureColor.a != 1.0) // Alpha is either 0 or 1
    discard;

  // The input image is grayscale, which means R = G = B. To cycle each pixel
  // through the grayscale, we could equally offset each color component.
  // We could also use the HSV model to have more control over the hue of the
  // gradient. In the HSV model, gray colors lie on the central vertical axis
  // (H = *, S = 0, V ∈ [0, 1]). We can achieve the same color cycling effect
  // as before by offsetting V. But the ice looks prettier when cycling through
  // saturation (white ⟷ hue) rather than value (black ⟷ hue), so we offset
  // saturation using V as the initial value. We then set V to 1 for a light
  // color. Now we can also easily control the hue.
  vec3 hsv = rgb2hsv(textureColor.rgb);

  // Helpful hues: darkblue (207), lightblue (183)
  vec3 color1 = vec3(207. / 360., mod(hsv[2] - offset, 1.0), 1.);
  vec3 color2 = vec3(183. / 360., mod(hsv[2] - offset, 1.0), 1.);

  // Convert back to rgb and then multiply blend
  gl_FragColor = vec4(hsv2rgb(color1) * hsv2rgb(color2), 1);
}
