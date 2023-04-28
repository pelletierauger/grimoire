You are now in the shaders.js tab.

Below are big blocks of code, each of which define a different background animation.
You can evaluate a block of code using CMD and ENTER on Mac, and CRTL and ENTER on PC.

What you will do by evaluating any blocks below is modifying the value
of newFlickeringVert, a WebGL shader program that is currently set to be displayed
in the background.

It is recommended that you set the amountOfVertices to 450000 to view most of these
animations.

amountOfVertices = 450000;

// —————————————————————————————————————————————————————————————
// radiator
// —————————————————————————————————————————————————————————————

newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float resolution;
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
        float vig = (roundedRectangle(
        pos.xy * 1.5 / pos.z, vec2(0.0, 0.0), vec2(1.77, 0.94) * 0.47, 0.03, 0.05) + 0.0);
        cols = mix(cols, cols * floor(vig), 1.);
        // gl_PointSize *= floor(vig) * 1.2;
        gl_PointSize *= floor(vig) * 1.2 * 2. * resolution;
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

// —————————————————————————————————————————————————————————————
// radsigil
// —————————————————————————————————————————————————————————————

newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float resolution;
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
        // gl_PointSize *= floor(vig) * 1.2;
        gl_PointSize *= floor(vig) * 1.2 * 2. * resolution;
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


// —————————————————————————————————————————————————————————————
// radsigil2
// —————————————————————————————————————————————————————————————

newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float resolution;
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
        // gl_PointSize *= floor(vig) * 1.2;
        gl_PointSize *= floor(vig) * 1.2 * 2. * resolution;
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


// —————————————————————————————————————————————————————————————
// radsigil3
// —————————————————————————————————————————————————————————————

alterVision = function(av0 = "1e-3", av1 = "1e-4", av2 = "1.") {
newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float resolution;
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
        // gl_PointSize *= floor(vig) * 1.2;
        gl_PointSize *= floor(vig) * 1.2 * 2. * resolution;
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


// —————————————————————————————————————————————————————————————
// radflow
// —————————————————————————————————————————————————————————————

newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float resolution;
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
        // gl_PointSize *= floor(vig) * 1.2;
        gl_PointSize *= floor(vig) * 1.2 * 2. * resolution;
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


// —————————————————————————————————————————————————————————————
// zen terrain
// —————————————————————————————————————————————————————————————

newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float resolution;
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
        // gl_PointSize = 20. - (60. * pos.z * 0.01);
        gl_PointSize = (20. - (60. * pos.z * 0.01)) * 2. * resolution;
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



// —————————————————————————————————————————————————————————————
// other terrain
// —————————————————————————————————————————————————————————————

newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float resolution;
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
        // gl_PointSize = 25. - (60. * pos.z * 0.01);
        gl_PointSize = (25. - (60. * pos.z * 0.01)) * 2. * resolution;
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


// —————————————————————————————————————————————————————————————
// yet another terrain
// —————————————————————————————————————————————————————————————


newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float resolution;
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
        // gl_PointSize = 34. - (60. * pos.z * 0.02);        
        gl_PointSize = (34. - (60. * pos.z * 0.02)) * 2. * resolution;
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


// —————————————————————————————————————————————————————————————
// where are we
// —————————————————————————————————————————————————————————————

newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float resolution;
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
        // gl_PointSize = 34. - (60. * pos.z * 0.02);   
        gl_PointSize = (34. - (60. * pos.z * 0.02)) * 2. * resolution;
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


// —————————————————————————————————————————————————————————————
// we don't know
// —————————————————————————————————————————————————————————————

newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float resolution;
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
        // gl_PointSize = 34. - (60. * pos.z * 0.02);        
        gl_PointSize = (34. - (60. * pos.z * 0.02)) * 2. * resolution;
        alph = 0.25 * 0.75;
        cols = vec3(0.65 + 0.5 / pos.z);
       // float vig = (roundedRectangle(pos.xy * 1.5 / pos.z, vec2(0.0, 0.0), vec2(1.82, 0.92) * 0.026 * 1.29, 0.001, 0.05) + 0.0);
               float vig = (roundedRectangle(
       pos.xy * 1.5 / pos.z, vec2(0.0, 0.0), vec2(0.865, 0.46) * 0.026 * 2.8, 0.001, 0.02) + 0.0);
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

// —————————————————————————————————————————————————————————————
// nor will we ever, probably
// —————————————————————————————————————————————————————————————

newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float resolution;
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
        // gl_PointSize = 29.5 - (60. * pos.z * 0.02);    
        gl_PointSize = (29.5 - (60. * pos.z * 0.02)) * 2. * resolution;
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

// —————————————————————————————————————————————————————————————
// it'll remain uncertain
// —————————————————————————————————————————————————————————————

newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float resolution;
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
        // gl_PointSize = 29.5 - (60. * pos.z * 0.02);
        gl_PointSize = (29.5 - (60. * pos.z * 0.02)) * 2. * resolution;
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

// —————————————————————————————————————————————————————————————
// forever uncertain
// —————————————————————————————————————————————————————————————

newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float resolution;
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
        // gl_PointSize = 29.5 - (60. * pos.z * 0.02);
        gl_PointSize = (29.5 - (60. * pos.z * 0.02)) * 2.0 * resolution;
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


// —————————————————————————————————————————————————————————————
// void
// —————————————————————————————————————————————————————————————

newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float resolution;
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
        // gl_PointSize = 6. * sca;
        gl_PointSize = 6. * sca * 2. * resolution;
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