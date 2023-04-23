if (false) {


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
        vec2 r = vec2(cos(t * -2.), sin(t * -2.));
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
        vec4 pos = vec4(x * 3., y, 0.0 + sin(id * x * 3e1 * 1e2 +  x * y * 0.02) * 1.5, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        // pos = zr * pos;
        // pos = tm4 * pos;
                pos = yr * pos;
        pos = tm4 * pos;
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * 3., pos.y * 12. + 8.25, 0.0, pos.z * 1.);
        gl_Position.xy *= (1.0 - distance(gl_Position.xy, vec2(0,0)) * 0.025) * 1.0;
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
        gl_FragColor.rgb = cols * 1.;
        gl_FragColor.a *= 2.;
        
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
        vec2 r = vec2(cos(t * -2.), sin(t * -2.));
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
        vec4 pos = vec4(x * 3. * sin(id * 1e-4), y, 0.0 + sin(id * x * 3e1 * 1e2 +  x * y * 0.02) * 1.5, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        // pos = zr * pos;
        // pos = tm4 * pos;
                pos = yr * pos;
        pos = tm4 * pos;
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * 3., pos.y * 12. + 8.25, 0.0, pos.z * 1.);
        gl_Position.xy *= (1.0 - distance(gl_Position.xy, vec2(0,0)) * 0.025) * 1.0;
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
        gl_FragColor.rgb = cols * 1.;
        gl_FragColor.a *= 2.;
        
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
        vec2 r = vec2(cos(t * -2.), sin(t * -2.));
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
        vec4 pos = vec4(x * 3., y, 0.0 + sin(id * x * 3e1 * 1e2 +  x * y * 0.02) * 1.5, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        // pos = zr * pos;
        // pos = tm4 * pos;
                pos = yr * pos;
        pos = tm4 * pos;
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * 3., pos.y * 3. + 0.25, 0.0, pos.z * 1.);
        gl_Position.xy *= (1.0 - distance(gl_Position.xy, vec2(0,0)) * 0.025) * 1.0;
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
        gl_FragColor.rgb = cols * 1.;
        gl_FragColor.a *= 0.5;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();



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
    float vig = smoothstep(edge * 0.7, edge, pos.x * pos.y * (1. - pos.x) * (1. - pos.y));
    gl_FragColor.rgb *= vig;
    float vig2 = smoothstep(pow(0.01, 4.), pow(0.22, 3. * 1.1), pos.x * pos.y * (1. - pos.x) * (1. - pos.y));
    float vig3 = smoothstep(pow(0.01, 4.), pow(0.22, 3.5 * 1.1), pos.x * pos.y * (1. - pos.x) * (1. - pos.y));
    float vig4 = smoothstep(pow(0.01, 4.), pow(0.22, 2.2 * 1.1), pos.x * pos.y * (1. - pos.x) * (1. - pos.y));
    gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb - 1./ vig2 * 0.25, 0.25 * 0.85);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb - 1./ vig3 * 0.25, 0.125 * 0.85);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb - 1./ vig4 * 0.25, 0.125 * 0.85) * 1.1 + 0.02;
    gl_FragColor.rgb = max(vec3(0.1), gl_FragColor.rgb) * vig;
    // gl_FragColor.rgb *= 1.05;        
    // gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, 3.75);
    // gl_FragColor.b += col.b * 0.25;
//gl_FragColor.rgb = gl_FragColor.rbg;
}
// endGLSL
`;
textureShader.init();


// if (false) {
}