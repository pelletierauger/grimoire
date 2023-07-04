
let radiator = new ShaderProgram("radiator");
radiator.vertText = `
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
radiator.fragText = `
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
        gl_FragColor.rgb *= 0.75;
        
    }
    // endGLSL
`;
radiator.vertText = radiator.vertText.replace(/[^\x00-\x7F]/g, "");
radiator.fragText = radiator.fragText.replace(/[^\x00-\x7F]/g, "");
radiator.init();
let radialSwirl = new Animation(radiator, drawAlligatorQuietVert, 147456 * 3);
let backgroundAnimation = radialSwirl;


let globeProgram = new ShaderProgram("globe");
globeProgram.vertText = `
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
z += tan(id * 1e-5) * id / vertexCount;
        float d = distance(vec2(x, y), vec2(0.0, 0.0));
        vec4 pos = vec4(x, y, z, 1.0);
        // pos = pm * pos;
        // pos.xyz = rotate(pos.xyz, vec3(0.0, 0.0, 0.0), t);
        pos = (zr * sin(id * 1e-2) * 2.) * pos;
        // pos = tm4 * pos;
                pos = xr * pos;
        pos = tm4 * pos;
        // pos = m * pos;
        gl_Position = vec4(pos.x / ratio * 2., pos.y * 2., 0.0, pos.z * 1.);
        gl_PointSize = 25. - (60. * pos.z * 0.01);
        alph = 0.25 * 0.75;
        cols = vec3(0.65 + 0.5 / pos.z);
       float vig = (roundedRectangle(pos.xy * 1.5 / pos.z * 2., vec2(0.0, 0.0), vec2(1.735, 0.929) * 1.45, 0.05, 0.5) + 0.0);
        cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig) * 1.5 * 2. * resolution;
    }
    // endGLSL
`;
globeProgram.fragText = `
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
        gl_FragColor.rgb = cols * 0.25;
        // gl_FragColor.b *= 0.75;
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
globeProgram.vertText = globeProgram.vertText.replace(/[^\x00-\x7F]/g, "");
globeProgram.fragText = globeProgram.fragText.replace(/[^\x00-\x7F]/g, "");
globeProgram.init();
let globe = new Animation(globeProgram, drawAlligatorQuietVert, 147456);
// backgroundAnimation = globe;


drawSwirl = function(selectedProgram) {
    vertices = [];
    // let xOffset = (noise(frameCount * 0.01) - 0.5) * 0.75;
    // let yOffset = (noise((frameCount + 100) * 0.01) - 0.5) * 0.75;
    let t = drawCount * 0.00125 * 0.00005 * 1.5 + 10;
    let t2 = t * 1e1 * 2000;
    let xOffset = openSimplex.noise2D(t2, t2 + 1000);
    let yOffset = openSimplex.noise2D(t2 - 1000, t2 + 500);
    t2 = (t2 + 5000) * 100;
    let xOffset2 = openSimplex.noise2D(t2, t2 + 1000);
    let yOffset2 = openSimplex.noise2D(t2 - 1000, t2 + 500);
    let fx = 1;
    let fy = 1;
    let x = 1;
    let y = 1;
    // let al = map(sin(t * 1e6), -1, 1, 0.1, 1);
    let t3 = t * 1e5;
    let al = map(openSimplex.noise2D(t3, t3 + 1000), -1, 1, 0.5, 1);
    for (let i = 0; i < 60000; i += 1) {
        let ax = Math.pow(Math.cos(fx * 1e-4 + i * 1e-4), -1);
        let ay = Math.pow(Math.cos(fx * 1e-4 + i * 1e-4), -1);
        let aax = 0.5 - ax;
        let aay = 0.5 - ay;
        x = Math.sin(Math.tan(i * 24.9 + t * 1e-1) * aax * Math.sin(i * 1e-10 + ax * 0.35) + i * 1e-5 + t * 11e4) * i * 0.00005 * 1.5;
        y = Math.cos(Math.tan(i * 24.9 + t * 1e-1) * aay * Math.sin(i * 1e-10 + ax * 0.35) + i * 1e-5 + t * 11e4) * i * 0.00015 * 1.5;
        //         x *= sin(t * 50 * cos(y * 0.002));
        //         x *= cos(fx * fy * 0.001) * sin(x + t * 20);
        //         y *= cos(fx * fy * 0.001) * cos(x + t * 20);
        x *= Math.sin(fx * 0.05) + Math.cos(fy * 0.05);
        y *= Math.sin(fy * 0.05) + Math.cos(fy * 0.05);
        fx = x;
        fy = y;
        //         x += (Math.random() - 0.5) * 0.00005;
        //         y += (Math.random() - 0.5) * 0.00005;
        // x += xOffset * 0.125;
        // y += yOffset * 0.125;
        x += Math.cos(t * -1e6 * 0.25) * i * 0.125e-4 * 2;
        y += Math.sin(t * -1e6 * 0.25) * i * 0.125e-4 * 3;
        x += xOffset * 0.15 * 2 * 0.2 * 6.5 * 0.5;
        y += yOffset * 0.15 * 3 * 0.2 * 6.5 * 0.5;
        x += xOffset2 * 2 * 1e-3 * 0.5 * 6.5 * 0.5;
        y += yOffset2 * 3 * 1e-3 * 0.5 * 6.5 * 0.5;
        //         let xo = openSimplex.noise2D(i, t * 1e4) * 4e-4;
        //         let yo = openSimplex.noise2D(i, t * 1e4 + 1000) * 4e-4;
        let xo = 0;
        let yo = 0;
        //         let zo = (openSimplex.noise2D(i, (t + i) * 1e2 + 100)) * 5;
        vertices.push((x + xo * 6.5) * 1.5 * 0.15, (y + yo * 6.5) * 0.8 * 0.15 * 1.1, 14.0, al);
    }
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, dotsVBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    var scalar = gl.getUniformLocation(selectedProgram, "resolution");
    // Point an attribute to the currently bound VBO
    // gl.vertexAttribPointer(coord, 1, gl.FLOAT, false, 0, 0);
    gl.uniform1f(scalar, resolutionScalar);
    let dotsToDraw = Math.floor(map(drawCount, 0, 2400 - 672, 60000, 0));
    dotsToDraw = 60000;
    gl.drawArrays(gl.POINTS, 0, dotsToDraw);
    // console.log("aaa");
}

let swirl = new Animation(newFlickering, drawSwirl, 147456);


drawSmoke = function(selectedProgram) {
    vertices = [];
    // let xOffset = (noise(frameCount * 0.01) - 0.5) * 0.75;
    // let yOffset = (noise((frameCount + 100) * 0.01) - 0.5) * 0.75;
    let t = drawCount * 0.00125 * 2 * 2 + 8;
    let t2 = t * 1e-4 * 20000 * 0.25;
    let xOffset = openSimplex.noise2D(t2, t2 + 1000);
    let yOffset = openSimplex.noise2D(t2 - 1000, t2 + 500);
    t2 = (t2 + 5000) * 10;
    let xOffset2 = openSimplex.noise2D(t2, t2 + 1000);
    let yOffset2 = openSimplex.noise2D(t2 - 1000, t2 + 500);
    let fx = 1;
    let fy = 1;
    let x = 1;
    let y = 1;
    let t3 = t * 1e1 * 2;
    let al = map(openSimplex.noise2D(t3, t3 + 1000), -1, 1, 0.025, 1.25);
    t *= 0.4;
    t += 115;
    for (let i = 0; i < 40000; i += 1) {
        x = fx * 0.16 + Math.sin(Math.tan(i * 24.9 + t * 0.5) + i * t * 0.000001) * i * 0.000022;
        y = fy * 0.16 + Math.cos(Math.tan(i * 24.9 + t * 0.5) + i * t * 0.000001) * i * 0.00005;
        //         x *= Math.cos(fx * fy * 0.001 * t * 5) * Math.sin(x + t * 10);
        //         x *= Math.cos(fx * fy * 0.001 * t * 7) * Math.sin(x + t * 15);
        //         y *= cos(fx * fy * 0.001) * cos(x + t + 2 * 10);
        //         x -= Math.sin(fx * fx * fy * Math.cos(fy * 400) * 0.018) * 7.5 * 2;
        //         y -= Math.sin(fy * fy * 0.018) * 7.5 * 2;
        // Below, I changed the range of the inner oscillator to [-0.65, 1]
        // to reduce the amount of time it destroys the harmonic shape.
        fx = tan(x * 0.15 * (map(sin(t * 2), -1, 1, -0.65, 1))) * 40;
        fy = tan(y * 0.15 * (map(sin(t * 2), -1, 1, -0.65, 1))) * 40;
        //         x += (Math.random() - 0.5) * 0.00005;
        //         y += (Math.random() - 0.5) * 0.00005;
        // x += xOffset * 0.125;
        // y += yOffset * 0.125;
        x += cos(t * -0.5e2 * 0.25) * i * 0.125e-4 * 2 * 0.5;
        y += sin(t * -0.5e2 * 0.25) * i * 0.125e-4 * 3 * 0.5;
        x += xOffset * 0.15 * 2 * 0.2 * 6.5 * 0.25;
        y += yOffset * 0.15 * 3 * 0.2 * 6.5 * 0.25;
        x += xOffset2 * 2 * 1e-3 * 0.5 * 6.5 * 0.25;
        y += yOffset2 * 3 * 1e-3 * 0.5 * 6.5 * 0.25;
        let xo = openSimplex.noise2D(i, t * 1e4) * 1e-3;
        let yo = openSimplex.noise2D(i, t * 1e4 + 1000) * 1e-3;
        let zo = (openSimplex.noise2D(i, (t + i) * 1e2 + 100)) * 5;
        let s = 0.7;
        vertices.push((x + xo) * 1.3 * 1.5 * s, (y + yo) * 0.9 * 1.5 * s - 0.25, 15.0 + zo, al);
    }
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, dotsVBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    var scalar = gl.getUniformLocation(selectedProgram, "resolution");
    // Point an attribute to the currently bound VBO
    // gl.vertexAttribPointer(coord, 1, gl.FLOAT, false, 0, 0);
    gl.uniform1f(scalar, resolutionScalar);
    let dotsToDraw = Math.floor(map(drawCount, 0, 2400 - 672, 60000, 0));
    dotsToDraw = 40000;
    gl.drawArrays(gl.POINTS, 0, dotsToDraw);
};

let smokySpiral = new Animation(newFlickering, drawSmoke, 40000);



let brokenTerrainProgram = new ShaderProgram("broken-terrain");
brokenTerrainProgram.vertText = `
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
       float vig = (roundedRectangle(pos.xy * 1.5 / pos.z, vec2(0.0, 0.0), vec2(1.938, 1.035) * 0.065, 0.0025, 0.125 * 0.25) + 0.0);
        cols = mix(cols, cols * floor(vig), 1.);
        gl_PointSize *= floor(vig);
    }
    // endGLSL
`;
brokenTerrainProgram.fragText = `
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
brokenTerrainProgram.vertText = brokenTerrainProgram.vertText.replace(/[^\x00-\x7F]/g, "");
brokenTerrainProgram.fragText = brokenTerrainProgram.fragText.replace(/[^\x00-\x7F]/g, "");
brokenTerrainProgram.init();

let brokenTerrain = new Animation(brokenTerrainProgram, drawAlligatorQuietVert, 147456 * 3);


fullArr = [];
nextArr = [];
for (let i = 0 ; i < 30000; i++) {
    fullArr.push({x: Math.cos(i) * i, y: Math.sin(i) * i});
    nextArr.push({x: 0, y: 0});
}
drawDots = function(selectedProgram) {
    vertices = [];
    let xOffset = (noise(frameCount * 0.0025) - 0.5) * 0.9;
    let yOffset = (noise((frameCount + 100) * 0.0025) - 0.5) * 0.9;
    let t = drawCount * 0.00000005 + 0;
    let fx = 1;
    let fy = 1;
    let x = 0;
    let y = 0;
    let num = 30000;
    function ro(a, l, x, y, h) {
        return {
            x: x + Math.cos(h + a) * l,
            y: y + Math.sin(h + a) * l,
            h: h + a
        };
    }
    let amountRays = 120;
    let sj = (10 - t) * 1000000;
    let rayInc = Math.PI * 2 / amountRays;
    let numV = 0;
    let metaV = [];
    let indMetaV = 0;
    let ink = 0;
    for (let j = sj; j < (Math.PI * 2 + sj) - rayInc; j += rayInc) {
        let p = {x: 0, y: 0, h: j};
        let jj = j - sj;
        metaV[indMetaV] = [];
        for (let i = 0; i < (num / amountRays); i += 1) {
//             let a = 0;
//             let l = 1;
//             p = ro(a, l, p.x * 1, p.y * 1, p.h);
//             p.x += xOffset * 0.95;
//             p.y += yOffset * 0.95;
//             let ppx = cos(t * 2e6) * 50;
//             let ppy = sin(t * 2e6) * 50;
//             p.x = ppx * 1;
//             p.y = ppy * 1;
            let x = fullArr[ink].x;
            let y = fullArr[ink].y;
            p.x = tan(x * 2.05) * 0.49;
            p.y = tan(y * 2.05) * 0.49;
            nextArr[ink] = {x: p.x, y: p.y};
            ink++;
            var sc = 0.01 * (1 / cos(t * 4e5));
            sc = 15.5 * 0.75;
            metaV[indMetaV].push(p.y * 0.35 * 1.5 * sc, p.x * 0.8 * sc,  14.0, 0.9);
            numV += 1;
        }
        indMetaV++;
    }
    for (let i = 0; i < num; i++) {
        fullArr[i] = {x: nextArr[i].x, y: nextArr[i].y};
    }
    let flatV = [];
    for (let j = 0; j < metaV[0].length; j += 4) {
        for (let i = 0; i < metaV.length; i++) {
            flatV.push(metaV[i][j], metaV[i][j + 1], metaV[i][j + 2], metaV[i][j+3]);
        }
    }
    vertices = flatV;
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, dotsVBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    var scalar = gl.getUniformLocation(selectedProgram, "resolution");
    // Point an attribute to the currently bound VBO
    // gl.vertexAttribPointer(coord, 1, gl.FLOAT, false, 0, 0);
    gl.uniform1f(scalar, resolutionScalar);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, num);
}

let expandingUniverse = new Animation(newFlickering, drawDots, 30000);


backgroundAnimation = globe;

