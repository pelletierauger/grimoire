makeQuad(x1, y1, x2, y2, width, r, g, b, a, roundess, blur);

function resetLines() {
    positions = [];
    colors = [];
    widths = [];
    roundnesses = [];
    blurs = []; 
};
function makeLine(x1, y1, x2, y2, width, r, g, b, a, roundness, blur) {
    for (let i = 0; i < 4; i++) {
        positions.push(x1, y1, x2, y2);
        widths.push(width);
        colors.push(r, g, b, a);
        roundnesses.push(roundness);
        blurs.push(blur);
    }
    let indices = [
        0, 1, 2,
        0, 2, 3
    ];
    for (let i = 0; i < indices.length; i++) {
        indices[i] += rectangles * 4;
    }
};
function createLineBuffers() {
    indicesBuffer = gl.createBuffer();
    vertexIndices = [];
    for (let i = 0; i < 1000000; i++) {
        vertexIndices.push(i);
    }
    vertexIndices = new Float32Array(vertexIndices);

    positionsBuffer = gl.createBuffer();
    widthsBuffer = gl.createBuffer();
    colorsBuffer = gl.createBuffer();
    roundnessesBuffer = gl.createBuffer();
    blursBuffer = gl.createBuffer();
};
function sendDataToBuffers() {
    gl.bindBuffer(gl.ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexIndices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, positionsBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(positions), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, widthsBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(widths), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(colors), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, roundnessesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(roundnesses), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, blursBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(blurs), gl.STATIC_DRAW);
}

function drawLine() {
    sendDataToBuffers();
    gl.useProgram(lineShader);
    /* ======== Associating shaders to buffer objects =======*/
    
        // Get the attribute location
    var vertexID = gl.getAttribLocation(shaderProgram, "vertexID");
    // point an attribute to the currently bound VBO
    gl.vertexAttribPointer(vertexID, 1, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(vertexID);

    // bind the color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    // get the attribute location
    var colors = gl.getAttribLocation(shaderProgram, "colors");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(colors, 4, gl.FLOAT, false, 0, 0);
}



attribute vec2 pos;
uniform 

function makeQuad(r) {
    let vertices = [
        r.v[0][0], r.v[0][1], 0,
        r.v[1][0], r.v[1][1], 0,
        r.v[2][0], r.v[2][1], 0,
        r.v[3][0], r.v[3][1], 0,
    ];
    let indices = [
        0, 1, 2,
        0, 2, 3
    ];
    for (let i = 0; i < indices.length; i++) {
        indices[i] += rectangles * 4;
    }

    let colors = [];
    for (let i = 0; i < 4; i++) {
        colors.push(r.c[0], r.c[1], r.c[2], r.c[3]);
    }
    for (let i = 0; i < 4; i++) {
        colors.push(c.r, c.g, c.b, 0.0);
    }
    rectangles++;
    return {
        colors: colors,
        vertices: vertices,
        indices: indices
    };
}