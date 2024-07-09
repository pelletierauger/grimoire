let lineShader = new ShaderProgram("line");
lineShader.vertText = `
// beginGLSL
attribute vec3 position;
void main() {
  vec4 positionVec4 = vec4(position, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}
// endGLSL
`;
lineShader.fragText = `
// beginGLSL
precision mediump float;
uniform float time;
uniform float resolution;
uniform vec3 col;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
    float d = length(max(abs(uv - pos),size) - size) - radius;
    return smoothstep(0.66, 0.33, d / thickness * 5.0);
}
void main() {
    vec2 uv = gl_FragCoord.xy / vec2(2560, 1440) * 2. / resolution - 1.;
    uv *= vec2(16. / 9., 1.0);
    float rando = rand(vec2(floor(uv.x * 1280. * 0.75) * 1e-4, floor(uv.y * 720. * 0.75) * 1e-4) * 100.);
    gl_FragColor.rgb = col;
    gl_FragColor.a = roundedRectangle(uv, vec2(0. * (16./ 9.), 0.), vec2(0.1092 * (16./9.), 0.104) * 2.1 * 4.1, 0.01, 0.5) * 0.1;
    gl_FragColor.a *= rando;
}
// endGLSL
`;
lineShader.init();