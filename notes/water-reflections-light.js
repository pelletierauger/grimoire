drawTerminal = function(selectedProgram) {
    num = 0;
    vertices = [];
    colors = [];
    let c = ge.t.canvas.data;
    let cy = ge.t.scroll.y;
    let sc = 0.75;
    for (let i = -5; i < 15; i++) {
        for (let j = 0; j < 109; j++) {
            for (let k = 0; k < 63; k++) {
                if (c[cy+i] && c[cy+i][j] && c[cy+i][j][k]) {
                    let x = j * 7 + (k % 7);
                    let y = i * 9 + Math.floor(k / 7);
                    vertices.push((x / (109*7) * 2 - 1 + 0.1) * sc - 0.05 + (Math.sin(drawCount*2e-3*0)), (-y/(25*9) * 2 * (0.9) + 1 + 0.05) * sc, 11 * sc, 1);
                    num++;
                    colors.push(0.65, 0.65, 0.65);
                }
            }
        }
    }
    for (let i = -5; i < 15; i++) {
        for (let j = 0; j < 109; j++) {
            for (let k = 0; k < 63; k++) {
                if (c[cy+i] && c[cy+i][j] && c[cy+i][j][k]) {
                    let x = j * 7 + (k % 7);
                    let y = i * 9 + Math.floor(k / 7);
                    x += Math.floor(Math.sin(drawCount * 1 + y * 1) * 10 * map(y,0, 110, 2, 0.35) * 0.25);
                    x += Math.floor(Math.sin(drawCount * 0.1 + y * 0.1) * 100 * map(y,0, 110, 2, 0.35) * 0.25);
                    vertices.push((x / (109*7) * 2 - 1 + 0.1) * sc - 0.05 + (Math.sin(drawCount*2e-3*0)), (y/(25*9) * 2 * (0.9) - 1.15 + 0.05) * sc, 11 * sc, 1);
                    num++;
                    colors.push(0.65, 0.65, 0.65);
                }
            }
        }
    }
    // vertices.push(((x * 7 + xx) * 0.00303 - 1.155 + nx) * sc, ((y * 9 + yy) * -0.0095 + 1.062 + ny) * sc, 11 * sc, 1);
                            // num++;
                            // colors.push(0.65, 0.65, 0.65);   
    // logJavaScriptConsole(colors.length);
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    // Unbind the buffer
    gl.uniform1f(time, drawCount);
    gl.uniform1f(disturb, glitchDist);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, termVBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
//  ----
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, dotsCBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    // Get the attribute location
    var cols = gl.getAttribLocation(selectedProgram, "colors");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(cols, 3, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(cols);
// ----------
    var scalar = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform1f(scalar, resolutionScalar);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, num);
    if (vt.recording || vt.playback) {
        vt.recordingFrame++;
    }
    if (vt.playback) {
        vt.play();
    }
}