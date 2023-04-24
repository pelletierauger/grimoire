let fasterDots = new ShaderProgram("faster-dots");

fasterDots.vertText = `
    // beginGLSL
    attribute vec4 coordinates;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    void main(void) {
        gl_Position = vec4(coordinates.x, coordinates.y, 0.0, 1.0);
        center = vec2(gl_Position.x, gl_Position.y);
        center = 512.0 + center * 512.0;
        myposition = vec2(gl_Position.x, gl_Position.y);
        gl_PointSize = 15.0 + cos((coordinates.x + coordinates.y) * 4000000.) * 2.;
        alph = coordinates.w;
        // gl_PointSize = coordinates.z;
    }         
    // endGLSL 
`;
fasterDots.fragtext = ` 
    // beginGLSL 
    precision mediump float; 
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
        float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.015, 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.2 - dist_squared, 0.0 + alpha * 120., ((3. - dist_squared * 12.0 - (rando * 0.1)) * 0.045 + alpha) * 1.0) * 1.25;
        // gl_FragColor = vec4(1.0, 1.0 - dist_squared * 1.0, 0.0, 0.35 - dist_squared - (rando * 0.2));
        // gl_FragColor = vec4(d * 0.001, uv.x, 0.0, 0.25);
    }
    // endGLSL
`;
fasterDots.init();


let redDots = new ShaderProgram("white-flickering-dots");

redDots.vertText = `
    // beginGLSL
    attribute vec4 coordinates;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    void main(void) {
        gl_Position = vec4(coordinates.x, coordinates.y, 0.0, 1.0);
        center = vec2(gl_Position.x, gl_Position.y);
        center = 512.0 + center * 512.0;
        myposition = vec2(gl_Position.x, gl_Position.y);
        alph = coordinates.w;
        gl_PointSize = coordinates.z;
        // gl_PointSize = 25.0 + cos((coordinates.x + coordinates.y) * 4000000.) * 5.;
        // gl_PointSize = coordinates.z / (alph * (sin(myposition.x * myposition.y * 1.) * 3. + 0.5));
    }
    // endGLSL
`;
redDots.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
        float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.015, 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 1.0 - dist_squared, 1.0 + alpha * 120., ((3. - dist_squared * 12.0 - (rando * 0.1)) * 0.0245 + alpha) * alph) * 1.5;
        // gl_FragColor = vec4(1.0, 0.2 - dist_squared, 0.0 + alpha * 120., (0.25 - dist_squared * 3.0 - (rando * 0.1)) * 0.25 + alpha) * 1.25;
//         gl_FragColor = vec4(1.0, 1.0 - dist_squared * 1.0, 0.0, 0.35 - dist_squared - (rando * 0.2));
        // gl_FragColor = vec4(d * 0.001, uv.x, 0.0, 0.25);
        // endGLSL
    }`;
redDots.init();

let fog = new ShaderProgram("fog");
fog.vertText = `
    // beginGLSL
    // our vertex data
    attribute vec3 aPosition;
    // our texcoordinates
    attribute vec2 aTexCoord;
    // this is a variable that will be shared with the fragment shader
    // we will assign the attribute texcoords to the varying texcoords to move them from the vert shader to the frag shader
    // it can be called whatever you want but often people prefiv it with 'v' to indicate that it is a varying
    varying vec2 vTexCoord;
    void main() {
    // copy the texture coordinates
    vTexCoord = aTexCoord;
    // copy the position data into a vec4, using 1.0 as the w component
    vec4 positionVec4 = vec4(aPosition, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
    // send the vertex information on to the fragment shader
    gl_Position = positionVec4;
    }
    // endGLSL
`;
fog.fragText = `
    // beginGLSL
    precision lowp float;
varying vec2 vTexCoord;
uniform float time;
const float TURBULENCE = 0.009;
//noise function from iq: https://www.shadertoy.com/view/Msf3WH
vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x);
    vec2 o = vec2(m, 1.0 - m);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
}
const mat2 m2 = mat2(1.6,  1.2, -1.2,  1.6);
float fbm(vec2 p) {
    float amp = 0.5;
    float h = 0.0;
    for (int i = 0; i < 8; i++) {
        float n = noise(p);
        h += amp * n;
        amp *= 0.5;
        p = m2 * p;
    }
    return  0.5 + 0.5 * h;
}
vec3 smokeEffect(vec2 uv) {
    vec3 col = vec3(0.0, 0.0, 0.0);
    // time scale
    float v = 0.0002;
    vec3 smoke = vec3(1.0);
    //uv += mo * 10.0;
    vec2 scale = uv * 0.5;
    vec2 turbulence = TURBULENCE * vec2(noise(vec2(uv.x * 3.5, uv.y * 3.2) * 1.), noise(vec2(uv.x * 2.2, uv.y * 1.5)));
    scale += turbulence;
    float n1 = fbm(vec2(scale.x - abs(sin(time * v * 1000.0)), scale.y - 50.0 * abs(sin(time * v * 410.0))));
    col = mix(col, smoke, smoothstep(0.35, 0.9, n1));
    //float y = fragCoord.y/iResolution.y;
    //float fade = exp(-(y*y));
    //col *= fade;
//     col.r * 0.5;
    col = clamp(col, vec3(0.0), vec3(1.0)) * 2.;
    return col;
}
float circle(vec2 p, float r) {
    float c = length(p) - r;
    return smoothstep(r + 0.02, r, c);
}
float sinwave(vec2 p, float scale, float amp) {
    float wave = cos(p.x * scale + 1.5 + time * 20.) + 0.25 * cos(p.x * scale * scale + time * 20.);
    float s = smoothstep(amp + 0.07, amp, amp * wave * 0.5 - p.y * 0.5);
    return s;
}
float plot(vec2 s, float p) {
    float largeur = abs(sin(time * 0.01)) * 0.1 + 0.1;
    return smoothstep(p - largeur, p, s.y) - smoothstep(p, p + largeur, s.y);
}
float circ(float speed, float size, float vx, float vy, float dist) {
  // float x = cos(time * speed) * dist * 0.012 - 0.425;
  // float y = sin(time * speed) * dist * 0.012 - 0.25;
  float t = time;
  float x = cos(t * speed * 1000.0) * dist * (sin(t)) * 0.12 - 0.425;
  float y = sin(t * speed * 1000.0) * dist * (sin(t)) * 0.12 - 0.25;
  // float x = cos(time * speed) * dist * abs(sin(time * 0.01) * 1.0) - 0.425;
  // float y = sin(time * speed) * dist * abs(sin(time * 0.01) * 1.0) - 0.25;
  vec2 v = vec2(vx + x, vy + y);
  float d = 1.0 / length(v * size);
     d = sin(d * cos(t * 5.) * 1.);
  return d;
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / vec2(1600, 1600);
    vec2 p = gl_FragCoord.xy/1000.0;
    p -= 0.5;
//     p.x *= 2.0;
    p *= 2.0;
    p.y += 0.35;
//     p.x *= iResolution.x / iResolution.y;
    vec3 col = vec3(0.0);
//     vec3 smoke = smokeEffect(p);
//     vec3 tex = 0.02 * texture(iChannel0, uv * 2.5).rgb;   
    vec3 background = 0.7 * vec3(0.0, 100.0, 200.0) / 255.0;
    vec3 mountCol = mix(vec3(12.0, 153.0, 253.0) / 255.0, vec3(253.0 ,104.0 ,50.0) / 255.0, p.y + 0.5);
//     vec3 sunCol = 0.85 * mix(vec3(1.0, 0.0, 1.0), vec3(1.0, 1.0, 0.0), p.y + 0.5);
    vec3 cloudCol = vec3(0.9);
    float t = time * 20.5;
//     vec2 sunPos = p - vec2(0.4 * cos(t * 0.1), 0.4 * sin(t * 0.1));
//     float sun = circle(sunPos, 0.03);
    float mountain1 = sinwave(p - vec2(0.5, -1.1), 2.4, 0.1);
    float mountain2 = sinwave(p + vec2(0.0, 0.2), 2.0, 0.2);
//     float mountain3 = sinwave(p + vec2(-12.0, -0.5), -2.5, 0.1);
//     float cloud = 1.5 + smoke.r;
//     col = mix(background, sunCol, sun);
    vec3 smoke2 = smokeEffect(p + vec2(-1.0, -2.0));
    float cloud2 = 1.15 + smoke2.r;
//     col = mix(mountCol * 1.2, background, mountain3);
    col = mix(mountCol * 0.79, background, mountain1);
//     col = mix(cloudCol, col, cloud);
//     col = mix(mountCol * 0.5, col, mountain2);
    col = mix(cloudCol, col, vec3(cloud2 * 0.85, cloud2 * 0.85, cloud2 * 1.75));
    float rando = rand(vec2(uv.x, uv.y) * 100.);
//     col *= 0.2 + 0.8 * pow(32.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y), 0.2);
    gl_FragColor = vec4(col - rando * 0.1, 1.0);
//     gl_FragColor.b *= 0.25;
//     gl_FragColor = gl_FragColor.brga;
//     gl_FragColor.r = gl_FragColor.r - rando * 0.1;
    // gl_FragColor = gl_FragColor.grba;
    gl_FragColor.rgb *= 1.;
        gl_FragColor = gl_FragColor.brga;
        // gl_FragColor.r *= 3.;
}
// endGLSL
`;
fog.init();



let newFlickering = new ShaderProgram("new-flickering-dots");

newFlickering.vertText = `
    // beginGLSL
    attribute vec4 coordinates;
    uniform float resolution;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    float noise(vec2 p){
      vec2 ip = floor(p);
      vec2 u = fract(p);
      u = u*u*(3.0-2.0*u);
      float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
      return res*res;
    }
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
void main(void) {
        gl_Position = vec4(coordinates.x, coordinates.y, 0.0, 1.);
        gl_Position.xy *= (1.0 - distance(gl_Position.xy, vec2(0,0)) * 0.1) * 1.05;
            // gl_Position.xy *= 0.75;
        float n = noise(gl_Position.xy);
        // gl_Position.y += tan(n * 100. * 1e2 + alph) * 0.0009 * 2.;
        // gl_Position.x += tan(alph * 1e4) * 10.5;
    // gl_Position.xy += vec2(cos(n * 1.), sin(n * 1.)) * 0.1;
        center = vec2(gl_Position.x, gl_Position.y);
        center = 512.0 + center * 512.0;
        myposition = vec2(gl_Position.x, gl_Position.y);
        alph = coordinates.w;
        gl_PointSize = (9. + coordinates.z / ((6.0 + alph) * 0.25)) * alph * 2.5;
        // float vig = (roundedRectangle(gl_Position.xy, vec2(0.0, 0.0), vec2(0.905, 0.87) * 0.99, 0.05, 0.5) + 0.0);
float vig = (roundedRectangle(gl_Position.xy * 0.15, vec2(0.0, 0.0), vec2(2.012, 1.96) * 0.07, 0.001, 0.05) + 0.0);
                // cols = mix(cols, cols * floor(vig), 1.);
    gl_PointSize *= floor(vig) * resolution * 2.;
            // gl_PointSize = 25.0 + cos((coordinates.x + coordinates.y) * 4000000.) * 5.;
        // gl_PointSize = coordinates.z / (alph * (sin(myposition.x * myposition.y * 1.) * 3. + 0.5));
    }
    // endGLSL
`;
newFlickering.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.015 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.2 - dist_squared, 0.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 4.1)) * 0.045 + alpha)) * 1.25;
        // gl_FragColor = vec4(1.0);
        // gl_FragColor.b = 0.5;
        
        
    }
    // endGLSL
`;
newFlickering.init();

let greyFog = new ShaderProgram("grey-fog");
greyFog.vertText = `
    // beginGLSL
    // our vertex data
    attribute vec3 aPosition;
    // our texcoordinates
    attribute vec2 aTexCoord;
    // this is a variable that will be shared with the fragment shader
    // we will assign the attribute texcoords to the varying texcoords to move them from the vert shader to the frag shader
    // it can be called whatever you want but often people prefiv it with 'v' to indicate that it is a varying
    varying vec2 vTexCoord;
    void main() {
    // copy the texture coordinates
    vTexCoord = aTexCoord;
    // copy the position data into a vec4, using 1.0 as the w component
    vec4 positionVec4 = vec4(aPosition, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
    // send the vertex information on to the fragment shader
    gl_Position = positionVec4;
    }
    // endGLSL
`;
greyFog.fragText = `
// beginGLSL
precision lowp float;
varying vec2 vTexCoord;
uniform float time;
const float TURBULENCE = 0.009;
//noise function from iq: https://www.shadertoy.com/view/Msf3WH
vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x);
    vec2 o = vec2(m, 1.0 - m);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
}
const mat2 m2 = mat2(1.6,  1.2, -1.2,  1.6);
float fbm(vec2 p) {
    float amp = 0.5;
    float h = 0.0;
    for (int i = 0; i < 8; i++) {
        float n = noise(p);
        h += amp * n;
        amp *= 0.5;
        p = m2 * p;
    }
    return  0.5 + 0.5 * h;
}
vec3 smokeEffect(vec2 uv) {
    vec3 col = vec3(0.0, 0.0, 0.0);
    // time scale
    float v = 0.0002;
    vec3 smoke = vec3(1.0);
    //uv += mo * 10.0;
    vec2 scale = uv * 0.5;
    vec2 turbulence = TURBULENCE * vec2(noise(vec2(uv.x * 3.5, uv.y * 3.2) * 1.), noise(vec2(uv.x * 2.2, uv.y * 1.5)));
    scale += turbulence;
    float n1 = fbm(vec2(scale.x - abs(sin(time * v * 1000.0)), scale.y - 50.0 * abs(sin(time * v * 410.0))));
    col = mix(col, smoke, smoothstep(0.35, 0.9, n1));
    //float y = fragCoord.y/iResolution.y;
    //float fade = exp(-(y*y));
    //col *= fade;
//     col.r * 0.5;
    col = clamp(col, vec3(0.0), vec3(1.0)) * 2.;
    return col;
}
float circle(vec2 p, float r) {
    float c = length(p) - r;
    return smoothstep(r + 0.02, r, c);
}
float sinwave(vec2 p, float scale, float amp) {
    float wave = cos(p.x * scale + 1.5 + time * 20.) + 0.25 * cos(p.x * scale * scale + time * 20.);
    float s = smoothstep(amp + 0.07, amp, amp * wave * 0.5 - p.y * 0.5);
    return s;
}
float plot(vec2 s, float p) {
    float largeur = abs(sin(time * 0.01)) * 0.1 + 0.1;
    return smoothstep(p - largeur, p, s.y) - smoothstep(p, p + largeur, s.y);
}
float circ(float speed, float size, float vx, float vy, float dist) {
  // float x = cos(time * speed) * dist * 0.012 - 0.425;
  // float y = sin(time * speed) * dist * 0.012 - 0.25;
  float t = time;
  float x = cos(t * speed * 1000.0) * dist * (sin(t)) * 0.12 - 0.425;
  float y = sin(t * speed * 1000.0) * dist * (sin(t)) * 0.12 - 0.25;
  // float x = cos(time * speed) * dist * abs(sin(time * 0.01) * 1.0) - 0.425;
  // float y = sin(time * speed) * dist * abs(sin(time * 0.01) * 1.0) - 0.25;
  vec2 v = vec2(vx + x, vy + y);
  float d = 1.0 / length(v * size);
     d = sin(d * cos(t * 5.) * 1.);
  return d;
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / vec2(1600, 1600);
    vec2 p = gl_FragCoord.xy/1000.0;
    p -= 0.5;
//     p.x *= 2.0;
    p *= 2.0;
    p.y += 0.35;
//     p.x *= iResolution.x / iResolution.y;
    vec3 col = vec3(0.0);
//     vec3 smoke = smokeEffect(p);
//     vec3 tex = 0.02 * texture(iChannel0, uv * 2.5).rgb;   
    vec3 background = 0.7 * vec3(0.0, 100.0, 200.0) / 255.0;
    // vec3 mountCol = mix(vec3(12.0, 153.0, 253.0) / 255.0, vec3(253.0 ,104.0 ,50.0) / 255.0, p.y + 0.5);
//     vec3 sunCol = 0.85 * mix(vec3(1.0, 0.0, 1.0), vec3(1.0, 1.0, 0.0), p.y + 0.5);
    vec3 mountCol = vec3(250.0);
    vec3 cloudCol = vec3(0.9);
    float t = time * 20.5;
//     vec2 sunPos = p - vec2(0.4 * cos(t * 0.1), 0.4 * sin(t * 0.1));
//     float sun = circle(sunPos, 0.03);
    float mountain1 = sinwave(p - vec2(0.5, -1.1), 2.4, 0.1);
    float mountain2 = sinwave(p + vec2(0.0, 0.2), 2.0, 0.2);
//     float mountain3 = sinwave(p + vec2(-12.0, -0.5), -2.5, 0.1);
//     float cloud = 1.5 + smoke.r;
//     col = mix(background, sunCol, sun);
    vec3 smoke2 = smokeEffect(p + vec2(-1.0, -2.0));
    float cloud2 = 2.0 + smoke2.r;
//     col = mix(mountCol * 1.2, background, mountain3);
    col = mix(mountCol * 0.79, background, mountain1);
//     col = mix(cloudCol, col, cloud);
//     col = mix(mountCol * 0.5, col, mountain2);
    col = mix(cloudCol, col, vec3(cloud2, cloud2, cloud2));
    float rando = rand(vec2(uv.x, uv.y) * 100.) * 0.075;
    float rando2 = rand(vec2(uv.x, uv.y) * 200.) * 0.1;
    float rando3 = rand(vec2(uv.x, uv.y) * 300.) * 0.1;
//     col *= 0.2 + 0.8 * pow(32.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y), 0.2);
    gl_FragColor = vec4(vec3(col.b - rando), 1.0);
//     gl_FragColor.b *= 0.25;
//     gl_FragColor = gl_FragColor.brga;
//     gl_FragColor.r = gl_FragColor.r - rando * 0.1;
    // gl_FragColor = gl_FragColor.grba;
    // gl_FragColor.rgb *= 1.;
        // gl_FragColor = gl_FragColor.brga;
        // gl_FragColor.r *= 3.;
}
// endGLSL
`;
greyFog.init();

let pulsarDots = new ShaderProgram("pulsar-dots");
pulsarDots.vertText = `
    // beginGLSL
    attribute vec4 coordinates;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    void main(void) {
        gl_Position = vec4(coordinates.x, coordinates.y, 0.0, 1.0);
        center = vec2(gl_Position.x, gl_Position.y);
        center = 512.0 + center * 512.0;
        myposition = vec2(gl_Position.x, gl_Position.y);
        alph = coordinates.w;
        // gl_PointSize = 9. + coordinates.z / ((6.0 + alph) * 0.25);
        // gl_PointSize = 25.0 + cos((coordinates.x + coordinates.y) * 4000000.) * 5.;
        gl_PointSize = max(25.0, coordinates.z / (alph * (sin(myposition.x * myposition.y * 1.) * 3. + 0.5)));
    }
    // endGLSL
    `;
pulsarDots.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.015 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.1));
        gl_FragColor = vec4(1.0, 0.2 - dist_squared, 0.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.25)) * 0.045 + alpha)) * 1.25;
        // gl_FragColor = gl_FragColor.rbga;
        // gl_FragColor = gl_FragColor.gbra;
        // gl_FragColor.rgb *= 3.5;
        // gl_FragColor.b += 0.25;
        // gl_FragColor.a *= 1.5;
        
    }
    // endGLSL
`;
pulsarDots.init();


let whitePulsarDots = new ShaderProgram("white-pulsar-dots");

whitePulsarDots.vertText = `
    // beginGLSL
    attribute vec4 coordinates;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    void main(void) {
        gl_Position = vec4(coordinates.x, coordinates.y, 0.0, 1.0);
        center = vec2(gl_Position.x, gl_Position.y);
        center = 512.0 + center * 512.0;
        myposition = vec2(gl_Position.x, gl_Position.y);
        alph = coordinates.w;
        gl_PointSize = 20. + coordinates.z / ((6.0 + alph) * 0.25);
        // gl_PointSize = 25.0 + cos((coordinates.x + coordinates.y) * 4000000.) * 5.;
        // gl_PointSize = max(25.0, coordinates.z / (alph * (sin(myposition.x * myposition.y * 1.) * 3. + 0.5)));
    }
    // endGLSL
`;
whitePulsarDots.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.015 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.1));
        gl_FragColor = vec4(1.0, 0.2 - dist_squared, 0.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.25)) * 0.045 + alpha)) * 1.25;
        gl_FragColor = vec4(1.0, 1.0 - dist_squared, 1.0 + alpha * 120., ((3. - dist_squared * 12.0 - (rando * 1.1)) * 0.0245 + alpha) * alph) * 1.5;
        gl_FragColor.r *= 20.5 * alpha;
        // gl_FragColor.b /= alpha * 400.;
        gl_FragColor.b *= 0.5;
        // gl_FragColor.b /= alpha * 200.;
        // gl_FragColor = gl_FragColor.rbga;
        // gl_FragColor = gl_FragColor.gbra;
        // gl_FragColor.rgb *= 3.5;
        // gl_FragColor.b += 0.25;
        
    }
    // endGLSL
`;
whitePulsarDots.init();

let pulsarFog = new ShaderProgram("pulsar-fog");

pulsarFog.vertText = `
    // beginGLSL
    // our vertex data
    attribute vec3 aPosition;
    // our texcoordinates
    attribute vec2 aTexCoord;
    // this is a variable that will be shared with the fragment shader
    // we will assign the attribute texcoords to the varying texcoords to move them from the vert shader to the frag shader
    // it can be called whatever you want but often people prefiv it with 'v' to indicate that it is a varying
    varying vec2 vTexCoord;
    void main() {
    // copy the texture coordinates
    vTexCoord = aTexCoord;
    // copy the position data into a vec4, using 1.0 as the w component
    vec4 positionVec4 = vec4(aPosition, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
    // send the vertex information on to the fragment shader
    gl_Position = positionVec4;
    }
    // endGLSL
`;
pulsarFog.fragText = `
// beginGLSL
precision lowp float;
varying vec2 vTexCoord;
uniform float time;
uniform float resolution;
const float TURBULENCE = 0.009;
//noise function from iq: https://www.shadertoy.com/view/Msf3WH
vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x);
    vec2 o = vec2(m, 1.0 - m);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
}
const mat2 m2 = mat2(1.6,  1.2, -1.2,  1.6);
float fbm(vec2 p) {
    float amp = 0.5;
    float h = 0.0;
    for (int i = 0; i < 8; i++) {
        float n = noise(p);
        h += amp * n;
        amp *= 0.5;
        p = m2 * p;
    }
    return  0.5 + 0.5 * h;
}
vec3 smokeEffect(vec2 uv) {
    float time = 2.0;
    vec3 col = vec3(0.0, 0.0, 0.0);
    // time scale
    float v = 0.0002;
    vec3 smoke = vec3(1.0);
    //uv += mo * 10.0;
    vec2 scale = uv * 0.5;
    vec2 turbulence = TURBULENCE * vec2(noise(vec2(uv.x * 3.5, uv.y * 3.2) * 1.), noise(vec2(uv.x * 2.2, uv.y * 1.5)));
    scale += turbulence;
    float n1 = fbm(vec2(scale.x - abs(sin(time * v * 1000.0)), scale.y - 50.0 * abs(sin(time * v * 410.0))));
    col = mix(col, smoke, smoothstep(0.35, 0.9, n1));
    //float y = fragCoord.y/iResolution.y;
    //float fade = exp(-(y*y));
    //col *= fade;
//     col.r * 0.5;
    col = clamp(col, vec3(0.0), vec3(1.0)) * 2.;
    return col;
}
float circle(vec2 p, float r) {
    float c = length(p) - r;
    return smoothstep(r + 0.02, r, c);
}
float sinwave(vec2 p, float scale, float amp) {
    float time = 1.0;
    float wave = cos(p.x * scale + 1.5 + time * 20.) + 0.25 * cos(p.x * scale * scale + time * 20.);
    float s = smoothstep(amp + 0.07, amp, amp * wave * 0.5 - p.y * 0.5);
    return s;
}
float plot(vec2 s, float p) {
    float largeur = abs(sin(time * 0.01)) * 0.1 + 0.1;
    return smoothstep(p - largeur, p, s.y) - smoothstep(p, p + largeur, s.y);
}
float circ(float speed, float size, float vx, float vy, float dist) {
  // float x = cos(time * speed) * dist * 0.012 - 0.425;
  // float y = sin(time * speed) * dist * 0.012 - 0.25;
  float t = 1.;
  float x = cos(t * speed * 1000.0) * dist * (sin(t)) * 0.12 - 0.425;
  float y = sin(t * speed * 1000.0) * dist * (sin(t)) * 0.12 - 0.25;
  // float x = cos(time * speed) * dist * abs(sin(time * 0.01) * 1.0) - 0.425;
  // float y = sin(time * speed) * dist * abs(sin(time * 0.01) * 1.0) - 0.25;
  vec2 v = vec2(vx + x, vy + y);
  float d = 1.0 / length(v * size);
     d = sin(d * cos(t * 5.) * 1.);
  return d;
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        // pos = pos * resolution * 2.;
        // size = size * resolution;
        // radius = radius * resolution;
        // thickness = thickness * resolution;
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
void main() {
    vec2 uv = gl_FragCoord.xy / vec2(2560, 1440) * 2. / resolution - 1.;
    uv *= vec2(16. / 9., 1.0);
    // uv *= resolution;
    vec2 p = gl_FragCoord.xy / 1000.0 / resolution;
    p -= 0.5;
//     p.x *= 2.0;
    p *= 1.0;
    p.y += 0.35;
//     p.x *= iResolution.x / iResolution.y;
    vec3 col = vec3(0.0);
//     vec3 smoke = smokeEffect(p);
//     vec3 tex = 0.02 * texture(iChannel0, uv * 2.5).rgb;   
    vec3 background = 0.7 * vec3(0.0, 100.0, 200.0) / 255.0;
    vec3 mountCol = mix(vec3(12.0, 153.0, 253.0) / 255.0, vec3(253.0 ,104.0 ,50.0) / 255.0, p.y + 0.5);
//     vec3 sunCol = 0.85 * mix(vec3(1.0, 0.0, 1.0), vec3(1.0, 1.0, 0.0), p.y + 0.5);
    vec3 cloudCol = vec3(0.9);
    float t = 1. * 20.5;
//     vec2 sunPos = p - vec2(0.4 * cos(t * 0.1), 0.4 * sin(t * 0.1));
//     float sun = circle(sunPos, 0.03);
    float mountain1 = sinwave(p - vec2(0.5, -1.1), 2.4, 0.1);
    float mountain2 = sinwave(p + vec2(0.0, 0.2), 2.0, 0.2);
//     float mountain3 = sinwave(p + vec2(-12.0, -0.5), -2.5, 0.1);
//     float cloud = 1.5 + smoke.r;
//     col = mix(background, sunCol, sun);
    vec3 smoke2 = smokeEffect(p + vec2(-1.0, -2.0));
    float cloud2 = 1.15 + smoke2.r;
//     col = mix(mountCol * 1.2, background, mountain3);
    col = mix(mountCol * 0.79, background, mountain1);
//     col = mix(cloudCol, col, cloud);
//     col = mix(mountCol * 0.5, col, mountain2);
    col = mix(cloudCol, col, vec3(cloud2 * 0.85, cloud2 * 0.85, cloud2 * 1.75));
    float rando = rand(vec2(uv.x, uv.y) * 100.);
//     col *= 0.2 + 0.8 * pow(32.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y), 0.2);
    gl_FragColor = vec4(col - rando * 0.025, 1.0);
//     gl_FragColor.b *= 0.25;
//     gl_FragColor = gl_FragColor.brga;
//     gl_FragColor.r = gl_FragColor.r - rando * 0.1;
    // gl_FragColor = gl_FragColor.grba;
    gl_FragColor.rgb *= 1.;
        gl_FragColor = gl_FragColor.brga;
        gl_FragColor.r *= 0.5;
        gl_FragColor.b *= 1.25;
        gl_FragColor.b += 0.05;
    // gl_FragColor.r += 0.05;
    // gl_FragColor.rgb = vec3(1.0);
    // gl_FragColor.rgb *= 1.25;
    gl_FragColor.rgb *= roundedRectangle(uv, vec2(0. * (16./ 9.), 0.), vec2(0.1105 * (16./9.), 0.106) * 2.1 * 4.1, 0.01, 0.5) * 1.6;    
    // gl_FragColor.rgb += roundedRectangle(uv, vec2(0. * (16./ 9.), 0.), vec2(0.11, 0.11), 0.001, 0.25);
        // gl_FragColor = gl_FragColor.grra;
    gl_FragColor.rgb -= 0.2;
        // gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
}
// endGLSL
`;
pulsarFog.vertText = pulsarFog.vertText.replace(/[^\x00-\x7F]/g, "");
pulsarFog.fragText = pulsarFog.fragText.replace(/[^\x00-\x7F]/g, "");
pulsarFog.init();
if (pulsarFog.initialized) {
    time = gl.getUniformLocation(getProgram("pulsar-fog"), "time");
    resolutionBG = gl.getUniformLocation(getProgram("pulsar-fog"), "resolution");
}




let gold = new ShaderProgram("gold");

gold.vertText = `
    // beginGLSL
    attribute vec4 coordinates;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    void main(void) {
        gl_Position = vec4(coordinates.x, coordinates.y, 0.0, 1.0);
        center = vec2(gl_Position.x, gl_Position.y);
        center = 512.0 + center * 512.0;
        myposition = vec2(gl_Position.x, gl_Position.y);
        alph = coordinates.w;
        gl_PointSize = 9. + coordinates.z / ((6.0 + alph) * 0.25);
        // gl_PointSize = 25.0 + cos((coordinates.x + coordinates.y) * 4000000.) * 5.;
        // gl_PointSize = coordinates.z / (alph * (sin(myposition.x * myposition.y * 1.) * 3. + 0.5));
    }
    // endGLSL
`;
gold.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.015 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float alpha2 = smoothstep(0.15 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(0.3 + alpha2 * 40.0, 0.1 + alpha * 1.0, 0.25 + alpha * 0., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 1.5;        
    }
    // endGLSL                                               ▄   ▄▄   ▄   ▄    ▄    ▄▄
`;                              //                        ▄▄▀▄▀▀▀▄▄▀▀▀▄▀▀▀▄▀▀▀▀▄▀▀▀▀▄▄▀▄▄
gold.init();                   //                       ▄▀▀▄▀▀▀▄▀▄▄▀▄▀▀▀▄▀▀▀▄▀▀▄▀▀▄▀▄▄▀▄▀▀▄
                              //      A               ▄▀███████████████████████████████████▀▄
                             //      AAA       A    ▄▀▄▀█ ┌────┬────────┬─────────┬─────┐ █▀▄▀▄      A
                           //       AAAAA     AAA  ▀▄▀▄▀█ │░░░░│░░░░┌─░─┴─░─┐░░░░░│░░░░░│ █▀▄▀▄▀    AAA
let textureShader = new ShaderProgram("textu");//A   ▀▄▀█ │────│────│───────│─────│─────│ █▀▄▀     AAAAA
                           //      AAAAAAA  AAAAAAA    ▀█ │────│────│───────│─────│─────│ █▀      AAAAAAA
                           //  █████████████████████████████████████████████████████████████████████████████
// Bloody dawn over the mountains                         ░░█░░░ ░ ░░█ ░░░ █ ░░░█  █  ███ █ ░░░█░█░ ░ ░██░█░
textureShader.vertText = `   //                            ░ ░░░█░███  ░░░█  ░░░░██ █ ███ █ ░░  █░░ ░█░░ ░ ░
    // beginGLSL                                           ░ ░░░ ░ ░░░░░ ░ █ ░░░█    █████  ░░ █░░░█░ ░░ ░ ░
attribute vec3 a_position;         //                        ░ ░ ░  ░ ░░ ░░░░░░ ░     ███   ░  ░░░░░░░░░░░ ░
attribute vec2 a_texcoord;                   //               ░░    ░ ░░  ░  ██████   ███   █ █  █ ░░░ ░ ░ ░
varying vec2 v_texcoord;                      //              ░░    ░ ░░  ░   ░░ ░ █  ███    █  █    ░ ░ ░
void main() {                                  //             ░     ░░ ░  ░    ░ ░  █ ███   ████       ░ ░
  // Multiply the position by the matrix.                     ░      ░ ░             ████  █           ░ ░
  vec4 positionVec4 = vec4(a_position, 1.0)          //              ░ ░              ███ █              ░   ▄
  // gl_Position = a_position;                                                        ████
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;       //                             ████
  gl_Position = positionVec4;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
// endGLSL
`;
textureShader.fragText = `
// beginGLSL
precision mediump float;
// Passed in from the vertex shader.
uniform float time;
varying vec2 v_texcoord;
// The texture.
uniform sampler2D u_texture;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
${blendingMath}
void main() {
    vec2 uv = vec2(gl_FragCoord.xy) / vec2(1600, 1600);
   float rando = rand(vec2(uv.x, uv.y));
   gl_FragColor = texture2D(u_texture, v_texcoord);
   // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
   // gl_FragColor.r = gl_FragColor.r * 0.5;
   gl_FragColor.rgb = (gl_FragColor.rgb - (rando * 0.07)) * 1.2;
    vec3 col = gl_FragColor.rgb;
        // vec3 levels = LevelsControlInputRange(gl_FragColor.rgb, 0.2, 0.95);
    vec3 blender = BlendSoftLight(gl_FragColor.rgb, vec3(1.0, 0.4, 0.0).brg.gbr);
    // vec3 blend = mix(gl_FragColor.rgb, blender, 1.);
    
    blender = BlendSoftLight(blender, vec3(1.0, 0.0, 0.0).brg.gbr);
    // Les aubes rouges et sanguinolentes
    gl_FragColor.rgb = blender;
    // Les nuits bleues, profondes et ensorcelantes
    gl_FragColor.rgb = blender.bgr;
    // ------------------------------------------------
    // Spatial desaturation filter
    // ------------------------------------------------
    float lum = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) * 0.333333 * 1.;
    float d = distance(uv, vec2(0.35));
    d = smoothstep(0.2, 0.5, d);
    gl_FragColor.rgb += vec3(lum * -5.125, lum * -5.125, 1.3 / lum) * -0.04 * pow(d, 0.25);
    // ------------------------------------------------
             // vec3 bw = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
        // gl_FragColor.rgb = mix(gl_FragColor.rgb, bw, 0.35);
    // gl_FragColor.rgb = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
    // gl_FragColor.r += col.r * 0.975;
    // gl_FragColor.b += col.b * 0.25;
//gl_FragColor.rgb = gl_FragColor.rbg;
}
// endGLSL
`;
textureShader.init();




// Bloody dawn over the mountains
textureShader.vertText = `
    // beginGLSL
attribute vec3 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  // Multiply the position by the matrix.
  vec4 positionVec4 = vec4(a_position, 1.0);
  // gl_Position = a_position;
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
// endGLSL
`;
textureShader.fragText = `
// beginGLSL
precision mediump float;
// Passed in from the vertex shader.
uniform float time;
varying vec2 v_texcoord;
// The texture.
uniform sampler2D u_texture;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
${blendingMath}
void main() {
    vec2 uv = vec2(gl_FragCoord.xy) / vec2(1600, 1600);
   float rando = rand(vec2(uv.x, uv.y));
   gl_FragColor = texture2D(u_texture, v_texcoord);
   // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
   // gl_FragColor.r = gl_FragColor.r * 0.5;
   gl_FragColor.rgb = (gl_FragColor.rgb - (rando * 0.07)) * 1.2;
    vec3 col = gl_FragColor.rgb;
        // vec3 levels = LevelsControlInputRange(gl_FragColor.rgb, 0.2, 0.95);
    vec3 blender = BlendSoftLight(gl_FragColor.rgb, vec3(1.0, 0.4, 0.0).brg.gbr);
    // vec3 blend = mix(gl_FragColor.rgb, blender, 1.);
    
    blender = BlendSoftLight(blender, vec3(1.0, 0.0, 0.0).brg.gbr);
    // Les aubes rouges et sanguinolentes
    gl_FragColor.rgb = blender;
    // Les nuits bleues, profondes et ensorcelantes
    // gl_FragColor.rgb = blender.bgr;
    // ------------------------------------------------
    // Spatial desaturation filter
    // ------------------------------------------------
    float lum = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) * 0.333333 * 1.;
    float d = distance(uv, vec2(0.35));
    d = smoothstep(0.2, 0.5, d);
    gl_FragColor.rgb += vec3(lum * -5.125, lum * -5.125, 1.3 / lum).bgr * -0.04 * pow(d, 0.25);
    // gl_FragColor.b *= 0.6;
    // ------------------------------------------------
             // vec3 bw = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
        // gl_FragColor.rgb = mix(gl_FragColor.rgb, bw, 0.35);
    // gl_FragColor.rgb = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
    // gl_FragColor.r += col.r * 0.975;
    // gl_FragColor.b += col.b * 0.25;
//gl_FragColor.rgb = gl_FragColor.rbg;
}
// endGLSL
`;
textureShader.init();

// golden sunrise
textureShader.vertText = `
    // beginGLSL
attribute vec3 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  // Multiply the position by the matrix.
  vec4 positionVec4 = vec4(a_position, 1.0);
  // gl_Position = a_position;
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
// endGLSL
`;
textureShader.fragText = `
// beginGLSL
precision mediump float;
// Passed in from the vertex shader.
uniform float time;
uniform float resolution;
varying vec2 v_texcoord;
// The texture.
uniform sampler2D u_texture;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
${blendingMath}
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
void main() {
    // vec2 uv = vec2(gl_FragCoord.xy) / vec2(1600, 1600);
    // vec2 uv = gl_FragCoord.xy / vec2(1440., 1440.) * resolution;
    vec2 uv = gl_FragCoord.xy / vec2(2560, 1440) * 2. / resolution - 1.;
    uv *= vec2(16. / 9., 1.0);
    // float rando = rand(vec2(uv.x, uv.y));
    float rando = rand(vec2(floor(uv.x * 1280. * 0.75) * 1e-4, floor(uv.y * 720. * 0.75) * 1e-4) * 100.);
    gl_FragColor = texture2D(u_texture, v_texcoord);
   // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
   // gl_FragColor.r = gl_FragColor.r * 0.5;
   gl_FragColor.rgb = (gl_FragColor.rgb - (rando * 0.09)) * 1.;
    vec3 col = gl_FragColor.rgb;
        // vec3 levels = LevelsControlInputRange(gl_FragColor.rgb, 0.2, 0.95);
        // gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, 3.75);
            vec3 bw = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, bw, 0.85);
    vec3 mmm = mix(vec3(1.0, 0.4, 0.0), vec3(1.0, 0.4, 0.0).brg, 0.5);
    vec3 blender = BlendSoftLight(gl_FragColor.rgb, mmm);
    vec3 blend = mix(gl_FragColor.rgb, blender, 1.);
    gl_FragColor.rgb = blend.rbg * vec3(1.1, 1.25, 0.5);
    bw = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
        // gl_FragColor.rgb = mix(gl_FragColor.rgb, bw, 1.);
    // gl_FragColor.rgb = LevelsControlInput(gl_FragColor.rgb, 0., vec3(1.), 0.75);
    // gl_FragColor.rgb = max(vec3(0.1), gl_FragColor.rgb);
    // gl_FragColor.rgb += roundedRectangle(uv, vec2(0.25 * (16./ 9.), 0.25), vec2(0.11 * (16./9.), 0.1025) * 2.1, 0.001, 0.25) * 0.12;
    // gl_FragColor.rgb += roundedRectangle(uv, vec2(0. * (16./ 9.), 0.), vec2(0.1092 * (16./9.), 0.104) * 2.1 * 4.1, 0.01, 0.5) * 0.12;
    bw = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, bw, -1.);
            gl_FragColor.rgb = vec3(max(0., gl_FragColor.r), max(0., gl_FragColor.g), max(0., gl_FragColor.b));
    gl_FragColor.rgb += roundedRectangle(uv, vec2(0. * (16./ 9.), 0.), vec2(0.1092 * (16./9.), 0.104) * 2.1 * 4.1, 0.01, 0.5) * 0.1;
    // gl_FragColor.rgb = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
    // gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, 2.75);
    // gl_FragColor.r += col.r * 0.975;
    // gl_FragColor.rgb *= 1.05;
    // gl_FragColor.b += col.b * 0.25;
//gl_FragColor.rgb = gl_FragColor.rbg;
}
// endGLSL
`;
textureShader.init();



// lavender crt
textureShader.vertText = `
    // beginGLSL
attribute vec3 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  // Multiply the position by the matrix.
  vec4 positionVec4 = vec4(a_position, 1.0);
  // gl_Position = a_position;
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
// endGLSL
`;
textureShader.fragText = `
// beginGLSL
precision mediump float;
// Passed in from the vertex shader.
uniform float time;
uniform float resolution;
varying vec2 v_texcoord;
// The texture.
uniform sampler2D u_texture;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
${blendingMath}
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
void main() {
    // vec2 uv = vec2(gl_FragCoord.xy) / vec2(1600, 1600);
    // vec2 uv = gl_FragCoord.xy / vec2(1440., 1440.) * resolution;
    vec2 uv = gl_FragCoord.xy / vec2(2560, 1440) * 2. / resolution - 1.;
    uv *= vec2(16. / 9., 1.0);
    // float rando = rand(vec2(uv.x, uv.y));
    float rando = rand(vec2(floor(uv.x * 1280. * 0.75) * 1e-4, floor(uv.y * 720. * 0.75) * 1e-4) * 100.);
    gl_FragColor = texture2D(u_texture, v_texcoord);
   // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
   // gl_FragColor.r = gl_FragColor.r * 0.5;
   gl_FragColor.rgb = (gl_FragColor.rgb - (rando * 0.09)) * 1.;
    vec3 col = gl_FragColor.rgb;
        // vec3 levels = LevelsControlInputRange(gl_FragColor.rgb, 0.2, 0.95);
        // gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, 3.75);
            vec3 bw = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, bw, 1.);
    vec3 mmm = mix(vec3(1.0, 0.4, 0.0), vec3(1.0, 0.4, 0.0).brg, 0.5);
    vec3 blender = BlendSoftLight(gl_FragColor.rgb, mmm);
    vec3 blend = mix(gl_FragColor.rgb, blender, 1.);
    gl_FragColor.rgb = blend.rbg * vec3(1.1, 1.25, 0.5);
    bw = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
        // gl_FragColor.rgb = mix(gl_FragColor.rgb, bw, 1.);
    // gl_FragColor.rgb = LevelsControlInput(gl_FragColor.rgb, 0., vec3(1.), 0.75);
    // gl_FragColor.rgb = max(vec3(0.1), gl_FragColor.rgb);
    // gl_FragColor.rgb += roundedRectangle(uv, vec2(0.25 * (16./ 9.), 0.25), vec2(0.11 * (16./9.), 0.1025) * 2.1, 0.001, 0.25) * 0.12;
    // gl_FragColor.rgb += roundedRectangle(uv, vec2(0. * (16./ 9.), 0.), vec2(0.1092 * (16./9.), 0.104) * 2.1 * 4.1, 0.01, 0.5) * 0.12;
    bw = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, bw, -1.);
            gl_FragColor.rgb = vec3(max(0., gl_FragColor.r), max(0., gl_FragColor.g), max(0., gl_FragColor.b));
    gl_FragColor.rgb += roundedRectangle(uv, vec2(0. * (16./ 9.), 0.), vec2(0.1092 * (16./9.), 0.104) * 2.1 * 4.1, 0.01, 0.5) * 0.1;
    // gl_FragColor.rgb = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
    gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, 2.75);
    vec2 pos = gl_FragCoord.xy / (vec2(1280, 720) * resolution * 2.);
    float edge = pow(0.26, 4.);
    gl_FragColor.rgb *= smoothstep(edge * 0.7, edge, pos.x * pos.y * (1. - pos.x) * (1. - pos.y));
    float vig2 = smoothstep(pow(0.26, 4.), pow(0.26, 3.), pos.x * pos.y * (1. - pos.x) * (1. - pos.y));
    float vig3 = smoothstep(pow(0.26, 4.), pow(0.26, 3.5), pos.x * pos.y * (1. - pos.x) * (1. - pos.y));
    float vig4 = smoothstep(pow(0.26, 4.), pow(0.26, 2.), pos.x * pos.y * (1. - pos.x) * (1. - pos.y));
    gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * vig2, 0.25 * 0.85);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * vig3, 0.125 * 0.85);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * vig4, 0.125 * 0.85);
    // gl_FragColor.r += col.r * 0.975;
    // gl_FragColor.rgb *= 1.05;
    // gl_FragColor.b += col.b * 0.25;
//gl_FragColor.rgb = gl_FragColor.rbg;
}
// endGLSL
`;
textureShader.init();




// deep lavender dreams
textureShader.vertText = `
    // beginGLSL
attribute vec3 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  // Multiply the position by the matrix.
  vec4 positionVec4 = vec4(a_position, 1.0);
  // gl_Position = a_position;
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
// endGLSL
`;
textureShader.fragText = `
// beginGLSL
precision mediump float;
// Passed in from the vertex shader.
uniform float time;
uniform float resolution;
varying vec2 v_texcoord;
// The texture.
uniform sampler2D u_texture;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
${blendingMath}
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
void main() {
    // vec2 uv = vec2(gl_FragCoord.xy) / vec2(1600, 1600);
    // vec2 uv = gl_FragCoord.xy / vec2(1440., 1440.) * resolution;
    vec2 uv = gl_FragCoord.xy / vec2(2560, 1440) * 2. / resolution - 1.;
    uv *= vec2(16. / 9., 1.0);
    // float rando = rand(vec2(uv.x, uv.y));
    float rando = rand(vec2(floor(uv.x * 1280. * 0.75) * 1e-4, floor(uv.y * 720. * 0.75) * 1e-4) * 100.);
    gl_FragColor = texture2D(u_texture, v_texcoord);
   // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
   // gl_FragColor.r = gl_FragColor.r * 0.5;
   gl_FragColor.rgb = (gl_FragColor.rgb - (rando * 0.09)) * 1.;
    vec3 col = gl_FragColor.rgb;
        // vec3 levels = LevelsControlInputRange(gl_FragColor.rgb, 0.2, 0.95);
        // gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, 3.75);
            vec3 bw = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, bw, 1.);
    vec3 mmm = mix(vec3(1.0, 0.4, 0.0), vec3(1.0, 0.4, 0.0).brg, 0.5);
    vec3 blender = BlendSoftLight(gl_FragColor.rgb, mmm);
    vec3 blend = mix(gl_FragColor.rgb, blender, 1.);
    gl_FragColor.rgb = blend.rbg * vec3(1.1, 1.25, 0.5);
    bw = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
        // gl_FragColor.rgb = mix(gl_FragColor.rgb, bw, 1.);
    // gl_FragColor.rgb = LevelsControlInput(gl_FragColor.rgb, 0., vec3(1.), 0.75);
    // gl_FragColor.rgb = max(vec3(0.1), gl_FragColor.rgb);
    // gl_FragColor.rgb += roundedRectangle(uv, vec2(0.25 * (16./ 9.), 0.25), vec2(0.11 * (16./9.), 0.1025) * 2.1, 0.001, 0.25) * 0.12;
    // gl_FragColor.rgb += roundedRectangle(uv, vec2(0. * (16./ 9.), 0.), vec2(0.1092 * (16./9.), 0.104) * 2.1 * 4.1, 0.01, 0.5) * 0.12;
    bw = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, bw, -1.);
            gl_FragColor.rgb = vec3(max(0., gl_FragColor.r), max(0., gl_FragColor.g), max(0., gl_FragColor.b));
    gl_FragColor.rgb += roundedRectangle(uv, vec2(0. * (16./ 9.), 0.), vec2(0.11025 * (16./9.), 0.105) * 2.1 * 4.1, 0.01, 0.5) * 0.12;
    // gl_FragColor.rgb = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
    gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, 2.75);
    vec2 pos = gl_FragCoord.xy / (vec2(1280, 720) * resolution * 2.);
    float edge = pow(0.26, 4.);
    // gl_FragColor.rgb *= smoothstep(edge * 0.7, edge, pos.x * pos.y * (1. - pos.x) * (1. - pos.y));
    float vig2 = smoothstep(pow(0.26, 4.), pow(0.26, 3.), pos.x * pos.y * (1. - pos.x) * (1. - pos.y));
    float vig3 = smoothstep(pow(0.26, 4.), pow(0.26, 3.5), pos.x * pos.y * (1. - pos.x) * (1. - pos.y));
    float vig4 = smoothstep(pow(0.26, 4.), pow(0.26, 2.), pos.x * pos.y * (1. - pos.x) * (1. - pos.y));
    // gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * vig2, 0.25 * 0.85);
    // gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * vig3, 0.125 * 0.85);
    // gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * vig4, 0.125 * 0.85);
    // gl_FragColor.r += col.r * 0.975;
    // gl_FragColor.rgb *= 1.05;
    // gl_FragColor.b += col.b * 0.25;
//gl_FragColor.rgb = gl_FragColor.rbg;
}
// endGLSL
`;
textureShader.init();

// deep green
textureShader.vertText = `
    // beginGLSL
attribute vec3 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  // Multiply the position by the matrix.
  vec4 positionVec4 = vec4(a_position, 1.0);
  // gl_Position = a_position;
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
// endGLSL
`;
textureShader.fragText = `
// beginGLSL
precision mediump float;
// Passed in from the vertex shader.
uniform float time;
uniform float resolution;
varying vec2 v_texcoord;
// The texture.
uniform sampler2D u_texture;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
${blendingMath}
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
void main() {
    // vec2 uv = vec2(gl_FragCoord.xy) / vec2(1600, 1600);
    // vec2 uv = gl_FragCoord.xy / vec2(1440., 1440.) * resolution;
    vec2 uv = gl_FragCoord.xy / vec2(2560, 1440) * 2. / resolution - 1.;
    uv *= vec2(16. / 9., 1.0);
    // float rando = rand(vec2(uv.x, uv.y));
    float rando = rand(vec2(floor(uv.x * 1280. * 0.75) * 1e-4, floor(uv.y * 720. * 0.75) * 1e-4) * 100.);
    gl_FragColor = texture2D(u_texture, v_texcoord);
   // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
   // gl_FragColor.r = gl_FragColor.r * 0.5;
   gl_FragColor.rgb = (gl_FragColor.rgb - (rando * 0.09)) * 1.;
    vec3 col = gl_FragColor.rgb;
        // vec3 levels = LevelsControlInputRange(gl_FragColor.rgb, 0.2, 0.95);
            vec3 bw = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, bw, 1.);
    vec3 blender = BlendSoftLight(gl_FragColor.rgb, vec3(1.0, 0.4, 0.0).brg.gbr);
    vec3 blend = mix(gl_FragColor.rgb, blender, 1.);
    gl_FragColor.rgb = blend.rbg * vec3(1.1, 1.25, 0.5);
    bw = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
        // gl_FragColor.rgb = mix(gl_FragColor.rgb, bw, 1.);
    // gl_FragColor.rgb = LevelsControlInput(gl_FragColor.rgb, 0., vec3(1.), 0.75);
    // gl_FragColor.rgb = max(vec3(0.1), gl_FragColor.rgb);
    // gl_FragColor.rgb += roundedRectangle(uv, vec2(0.25 * (16./ 9.), 0.25), vec2(0.11 * (16./9.), 0.1025) * 2.1, 0.001, 0.25) * 0.12;
    float rec = roundedRectangle(uv, vec2(0. * (16./ 9.), 0.), vec2(0.1092 * (16./9.), 0.104) * 2.1 * 4.1, 0.01, 0.5);
    // gl_FragColor.rgb += rec * vec3(2.0, 0.5, 1.0) * 1.2;
    gl_FragColor.rgb = max(vec3(rec * 0.12) - rando * 0.05, gl_FragColor.rgb);
        gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, 3.75);
    gl_FragColor.rgb += vec3(rando * 0.1, 0., 0.) * rec;
    // gl_FragColor.rgb = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
    // gl_FragColor.r += col.r * 0.975;
    // gl_FragColor.rgb *= 1.05;
    // gl_FragColor.b += col.b * 0.25;
//gl_FragColor.rgb = gl_FragColor.rbg;
}
// endGLSL
`;
textureShader.init();




// sepia crt
textureShader.vertText = `
    // beginGLSL
attribute vec3 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  // Multiply the position by the matrix.
  vec4 positionVec4 = vec4(a_position, 1.0);
  // gl_Position = a_position;
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
// endGLSL
`;
textureShader.fragText = `
// beginGLSL
precision mediump float;
// Passed in from the vertex shader.
uniform float time;
uniform float resolution;
varying vec2 v_texcoord;
// The texture.
uniform sampler2D u_texture;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
${blendingMath}
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
void main() {
    // vec2 uv = vec2(gl_FragCoord.xy) / vec2(1600, 1600);
    // vec2 uv = gl_FragCoord.xy / vec2(1440., 1440.) * resolution;
    vec2 uv = gl_FragCoord.xy / vec2(2560, 1440) * 2. / resolution - 1.;
    uv *= vec2(16. / 9., 1.0);
    // float rando = rand(vec2(uv.x, uv.y));
    float rando = rand(vec2(floor(uv.x * 1280. * 0.75) * 1e-4, floor(uv.y * 720. * 0.75) * 1e-4) * 100.);
    gl_FragColor = texture2D(u_texture, v_texcoord);
   // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
   // gl_FragColor.r = gl_FragColor.r * 0.5;
   gl_FragColor.rgb = (gl_FragColor.rgb - (rando * 0.09)) * 1.;
    vec3 col = gl_FragColor.rgb;
        // vec3 levels = LevelsControlInputRange(gl_FragColor.rgb, 0.2, 0.95);
        // gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, 3.75);
            vec3 bw = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, bw, 1.);
    vec3 blender = BlendSoftLight(gl_FragColor.rgb, vec3(1.0, 0.4, 0.0).brg.gbr);
    vec3 blend = mix(gl_FragColor.rgb, blender, 1.);
    gl_FragColor.rgb = blend.rbg * vec3(1.1, 1.25, 0.5);
    bw = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
        // gl_FragColor.rgb = mix(gl_FragColor.rgb, bw, 1.);
    // gl_FragColor.rgb = LevelsControlInput(gl_FragColor.rgb, 0., vec3(1.), 0.75);
    // gl_FragColor.rgb = max(vec3(0.1), gl_FragColor.rgb);
    // gl_FragColor.rgb += roundedRectangle(uv, vec2(0.25 * (16./ 9.), 0.25), vec2(0.11 * (16./9.), 0.1025) * 2.1, 0.001, 0.25) * 0.12;
    gl_FragColor.rgb += roundedRectangle(uv, vec2(0. * (16./ 9.), 0.), vec2(0.1092 * (16./9.), 0.104) * 2.1 * 4.1, 0.01, 0.5) * 0.12;
    // gl_FragColor.rgb = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
    // gl_FragColor.r += col.r * 0.975;
    vec2 pos = gl_FragCoord.xy / (vec2(1280, 720) * resolution * 2.);
    float edge = pow(0.26, 4.);
    gl_FragColor.rgb *= smoothstep(edge * 0.7, edge, pos.x * pos.y * (1. - pos.x) * (1. - pos.y));
    float vig2 = smoothstep(pow(0.26, 4.), pow(0.26, 3.), pos.x * pos.y * (1. - pos.x) * (1. - pos.y));
    float vig3 = smoothstep(pow(0.26, 4.), pow(0.26, 3.5), pos.x * pos.y * (1. - pos.x) * (1. - pos.y));
    float vig4 = smoothstep(pow(0.26, 4.), pow(0.26, 2.), pos.x * pos.y * (1. - pos.x) * (1. - pos.y));
    gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * vig2, 0.25 * 0.85);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * vig3, 0.125 * 0.85);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * vig4, 0.125 * 0.85);
    // gl_FragColor.rgb *= 1.05;
    // gl_FragColor.b += col.b * 0.25;
//gl_FragColor.rgb = gl_FragColor.rbg;
}
// endGLSL
`;
textureShader.init();



// The sepia of the magical thaw
textureShader.vertText = `
    // beginGLSL
attribute vec3 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  // Multiply the position by the matrix.
  vec4 positionVec4 = vec4(a_position, 1.0);
  // gl_Position = a_position;
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
// endGLSL
`;
textureShader.fragText = `
// beginGLSL
precision mediump float;
// Passed in from the vertex shader.
uniform float time;
uniform float resolution;
varying vec2 v_texcoord;
// The texture.
uniform sampler2D u_texture;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
${blendingMath}
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
void main() {
    // vec2 uv = vec2(gl_FragCoord.xy) / vec2(1600, 1600);
    // vec2 uv = gl_FragCoord.xy / vec2(1440., 1440.) * resolution;
    vec2 uv = gl_FragCoord.xy / vec2(2560, 1440) * 2. / resolution - 1.;
    uv *= vec2(16. / 9., 1.0);
    // float rando = rand(vec2(uv.x, uv.y));
    float rando = rand(vec2(floor(uv.x * 1280. * 0.75) * 1e-4, floor(uv.y * 720. * 0.75) * 1e-4) * 100.);
    gl_FragColor = texture2D(u_texture, v_texcoord);
   // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
   // gl_FragColor.r = gl_FragColor.r * 0.5;
   gl_FragColor.rgb = (gl_FragColor.rgb - (rando * 0.09)) * 1.;
    vec3 col = gl_FragColor.rgb;
        // vec3 levels = LevelsControlInputRange(gl_FragColor.rgb, 0.2, 0.95);
        // gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, 3.75);
            vec3 bw = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, bw, 1.);
    vec3 blender = BlendSoftLight(gl_FragColor.rgb, vec3(1.0, 0.4, 0.0).brg.gbr);
    vec3 blend = mix(gl_FragColor.rgb, blender, 1.);
    gl_FragColor.rgb = blend.rbg * vec3(1.1, 1.25, 0.5);
    bw = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
        // gl_FragColor.rgb = mix(gl_FragColor.rgb, bw, 1.);
    // gl_FragColor.rgb = LevelsControlInput(gl_FragColor.rgb, 0., vec3(1.), 0.75);
    // gl_FragColor.rgb = max(vec3(0.1), gl_FragColor.rgb);
    // gl_FragColor.rgb += roundedRectangle(uv, vec2(0.25 * (16./ 9.), 0.25), vec2(0.11 * (16./9.), 0.1025) * 2.1, 0.001, 0.25) * 0.12;
    gl_FragColor.rgb += roundedRectangle(uv, vec2(0. * (16./ 9.), 0.), vec2(0.11025 * (16./9.), 0.105) * 2.1 * 4.1, 0.01, 0.5) * 0.12;
    // gl_FragColor.rgb = vec3((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.);
    // gl_FragColor.r += col.r * 0.975;
    // gl_FragColor.rgb *= 1.05;
    // gl_FragColor.b += col.b * 0.25;
//gl_FragColor.rgb = gl_FragColor.rbg;
}
// endGLSL
`;
textureShader.init();

let processorShader = new ShaderProgram("process");

processorShader.vertText = `
attribute vec3 a_position;
attribute vec2 a_texcoord;

// uniform vec2 u_resolution;
// uniform float u_flipY;

varying vec2 v_texcoord;

void main() {
  // Multiply the position by the matrix.
  vec4 positionVec4 = vec4(a_position, 1.0);
  // gl_Position = a_position;
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;

  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
`;

processorShader.fragText = `
precision mediump float;

// our texture
uniform sampler2D u_texture;
uniform vec2 u_textureSize;
uniform float u_kernel[9];
uniform float u_kernelWeight;
uniform vec2 direction;

// the texCoords passed in from the vertex shader.
varying vec2 v_texcoord;

vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3846153846) * direction;
  vec2 off2 = vec2(3.2307692308) * direction;
  color += texture2D(image, uv) * 0.2270270270;
  color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
  color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
  return color;
}

void main() {
   vec2 uv = vec2(gl_FragCoord.xy);
   // vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
   // vec4 colorSum =
   //     texture2D(u_texture, v_texcoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
   //     texture2D(u_texture, v_texcoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
   //     texture2D(u_texture, v_texcoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
   //     texture2D(u_texture, v_texcoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
   //     texture2D(u_texture, v_texcoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
   //     texture2D(u_texture, v_texcoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
   //     texture2D(u_texture, v_texcoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
   //     texture2D(u_texture, v_texcoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
   //     texture2D(u_texture, v_texcoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;

   // gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1);

   gl_FragColor = blur9(u_texture, v_texcoord, u_textureSize, direction);
   // vec4 pass1 = blur9(u_texture, v_texcoord, u_textureSize, vec2(0.0, 1.5));
   // gl_FragColor = (pass0 + pass1) / 2.0;
   // gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
}
`;


let newFlickeringVert = new ShaderProgram("new-flickering-dots-vert");

newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
// 
    float map(float value, float min1, float max1, float min2, float max2) {
        float perc = (value - min1) / (max1 - min1);
        return perc * (max2 - min2) + min2;
    }
// 
    vec2 rotate(vec2 pos, float angle) {
        float c = cos(angle);
        float s = sin(angle);
        return mat2(c, s, -s, c) * pos;
    }
    float plane(vec3 pos) {
        return pos.y;
    }
    float sphere(vec3 pos, float radius) {
        return length(pos) - radius;
    }
    float box(vec3 pos, vec3 size) {
        return length(max(abs(pos) - size, 0.0));
    }
    float roundedBox(vec3 pos, vec3 size, float radius) {
        return length(max(abs(pos) - size, 0.0)) - radius;
    }
    float map(vec3 pos) {
        float planeDist = plane(pos + vec3(0.0, 10.0, 0.0));
        // float o = (sin(time * 1e1) + 1.) * 5.;
        // pos.xy = rotate(pos.xy, pos.z * 0.01 * sin(time * 0.5e2));
        // pos = mod(pos + 10., 20.) - 10.;
        // return min(planeDist, roundedBox(pos, vec3(2.0), 1.0));
        return min(planeDist, roundedBox(pos, vec3(1.5), 2.0));
    }
    float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    float noise(vec2 p){
      vec2 ip = floor(p);
      vec2 u = fract(p);
      u = u*u*(3.0-2.0*u);
      float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
      return res*res;
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec3 pos = vec3(0.0, 0.0, 0.0);
        vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 color = vec3(0.0);
        for (int i = 0; i < 128; i++) {
            float d = map(pos);
            if ( d < 0.01) {
                // float sh = 1.0 - float(j) * 0.015;
                // color = vec3(sh, sin(pos.y * 0.225) * 0.5 * sh, sin(pos.x * 0.125) * 1.5 * sh);
                break;
            }
            pos += d * dir;
            // x += sin(float(j)) * 0.01;
        }
        // float ds = dot(vec2(x, y), vec2(0.5, 0.5));
        // y -= ( abs(x) * 1. / y * cos(x)) * 0.1;
        // x -= cos( abs(y) * 1. / y * sin(t)) * 0.1;
        // x += ds * 0.9;
        // y += ds * 0.9;
        // // x += cos(x * 0.0625 * sin(t * 1e3) + i * 0.0625e5 / cos(i * 15.5 + t * 1e-2) * 2e-1) * 0.5e-1;
        // y += sin(x * 0.0625 * sin(t * 1e3) + i * 0.0625e5 / sin(i * 15.5 + t * 1e-2) * 2e-1) * 0.5e-1;
        // gl_Position = vec4((x - 0.) * 8., (y - 0.) * 8., 0.0, 1.0);
        float n = noise(vec2(x * 10. + cos(time * 2e-3) * 20., y * 10. + sin(time * 2e-3) * 20.));
        // n = sin(n * 3. * tan(n * 1e1));
        gl_Position = vec4(x * 1.75, y * 1.75 + n * 0.1, 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        gl_PointSize = 12. - n * 7.;
        alph = 0.25 * 0.75;
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = gl_FragColor.bbb;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();



// let newFlickeringVert = new ShaderProgram("new-flickering-dots-vert");

newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir);
        float b = 2.1 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-6), sin(time * 1e-6));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        // x = fx;
        // y = fy;
        vec3 pos = vec3(0.0, 10.0, -20.0);
        // vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 dir = vec3(x * (16. / 9.), y * 1., 1.0);
        float lfo = sin(time * 0.25e-1) * 3.;
        float lfo2 = cos(time * 0.25e-1) * 3.;
        float d = min(intersectPlane(pos, dir), intersectSphere(pos + vec3(lfo2 * 4., -9.5 + (lfo * 2.75), 0.0), dir));
        // d = min(d, intersectSphere(pos + vec3(1. / lfo + 5., -9.5 + (lfo * 2.75) - 4., 0.0), dir));
        pos += d * dir;
        vec3 color = fract(pos * 0.05);
        // color = pos;
        // y = mix(y * 1.5, y * 1.5 + (color.y * 0.2), 0.25 * (sin(time * 1e-1) * 0.5 + 0.5));
        gl_Position = vec4(x * 1.5 + sin(pos.z * 0.5e-1) * 0., y * 1.5 + pos.y * 0., 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 8. * color.x * 2.;
        // gl_PointSize = 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = gl_FragColor.bbb;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();



// Le premier raytracing convainquant
newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float resolution;
    uniform float time;
    varying float alph;
    varying vec3 col;
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir);
        float b = 2.1 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-6), sin(time * 1e-6));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        // x = fx;
        // y = fy;
        vec3 pos = vec3(0.0, 10.0, -20.0);
        // vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 dir = vec3(x * (16. / 9.), y * 1., 1.0);
        float lfo = sin(time * 0.25e-1) * 3.;
        float lfo2 = cos(time * 0.25e-1) * 3.;
        float d = min(intersectPlane(pos, dir), intersectSphere(pos + vec3(lfo2 * 4., -9.5 + (lfo * 2.75), 0.0), dir));
        // d = min(d, intersectSphere(pos + vec3(1. / lfo + 5., -9.5 + (lfo * 2.75) - 4., 0.0), dir));
        pos += d * dir;
        vec3 color = fract(pos * 0.05);
        // color = pos;
        // y = mix(y * 1.5, y * 1.5 + (color.y * 0.2), 0.25 * (sin(time * 1e-1) * 0.5 + 0.5));
        gl_Position = vec4(x * 1.5 + sin(pos.z * 0.5e-1) * 0., y * 1.5 + pos.y * 0., 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 8. * color.x * 2. * resolution * 2.;
        col = vec3(1.0);
       float vig = (roundedRectangle(vec2(x * (16./9.), y), vec2(0.0, 0.0), vec2(1. * (16./9.) + 0.105, 1.) * 0.59, 0.01, 0.5) + 0.0);
        // cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig);       // gl_PointSize = 10.;
        col = vec3(vig);
        if (gl_PointSize < 2.0) {
            gl_PointSize = 0.;
            col = vec3(0.);
        }
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
varying vec3 col;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = col;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();




newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir);
        float b = 2.001 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-3), sin(time * 1e-3));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        x = fx;
        y = fy;
        vec3 pos = vec3(0.0, 10.0, -20.0);
        // vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 dir = vec3(x * (16. / 9.), y * 1., 1.0);
        float lfo = sin(time * 0.25e-1) * 3.;
        float lfo2 = cos(time * 0.25e-1) * 3.;
        float d = min(intersectPlane(pos, dir), intersectSphere(pos + vec3(lfo2 * 4., -9.5 + (lfo * 2.75), 0.0), dir));
        d = intersectPlane(pos, dir);
        for (int i = 0; i < 140; i++) {
                float fi = float(i) * 0.1;
                d = min(d, intersectSphere(pos + vec3(cos(173607. * 1e-3 * fi) * fi, -10. + sin(173607. * 1e-3 * fi) * fi, fi * 0.2), dir));
            }
        pos += d * dir;
        vec3 color = fract(pos * 0.5);
        // color = pos;
        // y = mix(y * 1.5, y * 1.5 + (color.y * 0.2), 0.25 * (sin(time * 1e-1) * 0.5 + 0.5));
        gl_Position = vec4(x * 1.5 + sin(color.y * 1e3) * 0., y * 1.5 + pos.y * 0., 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 8. * color.z * 2.;
        // gl_PointSize = 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = gl_FragColor.bbb;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();




newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir);
        float b = 1.997 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-2), sin(time * 1e-2));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        // x = fx;
        // y = fy;
        vec3 pos = vec3(0.0, 10.0, -20.0);
        // vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 dir = vec3(x * (16. / 9.), y * 1., 1.0);
        float lfo = sin(time * 0.25e-1) * 3.;
        float lfo2 = cos(time * 0.25e-1) * 3.;
        float d = min(intersectPlane(pos, dir), intersectSphere(pos + vec3(lfo2 * 4., -9.5 + (lfo * 2.75), 0.0), dir));
        d = intersectPlane(pos, dir);
        for (int i = 0; i < 140; i++) {
                float fi = float(i) * 0.1;
                d = min(d, intersectSphere(pos + vec3(cos(time * 4e-3 * fi) * fi, -10. + sin(time * 4e-3 * fi) * fi, fi * 1.0), dir));
            }
        pos += d * dir;
        vec3 color = fract(pos * 0.005);
        // color = pos;
        // y = mix(y * 1.5, y * 1.5 + (color.y * 0.2), 0.25 * (sin(time * 1e-1) * 0.5 + 0.5));
        gl_Position = vec4(x * 0.85 * 0.5 + sin(color.y * 1.) * 0., y * 0.5 * 0.5 + pos.z * 0.005 - 0.0, 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        // gl_PointSize = 8. * color.z * 2.;
        gl_PointSize = 5.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
        cols = pos.yyy;
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = cols;
        // gl_FragColor.rgb = gl_FragColor.bbb;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();



newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir);
        float b = 2.001 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-2), sin(time * 1e-2));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        x = fx;
        y = fy;
        vec3 pos = vec3(0.0, 10.0, -20.0);
        // vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 dir = vec3(x * (16. / 9.), y * 1., 1.0);
        float lfo = sin(time * 0.25e-1) * 3.;
        float lfo2 = cos(time * 0.25e-1) * 3.;
        float d = min(intersectPlane(pos, dir), intersectSphere(pos + vec3(lfo2 * 4., -9.5 + (lfo * 2.75), 0.0), dir));
        d = intersectPlane(pos, dir);
        for (int i = 0; i < 140; i++) {
                float fi = float(i) * 0.1;
                d = min(d, intersectSphere(pos + vec3(cos(time * 1e-2 * fi) * fi, -10. + sin(time * 1e-2 * fi) * fi, fi * 0.2), dir));
            }
        pos += d * dir;
        vec3 color = fract(pos * 0.5);
        // color = pos;
        // y = mix(y * 1.5, y * 1.5 + (color.y * 0.2), 0.25 * (sin(time * 1e-1) * 0.5 + 0.5));
        gl_Position = vec4(x * 1.5 + sin(color.y * 1e3) * 0., y * 1.5 + pos.y * 0., 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 8. * color.z * 2.;
        // gl_PointSize = 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
        cols = color;
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = gl_FragColor.rbb * cols.b;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();






newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir);
        float b = 2.001 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-2), sin(time * 1e-2));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        x = fx;
        y = fy;
        vec3 pos = vec3(0.0, 10.0, -20.0);
        // vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 dir = vec3(x * (16. / 9.), y * 1., 1.0);
        float lfo = sin(time * 0.25e-1) * 3.;
        float lfo2 = cos(time * 0.25e-1) * 3.;
        float d = min(intersectPlane(pos, dir), intersectSphere(pos + vec3(lfo2 * 4., -9.5 + (lfo * 2.75), 0.0), dir));
        d = intersectPlane(pos, dir);
        for (int i = 0; i < 140; i++) {
                float fi = float(i) * 0.1;
                d = min(d, intersectSphere(pos + vec3(cos(time * 1e-2 * fi) * fi, -10. + sin(time * 1e-2 * fi) * fi, fi * 0.2), dir));
            }
        pos += d * dir;
        vec3 color = fract(pos * 0.5);
        // color = pos;
        // y = mix(y * 1.5, y * 1.5 + (color.y * 0.2), 0.25 * (sin(time * 1e-1) * 0.5 + 0.5));
        gl_Position = vec4(x * 1.5 + sin(color.y * 1e3) * 0., y * 1.5 + pos.y * 0., 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 8. * color.z * 2.;
        // gl_PointSize = 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = gl_FragColor.bbb;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();






newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir);
        float b = 2.001 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-2), sin(time * 1e-2));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        x = fx;
        y = fy;
        vec3 pos = vec3(0.0, 10.0, -20.0);
        // vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 dir = vec3(x * (16. / 9.), y * 1., 1.0);
        float lfo = sin(time * 0.25e-1) * 3.;
        float lfo2 = cos(time * 0.25e-1) * 3.;
        float d = min(intersectPlane(pos, dir), intersectSphere(pos + vec3(lfo2 * 4., -9.5 + (lfo * 2.75), 0.0), dir));
        d = intersectPlane(pos, dir);
        for (int i = 0; i < 140; i++) {
                float fi = float(i) * 0.2;
                d = min(d, intersectSphere(pos + vec3(cos(time * 1e-3 * fi) * fi, -10. + sin(time * 1e-3 * fi) * fi, fi * 0.2), dir));
            }
        pos += d * dir;
        vec3 color = fract(pos * vec3(0.01, 0.01, 0.25));
        // color = pos;
        // y = mix(y * 1.5, y * 1.5 + (color.y * 0.2), 0.25 * (sin(time * 1e-1) * 0.5 + 0.5));
        gl_Position = vec4(x * 1.5 + sin(color.y * 1e3) * 0., y * 1.5 + pos.y * 0., 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 8. * color.z * 2.;
        // gl_PointSize = 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
        cols = color;
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = gl_FragColor.brr * cols.b * cols.g * vec3(1.0, 1.5, 1.0) * 12.;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();







newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir);
        float b = 2.01 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-2), sin(time * 1e-2));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        // x = fx;
        // y = fy;
        vec3 pos = vec3(0.0, 10.0, -20.0);
        // vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 dir = vec3(x * (16. / 9.), y * 1., 1.0);
        float lfo = sin(time * 0.25e-1) * 3.;
        float lfo2 = cos(time * 0.25e-1) * 3.;
        float d = min(intersectPlane(pos, dir), intersectSphere(pos + vec3(lfo2 * 4., -9.5 + (lfo * 2.75), 0.0), dir));
        d = intersectPlane(pos, dir);
        for (int i = 0; i < 140; i++) {
                float fi = float(i) * 0.2;
                d = min(d, intersectSphere(pos + vec3(cos(time * 1e-3 * fi) * fi, -10. + sin(time * 1e-3 * fi) * fi, fi * -0.2), dir));
            }
        pos += d * dir;
        vec3 color = fract(pos * vec3(0.01, 0.01, 0.25));
        // color = pos;
        // y = mix(y * 1.5, y * 1.5 + (color.y * 0.2), 0.25 * (sin(time * 1e-1) * 0.5 + 0.5));
        gl_Position = vec4(x * 1.5 + sin(color.y * 1e3) * 0., y * 1.5 + pos.y * 0., 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 8. * color.z * 2.;
        // gl_PointSize = 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
        cols = color;
       float vig = (roundedRectangle(vec2(x * 1.5, y * 1.5), vec2(0.0, 0.0), vec2(0.9, 0.88) * 0.92, 0.05, 0.25) + 0.0);
        cols = mix(cols, cols * (vig), 1.);
        gl_PointSize = (gl_PointSize * vig);
        if (floor(vig) == 0.0) {
            // gl_PointSize = 0.0;
        }
        // gl_PointSize = min(0.0,  vig);
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = gl_FragColor.brr * cols.b * cols.g * vec3(1.0, 1.5, 1.0) * 12.;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();




newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir);
        float b = 2.01 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-2), sin(time * 1e-2));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        // x = fx;
        // y = fy;
        vec3 pos = vec3(0.0, 10.0, -20.0);
        // vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 dir = vec3(x * (16. / 9.), y * 1., 1.0);
        float lfo = sin(time * 0.25e-1) * 3.;
        float lfo2 = cos(time * 0.25e-1) * 3.;
        float d = min(intersectPlane(pos, dir), intersectSphere(pos + vec3(lfo2 * 4., -9.5 + (lfo * 2.75), 0.0), dir));
        d = intersectPlane(pos, dir);
        for (int i = 0; i < 140; i++) {
                float fi = float(i) * 0.2;
                d = min(d, intersectSphere(pos + vec3(cos(time * 1e-3 * fi) * fi, -10. + sin(time * 1e-3 * fi) * fi, fi * -0.2), dir));
            }
        pos += d * dir;
        vec3 color = fract(pos * vec3(0.01, 0.005, 0.35));
        // color = pos;
        // y = mix(y * 1.5, y * 1.5 + (color.y * 0.2), 0.25 * (sin(time * 1e-1) * 0.5 + 0.5));
        gl_Position = vec4(x * 1.5 + sin(color.y * 1e3) * 0., y * 1.5 + pos.y * 0., 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 8. * color.z * 2.;
        // gl_PointSize = 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
        cols = color;
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = gl_FragColor.brr * cols.b * cols.g * vec3(1.0, 1.5, 1.0) * 12.;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();






newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir);
        float b = 2.01 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-2), sin(time * 1e-2));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        // x = fx;
        // y = fy;
        vec3 pos = vec3(0.0, 10.0, -20.0);
        // vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 dir = vec3(x * (16. / 9.), y * 1., 1.0);
        float lfo = sin(time * 0.25e-1) * 3.;
        float lfo2 = cos(time * 0.25e-1) * 3.;
        float d = min(intersectPlane(pos, dir), intersectSphere(pos + vec3(lfo2 * 4., -9.5 + (lfo * 2.75), 0.0), dir));
        d = intersectPlane(pos, dir);
        for (int i = 0; i < 140; i++) {
                float fi = float(i) * 0.2;
                d = min(d, intersectSphere(pos + vec3(cos(time * 1e-3 * fi) * fi, -10. + sin(time * 1e-3 * fi) * fi, fi * -0.2), dir));
            }
        pos += d * dir;
        vec3 color = fract(pos * vec3(0.01, 0.005, 0.35));
        // color = pos;
        // y = mix(y * 1.5, y * 1.5 + (color.y * 0.2), 0.25 * (sin(time * 1e-1) * 0.5 + 0.5));
        gl_Position = vec4(x * 1.5 + sin(color.y * 1e3) * 0., y * 1.5 + pos.y * 0., 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 8. * color.z * 2.;
        // gl_PointSize = 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
        cols = color;
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = gl_FragColor.brr * cols.b * cols.g * vec3(1.0, 1.5, 1.0) * 12.;
        gl_FragColor.rgb = gl_FragColor.brg;
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();




newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir);
        float b = 2.01 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-2), sin(time * 1e-2));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        // x = fx;
        // y = fy;
        vec3 pos = vec3(0.0, 10.0, -20.0);
        // vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 dir = vec3(x * (16. / 9.), y * 1., 1.0);
        float lfo = sin(time * 0.25e-1) * 3.;
        float lfo2 = cos(time * 0.25e-1) * 3.;
        float d = min(intersectPlane(pos, dir), intersectSphere(pos + vec3(lfo2 * 4., -9.5 + (lfo * 2.75), 0.0), dir));
        d = intersectPlane(pos, dir);
        for (int i = 0; i < 140; i++) {
                float fi = float(i) * 0.2;
                d = min(d, intersectSphere(pos + vec3(cos(time * 1e-3 * fi) * fi, -10. + sin(time * 1e-3 * fi) * fi, fi * -0.2), dir));
            }
        pos += d * dir;
        vec3 color = fract(pos * vec3(0.01, 0.005, 0.35) * 1. * sin(time * 1e-2));
        // color = pos;
        // y = mix(y * 1.5, y * 1.5 + (color.y * 0.2), 0.25 * (sin(time * 1e-1) * 0.5 + 0.5));
        gl_Position = vec4(x * 1.5 + sin(color.y * 1e3) * 0., y * 1.5 + pos.y * 0., 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 8. * color.z * 2.;
        // gl_PointSize = 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
        cols = color;
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = gl_FragColor.brr * cols.b * cols.g * vec3(1.0, 1.5, 1.0) * 12.;
        gl_FragColor.rgb = gl_FragColor.brg;
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();





newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir);
        float b = 2.01 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-2), sin(time * 1e-2));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        // x = fx;
        // y = fy;
        vec3 pos = vec3(0.0, 10.0, -20.0);
        // vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 dir = vec3(x * (16. / 9.), y * 1., 1.0);
        float lfo = sin(time * 0.25e-1) * 3.;
        float lfo2 = cos(time * 0.25e-1) * 3.;
        float d = min(intersectPlane(pos, dir), intersectSphere(pos + vec3(lfo2 * 4., -9.5 + (lfo * 2.75), 0.0), dir));
        d = intersectPlane(pos, dir);
        for (int i = 0; i < 140; i++) {
                float fi = float(i) * 0.2;
                d = min(d, intersectSphere(pos + vec3(cos(time * 1e-3 * fi) * fi, -10. + sin(time * 1e-3 * fi) * fi, fi * -0.1), dir));
            }
        pos += d * dir;
        vec3 color = fract(pos * vec3(0.01, 0.005, 0.35));
        // color = pos;
        // y = mix(y * 1.5, y * 1.5 + (color.y * 0.2), 0.25 * (sin(time * 1e-1) * 0.5 + 0.5));
        gl_Position = vec4(x * 1.05 + tan(y * 2e2 * t) * 0.01, (y * 1.05 + pos.y * 0.05) - 0.3, 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 4. * color.z * 2.5;
        // gl_PointSize = 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
        cols = color;
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 1.05;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = gl_FragColor.brr * cols.b * cols.g * vec3(1.0, 1.5, 1.0) * 12.;
        gl_FragColor.rgb = gl_FragColor.brg;
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();





newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir);
        float b = 2.01 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 3.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-2), sin(time * 1e-2));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        // x = fx;
        // y = fy;
        vec3 pos = vec3(0.0, 10.0, -20.0);
        // vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 dir = vec3(x * (16. / 9.), y * 1., 1.0);
        float lfo = sin(time * 0.25e-1) * 3.;
        float lfo2 = cos(time * 0.25e-1) * 3.;
        float d = min(intersectPlane(pos, dir), intersectSphere(pos + vec3(lfo2 * 4., -9.5 + (lfo * 2.75), 0.0), dir));
        d = intersectPlane(pos, dir);
        for (int i = 0; i < 140; i++) {
                float fi = float(i) * 0.2;
                d = min(d, intersectSphere(pos + vec3(cos(time * 1e-3 * fi) * fi, -10. + sin(time * 1e-3 * fi) * fi, fi * -0.2 + 10.), dir));
            }
        pos += d * dir;
        vec3 color = fract(pos * vec3(0.01, 0.005, 0.35));
        // color = pos;
        // y = mix(y * 1.5, y * 1.5 + (color.y * 0.2), 0.25 * (sin(time * 1e-1) * 0.5 + 0.5));
        gl_Position = vec4(x * 1.5 + sin(color.y * 1e3) * 0., y * 1.5 + pos.y * 0., 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 8. * pow(color.z, 5.0) * 8. * 1.;
        // gl_PointSize = 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
        cols = color;
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = gl_FragColor.brr * cols.b * cols.g * vec3(1.0, 1.5, 1.0) * 12.;
        // gl_FragColor.rgb = pow(gl_FragColor.rgb, 2.0);
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();



newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir);
        float b = 2.01 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-5), sin(time * 1e-5));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        x = fx;
        y = fy;
        vec3 pos = vec3(0.0, 10.0, -20.0);
        // vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 dir = vec3(x * (16. / 9.), y * 1., 1.0);
        float lfo = sin(time * 0.25e-1) * 3.;
        float lfo2 = cos(time * 0.25e-1) * 3.;
        float d = intersectPlane(pos, dir);
        for (int i = 0; i < 140; i++) {
                float fi = float(i) * 0.1;
                d = min(d, intersectSphere(pos + vec3(sin(fi * time * 1e-1) * 10., fi * pos.z * 1., 5. - fi), dir));
            }       
        pos += d * dir;
        vec3 color = fract(pos * 0.1);
        // color = 1. / pos * 0.01;
        // y = mix(y * 1.5, y * 1.5 + (color.y * 0.2), 0.25 * (sin(time * 1e-1) * 0.5 + 0.5));
        gl_Position = vec4(x * 1.5 + sin(pos.z * 0.5e-1) * 0., y * 1.5 + pos.y * 0., 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 8. * color.z * 2.;
        // gl_PointSize = 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = gl_FragColor.bbb;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();




newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir);
        float b = 2.01 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
     float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-5), sin(time * 1e-5));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        x = fx;
        y = fy;
        vec3 pos = vec3(0.0, 10.0, -20.0);
        // vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 dir = vec3(x * (16. / 9.), y * 1., 1.0);
        float lfo = sin(time * 0.25e-1) * 3.;
        float lfo2 = cos(time * 0.25e-1) * 3.;
        float d = intersectPlane(pos, dir);
        for (int i = 0; i < 140; i++) {
                float fi = float(i) * 0.1;
                d = min(d, intersectSphere(pos + vec3(sin(fi * time * 2e-2) * 10., fi * pos.z * 0.25, 5. - fi), dir));
            }       
        pos += d * dir;
        vec3 color = fract(pos * 0.1);
        // color = 1. / pos * 0.01;
        // y = mix(y * 1.5, y * 1.5 + (color.y * 0.2), 0.25 * (sin(time * 1e-1) * 0.5 + 0.5));
        gl_Position = vec4(x * 1.5 + sin(pos.z * 0.5e-1) * 0., y * 1.5 + pos.y * 0., 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 8. * color.z * 2.;
        // gl_PointSize = 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
       float vig = (roundedRectangle(vec2(x * 1.5, y * 1.5), vec2(0.0, 0.0), vec2(0.9, 0.88) * 0.97, 0.05, 0.5) + 0.0);
        // cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig);
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = gl_FragColor.bbb;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();



newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir);
        float b = 2.01 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
     float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-1), sin(time * 1e-1));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        // x = fx;
        // y = fy;
        // y = fy + (tan(fx * 1.) * 0.05);
        vec3 pos = vec3(0.0, 10.0, -20.0);
        // vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 dir = vec3(x * (16. / 9.), y * 1., 1.0);
        float lfo = sin(time * 0.25e-1) * 3.;
        float lfo2 = cos(time * 0.25e-1) * 3.;
        float d = intersectPlane(pos, dir);
        for (int i = 0; i < 140; i++) {
                float fi = float(i) * 0.1;
                d = min(d, intersectSphere(pos + vec3(sin(fi * time * 2e-2) * 10., fi * pos.z * 0.25, 5. - fi), dir));
            }       
        pos += d * dir;
        vec3 color = fract(pos * 0.05);
        // color = 1. / pos * 0.01;
        // y = mix(y * 1.5, y * 1.5 + (color.y * 0.2), 0.25 * (sin(time * 1e-1) * 0.5 + 0.5));
        gl_Position = vec4(x * 1.5 + sin(pos.z * 0.5e-1) * 0., y * 1.5 + pos.y * 0., 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 8. * color.z * 2.;
        // gl_PointSize = 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
        cols = color;
       float vig = (roundedRectangle(vec2(x * 1.5, y * 1.5), vec2(0.0, 0.0), vec2(0.9, 0.88) * 0.9, 0.05, 0.5) + 0.0);
        cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig);
   }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = cols.zyy;
        // gl_FragColor.rgb = gl_FragColor.brr;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();



newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir + sin(pos.x) * 0.1);
        float b = 2.01 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-1), sin(time * 1e-1));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        // x = fx;
        // y = fy;
        // y = fy + (tan(fx * 1.) * 0.05);
        vec3 pos = vec3(0.0, 10.0, -20.0);
        // vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 dir = vec3(x * (16. / 9.), y * 1., 1.0);
        float lfo = sin(time * 0.25e-1) * 3.;
        float lfo2 = cos(time * 0.25e-1) * 3.;
        float d = intersectPlane(pos, dir);
        float vig = (roundedRectangle(vec2(x, y) * 1.5, vec2(0.0, 0.0), vec2(0.9, 0.88) * 0.95, 0.05, 0.5) + 0.0);
        if (floor(vig) > 0.0) {
        // for (int i = 0; i < 40; i++) {
        for (int i = 0; i < 60; i++) {
                float fi = float(i) * 0.1;
                d = min(d, intersectSphere(pos + vec3(sin(fi * time * 2e-3) * 10., fi * pos.z * 0.25, 5. - fi), dir));
            }       
        pos += d * dir;
        }
        vec3 color = fract(pos * 0.05);
        // color = 1. / pos * 0.01;
        // y = mix(y * 1.5, y * 1.5 + (color.y * 0.2), 0.25 * (sin(time * 1e-1) * 0.5 + 0.5));
        gl_Position = vec4(x * 1.5 + sin(pos.z * 0.5e-1) * 0., y * 1.5 + pos.y * 0., 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 8. * color.z * 2.;
        // gl_PointSize = 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
        cols = color;
        // gl_PointSize *= floor(vig);
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = cols.zyy;
        gl_FragColor.b = pow(gl_FragColor.b, 14.5);
        gl_FragColor.b *= 0.5;
        // gl_FragColor.rgb = gl_FragColor.brr;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();



newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir - sin(pos.z) * 0.1, dir + sin(pos.x) * 0.1);
        float b = 2.01 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-1), sin(time * 1e-1));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        // x = fx;
        // y = fy;
        // y = fy + (tan(fx * 1.) * 0.05);
        vec3 pos = vec3(0.0, 10.0, -20.0);
        // vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 dir = vec3(x * (16. / 9.), y * 1., 1.0);
        float lfo = sin(time * 0.25e-1) * 3.;
        float lfo2 = cos(time * 0.25e-1) * 3.;
        float d = intersectPlane(pos, dir);
        float vig = (roundedRectangle(vec2(x, y) * 1.5, vec2(0.0, 0.0), vec2(0.9, 0.88) * 0.95, 0.05, 0.5) + 0.0);
        if (floor(vig) > 0.0) {
        for (int i = 0; i < 40; i++) {
                float fi = float(i) * 0.1;
                d = min(d, intersectSphere(pos + vec3(sin(fi * time * 2e-3) * 10., fi * pos.z * 0.25, 10. - fi), dir));
            }       
        pos += d * dir;
        }
        vec3 color = fract(pos * 0.05);
        // color = 1. / pos * 0.01;
        // y = mix(y * 1.5, y * 1.5 + (color.y * 0.2), 0.25 * (sin(time * 1e-1) * 0.5 + 0.5));
        gl_Position = vec4(x * 1.5 + sin(pos.z * 0.5e-1) * 0., y * 1.5 + pos.y * 0., 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 8. * color.z * 2.;
        // gl_PointSize = 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
        cols = color;
       cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig);
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = cols.zyy;
        // gl_FragColor.rgb = gl_FragColor.brr;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();




newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
// 
    float map(float value, float min1, float max1, float min2, float max2) {
        float perc = (value - min1) / (max1 - min1);
        return perc * (max2 - min2) + min2;
    }
// 
    vec2 rotate(vec2 pos, float angle) {
        float c = cos(angle);
        float s = sin(angle);
        return mat2(c, s, -s, c) * pos;
    }
    float plane(vec3 pos) {
        return pos.y;
    }
    float sphere(vec3 pos, float radius) {
        return length(pos) - radius;
    }
    float box(vec3 pos, vec3 size) {
        return length(max(abs(pos) - size, 0.0));
    }
    float roundedBox(vec3 pos, vec3 size, float radius) {
        return length(max(abs(pos) - size, 0.0)) - radius;
    }
    float map(vec3 pos) {
        float planeDist = plane(pos + vec3(0.0, 10.0, 0.0));
        // float o = (sin(time * 1e1) + 1.) * 5.;
        // pos.xy = rotate(pos.xy, pos.z * 0.01 * sin(time * 0.5e2));
        // pos = mod(pos + 10., 20.) - 10.;
        // return min(planeDist, roundedBox(pos, vec3(2.0), 1.0));
        return min(planeDist, roundedBox(pos, vec3(1.5), 2.0));
    }
    float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    float intersectPlane(vec3 pos, vec3 dir) {
        return pos.y / dir.y;
    }
    float intersectSphere(vec3 pos, vec3 dir, float f) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir);
        float b = 2.1 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 1e-2), sin(time * 1e-2));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        vec3 pos = vec3(0.0, 1.0, 10.0);
        vec3 dir = (vec3(x * (16. / 9.), -y, 0.5));
        // float d = min(intersectSphere(pos, dir), intersectPlane(pos, dir));
        // // d = min(d, intersectSphere(pos, dir + vec3(0.0, 0.0, 1.0)));
        // pos += d * dir;
                float d = intersectPlane(pos + vec3(0.0, -3.0, 0.0), dir);
        d = 0.0;
        for (int i = 0; i < 70; i++) {
                float fi = float(i);
                float xx = (fract(fi / 8.) - (1. / 144.) * 60.) * 80.;
                float yy = floor(fi / 8.) * 4. - 15.;
                float zz = fi * 0.25 * 2.;
                vec2 rr = vec2(cos(time * 1e-3), sin(time * 1e-3));
                float fxx = xx * rr.y + yy * rr.x;
                float fyy = yy * rr.y - xx * rr.x;
                fxx += sin(fyy * 0.2) * 20. - 2.;
                d = min(d, intersectSphere(pos + vec3(fxx - 2., fyy + 4., 2.5), dir, fi));
            // d = mix(d, intersectSphere(pos + vec3(fxx, fyy, 2.0 + fi * 0.001), dir), 0.99);
            }       
        pos += d * dir;
        vec3 color = fract(pos * 0.015);
        // }
        // for (int i = 0; i < 128; i++) {
        //     float d = map(pos);
        //     if ( d < 0.01) {
        //         // float sh = 1.0 - float(j) * 0.015;
        //         // color = vec3(sh, sin(pos.y * 0.225) * 0.5 * sh, sin(pos.x * 0.125) * 1.5 * sh);
        //         break;
        //     }
        //     pos += d * dir;
        //     // x += sin(float(j)) * 0.01;
        // }
        
        gl_Position = vec4(x * 1.05 + sin(pos.y * 1.1) * 0.0, y * 1.05, 0.0, 1.0);
        gl_PointSize = 10. * pow(color.z, 1.5) * 2.;
        alph = 0.25 * 0.75;
        cols = color;
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 0.75;
        // gl_FragColor = gl_FragColor.brba;
//         gl_FragColor.g *= 0.525;
        gl_FragColor.rgb = vec3(pow(abs(cols.x - 0.5), 0.5), pow(cols.z, 14.5), pow(cols.z, 7.5)) * 1.2;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();





newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    float intersectPlane(vec3 pos, vec3 dir) {
        return abs(-pos.y / dir.y);
    }
    float intersectSphere(vec3 pos, vec3 dir) {
        // solve pos + k*dir = unit sphere surface
        // dot(pos + k*dir, pos + k*dir) = 1
        // quadratic coefficients
        float a = dot(dir, dir);
        float b = 2.01 * dot(pos, dir);
        float c = dot(pos, pos) - 1.0;
        float discriminant = b * b - 4.0 * a * c;
        // only the positive root is useful
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 2e-2), sin(time * 2e-2));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        x = fx;
        y = fy;
        float px = x;
        float py = y;
        x /= tan(id / (512. * 288.) * 1e3);
        y /= tan(id / (512. * 288.) * 1e3);
        x += sin(id * 1e-2 + time * 5e-3);
        y += cos(id * 1e-2 + time * 5e-3);
        x = mix(x, px, 0.5);
        y = mix(y, py, 0.5);
        x += sin(x * y * 1e6) * 0.02 * sin(y + time * 1e2);
        gl_Position = vec4(x * 0.75 * (9. / 16.), y * 0.75, 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 5.;
        // gl_PointSize = dist_squared * 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
        cols = vec3(1.0);
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.75;
        gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();





newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    #define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 2e-2), sin(time * 2e-2));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        // x = fx;
        // y = fy;
        float px = x;
        float py = y;
        vec2 pos = cx_mul(vec2(x, y), vec2(sin(x + time * 5e-2) * cos(y * 2e1), cos(y)));
        // x /= tan(id / (512. * 288.) * 1e3);
        // y /= tan(id / (512. * 288.) * 1e3);
        // x += sin(id * 1e-2 + time * 5e-3);
        // y += cos(id * 1e-2 + time * 5e-3);
        pos.x += sin(pos.x * pos.y * 1e6) * 0.02 * sin(pos.y + time * 1e2);
        // x = mix(x, px, 0.5);
        // y = mix(y, py, 0.5);
         gl_Position = vec4(pos.x * 0.75, pos.y * 0.75, 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 7.;
        // gl_PointSize = dist_squared * 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
        cols = vec3(1.0);
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.75;
        gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();







newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    #define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5) * 2.;
        float y = ((floor(id / 512.) / 288.) - 0.5) * 2.;
        vec2 r = vec2(cos(time * 2e-2), sin(time * 2e-2));
        float fx = x * r.y + y * r.x;
        float fy = y * r.y - x * r.x;
        float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        // x = fx;
        // y = fy;
        float px = x;
        float py = y;
        vec2 pos = cx_mul(vec2(x, sin(y * 1e1)), vec2(sin(x + time * 5e-2) * cos(y * 2e1), cos(y)));
        // pos.x /= tan(id / (512. * 288.) * 1e3);
        // pos.y /= tan(id / (512. * 288.) * 1e3);
        // pos.x += sin(id * 1e-2 + time * 5e-3) * 0.01;
        // pos.y += cos(id * 1e-2 + time * 5e-3) * 0.01;
        // x = mix(x, px, 0.5);
        // y = mix(y, py, 0.5);
         gl_Position = vec4(pos.x * 0.75, pos.y * 0.75, 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 7.;
        // gl_PointSize = dist_squared * 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
        cols = vec3(1.0);
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.75;
        gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();



newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    #define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        float t = time * 0.5e-2;
        float ratio = 16.0 / 9.0;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5);
        float y = ((floor(id / 512.) / 512.) - 0.5 / ratio);
        // float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        // float px = x;
        // float py = y;
        vec2 r = vec2(cos(t * 2.), sin(t * 2.));
        vec3 tr = vec3(0.0, 0.0 / ratio, 0.0);
        mat3 tm = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            tr.x, tr.y, 1.0
        );
        mat3 rm = mat3(
           r.x, r.y, 0.0, // first column 
          -r.y, r.x, 0.0, // second column
           0.0, 0.0, 1.0  // third column
        );
        mat3 sm = mat3(
            1.5, 0.0, 0.0,
            0.0, 1.5, 0.0,
            0.0, 0.0, 1.0
        );
        mat3 m = tm * sm * rm;
        mat4 tm4 = mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            tr.x, tr.y, tr.z, 1.0
        );
        // m = m * 4.0;
        // rm = sm * rm;
                // m = tm * m;
        // vec2 pos = cx_mul(vec2(x, y), vec2(0.5, 0.5));
        // pos = cx_mul(pos, vec2(0.75, 0.75));
        
        vec3 pos = vec3(x, y, 1.0);
        pos = m * pos;
        float turb = 1.0;
        // for (float i = 0.0; i < 25.0; i++) {
        //     float fi = i * 1e-1;
        //     float ts = 0.005;
        //     float xd = cos(distance(pos, vec2(cos(fi * 1000. + t * 1.) * fi, sin(fi * 1000. + t * 1.) * fi)) * 50.75 + time * 0.5e-1) * ts;
        //     float yd = sin(distance(pos, vec2(cos(fi * 1000. + t * 1.) * fi, sin(fi * 1000. + t * 1.) * fi)) * 50.75 + time * 0.5e-1) * ts;
        //     xd += sin(pos.x * 1e4) * 0.0008;
        //     pos.x += xd * cos(xd * 2e2) * 0.6;
        //     pos.y += yd * cos(yd * 2e2) * 0.6;
        //     turb += xd + yd;
        // }
        // pos.x += sin(turb * 10.) * 0.2;
        float fx = pos.x * r.y + pos.y * r.x;
        float fy = pos.y * r.y - pos.x * r.x;
        // pos.x = fx;
        // pos.y = fy;
        // pos = cx_mul(pos, vec2(sin(xd * 1e-), sin(yd * 1e-)));
        // pos.x /= tan(id / (512. * 288.) * 1e-1) * 15.5;
        // pos.y /= tan(id / (512. * 288.) * 1e-1) * 15.5;
        // pos.x += sin(id * 1e-2 + time * 5e-3) * 0.01;
        // pos.y += cos(id * 1e-2 + time * 5e-3) * 0.01;
        // x = mix(x, px, 0.5);
        // y = mix(y, py, 0.5);
         gl_Position = vec4(pos.x / ratio * 8., pos.y * 8., -1., 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 2. / color.x * 1e-2;
        gl_PointSize = 9.;
        // gl_PointSize = 9. / (id / (512. * 288.));
        // gl_PointSize = dist_squared * 10.;
        // gl_PointSize = 8. - ((color.z) * 2e-1) + 0.;
        alph = 0.25 * 0.75;
        // cols = vec3(turb * 2.);
        cols = vec3(0.5);
        // cols = vec3(sin(turb * 150.) * pow(pos.x, -2.5), cos(turb * 150.), cos(turb * 150.));
       // float vig = (roundedRectangle(pos * 1.5, vec2(0.0, 0.0), vec2(0.9, 0.88) * 1.2, 0.05, 0.5) + 0.0);
        // cols = mix(cols, cols * floor(vig), 1.);
        // gl_PointSize *= floor(vig);
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.75;
        gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.rgb = cols;
        gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();






newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    #define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}
vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}
    void main(void) {
        float t = time * 0.5e-2;
        float ratio = 16.0 / 9.0;
        float id = vertexID;
        float x = ((fract(id / 512.)) - 0.5);
        float y = ((floor(id / 512.) / 512.) - 0.5 / ratio);
        // float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        // float px = x;
        // float py = y;
        vec2 r = vec2(cos(t * 4.), sin(t * 4.));
        vec3 tr = vec3(0.0, -1.0 / ratio, 2.9);
        mat3 tm = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            tr.x, tr.y, 1.0
        );
        mat3 rm = mat3(
           r.x, r.y, 0.0, // first column 
          -r.y, r.x, 0.0, // second column
           0.0, 0.0, 1.0  // third column
        );
        mat3 sm = mat3(
            1.5, 0.0, 0.0,
            0.0, 1.5, 0.0,
            0.0, 0.0, 1.0
        );
        mat3 m = tm * sm * rm;
        mat4 tm4 = mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            tr.x, tr.y, tr.z, 1.0
        );
        float pro = 1. / tan((3.14159265 / 2.0) / 2.0);
        mat4 xr = mat4(
           1.0, 0.0, 0.0, 0.0,
           0.0, r.x, -r.y, 0.0,
           0.0, r.y, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 yr = mat4(
           r.x, 0.0, r.y, 0.0,
           0.0, 1.0, 0.0, 0.0,
           -r.y, 0.0, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 zr = mat4(
           r.x, -r.y, 0.0, 0.0, // first column 
          r.y, r.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        mat4 pm = mat4(
            pro, 0.0, 0.0, 0.0,
            0.0, pro, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        // m = m * 4.0;
        // rm = sm * rm;
                // m = tm * m;
        // vec2 pos = cx_mul(vec2(x, y), vec2(0.5, 0.5));
        // pos = cx_mul(pos, vec2(0.75, 0.75));
        float d = distance(vec2(x, y), vec2(0.0, 0.0));
        vec4 pos = vec4(x, y, 1.0 + sin(id * x * 5e-1 * t +  x * y * 0.2) * 0.5, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        pos = zr * pos;
        // pos = tm4 * pos;
                pos = yr * pos;
        pos = tm4 * pos;
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * 2., pos.y * 2., 0.0, pos.z * 1.);
        gl_PointSize = 10.;
        alph = 0.25 * 0.75;
        cols = vec3(0.5 + 0.5 / pos.z);
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.35;
        // gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.rgb = cols;
        // gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();





newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
#define POINTSIZE 2.0
float vertexCount = 147456.0;
float SCALE = 8.0 * (1.0);
float SIZE = floor(sqrt(vertexCount));
float TSCALE = 0.2 * 4096. / vertexCount;
float MSCALE = 0.12 * 64.0 / SIZE;
vec3 rotateY(vec3 p, float a) {
    float sa = sin(a);
    float ca = cos(a);
    vec3 r;
    r.x = ca*p.x + sa*p.z;
    r.y = p.y;
    r.z = -sa*p.x + ca*p.z;
    return r;
}
// terrain function from mars shader by reider
// https://www.shadertoy.com/view/XdsGWH
const mat2 mr = mat2 (
    0.84147,  0.54030,
    0.54030, -0.84147
);
float hash(in float n) {
  return fract(sin(n)*43758.5453);
}
float noise(in vec2 x) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);  
    float n = p.x + p.y*57.0;
    float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
          mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
    return res;
}
float fbm( in vec2 p ) {
    float f;
    f  = 0.5000*noise( p ); p = mr*p*2.02;
    f += 0.2500*noise( p ); p = mr*p*2.33;
    f += 0.1250*noise( p ); p = mr*p*2.01;
    f += 0.0625*noise( p ); p = mr*p*5.21;
    return f/(0.9375)*smoothstep( 260., 768., p.y ); // flat at beginning
}
vec3 GetPoint( float vertexid ) {
    float SPACING = 16.0 / SIZE;
    float x = mod( vertexid, SIZE );
    if (x==SIZE-1.) // last in 'line' 
    {
    //x = SIZE-2.; // equals previous
    }
    float y = floor( vertexid / SIZE );
    if (mod(y, 2.) > 0.0) {
    // odd - change direction
        x = SIZE - 1. - x;
    }
    vec2 trans = vec2( time * 0. + 100., time * 0.5 ) * MSCALE;
    return vec3( (-SIZE/2.0 + x) * SPACING, fbm( vec2( x, y ) * TSCALE + trans ) * SCALE, (-SIZE/2.0 + y) * SPACING );
}
void main() {
    if (mod(SIZE,2.)>0.) SIZE += 1.; // need even number of points on side
    vec3 p = GetPoint(vertexID);
    float fov = 1.1;
    p = rotateY(p, time * 0.25e-2 * 2.0 );
    p += vec3(0.0, -5.0, 15.0);
    gl_Position = vec4(p.xy * fov, 0.0, p.z );   
    gl_PointSize = 40. / p.z;
    cols = vec3(0.7);
}
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.75;
        gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.rgb = cols;
        gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();


// radiator
newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying float alsca;
    varying vec3 cols;
    #define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        float t = time * 0.25e-2;
        float ratio = 16.0 / 9.0;
        float vertexCount = 147456.0;
        float id = vertexID;
       // float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        // float px = x;
        // float py = y;
        vec2 r = vec2(cos(t * 2.), sin(t * 2.));
        vec3 tr = vec3(0.0, -1.0 / ratio, 18.9);
        mat3 tm = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            tr.x, tr.y, 1.0
        );
        mat3 rm = mat3(
           r.x, r.y, 0.0, // first column 
          -r.y, r.x, 0.0, // second column
           0.0, 0.0, 1.0  // third column
        );
        mat3 sm = mat3(
            1.5, 0.0, 0.0,
            0.0, 1.5, 0.0,
            0.0, 0.0, 1.0
        );
        mat3 m = tm * sm * rm;
        mat4 tm4 = mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            tr.x, tr.y, tr.z, 1.0
        );
        float pro = 1. / tan((3.14159265 / 2.0) / 2.0);
        mat4 xr = mat4(
           1.0, 0.0, 0.0, 0.0,
           0.0, r.x, -r.y, 0.0,
           0.0, r.y, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 yr = mat4(
           r.x, 0.0, r.y, 0.0,
           0.0, 1.0, 0.0, 0.0,
           -r.y, 0.0, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 zr = mat4(
           r.x, -r.y, 0.0, 0.0, // first column 
          r.y, r.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        mat4 pm = mat4(
            pro, 0.0, 0.0, 0.0,
            0.0, pro, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        // m = m * 4.0;
        // rm = sm * rm;
                // m = tm * m;
        // vec2 pos = cx_mul(vec2(x, y), vec2(0.5, 0.5));
        // pos = cx_mul(pos, vec2(0.75, 0.75));
        float x0 = ((fract(id / 512.)) - 0.5);
        float y0 = ((floor(id / 512.) / 512.) - 0.5 / ratio);
        float x = cos(id * 1e1) * id * 5e-5;
        float y = sin(id * 1e1) * id * 5e-5;
        // x = mix(x, x0, 0.8);
        // y = mix(y, y0, 0.8);
        float z = 1.0 + sin(id * x * 5e-1 * t +  x * y * 0.2) * 0.5;
        z = id / vertexCount * 40. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
        z += tan(id * 1e-4) * id / vertexCount * 0.1;
        // z = mix(z, 0.0, 0.85);
        float d = distance(vec2(x, y), vec2(0.0, 0.0));
        vec4 pos = vec4(x, y, z, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        pos = zr * pos;
        // pos = tm4 * pos;
                pos = xr * pos;
        pos = tm4 * pos;
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * 3., pos.y * 3., 0.0, pos.z * 1.);
        gl_PointSize = 25. - (60. * pos.z * 0.01);
        alph = 0.25 * 0.75;
        cols = vec3(0.65 + 0.5 / pos.z);
       float vig = (roundedRectangle(pos.xy * 1.5 / pos.z, vec2(0.0, 0.0), vec2(1.82, 0.91) * 0.43, 0.05, 0.5) + 0.0);
        cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig) * 1.2;
        alsca = 1.0;
        if ((sin((vertexID * 1e-5)) + 1.0) * 0.5 < (cos(time * 0.5e-2) + 1.) * 0.5) {
            // cols = vec3(0.0);
            gl_PointSize = 0.0;
            alsca = 0.0;
        }
        // gl_PointSize = max(9.0, gl_PointSize) * gl_PointSize * 0.1;
    if (gl_PointSize < 6.0) {
        alsca = 0.0;
    }
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    varying float alsca;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.5;
        // gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.rgb = cols;
        gl_FragColor.a *= alsca;
        // gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();


// radsigil
newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying float alsca;
    varying vec3 cols;
    #define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        float t = time * 0.25e-2;
        float ratio = 16.0 / 9.0;
        float vertexCount = 147456.0;
        float id = vertexID;
       // float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        // float px = x;
        // float py = y;
        vec2 r = vec2(cos(t * 2.), sin(t * 2.));
        vec3 tr = vec3(0.0, -1.0 / ratio, 18.9);
        mat3 tm = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            tr.x, tr.y, 1.0
        );
        mat3 rm = mat3(
           r.x, r.y, 0.0, // first column 
          -r.y, r.x, 0.0, // second column
           0.0, 0.0, 1.0  // third column
        );
        mat3 sm = mat3(
            1.5, 0.0, 0.0,
            0.0, 1.5, 0.0,
            0.0, 0.0, 1.0
        );
        mat3 m = tm * sm * rm;
        mat4 tm4 = mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            tr.x, tr.y, tr.z, 1.0
        );
        float pro = 1. / tan((3.14159265 / 2.0) / 2.0);
        mat4 xr = mat4(
           1.0, 0.0, 0.0, 0.0,
           0.0, r.x, -r.y, 0.0,
           0.0, r.y, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 yr = mat4(
           r.x, 0.0, r.y, 0.0,
           0.0, 1.0, 0.0, 0.0,
           -r.y, 0.0, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 zr = mat4(
           r.x, -r.y, 0.0, 0.0, // first column 
          r.y, r.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        mat4 pm = mat4(
            pro, 0.0, 0.0, 0.0,
            0.0, pro, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        // m = m * 4.0;
        // rm = sm * rm;
                // m = tm * m;
        // vec2 pos = cx_mul(vec2(x, y), vec2(0.5, 0.5));
        // pos = cx_mul(pos, vec2(0.75, 0.75));
        float x0 = ((fract(id / 512.)) - 0.5);
        float y0 = ((floor(id / 512.) / 512.) - 0.5 / ratio);
        float x = cos(id * 1e-4 + x0 * 8e-1 + tan(id * 1e-2) * 1e-2) * id * 5e-5;
        float y = sin(id * 1e-4 + x0 * 8e-1 + tan(id * 1e-2) * 1e-2) * id * 5e-5;
        // x = mix(x, x0, 0.8);
        // y = mix(y, y0, 0.8);
        float z = 1.0 + sin(id * x * 5e-1 * t +  x * y * 0.2) * 0.5;
        z = id / vertexCount * 40. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
        z += tan(id * 1e-4) * id / vertexCount * 0.1;
        // z = mix(z, 0.0, 0.85);
        float d = distance(vec2(x, y), vec2(0.0, 0.0));
        vec4 pos = vec4(x, y, z, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        pos = zr * pos;
        // pos = tm4 * pos;
                pos = xr * pos;
        pos = tm4 * pos;
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * 1., pos.y * 1., 0.0, pos.z * 1.);
        gl_PointSize = 25. - (60. * pos.z * 0.01);
        alph = 0.25 * 0.75;
        cols = vec3(0.65 + 0.5 / pos.z);
       float vig = (roundedRectangle(pos.xy * 0.5 / pos.z, vec2(0.0, 0.0), vec2(1.82, 0.91) * 0.43, 0.05, 0.5) + 0.0);
        cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig) * 1.2;
        alsca = 1.0;
        if ((sin((vertexID * 1e-5)) + 1.0) * 0.5 < (cos(time * 0.5e-2) + 1.) * 0.5) {
            // cols = vec3(0.0);
            gl_PointSize = 0.0;
            alsca = 0.0;
        }
        // gl_PointSize = max(9.0, gl_PointSize) * gl_PointSize * 0.1;
    if (gl_PointSize < 6.0) {
        alsca = 0.0;
    }
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    varying float alsca;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.5;
        // gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.rgb = cols;
        gl_FragColor.a *= alsca;
        // gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();


// radsigil2
newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying float alsca;
    varying vec3 cols;
    #define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        float t = time * 0.25e-2;
        float ratio = 16.0 / 9.0;
        float vertexCount = 147456.0;
        float id = vertexID;
       // float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        // float px = x;
        // float py = y;
        vec2 r = vec2(cos(t * 2.), sin(t * 2.));
        vec3 tr = vec3(0.0, -1.0 / ratio, 18.9);
        mat3 tm = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            tr.x, tr.y, 1.0
        );
        mat3 rm = mat3(
           r.x, r.y, 0.0, // first column 
          -r.y, r.x, 0.0, // second column
           0.0, 0.0, 1.0  // third column
        );
        mat3 sm = mat3(
            1.5, 0.0, 0.0,
            0.0, 1.5, 0.0,
            0.0, 0.0, 1.0
        );
        mat3 m = tm * sm * rm;
        mat4 tm4 = mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            tr.x, tr.y, tr.z, 1.0
        );
        float pro = 1. / tan((3.14159265 / 2.0) / 2.0);
        mat4 xr = mat4(
           1.0, 0.0, 0.0, 0.0,
           0.0, r.x, -r.y, 0.0,
           0.0, r.y, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 yr = mat4(
           r.x, 0.0, r.y, 0.0,
           0.0, 1.0, 0.0, 0.0,
           -r.y, 0.0, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 zr = mat4(
           r.x, -r.y, 0.0, 0.0, // first column 
          r.y, r.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        mat4 pm = mat4(
            pro, 0.0, 0.0, 0.0,
            0.0, pro, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        // m = m * 4.0;
        // rm = sm * rm;
                // m = tm * m;
        // vec2 pos = cx_mul(vec2(x, y), vec2(0.5, 0.5));
        // pos = cx_mul(pos, vec2(0.75, 0.75));
        float x0 = ((fract(id / 512.)) - 0.5);
        float y0 = ((floor(id / 512.) / 512.) - 0.5 / ratio);
        float x = cos(id * 1e-4 + x0 * 8e-1 + tan(id * 1e-2) * 1e-2) * id * 5e-5;
        float y = sin(id * 1e-4 + x0 * 8e-1 + tan(id * 1e-2) * 1e-2) * id * 5e-5;
        // x = mix(x, x0, 0.8);
        // y = mix(y, y0, 0.8);
        float z = 1.0 + sin(id * x * 5e-1 * t +  x * y * 0.2) * 0.5;
        z = id / vertexCount * 40. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
        z += tan(id * 1e-4) * id / vertexCount * 0.1;
        // z = mix(z, 0.0, 0.85);
        float d = distance(vec2(x, y), vec2(0.0, 0.0));
        vec4 pos = vec4(x, y, z, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        pos = zr * pos;
        // pos = tm4 * pos;
                pos = xr * pos;
        pos = tm4 * pos;
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * 1., pos.y * 1., 0.0, pos.z * 1.);
        gl_PointSize = 7.;
        alph = 0.25 * 0.75;
        cols = vec3(0.65 + 0.5 / pos.z);
       float vig = (roundedRectangle(pos.xy * 0.5 / pos.z, vec2(0.0, 0.0), vec2(1.82, 0.91) * 0.43, 0.05, 0.5) + 0.0);
        cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig) * 1.2;
        alsca = 1.0;
        if ((sin((vertexID * 1e-5)) + 1.0) * 0.5 < (cos(time * 0.5e-2) + 1.) * 0.5) {
            // cols = vec3(0.0);
            gl_PointSize = 0.0;
            alsca = 0.0;
        }
        // gl_PointSize = max(9.0, gl_PointSize) * gl_PointSize * 0.1;
    if (gl_PointSize < 6.0) {
        alsca = 0.0;
    }
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    varying float alsca;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.5;
        // gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.rgb = cols;
        gl_FragColor.a *= alsca;
        // gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();



// radsigil2
alterVision = function(av0 = "1e-3", av1 = "1e-4", av2 = "1.") {
newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying float alsca;
    varying vec3 cols;
    #define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        float t = time * 0.25e-2;
        float ratio = 16.0 / 9.0;
        float vertexCount = 147456.0;
        float id = vertexID;
       // float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        // float px = x;
        // float py = y;
        vec2 r = vec2(cos(t * 2.), sin(t * 2.));
        vec3 tr = vec3(0.0, -1.0 / ratio, 18.9);
        mat3 tm = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            tr.x, tr.y, 1.0
        );
        mat3 rm = mat3(
           r.x, r.y, 0.0, // first column 
          -r.y, r.x, 0.0, // second column
           0.0, 0.0, 1.0  // third column
        );
        mat3 sm = mat3(
            1.5, 0.0, 0.0,
            0.0, 1.5, 0.0,
            0.0, 0.0, 1.0
        );
        mat3 m = tm * sm * rm;
        mat4 tm4 = mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            tr.x, tr.y, tr.z, 1.0
        );
        float pro = 1. / tan((3.14159265 / 2.0) / 2.0);
        mat4 xr = mat4(
           1.0, 0.0, 0.0, 0.0,
           0.0, r.x, -r.y, 0.0,
           0.0, r.y, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 yr = mat4(
           r.x, 0.0, r.y, 0.0,
           0.0, 1.0, 0.0, 0.0,
           -r.y, 0.0, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 zr = mat4(
           r.x, -r.y, 0.0, 0.0, // first column 
          r.y, r.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        mat4 pm = mat4(
            pro, 0.0, 0.0, 0.0,
            0.0, pro, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        // m = m * 4.0;
        // rm = sm * rm;
                // m = tm * m;
        // vec2 pos = cx_mul(vec2(x, y), vec2(0.5, 0.5));
        // pos = cx_mul(pos, vec2(0.75, 0.75));
        float x0 = ((fract(id / 512.)) - 0.5);
        float y0 = ((floor(id / 512.) / 512.) - 0.5 / ratio);
        float x = cos(id * 1e-5 + x0 * 8e2 * tan(id * ${av0}) * 1e-2 + time * 0.25e-1) * id * 5e-5;
        float y = sin(id * 1e-5 + x0 * 8e2 * tan(id * ${av0}) * 1e-2 + time * 0.25e-1) * id * 5e-5;
        // x = mix(x, x0, 0.8);
        // y = mix(y, y0, 0.8);
        float z = 1.0 + sin(id * x * 5e-1 * t +  x * y * 0.2) * 0.5;
        z = id / vertexCount * 40. * sin(x * id * 1e2 + tan(id * 1e-8) * 1e-1) * 0.5;
        z += tan(id * ${av1}) * id / vertexCount * 0.1;
        // z = mix(z, 0.0, 0.85);
        float d = distance(vec2(x, y), vec2(0.0, 0.0));
        vec4 pos = vec4(x, y, z, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        pos = zr * pos;
        // pos = tm4 * pos;
                pos = xr * pos;
        pos = tm4 * pos;
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * ${av2}, pos.y * ${av2}, 0.0, pos.z * 1.);
        gl_PointSize = 7.;
        alph = 0.25 * 0.75;
        cols = vec3(0.65 + 0.5 / pos.z);
       float vig = (roundedRectangle(pos.xy * 0.5 / pos.z * ${av2}, vec2(0.0, 0.0), vec2(1.82, 0.91) * 0.43, 0.05, 0.5) + 0.0);
        cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig) * 1.2;
        alsca = 1.0;
        if ((sin((vertexID * 1e-5)) + 1.0) * 0.5 < (cos(time * 0.5e-2) + 1.) * 0.5) {
            // cols = vec3(0.0);
            gl_PointSize = 0.0;
            alsca = 0.0;
        }
        // gl_PointSize = max(9.0, gl_PointSize) * gl_PointSize * 0.1;
    if (gl_PointSize < 6.0) {
        alsca = 0.0;
    }
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    varying float alsca;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.5;
        // gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.rgb = cols;
        gl_FragColor.a *= alsca;
        // gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();
};
alterVision();

// radflow
newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying float alsca;
    varying vec3 cols;
    #define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        float t = time * 0.25e-2;
        float ratio = 16.0 / 9.0;
        float vertexCount = 147456.0;
        float id = vertexID;
       // float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        // float px = x;
        // float py = y;
        vec2 r = vec2(cos(t * 2.), sin(t * 2.));
        vec3 tr = vec3(0.0, -1.0 / ratio, 18.9);
        mat3 tm = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            tr.x, tr.y, 1.0
        );
        mat3 rm = mat3(
           r.x, r.y, 0.0, // first column 
          -r.y, r.x, 0.0, // second column
           0.0, 0.0, 1.0  // third column
        );
        mat3 sm = mat3(
            1.5, 0.0, 0.0,
            0.0, 1.5, 0.0,
            0.0, 0.0, 1.0
        );
        mat3 m = tm * sm * rm;
        mat4 tm4 = mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            tr.x, tr.y, tr.z, 1.0
        );
        float pro = 1. / tan((3.14159265 / 2.0) / 2.0);
        mat4 xr = mat4(
           1.0, 0.0, 0.0, 0.0,
           0.0, r.x, -r.y, 0.0,
           0.0, r.y, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 yr = mat4(
           r.x, 0.0, r.y, 0.0,
           0.0, 1.0, 0.0, 0.0,
           -r.y, 0.0, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 zr = mat4(
           r.x, -r.y, 0.0, 0.0, // first column 
          r.y, r.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        mat4 pm = mat4(
            pro, 0.0, 0.0, 0.0,
            0.0, pro, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        // m = m * 4.0;
        // rm = sm * rm;
                // m = tm * m;
        // vec2 pos = cx_mul(vec2(x, y), vec2(0.5, 0.5));
        // pos = cx_mul(pos, vec2(0.75, 0.75));
        float x0 = ((fract(id / 512.)) - 0.5);
        float y0 = ((floor(id / 512.) / 512.) - 0.5 / ratio);
        float x = cos(id * 1e-4 + x0 * 8e-1 + tan(id * 1e-2) * 1e-2 + time * 0.35e-1) * id * 5e-5;
        float y = sin(id * 1e-4 + x0 * 8e-1 + tan(id * 1e-2) * 1e-2 + time * 0.35e-1) * id * 5e-5;
        // x = mix(x, x0, 0.8);
        // y = mix(y, y0, 0.8);
        float z = 1.0 + sin(id * x * 5e-1 * t +  x * y * 0.2) * 0.5;
        z = id / vertexCount * 40. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
        z += tan(id * 1e-4) * id / vertexCount * 10.1;
        // x += tan(z * 1e3) * 0.01;
        // z = mix(z, 0.0, 0.85);
        float d = distance(vec2(x, y), vec2(0.0, 0.0));
        vec4 pos = vec4(x, y, z, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        pos = zr * pos;
        // pos = tm4 * pos;
                pos = xr * pos;
        pos = tm4 * pos;
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * 1., pos.y * 1., 0.0, pos.z * 1.);
        gl_PointSize = 25. - (60. * pos.z * 0.01);
        alph = 0.25 * 0.75;
        cols = vec3(0.65 + 0.5 / pos.z);
       float vig = (roundedRectangle(pos.xy * 0.5 / pos.z, vec2(0.0, 0.0), vec2(1.82, 0.91) * 0.43, 0.05, 0.5) + 0.0);
        cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig) * 1.2;
        alsca = 1.0;
        if ((sin((vertexID * 1e-5)) + 1.0) * 0.5 < (cos(time * 0.5e-2) + 1.) * 0.5) {
            // cols = vec3(0.0);
            gl_PointSize = 0.0;
            alsca = 0.0;
        }
        // gl_PointSize = max(9.0, gl_PointSize) * gl_PointSize * 0.1;
    if (gl_PointSize < 6.0) {
        alsca = 0.0;
    }
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    varying float alsca;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.5;
        // gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.rgb = cols;
        gl_FragColor.a *= alsca;
        // gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();


// zenterrain
newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    #define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    const mat2 mr = mat2 (
        0.84147,  0.54030,
        0.54030, -0.84147
    );
    float hash(in float n) {
      return fract(sin(n)*43758.5453);
    }
    float noise(in vec2 x) {
        vec2 p = floor(x);
        vec2 f = fract(x);
        f = f*f*(3.0-2.0*f);  
        float n = p.x + p.y*57.0;
        float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
              mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
        return res;
    }
    float fbm( in vec2 p ) {
        float f;
        f  = 0.5000*noise( p ); p = mr*p*2.02;
        f += 0.2500*noise( p ); p = mr*p*2.33;
        f += 0.1250*noise( p ); p = mr*p*2.01;
        f += 0.0625*noise( p ); p = mr*p*5.21;
        return f/(0.9375)*smoothstep( 260., 768., p.y ); // flat at beginning
    }
    void main(void) {
        float t = time * 0.5e-2;
        float ratio = 16.0 / 9.0;
        float vertexCount = 147456.0;
        float id = vertexID;
       // float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        // float px = x;
        // float py = y;
        vec2 r = vec2(cos(t * 0.5), sin(t * 0.5));
        vec3 tr = vec3(0.0, -1.0 / ratio, 18.9);
        mat3 tm = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            tr.x, tr.y, 1.0
        );
        mat3 rm = mat3(
           r.x, r.y, 0.0, // first column 
          -r.y, r.x, 0.0, // second column
           0.0, 0.0, 1.0  // third column
        );
        mat3 sm = mat3(
            1.5, 0.0, 0.0,
            0.0, 1.5, 0.0,
            0.0, 0.0, 1.0
        );
        mat3 m = tm * sm * rm;
        mat4 tm4 = mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            tr.x, tr.y, tr.z, 1.0
        );
        float pro = 1. / tan((3.14159265 / 2.0) / 2.0);
        mat4 xr = mat4(
           1.0, 0.0, 0.0, 0.0,
           0.0, r.x, -r.y, 0.0,
           0.0, r.y, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 yr = mat4(
           r.x, 0.0, r.y, 0.0,
           0.0, 1.0, 0.0, 0.0,
           -r.y, 0.0, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 zr = mat4(
           r.x, -r.y, 0.0, 0.0, // first column 
          r.y, r.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        mat4 pm = mat4(
            pro, 0.0, 0.0, 0.0,
            0.0, pro, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        // m = m * 4.0;
        // rm = sm * rm;
                // m = tm * m;
        // vec2 pos = cx_mul(vec2(x, y), vec2(0.5, 0.5));
        // pos = cx_mul(pos, vec2(0.75, 0.75));
        float x = ((fract(id / (512. * 2.))) - 0.5) * 6.;
        float y = ((floor(id / (512. * 2.)) / (512. * 2.)) - 0.5 / ratio) * 6.;
        // float x = cos(id * 1e1) * id * 5e-5;
        // float y = sin(id * 1e1) * id * 5e-5;
        // x = mix(x, x0, 0.8);
        // y = mix(y, y0, 0.8);
        float z = 1.0 + sin(id * x * 5e-1 * t +  x * y * 0.2) * 0.5;
        // z = id / vertexCount * 40. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
        // z = mix(z, 0.0, 0.85);
        z = 0.0;
        z = z + fbm((vec2(x, y) + 10.0) * 1.) * 2.5;
                z += id / vertexCount * 400. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
                // z += tan(id * 1e-4) * id / vertexCount * 0.1;
        float d = distance(vec2(x, y), vec2(0.0, 0.0));
        vec4 pos = vec4(y, z, x, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        pos = zr * pos;
        // pos = tm4 * pos;
                pos = yr * pos;
        pos = tm4 * pos;
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * 20., pos.y * 20., 0.0, pos.z * 1.);
        gl_PointSize = 20. - (60. * pos.z * 0.01);
        alph = 0.25 * 0.75;
        cols = vec3(0.65 + 0.5 / pos.z);
       float vig = (roundedRectangle(pos.xy * 1.5 / pos.z, vec2(0.0, 0.0), vec2(1.82, 0.91) * 0.065, 0.0025, 0.125) + 0.0);
        cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig);
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.5;
        // gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.rgb = cols;
        // gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();


newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    #define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        float t = time * 0.25e-2;
        float ratio = 16.0 / 9.0;
        float vertexCount = 147456.0;
        float id = vertexID;
       // float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        // float px = x;
        // float py = y;
        vec2 r = vec2(cos(t * 2.), sin(t * 2.));
        vec3 tr = vec3(0.0, -1.0 / ratio, 18.9);
        mat3 tm = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            tr.x, tr.y, 1.0
        );
        mat3 rm = mat3(
           r.x, r.y, 0.0, // first column 
          -r.y, r.x, 0.0, // second column
           0.0, 0.0, 1.0  // third column
        );
        mat3 sm = mat3(
            1.5, 0.0, 0.0,
            0.0, 1.5, 0.0,
            0.0, 0.0, 1.0
        );
        mat3 m = tm * sm * rm;
        mat4 tm4 = mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            tr.x, tr.y, tr.z, 1.0
        );
        float pro = 1. / tan((3.14159265 / 2.0) / 2.0);
        mat4 xr = mat4(
           1.0, 0.0, 0.0, 0.0,
           0.0, r.x, -r.y, 0.0,
           0.0, r.y, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 yr = mat4(
           r.x, 0.0, r.y, 0.0,
           0.0, 1.0, 0.0, 0.0,
           -r.y, 0.0, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 zr = mat4(
           r.x, -r.y, 0.0, 0.0, // first column 
          r.y, r.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        mat4 pm = mat4(
            pro, 0.0, 0.0, 0.0,
            0.0, pro, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        // m = m * 4.0;
        // rm = sm * rm;
                // m = tm * m;
        // vec2 pos = cx_mul(vec2(x, y), vec2(0.5, 0.5));
        // pos = cx_mul(pos, vec2(0.75, 0.75));
        // float x = ((fract(id / 512.)) - 0.5);
        // float y = ((floor(id / 512.) / 512.) - 0.5 / ratio);
        float x = cos(id * 1e-2 * tan(id * 1e-1)) * id * 12e-5;
        float y = sin(id * 1e-2 * tan(id * 1e-1)) * id * 12e-5;
        float z = 1.0 + sin(id * x * 5e-1 * t +  x * y * 0.2) * 0.5;
        z = id / vertexCount * 100. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
z += tan(id * 1e-4) * id / vertexCount;
        float d = distance(vec2(x, y), vec2(0.0, 0.0));
        vec4 pos = vec4(x, y, z, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        pos = (zr * sin(id * 1e-2) * 2.) * pos;
        // pos = tm4 * pos;
                pos = xr * pos;
        pos = tm4 * pos;
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * 1., pos.y * 1., 0.0, pos.z * 1.);
        gl_PointSize = 25. - (60. * pos.z * 0.01);
        alph = 0.25 * 0.75;
        cols = vec3(0.65 + 0.5 / pos.z);
       float vig = (roundedRectangle(pos.xy * 1.5 / pos.z, vec2(0.0, 0.0), vec2(1.68, 0.91) * 1.5, 0.05, 0.5) + 0.0);
        cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig);
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.5;
        // gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.rgb = cols;
        // gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();




newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    #define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    const mat2 mr = mat2 (
        0.84147,  0.54030,
        0.54030, -0.84147
    );
    float hash(in float n) {
      return fract(sin(n)*43758.5453);
    }
    float noise(in vec2 x) {
        vec2 p = floor(x);
        vec2 f = fract(x);
        f = f*f*(3.0-2.0*f);  
        float n = p.x + p.y*57.0;
        float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
              mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
        return res;
    }
    float fbm( in vec2 p ) {
        float f;
        f  = 0.5000*noise( p ); p = mr*p*2.02;
        f += 0.2500*noise( p ); p = mr*p*2.33;
        f += 0.1250*noise( p ); p = mr*p*2.01;
        f += 0.0625*noise( p ); p = mr*p*5.21;
        return f/(0.9375)*smoothstep( 260., 768., p.y ); // flat at beginning
    }
    void main(void) {
        float t = time * 0.5e-2;
        float ratio = 16.0 / 9.0;
        float vertexCount = 147456.0;
        float id = vertexID;
       // float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        // float px = x;
        // float py = y;
        vec2 r = vec2(cos(t * 0.5), sin(t * 0.5));
        vec3 tr = vec3(0.0, 0.2 / ratio, 18.9);
        mat3 tm = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            tr.x, tr.y, 1.0
        );
        mat3 rm = mat3(
           r.x, r.y, 0.0, // first column 
          -r.y, r.x, 0.0, // second column
           0.0, 0.0, 1.0  // third column
        );
        mat3 sm = mat3(
            1.5, 0.0, 0.0,
            0.0, 1.5, 0.0,
            0.0, 0.0, 1.0
        );
        mat3 m = tm * sm * rm;
        mat4 tm4 = mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            tr.x, tr.y, tr.z, 1.0
        );
        float pro = 1. / tan((3.14159265 / 2.0) / 2.0);
        mat4 xr = mat4(
           1.0, 0.0, 0.0, 0.0,
           0.0, r.x, -r.y, 0.0,
           0.0, r.y, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 yr = mat4(
           r.x, 0.0, r.y, 0.0,
           0.0, 1.0, 0.0, 0.0,
           -r.y, 0.0, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 zr = mat4(
           r.x, -r.y, 0.0, 0.0, // first column 
          r.y, r.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        float a = 10.;
        vec2 zz = vec2(cos(a), sin(a));
        mat4 zr2 = mat4(
           zz.x, -zz.y, 0.0, 0.0, // first column 
           zz.y, zz.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        mat4 pm = mat4(
            pro, 0.0, 0.0, 0.0,
            0.0, pro, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        // m = m * 4.0;
        // rm = sm * rm;
                // m = tm * m;
        // vec2 pos = cx_mul(vec2(x, y), vec2(0.5, 0.5));
        // pos = cx_mul(pos, vec2(0.75, 0.75));
        float x = ((fract(id / (512. * 2.))) - 0.5) * 6.;
        float y = ((floor(id / (512. * 2.)) / (512. * 2.)) - 0.5 / ratio) * 6.;
                vec2 pos2 = vec2(x, y);
        float turb = 0.0;
        for (float i = 0.0; i < 25.0; i++) {
            float fi = i * 2e-2;
            float ts = 0.001 * sin(x * y * 1.5e1) * 3.;
            float xd = cos(distance(pos2, vec2(cos(fi * 1000. + t * 0.001) * fi, sin(fi * 1000. + t * 0.001) * fi)) * 50.75 + time * 0.5e-2) * ts;
            float yd = sin(distance(pos2, vec2(cos(fi * 1000. + t * 0.001) * fi, sin(fi * 1000. + t * 0.001) * fi)) * 50.75 + time * 0.5e-2) * ts;
            xd += sin(pos2.x * 1e3) * 0.0008;
            pos2.x += xd * cos(xd * 2e1) * 1.6;
            pos2.y += yd * cos(yd * 2e1) * 1.6;
            turb += xd + yd;
        }
        
        
        // float x = cos(id * 1e1) * id * 5e-5;
        // float y = sin(id * 1e1) * id * 5e-5;
        // x = mix(x, x0, 0.8);
        // y = mix(y, y0, 0.8);
        float z = 1.0 + sin(id * x * 5e-1 * t +  x * y * 0.2) * 1.5;
        // z = id / vertexCount * 40. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
        // z = mix(z, 0.0, 0.85);
        z = 0.0;
        z = z + fbm((vec2(x, y) + 10.0) * 1.) * 0.75;
                // z += id / vertexCount * 400. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
                // z += tan(id * 1e-4) * id / vertexCount * 0.1;
        float d = distance(vec2(pos2.x, pos2.y), vec2(0.0, 0.0));
        vec4 pos = vec4(pos2.y, z, pos2.x, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        pos = zr2 * pos;
        // pos = tm4 * pos;
                pos = yr * pos;
        pos = tm4 * pos;
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * 50., pos.y * 50., 0.0, pos.z * 1.);
        gl_PointSize = 34. - (60. * pos.z * 0.02);
        alph = 0.25 * 0.75;
        cols = vec3(0.65 + 0.5 / pos.z);
       float vig = (roundedRectangle(pos.xy * 1.5 / pos.z, vec2(0.0, 0.0), vec2(1.85, 0.94) * 0.026, 0.001, 0.05) + 0.0);
        cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig);
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.5;
        // gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.rgb = cols;
        // gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();



newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    #define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    const mat2 mr = mat2 (
        0.84147,  0.54030,
        0.54030, -0.84147
    );
    float hash(in float n) {
      return fract(sin(n)*43758.5453);
    }
    float noise(in vec2 x) {
        vec2 p = floor(x);
        vec2 f = fract(x);
        f = f*f*(3.0-2.0*f);  
        float n = p.x + p.y*57.0;
        float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
              mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
        return res;
    }
    float fbm( in vec2 p ) {
        float f;
        f  = 0.5000*noise( p ); p = mr*p*2.02;
        f += 0.2500*noise( p ); p = mr*p*2.33;
        f += 0.1250*noise( p ); p = mr*p*2.01;
        f += 0.0625*noise( p ); p = mr*p*5.21;
        return f/(0.9375)*smoothstep( 260., 768., p.y ); // flat at beginning
    }
    void main(void) {
        float t = time * 0.5e-2;
        float ratio = 16.0 / 9.0;
        float vertexCount = 147456.0;
        float id = vertexID;
       // float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        // float px = x;
        // float py = y;
        vec2 r = vec2(cos(t * 0.5), sin(t * 0.5));
        vec3 tr = vec3(0.0, 0.2 / ratio, 18.9);
        mat3 tm = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            tr.x, tr.y, 1.0
        );
        mat3 rm = mat3(
           r.x, r.y, 0.0, // first column 
          -r.y, r.x, 0.0, // second column
           0.0, 0.0, 1.0  // third column
        );
        mat3 sm = mat3(
            1.5, 0.0, 0.0,
            0.0, 1.5, 0.0,
            0.0, 0.0, 1.0
        );
        mat3 m = tm * sm * rm;
        mat4 tm4 = mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            tr.x, tr.y, tr.z, 1.0
        );
        float pro = 1. / tan((3.14159265 / 2.0) / 2.0);
        mat4 xr = mat4(
           1.0, 0.0, 0.0, 0.0,
           0.0, r.x, -r.y, 0.0,
           0.0, r.y, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 yr = mat4(
           r.x, 0.0, r.y, 0.0,
           0.0, 1.0, 0.0, 0.0,
           -r.y, 0.0, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 zr = mat4(
           r.x, -r.y, 0.0, 0.0, // first column 
          r.y, r.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        float a = 10.;
        vec2 zz = vec2(cos(a), sin(a));
        mat4 zr2 = mat4(
           zz.x, -zz.y, 0.0, 0.0, // first column 
           zz.y, zz.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        mat4 pm = mat4(
            pro, 0.0, 0.0, 0.0,
            0.0, pro, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        // m = m * 4.0;
        // rm = sm * rm;
                // m = tm * m;
        // vec2 pos = cx_mul(vec2(x, y), vec2(0.5, 0.5));
        // pos = cx_mul(pos, vec2(0.75, 0.75));
        float x = ((fract(id / (512. * 2.))) - 0.5) * 6.;
        float y = ((floor(id / (512. * 2.)) / (512. * 2.)) - 0.5 / ratio) * 6.;
                vec2 pos2 = vec2(x, y);
        float turb = 0.0;
        for (float i = 0.0; i < 25.0; i++) {
            float fi = i * 2e-2;
            float ts = 0.001 * sin(x * y * 1.5e1) * 3.;
            float xd = cos(distance(pos2, vec2(cos(fi * 1000. + t * 0.001) * fi, sin(fi * 1000. + t * 0.001) * fi)) * 50.75 + time * 0.5e-2) * ts;
            float yd = sin(distance(pos2, vec2(cos(fi * 1000. + t * 0.001) * fi, sin(fi * 1000. + t * 0.001) * fi)) * 50.75 + time * 0.5e-2) * ts;
            xd += sin(pos2.x * 1e3) * 0.0008;
            pos2.x += xd * cos(xd * 2e1) * 1.6;
            pos2.y += yd * cos(yd * 2e1) * 1.6;
            turb += xd + yd;
        }
        
        
        // float x = cos(id * 1e1) * id * 5e-5;
        // float y = sin(id * 1e1) * id * 5e-5;
        // x = mix(x, x0, 0.8);
        // y = mix(y, y0, 0.8);
        float z = 1.0 + sin(id * x * 5e-1 * t +  x * y * 0.2) * 1.5;
        // z = id / vertexCount * 40. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
        // z = mix(z, 0.0, 0.85);
        z = 0.0;
        z = z + fbm((vec2(x, y) + 10.0) * 1. + t * 2e-1) * 0.75;
                // z += id / vertexCount * 400. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
                // z += tan(id * 1e-4) * id / vertexCount * 0.1;
        float d = distance(vec2(pos2.x, pos2.y), vec2(0.0, 0.0));
        vec4 pos = vec4(pos2.y, z, pos2.x, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        pos = zr2 * pos;
        // pos = tm4 * pos;
                pos = yr * pos;
        pos = tm4 * pos;
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * 50., pos.y * 50., 0.0, pos.z * 1.);
        gl_PointSize = 34. - (60. * pos.z * 0.02);
        alph = 0.25 * 0.75;
        cols = vec3(0.65 + 0.5 / pos.z);
       float vig = (roundedRectangle(pos.xy * 1.5 / pos.z, vec2(0.0, 0.0), vec2(1.85, 0.94) * 0.026, 0.001, 0.05) + 0.0);
        cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig);
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.79;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.5;
        // gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.rgb = cols;
        // gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();




newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    #define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    const mat2 mr = mat2 (
        0.84147,  0.54030,
        0.54030, -0.84147
    );
    float hash(in float n) {
      return fract(sin(n)*43758.5453);
    }
    float noise(in vec2 x) {
        vec2 p = floor(x);
        vec2 f = fract(x);
        f = f*f*(3.0-2.0*f);  
        float n = p.x + p.y*57.0;
        float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
              mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
        return res;
    }
    float fbm( in vec2 p ) {
        float f;
        f  = 0.5000*noise( p ); p = mr*p*2.02;
        f += 0.2500*noise( p ); p = mr*p*2.33;
        f += 0.1250*noise( p ); p = mr*p*2.01;
        f += 0.0625*noise( p ); p = mr*p*5.21;
        return f/(0.9375)*smoothstep( 260., 768., p.y ); // flat at beginning
    }
    void main(void) {
        float t = time * 0.5e-2;
        float ratio = 16.0 / 9.0;
        float vertexCount = 147456.0;
        float id = vertexID;
       // float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        // float px = x;
        
        // float py = y;
        float ra = 1.25;
        vec2 r = vec2(cos(ra), sin(ra));
        vec3 tr = vec3(0.0, 0.39 / ratio, 18.9);
        mat3 tm = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            tr.x, tr.y, 1.0
        );
        mat3 rm = mat3(
           r.x, r.y, 0.0, // first column 
          -r.y, r.x, 0.0, // second column
           0.0, 0.0, 1.0  // third column
        );
        mat3 sm = mat3(
            1.5, 0.0, 0.0,
            0.0, 1.5, 0.0,
            0.0, 0.0, 1.0
        );
        mat3 m = tm * sm * rm;
        mat4 tm4 = mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            tr.x, tr.y, tr.z, 1.0
        );
        float pro = 1. / tan((3.14159265 / 2.0) / 2.0);
        mat4 xr = mat4(
           1.0, 0.0, 0.0, 0.0,
           0.0, r.x, -r.y, 0.0,
           0.0, r.y, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 yr = mat4(
           r.x, 0.0, r.y, 0.0,
           0.0, 1.0, 0.0, 0.0,
           -r.y, 0.0, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 zr = mat4(
           r.x, -r.y, 0.0, 0.0, // first column 
          r.y, r.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        float a = 10.;
        vec2 zz = vec2(cos(a), sin(a));
        mat4 zr2 = mat4(
           zz.x, -zz.y, 0.0, 0.0, // first column 
           zz.y, zz.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        mat4 pm = mat4(
            pro, 0.0, 0.0, 0.0,
            0.0, pro, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        // m = m * 4.0;
        // rm = sm * rm;
                // m = tm * m;
        // vec2 pos = cx_mul(vec2(x, y), vec2(0.5, 0.5));
        // pos = cx_mul(pos, vec2(0.75, 0.75));
        float x = ((fract(id / (512. * 2.))) - 0.5) * 6.;
        float y = ((floor(id / (512. * 2.)) / (512. * 2.)) - 0.5 / ratio) * 6.;
                vec2 pos2 = vec2(x, y);
        float turb = 0.0;
        for (float i = 0.0; i < 25.0; i++) {
            float fi = i * 2e-2;
            float ts = 0.001 * sin(x * y * 1.5e1) * 3.;
            float xd = cos(distance(pos2, vec2(cos(fi * 1000. + t * 5.1) * fi, sin(fi * 1000. + t * 0.001) * fi)) * 50.75 + time * 0.5e-2) * ts;
            float yd = sin(distance(pos2, vec2(cos(fi * 1000. + t * 5.1) * fi, sin(fi * 1000. + t * 0.001) * fi)) * 50.75 + time * 0.5e-2) * ts;
            xd += sin(pos2.x * 1e3) * 0.0008;
            pos2.x += xd * cos(xd * 2e1) * 1.6;
            pos2.y += yd * cos(yd * 2e1) * 1.6;
            turb += xd + yd;
        }
        
        
        // float x = cos(id * 1e1) * id * 5e-5;
        // float y = sin(id * 1e1) * id * 5e-5;
        // x = mix(x, x0, 0.8);
        // y = mix(y, y0, 0.8);
        float z = 1.0 + sin(id * x * 5e-1 * t +  x * y * 0.2) * 1.5;
        // z = id / vertexCount * 40. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
        // z = mix(z, 0.0, 0.85);
        z = 0.0;
        z = z + fbm((vec2(x, y) + 10.0) * 1. + 5990. * 2e-1) * 0.75;
                // z += id / vertexCount * 400. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
                // z += tan(id * 1e-4) * id / vertexCount * 0.1;
        float d = distance(vec2(pos2.x, pos2.y), vec2(0.0, 0.0));
        vec4 pos = vec4(pos2.y, z, pos2.x, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        pos = zr2 * pos;
        // pos = tm4 * pos;
                pos = yr * pos;
        pos = tm4 * pos;
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * 40., pos.y * 40., 0.0, pos.z * 1.);
        gl_PointSize = 34. - (60. * pos.z * 0.02);
        alph = 0.25 * 0.75;
        cols = vec3(0.65 + 0.5 / pos.z);
       float vig = (roundedRectangle(pos.xy * 1.5 / pos.z, vec2(0.0, 0.0), vec2(1.82, 0.92) * 0.026 * 1.29, 0.001, 0.05) + 0.0);
        cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig);
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.79;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.5;
        // gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.rgb = cols;
        // gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();


newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    #define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    const mat2 mr = mat2 (
        0.84147,  0.54030,
        0.54030, -0.84147
    );
    float hash(in float n) {
      return fract(sin(n)*43758.5453);
    }
    float noise(in vec2 x) {
        vec2 p = floor(x);
        vec2 f = fract(x);
        f = f*f*(3.0-2.0*f);  
        float n = p.x + p.y*57.0;
        float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
              mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
        return res;
    }
    float fbm( in vec2 p ) {
        float f;
        f  = 0.5000*noise( p ); p = mr*p*2.02;
        f += 0.2500*noise( p ); p = mr*p*2.33;
        f += 0.1250*noise( p ); p = mr*p*2.01;
        f += 0.0625*noise( p ); p = mr*p*5.21;
        return f/(0.9375)*smoothstep( 260., 768., p.y ); // flat at beginning
    }
    void main(void) {
        float t = time * 0.5e-2;
        float ratio = 16.0 / 9.0;
        float vertexCount = 147456.0;
        float id = vertexID;
       // float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        // float px = x;
        
        // float py = y;
        float ra = 1.25;
        vec2 r = vec2(cos(ra), sin(ra));
        vec3 tr = vec3(0.0, 0.49 / ratio, 18.9);
        mat3 tm = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            tr.x, tr.y, 1.0
        );
        mat3 rm = mat3(
           r.x, r.y, 0.0, // first column 
          -r.y, r.x, 0.0, // second column
           0.0, 0.0, 1.0  // third column
        );
        mat3 sm = mat3(
            1.5, 0.0, 0.0,
            0.0, 1.5, 0.0,
            0.0, 0.0, 1.0
        );
        mat3 m = tm * sm * rm;
        mat4 tm4 = mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            tr.x, tr.y, tr.z, 1.0
        );
        float pro = 1. / tan((3.14159265 / 2.0) / 2.0);
        mat4 xr = mat4(
           1.0, 0.0, 0.0, 0.0,
           0.0, r.x, -r.y, 0.0,
           0.0, r.y, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 yr = mat4(
           r.x, 0.0, r.y, 0.0,
           0.0, 1.0, 0.0, 0.0,
           -r.y, 0.0, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 zr = mat4(
           r.x, -r.y, 0.0, 0.0, // first column 
          r.y, r.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        float a = 10.;
        vec2 zz = vec2(cos(a), sin(a));
        mat4 zr2 = mat4(
           zz.x, -zz.y, 0.0, 0.0, // first column 
           zz.y, zz.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        mat4 pm = mat4(
            pro, 0.0, 0.0, 0.0,
            0.0, pro, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        // m = m * 4.0;
        // rm = sm * rm;
                // m = tm * m;
        // vec2 pos = cx_mul(vec2(x, y), vec2(0.5, 0.5));
        // pos = cx_mul(pos, vec2(0.75, 0.75));
        float x = ((fract(id / (512. * 1.75))) - 0.5) * 6.;
        float y = ((floor(id / (512. * 1.75)) / (512. * 1.75)) - 0.5 / ratio) * 6.;
                vec2 pos2 = vec2(x, y);
        float turb = 0.0;
        for (float i = 0.0; i < 25.0; i++) {
            float fi = i * 2e-2;
            float ts = 0.001 * sin(x * y * 1.5e1) * 3.;
            float xd = cos(distance(pos2, vec2(cos(fi * 1000. + t * 5.1) * fi, sin(fi * 1000. + t * 0.001) * fi)) * 50.75 + time * 0.5e-2) * ts;
            float yd = sin(distance(pos2, vec2(cos(fi * 1000. + t * 5.1) * fi, sin(fi * 1000. + t * 0.001) * fi)) * 50.75 + time * 0.5e-2) * ts;
            xd += sin(pos2.x * 1e3) * 0.0008;
            pos2.x += xd * cos(xd * 2e1) * 1.6;
            pos2.y += yd * cos(yd * 2e1) * 1.6;
            turb += xd + yd;
        }
        
        
        // float x = cos(id * 1e1) * id * 5e-5;
        // float y = sin(id * 1e1) * id * 5e-5;
        // x = mix(x, x0, 0.8);
        // y = mix(y, y0, 0.8);
        float z = 1.0 + sin(id * x * 5e-1 * t +  x * y * 0.2) * 1.5;
        // z = id / vertexCount * 40. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
        // z = mix(z, 0.0, 0.85);
        z = 0.0;
        z = z + fbm((vec2(x, y) + 10.0) * 1. + 5990. * 2e-1) * 0.75;
                // z += id / vertexCount * 400. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
                // z += tan(id * 1e-4) * id / vertexCount * 0.1;
        float d = distance(vec2(pos2.x, pos2.y), vec2(0.0, 0.0));
        vec4 pos = vec4(pos2.y, z, pos2.x, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        pos = zr2 * pos;
        // pos = yr * pos;
        // pos = tm4 * pos;
                pos = yr * pos;
        pos = tm4 * pos;
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * 20., pos.y * 20., 0.0, pos.z * 1.);
        gl_PointSize = 29.5 - (60. * pos.z * 0.02);
        alph = 0.25 * 0.75;
        cols = vec3(0.65 + 0.5 / pos.z);
       float vig = (roundedRectangle(pos.xy * 1.5 / pos.z, vec2(0.0, 0.0), vec2(1.82, 0.96) * 0.026 * 2.69, 0.001, 0.05) + 0.0);
        cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig);
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.79;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.5;
        // gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.rgb = cols;
        // gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();



newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    #define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    const mat2 mr = mat2 (
        0.84147,  0.54030,
        0.54030, -0.84147
    );
    float hash(in float n) {
      return fract(sin(n)*43758.5453);
    }
    float noise(in vec2 x) {
        vec2 p = floor(x);
        vec2 f = fract(x);
        f = f*f*(3.0-2.0*f);  
        float n = p.x + p.y*57.0;
        float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
              mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
        return res;
    }
    float fbm( in vec2 p ) {
        float f;
        f  = 0.5000*noise( p ); p = mr*p*2.02;
        f += 0.2500*noise( p ); p = mr*p*2.33;
        f += 0.1250*noise( p ); p = mr*p*2.01;
        f += 0.0625*noise( p ); p = mr*p*5.21;
        return f/(0.9375)*smoothstep( 260., 768., p.y ); // flat at beginning
    }
    void main(void) {
        float t = time * 0.5e-2;
        float ratio = 16.0 / 9.0;
        float vertexCount = 147456.0;
        float id = vertexID;
       // float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        // float px = x;
        
        // float py = y;
        float ra = 1.25;
        vec2 r = vec2(cos(ra), sin(ra));
        vec3 tr = vec3(-0.5, 2.69 / ratio, 17.9);
        mat3 tm = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            tr.x, tr.y, 1.0
        );
        mat3 rm = mat3(
           r.x, r.y, 0.0, // first column 
          -r.y, r.x, 0.0, // second column
           0.0, 0.0, 1.0  // third column
        );
        mat3 sm = mat3(
            1.5, 0.0, 0.0,
            0.0, 1.5, 0.0,
            0.0, 0.0, 1.0
        );
        mat3 m = tm * sm * rm;
        mat4 tm4 = mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            tr.x, tr.y, tr.z, 1.0
        );
        float pro = 1. / tan((3.14159265 / 2.0) / 2.0);
        mat4 xr = mat4(
           1.0, 0.0, 0.0, 0.0,
           0.0, r.x, -r.y, 0.0,
           0.0, r.y, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 yr = mat4(
           r.x, 0.0, r.y, 0.0,
           0.0, 1.0, 0.0, 0.0,
           -r.y, 0.0, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 zr = mat4(
           r.x, -r.y, 0.0, 0.0, // first column 
          r.y, r.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        float a = 10.;
        vec2 zz = vec2(cos(a), sin(a));
        mat4 zr2 = mat4(
           zz.x, -zz.y, 0.0, 0.0, // first column 
           zz.y, zz.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        mat4 pm = mat4(
            pro, 0.0, 0.0, 0.0,
            0.0, pro, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        // m = m * 4.0;
        // rm = sm * rm;
                // m = tm * m;
        // vec2 pos = cx_mul(vec2(x, y), vec2(0.5, 0.5));
        // pos = cx_mul(pos, vec2(0.75, 0.75));
        float x = ((fract(id / (512. * 4.75))) - 0.5) * 6.;
        float y = ((floor(id / (512. * 2.75)) / (512. * 2.75)) - 0.5 / ratio) * 15.;
                vec2 pos2 = vec2(x, y);
        float turb = 0.0;
        for (float i = 0.0; i < 25.0; i++) {
            float fi = i * 2e-2;
            float ts = 0.001 * sin(x * y * 1.5e1) * 3.;
            float xd = cos(distance(pos2, vec2(cos(fi * 1000. + t * 5.1) * fi, sin(fi * 1000. + t * 0.001) * fi)) * 50.75 + time * 50.5e-2) * ts;
            float yd = sin(distance(pos2, vec2(cos(fi * 1000. + t * 5.1) * fi, sin(fi * 1000. + t * 0.001) * fi)) * 50.75 + time * 50.5e-2) * ts;
            xd += sin(pos2.x * 1e3) * 0.00008;
            pos2.x += xd * cos(xd * 5e1) * 1.6;
            pos2.y += yd * cos(yd * 5e1) * 1.6;
            turb += xd + yd;
        }
        
        
        // float x = cos(id * 1e1) * id * 5e-5;
        // float y = sin(id * 1e1) * id * 5e-5;
        // x = mix(x, x0, 0.8);
        // y = mix(y, y0, 0.8);
        float z = 1.0 + sin(id * x * 5e-1 * t +  x * y * 0.2) * 1.5;
        // z = id / vertexCount * 40. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
        // z = mix(z, 0.0, 0.85);
        z = 0.0;
        z = z + fbm((vec2(x, y) + 10.0) * 1. + 5990. * 0.0625e-1) * 1.;
                // z += id / vertexCount * 400. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
                // z += tan(id * 1e-4) * id / vertexCount * 0.1;
        float d = distance(vec2(pos2.x, pos2.y), vec2(0.0, 0.0));
        vec4 pos = vec4(pos2.y, z, pos2.x, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        pos = zr2 * pos;
        // pos = yr * pos;
        // pos = tm4 * pos;
                pos = yr * pos;
        pos = tm4 * pos;
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * 20., pos.y * 20., 0.0, pos.z * 1.);
        gl_PointSize = 29.5 - (60. * pos.z * 0.02);
        alph = 0.25 * 0.75;
        cols = vec3(0.65 + 0.5 / pos.z);
       float vig = (roundedRectangle(pos.xy * 1.5 / pos.z, vec2(0.0, 0.0), vec2(1.82, 0.96) * 0.026 * 2.69, 0.001, 0.05) + 0.0);
        cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig);
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.79;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.5;
        // gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.rgb = cols;
        // gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();


newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    #define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    const mat2 mr = mat2 (
        0.84147,  0.54030,
        0.54030, -0.84147
    );
    float hash(in float n) {
      return fract(sin(n)*43758.5453);
    }
    float noise(in vec2 x) {
        vec2 p = floor(x);
        vec2 f = fract(x);
        f = f*f*(3.0-2.0*f);  
        float n = p.x + p.y*57.0;
        float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
              mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
        return res;
    }
    float fbm( in vec2 p ) {
        float f;
        f  = 0.5000*noise( p ); p = mr*p*2.02;
        f += 0.2500*noise( p ); p = mr*p*2.33;
        f += 0.1250*noise( p ); p = mr*p*2.01;
        f += 0.0625*noise( p ); p = mr*p*5.21;
        return f/(0.9375)*smoothstep( 260., 768., p.y ); // flat at beginning
    }
    void main(void) {
        float t = time * 0.5e-2;
        float ratio = 16.0 / 9.0;
        float vertexCount = 147456.0;
        float id = vertexID;
       // float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        // float px = x;
        
        // float py = y;
        float ra = 1.25;
        vec2 r = vec2(cos(ra), sin(ra));
        vec3 tr = vec3(-0.5, 1.8 / ratio, 17.9);
        mat3 tm = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            tr.x, tr.y, 1.0
        );
        mat3 rm = mat3(
           r.x, r.y, 0.0, // first column 
          -r.y, r.x, 0.0, // second column
           0.0, 0.0, 1.0  // third column
        );
        mat3 sm = mat3(
            1.5, 0.0, 0.0,
            0.0, 1.5, 0.0,
            0.0, 0.0, 1.0
        );
        mat3 m = tm * sm * rm;
        mat4 tm4 = mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            tr.x, tr.y, tr.z, 1.0
        );
        float pro = 1. / tan((3.14159265 / 2.0) / 2.0);
        mat4 xr = mat4(
           1.0, 0.0, 0.0, 0.0,
           0.0, r.x, -r.y, 0.0,
           0.0, r.y, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        // float ya = 0.0;
        // vec2 yyra = vec2(cos(ya), sin(ya));
        // mat4 yyr = mat4(
        //    yyra.x, 0.0, yyra.y, 0.0,
        //    0.0, 1.0, 0.0, 0.0,
        //    -yyra.y, 0.0, yyra.x, 0.0,
        //    0.0, 0.0, 0.0, 1.0
        // );
        mat4 yr = mat4(
           r.x, 0.0, r.y, 0.0,
           0.0, 1.0, 0.0, 0.0,
           -r.y, 0.0, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 zr = mat4(
           r.x, -r.y, 0.0, 0.0, // first column 
          r.y, r.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        float a = 10.;
        vec2 zz = vec2(cos(a), sin(a));
        mat4 zr2 = mat4(
           zz.x, -zz.y, 0.0, 0.0, // first column 
           zz.y, zz.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        mat4 pm = mat4(
            pro, 0.0, 0.0, 0.0,
            0.0, pro, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        // m = m * 4.0;
        // rm = sm * rm;
                // m = tm * m;
        // vec2 pos = cx_mul(vec2(x, y), vec2(0.5, 0.5));
        // pos = cx_mul(pos, vec2(0.75, 0.75));
        float x = ((fract(id / (512. * 4.75))) - 0.5) * 6.;
        float y = ((floor(id / (512. * 2.35)) / (512. * 2.35)) - 0.5 / ratio) * 15.;
                vec2 pos2 = vec2(x, y);
        float turb = 0.0;
        for (float i = 0.0; i < 25.0; i++) {
            float fi = i * 2e-2;
            float ts = 0.001 * sin(x * y * 1.5e1) * 5.;
            float xd = cos(distance(pos2 * 0.25, vec2(cos(fi + t) * fi, sin(fi * 1. + t * 1.02) * fi)) * 50.75 + time * 50.5e-2) * ts;
            float yd = sin(distance(pos2 * 0.25, vec2(cos(fi + t) * fi, sin(fi * 1. + t * 1.02) * fi)) * 50.75 + time * 50.5e-2) * ts;
            xd += sin(pos2.x * 1e3) * 0.00008;
            pos2.x += xd * cos(xd * 5e1) * 1.6;
            pos2.y += yd * cos(yd * 5e1) * 1.6;
            turb += xd + yd;
        }
        
        
        // float x = cos(id * 1e1) * id * 5e-5;
        // float y = sin(id * 1e1) * id * 5e-5;
        // x = mix(x, x0, 0.8);
        // y = mix(y, y0, 0.8);
        float z = 1.0 + sin(id * x * 5e-1 * t +  x * y * 0.2) * 1.5;
        // z = id / vertexCount * 40. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
        // z = mix(z, 0.0, 0.85);
        z = 0.0;
        z = z + fbm((vec2(x, y) + 10.0) * 1. + 5990. * 0.0625e-1) * 1.;
                // z += id / vertexCount * 400. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
                // z += tan(id * 1e-4) * id / vertexCount * 0.1;
        float d = distance(vec2(pos2.x, pos2.y), vec2(0.0, 0.0));
        vec4 pos = vec4(pos2.y, z, pos2.x, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        pos = zr2 * pos;
        // pos = yr * pos;
        // pos = tm4 * pos;
                pos = yr * pos;
        pos = tm4 * pos;
        // pos = yyr * pos;
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * 15., pos.y * 15., 0.0, pos.z * 1.);
        gl_PointSize = 29.5 - (60. * pos.z * 0.02);
        alph = 0.25 * 0.75;
        cols = vec3(0.65 + 0.5 / pos.z);
       float vig = (roundedRectangle(pos.xy * 1.5 / pos.z, vec2(0.0, 0.0), vec2(1.82, 0.98) * 0.026 * 3.59, 0.001, 0.05) + 0.0);
        cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig);
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.79;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.5;
        // gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.rgb = cols;
        // gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();



newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    varying float alph;
    varying vec3 cols;
    #define cx_mul(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    const mat2 mr = mat2 (
        0.84147,  0.54030,
        0.54030, -0.84147
    );
    float hash(in float n) {
      return fract(sin(n)*43758.5453);
    }
    float noise(in vec2 x) {
        vec2 p = floor(x);
        vec2 f = fract(x);
        f = f*f*(3.0-2.0*f);  
        float n = p.x + p.y*57.0;
        float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
              mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
        return res;
    }
    float fbm( in vec2 p ) {
        float f;
        f  = 0.5000*noise( p ); p = mr*p*2.02;
        f += 0.2500*noise( p ); p = mr*p*2.33;
        f += 0.1250*noise( p ); p = mr*p*2.01;
        f += 0.0625*noise( p ); p = mr*p*5.21;
        return f/(0.9375)*smoothstep( 260., 768., p.y ); // flat at beginning
    }
    void main(void) {
        float t = time * 0.5e-3;
        float ratio = 16.0 / 9.0;
        float vertexCount = 147456.0;
        float id = vertexID;
       // float dist_squared = dot(vec2(x, y), vec2(0., 0.));
        // x += (dist_squared) * 200.;
        // float px = x;
        
        // float py = y;
        float ra = 1.25;
        vec2 r = vec2(cos(ra), sin(ra));
        vec3 tr = vec3(-0.5, 1.8 / ratio, 17.9);
        mat3 tm = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            tr.x, tr.y, 1.0
        );
        mat3 rm = mat3(
           r.x, r.y, 0.0, // first column 
          -r.y, r.x, 0.0, // second column
           0.0, 0.0, 1.0  // third column
        );
        mat3 sm = mat3(
            1.5, 0.0, 0.0,
            0.0, 1.5, 0.0,
            0.0, 0.0, 1.0
        );
        mat3 m = tm * sm * rm;
        mat4 tm4 = mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            tr.x, tr.y, tr.z, 1.0
        );
        float pro = 1. / tan((3.14159265 / 2.0) / 2.0);
        mat4 xr = mat4(
           1.0, 0.0, 0.0, 0.0,
           0.0, r.x, -r.y, 0.0,
           0.0, r.y, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        // float ya = 0.0;
        // vec2 yyra = vec2(cos(ya), sin(ya));
        // mat4 yyr = mat4(
        //    yyra.x, 0.0, yyra.y, 0.0,
        //    0.0, 1.0, 0.0, 0.0,
        //    -yyra.y, 0.0, yyra.x, 0.0,
        //    0.0, 0.0, 0.0, 1.0
        // );
        mat4 yr = mat4(
           r.x, 0.0, r.y, 0.0,
           0.0, 1.0, 0.0, 0.0,
           -r.y, 0.0, r.x, 0.0,
           0.0, 0.0, 0.0, 1.0
        );
        mat4 zr = mat4(
           r.x, -r.y, 0.0, 0.0, // first column 
          r.y, r.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        float a = 10.;
        vec2 zz = vec2(cos(a), sin(a));
        mat4 zr2 = mat4(
           zz.x, -zz.y, 0.0, 0.0, // first column 
           zz.y, zz.x, 0.0, 0.0, // second column
           0.0, 0.0, 1.0, 0.0,  // third column
           0.0, 0.0, 0.0, 1.0
        );
        mat4 pm = mat4(
            pro, 0.0, 0.0, 0.0,
            0.0, pro, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        // m = m * 4.0;
        // rm = sm * rm;
                // m = tm * m;
        // vec2 pos = cx_mul(vec2(x, y), vec2(0.5, 0.5));
        // pos = cx_mul(pos, vec2(0.75, 0.75));
        float x = ((fract(id / (512. * 4.75))) - 0.5) * 6.;
        float y = ((floor(id / (512. * 2.35)) / (512. * 2.35)) - 0.5 / ratio) * 15.;
                vec2 pos2 = vec2(x, y);
        float turb = 0.0;
        for (float i = 0.0; i < 25.0; i++) {
            float fi = i * 2e-2;
            float ts = 0.001 * sin(x * y * 1.5e1) * 5.;
            float xd = cos(distance(pos2 * 0.25, vec2(cos(fi + t) * fi, sin(fi * 1. + t * 1.02) * fi)) * 50.75 + time * 50.5e-2) * ts;
            float yd = sin(distance(pos2 * 0.25, vec2(cos(fi + t) * fi, sin(fi * 1. + t * 1.02) * fi)) * 50.75 + time * 50.5e-2) * ts;
            xd += sin(pos2.x * 1e3) * 0.00008;
            pos2.x += xd * cos(xd * 5e1) * 1.6;
            pos2.y += yd * cos(yd * 5e1) * 1.6;
            turb += xd + yd;
        }
        
        
        // float x = cos(id * 1e1) * id * 5e-5;
        // float y = sin(id * 1e1) * id * 5e-5;
        // x = mix(x, x0, 0.8);
        // y = mix(y, y0, 0.8);
        float z = 1.0 + sin(id * x * 5e-1 * t +  x * y * 0.2) * 1.5;
        // z = id / vertexCount * 40. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
        // z = mix(z, 0.0, 0.85);
        z = 0.0;
        z = z + fbm((vec2(x, y) + 10.0) * 1. + 5990. * 0.0625e-1) * 1.;
                // z += id / vertexCount * 400. * sin(x * id * 1e2 + tan(id * 1e8) * 1e-1) * 0.5;
                // z += tan(id * 1e-4) * id / vertexCount * 0.1;
        float d = distance(vec2(pos2.x, pos2.y), vec2(0.0, 0.0));
        vec4 pos = vec4(pos2.y, z, pos2.x, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        pos = zr2 * pos;
        // pos = yr * pos;
        // pos = tm4 * pos;
                pos = yr * pos;
        pos = tm4 * pos;
        // pos = yyr * pos;
        float sca = 1.0;
        if (id < 3500.) {
            float oid = id - 0.;
            pos.x = sin(oid * 1e-1 + t * 5.) * oid * 6e-6 + 0.000;
            pos.y = cos(oid * 1e-1 + t * 5.) * oid * 6e-6 + 0.046;
            pos.z = 0.9;
            sca = 2.5;
        }
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * 15., pos.y * 15., 0.0, pos.z * 1.);
        float disturbance = (floor(sin(gl_Position.y * 5. + time * 0.25 + tan(gl_Position.y * 1e3) * 0.125) * 2.)) * 0.125 * 0.125;
        float fluctuate = floor(mod(time * 1e5, 100.)/50.);
        float distr2 = (floor(sin(gl_Position.y * 1e-7 + time * 0.125 + tan(gl_Position.y * 2e-1 + gl_Position.x * 1e-3) * 0.5) * 0.01)) * 10.1 * fluctuate;
        // distr2 *= 0.;
        //gl_Position.y += disturbance * 0.1 * sin(time) * (1. + distr2 * 5.);
        gl_PointSize = (29.5 - (60. * pos.z * 0.02)) * sca;
        gl_PointSize = 6. * sca;
        alph = 0.25 * 0.75;
        cols = vec3(0.65 + 0.5 / pos.z);
       float vig = (roundedRectangle(pos.xy * 1.5 / pos.z, vec2(0.0, 0.0), vec2(1.82, 0.98) * 0.026 * 3.59, 0.001, 0.05) + 0.0);
        cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig);
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
//     varying vec2 myposition;
//     varying vec2 center;
    varying float alph;
    varying vec3 cols;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.05 / (0.9 + alph), 0.000125, dist_squared) * 0.79;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.4 - dist_squared, 2.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph)) * 0.045 + alpha)) * 0.5;
        // gl_FragColor.rgb = gl_FragColor.rbr;
        gl_FragColor.rgb = cols * 0.35 * vec3(3.5, 1., 1.2);
        gl_FragColor.rgb = gl_FragColor.gbr;
        // gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();





newFlickering.vertText = `
    // beginGLSL
    attribute vec4 coordinates;
    uniform float resolution;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    float rand(vec2 n) { 
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    float noise(vec2 p){
        vec2 ip = floor(p);
        vec2 u = fract(p);
        u = u*u*(3.0-2.0*u);
        float res = mix(
            mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
            mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
        return res*res;
    }
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        gl_Position = vec4(coordinates.x, coordinates.y, 0.0, 1.);
        gl_Position.xy *= (1.0 - distance(gl_Position.xy, vec2(0,0)) * 0.1) * 1.05;
        // gl_Position.xy *= 0.75;
        float n = noise(gl_Position.xy);
        // gl_Position.y += tan(n * 100. * 1e2 + alph) * 0.0009 * 2.;
        // gl_Position.x += tan(alph * 1e4) * 10.5;
        // gl_Position.xy += vec2(cos(n * 1.), sin(n * 1.)) * 0.1;
        center = vec2(gl_Position.x, gl_Position.y);
        center = 512.0 + center * 512.0;
        myposition = vec2(gl_Position.x, gl_Position.y);
        alph = coordinates.w;
        gl_PointSize = (9. + coordinates.z / ((6.0 + alph) * 0.25)) * alph * 2.5;
        // float vig = (roundedRectangle(gl_Position.xy, vec2(0.0, 0.0), vec2(0.905, 0.87) * 0.99, 0.05, 0.5) + 0.0);
        float vig = (roundedRectangle(gl_Position.xy * 0.15, vec2(0.0, 0.0), vec2(2.035, 2.) * 0.07, 0.001, 0.05) + 0.0);
        // cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig) * resolution * 1.;
        // gl_PointSize = 25.0 + cos((coordinates.x + coordinates.y) * 4000000.) * 5.;
        // gl_PointSize = coordinates.z / (alph * (sin(myposition.x * myposition.y * 1.) * 3. + 0.5));
    }
    // endGLSL
`;
newFlickering.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
        float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.015 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.2 - dist_squared, 0.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 4.1)) * 0.045 + alpha)) * 1.25;
        // gl_FragColor = vec4(1.0);
        gl_FragColor.rgb *= 0.25;
    }
    // endGLSL
`;
newFlickering.init();