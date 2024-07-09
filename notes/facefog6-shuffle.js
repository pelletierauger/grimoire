buildFace = function() {
    let face = [];
    let c = ge.t.canvas.data;
    let cy = ge.t.scroll.y;
    let sc = 0.75;
    for (let i = -5; i < 30; i++) {
        for (let j = 0; j < 109; j++) {
            for (let k = 0; k < 63; k++) {
                if (c[cy+i] && c[cy+i][j] && c[cy+i][j][k]) {
                    let x = j * 7 + (k % 7);
                    let y = i * 9 + Math.floor(k / 7);
                    x = (x / (109*7) * 2 - 1 + 0.1) * sc - 0.05;
                    y = (-y/(25*9) * 2 * (0.9) + 1 + 0.05) * sc;
                    for (let l = 0; l < 4; l++) {
                         for (let m = 0; m < 4; m++) {
                             var xx = x+(l*0.01*1*Math.round(Math.random()));
                             var yy = y+(m*0.02*1*Math.round(Math.random()));
                             var shift = map(openSimplex.noise2D(xx, yy), -1, 1, 0.25, 3.25);
                             xx += map(openSimplex.noise2D(xx*1e2+1000, yy*1e3), -1, 1, 0.25, 3.25)*0.001;
                             yy += map(openSimplex.noise2D(xx*1e2, yy*1e3+1000), -1, 1, 0.25, 3.25)*0.001;
                            var size = Math.random()*4;
                             // if (Math.random() < 0.5) {
                                 face.push([xx, yy, 2 * sc, 4]);
                             // } else {
                                 // face.unshift(xx, yy, 2 * sc, 4);
                             // }
                             
                        }   
                    }
                    // face.push(x, y, 11 * sc, 1);
                }
            }
        }
    }
    shuffle(face);
   var face2 = [];
    for (let i = 0; i < face.length; i++) {
        face2.push(face[i][0]);
        face2.push(face[i][1]);
        face2.push(face[i][2]);
        face2.push(face[i][3]);
    }
    // shuffle(face2);
    faceArray = new Float32Array(face2);
}
buildFace();

drawSwirl = function(selectedProgram) {
    vertices = [];
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
    gl.bufferData(gl.ARRAY_BUFFER, faceArray, gl.STATIC_DRAW);
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
    var time = gl.getUniformLocation(selectedProgram, "time");
    // Point an attribute to the currently bound VBO
    // gl.vertexAttribPointer(coord, 1, gl.FLOAT, false, 0, 0);
    gl.uniform1f(time, drawCount);    
    var scalar = gl.getUniformLocation(selectedProgram, "resolution");
    // Point an attribute to the currently bound VBO
    // gl.vertexAttribPointer(coord, 1, gl.FLOAT, false, 0, 0);
    gl.uniform1f(scalar, resolutionScalar);
    let dotsToDraw = Math.floor(map(drawCount, 0, 2400 - 672, 60000, 0));
    dotsToDraw = 6000;
    gl.drawArrays(gl.POINTS, 0, faceArray.length/4 * map(Math.sin(drawCount*0.1),-1,1,0,1));
    // console.log("aaa");
}





newFlickering.vertText = `
    // beginGLSL
    attribute vec4 coordinates;
    uniform float resolution;
    uniform float time;
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
        float t = time * 0.25e-1;
        gl_Position = vec4(coordinates.x * 2. + 0.25*0., coordinates.y * 2., 0.0, 1.0);
        center = vec2(gl_Position.x, gl_Position.y);
        center = 512.0 + center * 512.0;
        myposition = vec2(gl_Position.x, gl_Position.y);
        alph = coordinates.w;
        gl_PointSize = (9. + coordinates.z / ((6.0 + alph) * 0.25)) * 2.0 * resolution;
float vig = (roundedRectangle(gl_Position.xy * 0.15, vec2(0.0, 0.0), vec2(1.9, 1.96) * 0.0712*1., 0.001, 0.05) + 0.0);
                // cols = mix(cols, cols * floor(vig), 1.);
        vec2 pos = gl_Position.xy;
        // gl_PointSize *= noise(pos*1000.*vec2(cos(t*tan(pos.x*1e-1+1e1)),sin(t*tan(pos.x*1e-1+1e1))));
        // gl_Position.xy *= 1.0 - (noise(pos*1000.*vec2(cos(t*tan(pos.x)*1e-2),sin(t*tan(pos.x)*1e-2)))*0.1);
        gl_Position.xy += noise(pos*1e3+vec2(cos(t),sin(t)))*0.05;
    gl_PointSize *= floor(vig) * 3.;
        gl_PointSize+= noise(pos*1e3+vec2(cos(t),sin(t)))*4.5;
        gl_PointSize *= floor(vig);
        gl_Position.xy += vec2(noise(vec2(pos.x, t*1e-1)), noise(vec2(pos.x+1000., t*1e-1)))*0.25;
                alph*= 1. - noise(pos*5.+vec2(cos(t),sin(t)))*1.;
                alph*= 1. - noise(pos*1.+vec2(cos(t+1e3),sin(t+1e3)))*1.;
        // gl_Position.xy += vec2(noise(vec2(pos.x, t*1e1)), noise(vec2(pos.x+1000., t*1e1)))*0.0625;
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
        gl_FragColor = vec4(1.0, 0.2 - dist_squared, 0.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 1.1)) * 0.045 + alpha)) * 1.25;
        gl_FragColor.rgb = gl_FragColor.rrr * 0.6;
        gl_FragColor.a *= 0.125*0.25;
    }
    // endGLSL
`;
newFlickering.init();



shuffle = function(array) {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}