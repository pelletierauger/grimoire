drawTerminal = function(selectedProgram) {
    // let canH = cnvs.height / resolutionScalar / 2;
    // let hh = (window.innerHeight - canH) * 0.5;
    // let mx = map(mouse.x, 0, document.body.clientWidth, -1, 1);
    // let my = map(mouse.y, hh, canH + hh, 1, -1);
    if (ge.playback) {
        ge.play();
    }
    fmouse[0] = constrain(Math.floor(map(mouse.x, 78, 1190, 0, 108)), 0, 109);
    fmouse[1] = constrain(Math.floor(map(mouse.y, 96, 695, 0, 25)), 0, 24);
    pmouse[0] = constrain(Math.floor(map(mouse.x, 78, 1190, 0, 108 * 7)), 0, 109 * 7);
    pmouse[1] = constrain(Math.floor(map(mouse.y, 96, 695, 0, 25 * 9)), 0, 24 * 9);
    smouse[0] = Math.floor(pmouse[0] % 7);
    smouse[1] = Math.floor(pmouse[1] % 9);
    //scdDisplay();
    // ———————————————————————————————————————————————————————————————
    //  Grimoire drawing algorithm
    // ———————————————————————————————————————————————————————————————
    
    vertices = [];
    let num = 0;
    let colors = [];
    if (ge.brushPositions && mode == 2) {
        for (let i = 0; i < patterns.length; i++) {
            for (let y = 0; y < 18; y++) {
                let r = 7 * 5 - 2;
                 for (let x = i * r; x < r + (i * r); x++) {
                     let p = patterns[i].grid;
                     let pdim = [p[0].length, p.length];
                     let vv = p[y % pdim[1]][(x - i * r) % pdim[0]];
                     let sel = false;
                     let contour = false;
                     if (patterns[i] == ge.activePattern) {
                         sel = (y==0|x==i*r|x==(r+(i*r)-1)|y==17);
                         if (!sel) {
                             contour = (
                                 y==1||
                                 x==i*r+1||
                                 x==i*r+2||
                                 x==(r+(i*r)-2)||
                                 x==(r+(i*r)-3)||
                                 y==16);
                         }
                     }
                     if ((vv || sel) && !contour) {
                         ge.brushPositions[23 * 9 + y][x] = 1;
                     }
                 }
             }
         }
        if (fmouse[1] > 19 + 3) {
            applyPointer();
        }
    }   
// 
    let editorSelection = false;
    let selections = null;
    let oneD = function(x, y) {return x + (y * 109)};
    if (ge.activeTab !== null) {
        let t = ge.activeTab;
            let sel = false;
    for (let i = 0; i < t.carets.length; i++) {
        let c = t.carets[i];
        // console.log(c);
        if (c.sel !== null) {
            sel = true;
        }
    }
    if (sel) {
        // ctt++;
        selections = [];
        for (let y = 0; y < 22 + 3; y++) {
            selections[y] = [];
            for (let x = 0; x < 109; x++) {
                selections[y][x] = 0;
                for (let i = 0; i < ge.activeTab.carets.length; i++) {
                    let c = ge.activeTab.carets[i];
                    if (c.sel !== null) {
                        let oy = ge.activeTab.scroll.y + y;
                        let span = [oneD(c.x, c.y), oneD(c.sel[0], c.sel[1])].sort(function(a, b) {
                            return a - b;
                        });
                        if (oneD(x, oy) >= span[0] && oneD(x, oy) < span[1]) {
                            selections[y][x] = 1;
                        }
                    }
                }
            }
        }
    }
    if (ge.evaluated) {
        if (selections == null) {selections = []};
        for (let y = 0; y < 22 + 3; y++) {
            selections[y] = [];
            for (let x = ge.evaluatedLines[2]; x < 109; x++) {
                let sy = y + ge.activeTab.scroll.y;
                if (sy >= ge.evaluatedLines[0] && sy < ge.evaluatedLines[1]) {
                    if (x == 0 || x < ge.activeTab.data[sy].length) {
                        selections[y][x] = 1;
                    } else {
                        selections[y][x] = 0;
                    }
                } else {
                    selections[y][x] = 0;
                }
            }
        }
        if (ge.evaluated > 0) {ge.evaluated--};
    }
}
//     
    for (let y = 0; y < 22 + 3; y++) {
        for (let x = 0; x < 109; x++) {
            let char;
            let caret = false;
            let selection;
            let blink;
            if (y == 21 + 3 && mode == 0) {
                char = (x >= vt.text.length + 1) ? " " : (">" + vt.text)[x];
                caret = (x == vt.caretPosition + 1);
                let sx0 = vt.selectionBounds[0];
                let sx1 = vt.selectionBounds[1];
                selection = x >= sx0 && x < sx1;
                selection = (vt.enter && x < vt.text.length + 1) ? true : selection;
                blink = (mode == 0);
            } else if (y == 20 + 3 && mode == 0) {
                // char = "-";
                char = (x < swatchesArr.length) ? swatchesArr[x] : " ";
            } else {
                if (ge.activeTab !== null) {
                    let t = ge.activeTab;
                    if (y + t.scroll.y >= t.data.length || x >= t.data[y + t.scroll.y].length) {
                        char = " ";
                    } else {
                        char = t.data[y + t.scroll.y][x];
                    }
                    for (let i = 0; i < t.carets.length; i++) {
                        if ((x + t.scroll.x) == t.carets[i].x && (y + t.scroll.y) == t.carets[i].y) {
                            caret = true;
                            blink = (mode == 1);
                        }
                    }
                } else {
                    char = " ";
                }
            }
            if (mode == 2 && y > 19 + 3) {char = " "; caret = false;};
            let cur = (x == fmouse[0] && y == fmouse[1]);
            // let curP = (x == fmouse[0] && y == fmouse[1]);
            // cur = (mode == 3) ? false : cur;
            let g = (cur && mode !== 2) ? (mode == 1 ? getGlyph("caret") : getGlyph(pchar)) : getGlyph(char);
            if (mode == 0 && x >= fmouse[0] && (x - fmouse[0]) < pchar.length && y == fmouse[1]) {
                char = pchar[x - fmouse[0]];
                g = getGlyph(char);
            }
            if (caret) {
                caret = caret && ((drawCount / 20 % 1 < 0.5) || !blink);
            }
            let paint = false;
            let canvas = null;
            if (ge.activeTab !== null && (y < 20 + 3 || mode == 1)) {
                if (ge.activeTab.canvas !== null) {
                    canvas = ge.activeTab.canvas.data;
                    if (canvas[y + ge.activeTab.scroll.y]) {
                        if (canvas[y + ge.activeTab.scroll.y][x]) {
                            paint = true;
                        }
                    }
                }
            }
            // if (mode == 3 && cur) {
            //     char = " "
            //     // g = getGlyph(char);
            // };
            if (selections !== null && (y < ((mode == 1) ? 22 + 3 : 20 + 3))) {
                selection = (selections[y][x] && x < ge.activeTab.data[y+ge.activeTab.scroll.y].length + 1) ? true : selection;
            }
            let maxloopy = 0;
            if (char !== " " || caret == true || cur || selection || paint || mode == 2) {
                for (let yy = 0; yy < g.length; yy++) {
                    for (let xx = 0; xx < g[yy].length; xx++) {
                        let brush = false;
                        if (ge.brushPositions) {
                            brush = ge.brushPositions[(y * 9) + yy][(x * 7) + xx];
                        }
                        let test = !selection;
                        test = ((xx == 0) && caret) ? !test : test
                        test = (test) ? "1" : "0";
                        let paintTest = (paint) ? canvas[y + ge.activeTab.scroll.y][x][xx + (yy * 7)] : false;
                        // let curPSub = (xx == smouse[0] && yy == smouse[1]);
                        // paintTest = (cur && curPSub && mode == 3) ? true : paintTest;
                        if (g[yy][xx] == test || paintTest || (brush && mode == 2)) {
                            // let tx = 0, ty = 0;
                            let sc = 0.8;
                            // tx = openSimplex.noise3D((x + (xx * 1e-1)) * 0.1, (y + (yy * 1e-1)) * 0.1, drawCount * 0.5e-1) * 0.0;
                            // ty = openSimplex.noise3D((x + (xx * 1e-1)) * 0.1, (y + (yy * 1e-1)) * 0.1, drawCount * 0.5e-1 + 1e4) * 0.0;
                            vertices.push(((x * 7 + xx) * 0.00303 - 1.155 + nx) * sc, ((y * 9 + yy) * -0.0095 + 1.062 + ny) * sc, 11 * sc, 1);
                            num++;
                            colors.push(0.65, 0.65, 0.65);   
                        }
                    }
                }
            }
            // console.log(maxloopy);
        }
    }
    // First idea for visualizing some data
    // for (let x = 0; x < 30; x++) {
    //      for (let y = 0; y < 15; y++) {
    //         let m = Math.sin(x * 1e-1 + y * drawCount * 1e-2);
    //          m += Math.cos(x * y * 0.01);
    //          let tx = -0.86, ty = 0;
    //          if (m < 0.5) {
    //              vertices.push(x * 0.01 * (9 / 16) * 4 + tx, -y * 4 * 0.01 + ty - 0.02, 50.0 * sc * 0.9, 1);
    //                          num++;
    //             colors.push(0, 0, 0);
    //              vertices.push(x * 0.01 * (9 / 16) * 4 + tx, -y * 4 * 0.01 + ty, 50.0 * sc * 0.9, 1);
    //                          num++;
    //             colors.push(0.75, 0.75, 0.75);
    //          }
    //     }
    // }
    if (vt.enter > 0) {vt.enter--};
    // logJavaScriptConsole(colors.length);
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    // Unbind the buffer
    gl.uniform1f(time, drawCount);
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


let roundedSquare = new ShaderProgram("rounded-square");

roundedSquare.vertText = `
    // beginGLSL
    precision mediump float;
    attribute vec4 coordinates;
    attribute vec3 colors;
    uniform float time;
    uniform float resolution;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    varying float size;
    varying vec3 cols;
    varying float t;
    void main(void) {
        gl_Position = vec4(coordinates.x, coordinates.y, 0.0, 1.0);
        // CRT curve
        // gl_Position.x += floor(sin(gl_Position.y * 1e2 + time)) * 0.1
        float disturbance = (floor(sin(gl_Position.y * 5. + time * 0.25 + tan(gl_Position.y * 1e3) * 0.125) * 2.)) * 0.125 * 0.125;
        float fluctuate = floor(mod(time * 1e5, 100.)/50.);
        float distr2 = (floor(sin(gl_Position.y * 1e-7 + time * 0.125 + tan(gl_Position.y * 2. + gl_Position.x * 1e-1) * 0.5) * 0.01)) * 10.1 * fluctuate;
        distr2 *= 0.;
        // gl_Position.x += disturbance * 0.1 * (1. + distr2);
        // gl_Position.x += tan(floor(sin(gl_Position.y * 1e3))) * 0.1;
        // gl_Position.xy *= (1.0 - distance(gl_Position.xy, vec2(0,0)) * 0.1) * 1.05;
        center = vec2(gl_Position.x, gl_Position.y);
        center = 512.0 + center * 512.0;
        myposition = vec2(gl_Position.x, gl_Position.y);
        alph = coordinates.w;
        gl_PointSize = coordinates.z * resolution * 2.;
        size = gl_PointSize;
        cols = colors;
        t = time;
        // gl_PointSize = 25.0 + cos((coordinates.x + coordinates.y) * 4000000.) * 5.;
        // gl_PointSize = coordinates.z / (alph * (sin(myposition.x * myposition.y * 1.) * 3. + 0.5));
    }
    // endGLSL
`;
roundedSquare.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    uniform float resolution;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    varying float size;
    varying vec3 cols;
    varying float t;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float roundedRectangleFlicker (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        // vec2 uv = gl_PointCoord.xy;
        float t2 = mod(t * 0.125, 3.14159 * 2.) * 1.;
        // t = 100. + (t * 1e-4);
        float w = 0.15 + (sin(t2 * 1e-2 * tan(t2 * 2e-2)) + 1.0) * 0.25;
        float d = length(max(abs(uv - pos), size * 0.5) - size * 0.5) * w - radius * 0.01;
        float oscFull = (sin(t2) * 0.5 + 0.5) * 3.75 * 0.;
        float oscScanning = (sin(gl_FragCoord.y * 1e-2 + t2) * 0.5 + 0.5) * 4.;
        return smoothstep(2.99 + oscFull + oscScanning, 0.11, d * 10. / thickness * 5.0 * 0.125 * 1.5);
    }
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos), size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
         // float resolution = 1.0;
         vec2 screenSize = vec2(2560.0, 1440.0) * resolution;
         vec2 uv = gl_PointCoord.xy;
        uv = uv * 2. - 1.;
        float color = roundedRectangleFlicker(uv, vec2(0.0, 0.0), vec2(0.125, 0.35) * 0.5, 0.1, 0.5);
        float rando = rand(uv * t) * 0.1;
        gl_FragColor = vec4(cols, color - rando);
    }
    // endGLSL
`;
roundedSquare.init();

// vString = [];

// makeTerminalString("acacacacab");

glyphs = [
    // a
    [
    "0000000",
    "0000000",
    "0011100",
    "0000010",
    "0011110",
    "0100010",
    "0011101",
    "0000000",
    "0000000",
    ],
    // b
        [
    "0110000",
    "0010000",
    "0010000",
    "0011100",
    "0010010",
    "0010010",
    "0011100",
    "0000000",
    "0000000",
    ],
        // c
        [
    "0000000",
    "0000000",
    "0011100",
    "0100010",
    "0100000",
    "0100010",
    "0011100",
    "0000000",
    "0000000",
    ],
            // d
        [
    "0001100",
    "0000100",
    "0000100",
    "0011100",
    "0100100",
    "0100100",
    "0011010",
    "0000000",
    "0000000",
    ],
            // e
        [
    "0000000",
    "0000000",
    "0011100",
    "0100010",
    "0111110",
    "0100000",
    "0011100",
    "0000000",
    "0000000",
    ],
                // e
        [
    "0100000",
    "0010000",
    "0001000",
    "0000100",
    "0001000",
    "0010000",
    "0100000",
    "0000000",
    "0000000",
    ],
];




getGlyph = function(g) {
    let ch;
    // logJavaScriptConsole(g);
    switch (g) {
        case "a":
        ch = [
            "0000000",
            "0000000",
            "0011100",
            "0000010",
            "0011110",
            "0100010",
            "0011101",
            "0000000",
            "0000000",
        ];
        break;
        case "à":
        ch = [
            "0010000",
            "0001000",
            "0011100",
            "0000010",
            "0011110",
            "0100010",
            "0011101",
            "0000000",
            "0000000",
        ];
        break;
        case "â":
        ch = [
            "0001000",
            "0010100",
            "0011100",
            "0000010",
            "0011110",
            "0100010",
            "0011101",
            "0000000",
            "0000000",
        ];
        ch = [
            "0001000",
            "0010100",
            "0000000",
            "0011110",
            "0100010",
            "0100010",
            "0011101",
            "0000000",
            "0000000",
        ];
        // ch = [
        //     "0001000",
        //     "0010100",
        //     "0000000",
        //     "0011100",
        //     "0000010",
        //     "0111110",
        //     "0011111",
        //     "0000000",
        //     "0000000",
        // ];
        break;
        case "ä":
        ch = [
            "0100010",
            "0000000",
            "0011100",
            "0000010",
            "0011110",
            "0100010",
            "0011101",
            "0000000",
            "0000000",
        ];
        break;
        case "b": 
        ch = [
            "0110000",
            "0010000",
            "0010000",
            "0011100",
            "0010010",
            "0010010",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "c":
            ch = [
            "0000000",
            "0000000",
            "0011100",
            "0100010",
            "0100000",
            "0100010",
            "0011100",
            "0000000",
            "0000000",
            ];
        break;
        case "ç":
            ch = [
            "0000000",
            "0000000",
            "0011100",
            "0100010",
            "0100000",
            "0100010",
            "0011100",
            "0000010",
            "0011100",
            ];
        break;
        case "d":
        ch = [
            "0001100",
            "0000100",
            "0000100",
            "0011100",
            "0100100",
            "0100100",
            "0011010",
            "0000000",
            "0000000",
        ];
        break;
        case "e":
         ch = [
            "0000000",
            "0000000",
            "0011100",
            "0100010",
            "0111110",
            "0100000",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "é":
        ch = [
            "0000100",
            "0001000",
            "0011100",
            "0100010",
            "0111110",
            "0100000",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "è":
        ch = [
            "0010000",
            "0001000",
            "0011100",
            "0100010",
            "0111110",
            "0100000",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "ê":
        ch = [
            "0001000",
            "0010100",
            "0011100",
            "0100010",
            "0111110",
            "0100000",
            "0011100",
            "0000000",
            "0000000",
        ];
        ch = [
            "0001000",
            "0010100",
            "0000000",
            "0011100",
            "0100110",
            "0111000",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "ë":
        ch = [
            "0100010",
            "0000000",
            "0011100",
            "0100010",
            "0111110",
            "0100000",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "f":
        ch = [
            "0001100",
            "0010010",
            "0010000",
            "0111000",
            "0010000",
            "0010000",
            "0111000",
            "0000000",
            "0000000",
        ];
        break;
        case "g":
        ch = [
            "0000000",
            "0000000",
            "0011010",
            "0100100",
            "0100100",
            "0011100",
            "0000100",
            "0100100",
            "0011000",
        ];
        break;
        case "h":
        ch = [
            "0110000",
            "0010000",
            "0010000",
            "0011100",
            "0010010",
            "0010010",
            "0110010",
            "0000000",
            "0000000",
        ];
        break;
        case "i":
        ch = [
            "0000000",
            "0001000",
            "0000000",
            "0011000",
            "0001000",
            "0001000",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "î":
        ch = [
            "0001000",
            "0010100",
            "0000000",
            "0011000",
            "0001000",
            "0001000",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "ï":
        ch = [
            "0000000",
            "0100010",
            "0000000",
            "0011000",
            "0001000",
            "0001000",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "j":
        ch = [
            "0000000",
            "0000100",
            "0000000",
            "0000100",
            "0000100",
            "0000100",
            "0100100",
            "0011000",
            "0000000",
        ];
        break;
        case "k":
        ch = [
            "0010000",
            "0010000",
            "0010010",
            "0010100",
            "0011000",
            "0010100",
            "0010010",
            "0000000",
            "0000000",
        ];
        break;
        case "l":
        ch = [
            "0011000",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "m":
        ch = [
            "0000000",
            "0000000",
            "0110110",
            "0101010",
            "0101010",
            "0100010",
            "0100010",
            "0000000",
            "0000000",
        ];
        break;
        case "n":
        ch = [
            "0000000",
            "0000000",
            "0101100",
            "0010010",
            "0010010",
            "0010010",
            "0010010",
            "0000000",
            "0000000",
        ];
        break;
        case "o":
        ch = [
            "0000000",
            "0000000",
            "0011100",
            "0100010",
            "0100010",
            "0100010",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "ô":
        ch = [
            "0001000",
            "0010100",
            "0000000",
            "0011100",
            "0100010",
            "0100010",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "p":
        ch = [
            "0000000",
            "0000000",
            "0111100",
            "0010010",
            "0010010",
            "0011100",
            "0010000",
            "0111000",
            "0000000",
        ];
        break;
        case "q":
        ch = [
            "0000000",
            "0000000",
            "0011010",
            "0100100",
            "0100100",
            "0011100",
            "0000100",
            "0001110",
            "0000000",
        ];
        break;
        case "r":
        ch = [
            "0000000",
            "0000000",
            "0101100",
            "0010010",
            "0010000",
            "0010000",
            "0111000",
            "0000000",
            "0000000",
        ];
        break;
        case "s":
        ch = [
            "0000000",
            "0000000",
            "0011100",
            "0100000",
            "0011100",
            "0000010",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "t":
        ch = [
            "0010000",
            "0010000",
            "0111000",
            "0010000",
            "0010000",
            "0010010",
            "0001100",
            "0000000",
            "0000000",
        ];
        break;
        case "u":
        ch = [
            "0000000",
            "0000000",
            "0100010",
            "0100010",
            "0100010",
            "0100010",
            "0011101",
            "0000000",
            "0000000",
        ];
        break;
        case "ù":
        ch = [
            "0010000",
            "0001000",
            "0000000",
            "0100010",
            "0100010",
            "0100010",
            "0011101",
            "0000000",
            "0000000",
        ];
        break;
        case "û":
        ch = [
            "0001000",
            "0010100",
            "0000000",
            "0100010",
            "0100010",
            "0100010",
            "0011101",
            "0000000",
            "0000000",
        ];
        break;
        case "ü":
        ch = [
            "0100010",
            "0000000",
            "0100010",
            "0100010",
            "0100010",
            "0100010",
            "0011101",
            "0000000",
            "0000000",
        ];
        break;
        case "v":
        ch = [
            "0000000",
            "0000000",
            "0100010",
            "0100010",
            "0100010",
            "0010100",
            "0001000",
            "0000000",
            "0000000",
        ];
        break;
        case "w":
        ch = [
            "0000000",
            "0000000",
            "0100010",
            "0100010",
            "0101010",
            "0111110",
            "0010100",
            "0000000",
            "0000000",
        ];
        break;
        case "x":
        ch = [
            "0000000",
            "0000000",
            "0100010",
            "0010100",
            "0001000",
            "0010100",
            "0100010",
            "0000000",
            "0000000",
        ];
        break;
        case "y":
        ch = [
            "0000000",
            "0000000",
            "0100010",
            "0100010",
            "0011110",
            "0000010",
            "0000010",
            "0001100",
            "0000000",
        ];
        break;
        case "z":
        ch = [
            "0000000",
            "0000000",
            "0111110",
            "0000100",
            "0001000",
            "0010000",
            "0111110",
            "0000000",
            "0000000",
        ];
        break;
        case "(":
        ch = [
            "0000100",
            "0001000",
            "0010000",
            "0010000",
            "0010000",
            "0001000",
            "0000100",
            "0000000",
            "0000000",
        ];
        break;
        case ")":
        ch = [
            "0010000",
            "0001000",
            "0000100",
            "0000100",
            "0000100",
            "0001000",
            "0010000",
            "0000000",
            "0000000",
        ];
        break;
        case "{":
        ch = [
            "0000110",
            "0001000",
            "0001000",
            "0010000",
            "0001000",
            "0001000",
            "0000110",
            "0000000",
            "0000000",
        ];
        break;
        case "}":
        ch = [
            "0110000",
            "0001000",
            "0001000",
            "0000100",
            "0001000",
            "0001000",
            "0110000",
            "0000000",
            "0000000",
        ];
        break;
        case "[":
        ch = [
            "0011100",
            "0010000",
            "0010000",
            "0010000",
            "0010000",
            "0010000",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "]":
        ch = [
            "0011100",
            "0000100",
            "0000100",
            "0000100",
            "0000100",
            "0000100",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case " ":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "=":
        ch = [
            "0000000",
            "0000000",
            "0111110",
            "0000000",
            "0111110",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "0":
        ch = [
            "0011100",
            "0100010",
            "0100010",
            "0101010",
            "0100010",
            "0100010",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "1":
        ch = [
            "0000100",
            "0001100",
            "0010100",
            "0000100",
            "0000100",
            "0000100",
            "0001110",
            "0000000",
            "0000000",
        ];
        break;
        case "2":
        ch = [
            "0011100",
            "0100010",
            "0000010",
            "0000100",
            "0001000",
            "0010000",
            "0111110",
            "0000000",
            "0000000",
        ];
        break;
        case "3":
        ch = [
            "0011100",
            "0100010",
            "0000010",
            "0001100",
            "0000010",
            "0100010",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "4":
        ch = [
            "0000100",
            "0001100",
            "0010100",
            "0111100",
            "0000100",
            "0000100",
            "0001110",
            "0000000",
            "0000000",
        ];
        break;
        case "5":
        ch = [
            "0111110",
            "0100000",
            "0100000",
            "0111100",
            "0000010",
            "0100010",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "6":
        ch = [
            "0011100",
            "0100000",
            "0100000",
            "0111100",
            "0100010",
            "0100010",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "7":
        ch = [
            "0111110",
            "0100010",
            "0000010",
            "0000100",
            "0001000",
            "0001000",
            "0001000",
            "0000000",
            "0000000",
        ];
        break;
        case "8":
        ch = [
            "0011100",
            "0100010",
            "0100010",
            "0011100",
            "0100010",
            "0100010",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "9":
        ch = [
            "0011100",
            "0100010",
            "0100010",
            "0011110",
            "0000010",
            "0000010",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "A":
        ch = [
            "0001000",
            "0010100",
            "0100010",
            "0100010",
            "0111110",
            "0100010",
            "0100010",
            "0000000",
            "0000000",
        ];
        break;
        case "B":
        ch = [
            "0111100",
            "0100010",
            "0100010",
            "0111100",
            "0100010",
            "0100010",
            "0111100",
            "0000000",
            "0000000",
        ];
        break;
        case "C":
        ch = [
            "0011100",
            "0100010",
            "0100000",
            "0100000",
            "0100000",
            "0100010",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "D":
        ch = [
            "0111100",
            "0100010",
            "0100010",
            "0100010",
            "0100010",
            "0100010",
            "0111100",
            "0000000",
            "0000000",
        ];
        break;
        case "E":
        ch = [
            "0111110",
            "0100000",
            "0100000",
            "0111100",
            "0100000",
            "0100000",
            "0111110",
            "0000000",
            "0000000",
        ];
        break;
        case "F":
        ch = [
            "0111110",
            "0100000",
            "0100000",
            "0111000",
            "0100000",
            "0100000",
            "0100000",
            "0000000",
            "0000000",
        ];
        break;
        case "G":
        ch = [
            "0011100",
            "0100010",
            "0100000",
            "0100110",
            "0100010",
            "0100010",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "H":
        ch = [
            "0100010",
            "0100010",
            "0100010",
            "0111110",
            "0100010",
            "0100010",
            "0100010",
            "0000000",
            "0000000",
        ];
        break;
        case "I":
        ch = [
            "0011100",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "J":
        ch = [
            "0001110",
            "0000100",
            "0000100",
            "0000100",
            "0000100",
            "0100100",
            "0011000",
            "0000000",
            "0000000",
        ];
        break;
        case "K":
        ch = [
            "0100010",
            "0100100",
            "0101000",
            "0110000",
            "0101000",
            "0100100",
            "0100010",
            "0000000",
            "0000000",
        ];
        break;
        case "L":
        ch = [
            "0100000",
            "0100000",
            "0100000",
            "0100000",
            "0100000",
            "0100010",
            "0111110",
            "0000000",
            "0000000",
        ];
        break;
        case "M":
        ch = [
            "0100010",
            "0110110",
            "0101010",
            "0101010",
            "0100010",
            "0100010",
            "0100010",
            "0000000",
            "0000000",
        ];
        break;
        case "N":
        ch = [
            "0100010",
            "0110010",
            "0101010",
            "0100110",
            "0100010",
            "0100010",
            "0100010",
            "0000000",
            "0000000",
        ];
        break;
        case "O":
        ch = [
            "0001000",
            "0010100",
            "0100010",
            "0100010",
            "0100010",
            "0010100",
            "0001000",
            "0000000",
            "0000000",
        ];
        break;
        case "P":
        ch = [
            "0111100",
            "0010010",
            "0010010",
            "0011100",
            "0010000",
            "0010000",
            "0111000",
            "0000000",
            "0000000",
        ];
        break;
        case "Q":
        ch = [
            "0011100",
            "0100010",
            "0100010",
            "0100010",
            "0100010",
            "0101010",
            "0011100",
            "0000110",
            "0000000",
        ];
        break;
        case "R":
        ch = [
            "0111100",
            "0100010",
            "0100010",
            "0111100",
            "0101000",
            "0100100",
            "0100010",
            "0000000",
            "0000000",
        ];
        break;
        case "S":
        ch = [
            "0011100",
            "0100010",
            "0010000",
            "0001000",
            "0000100",
            "0100010",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "T":
        ch = [
            "0111110",
            "0101010",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "U":
        ch = [
            "0100010",
            "0100010",
            "0100010",
            "0100010",
            "0100010",
            "0100010",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "V":
        ch = [
            "0100010",
            "0100010",
            "0100010",
            "0100010",
            "0100010",
            "0010100",
            "0001000",
            "0000000",
            "0000000",
        ];
        break;
        case "W":
        ch = [
            "0100010",
            "0100010",
            "0100010",
            "0100010",
            "0101010",
            "0101010",
            "0010100",
            "0000000",
            "0000000",
        ];
        break;
        case "X":
        ch = [
            "0100010",
            "0100010",
            "0010100",
            "0001000",
            "0010100",
            "0100010",
            "0100010",
            "0000000",
            "0000000",
        ];
        break;
        case "Y":
        ch = [
            "0100010",
            "0100010",
            "0100010",
            "0010100",
            "0001000",
            "0001000",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "Z":
        ch = [
            "0111110",
            "0100010",
            "0000100",
            "0001000",
            "0010000",
            "0100010",
            "0111110",
            "0000000",
            "0000000",
        ];
        break;
        case "'":
        ch = [
            "0000100",
            "0000100",
            "0001000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case '"':
        ch = [
            "0010100",
            "0010100",
            "0101000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case ".":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000010",
            "0000010",
            "0000000",
            "0000000",
        ];
        break;
        case ",":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000110",
            "0000110",
            "0001100",
            "0000000",
        ];
        break;
        case ";":
        ch = [
            "0000000",
            "0000000",
            "0000100",
            "0000000",
            "0000100",
            "0000100",
            "0001000",
            "0000000",
            "0000000",
        ];
        break;
        case ":":
        ch = [
            "0000000",
            "0000000",
            "0000100",
            "0000000",
            "0000000",
            "0000100",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "+":
        ch = [
            "0000000",
            "0000000",
            "0001000",
            "0001000",
            "0111110",
            "0001000",
            "0001000",
            "0000000",
            "0000000",
        ];
        break;
        case "-":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0111110",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "_":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0111110",
            "0000000",
            "0000000",
        ];
        break;
        case "/":
        ch = [
            "0000000",
            "0000000",
            "0000010",
            "0000100",
            "0001000",
            "0010000",
            "0100000",
            "0000000",
            "0000000",
        ];
        break;
            case "\\":
        ch = [
            "0000000",
            "0000000",
            "0100000",
            "0010000",
            "0001000",
            "0000100",
            "0000010",
            "0000000",
            "0000000",
        ];
        break;
        case "*":
        ch = [
            "0000000",
            "0000000",
            "0100100",
            "0011000",
            "0111100",
            "0011000",
            "0100100",
            "0000000",
            "0000000",
        ];
        break;
        case "!":
        ch = [
            "0001000",
            "0011100",
            "0011100",
            "0011100",
            "0001000",
            "0000000",
            "0001000",
            "0000000",
            "0000000",
        ];
        break;
        case "?":
        ch = [
            "0011100",
            "0100010",
            "0000010",
            "0000100",
            "0001000",
            "0000000",
            "0001000",
            "0000000",
            "0000000",
        ];
        break;
        case "#":
        ch = [
            "0010100",
            "0010100",
            "1111111",
            "0010100",
            "1111111",
            "0010100",
            "0010100",
            "0000000",
            "0000000",
        ];
        break;
        case "&":
        ch = [
            "0011000",
            "0100100",
            "0011000",
            "0100110",
            "0100100",
            "0100100",
            "0011010",
            "0000000",
            "0000000",
        ];
        break;
        case "@":
        ch = [
            "0011100",
            "0100010",
            "0101110",
            "0101110",
            "0101100",
            "0100000",
            "0011100",
            "0000000",
            "0000000",
        ];
        break;
        case "%":
        ch = [
            "0110001",
            "1001010",
            "0110100",
            "0001000",
            "0010110",
            "0101001",
            "1000110",
            "0000000",
            "0000000"
        ];
        break;
        case "$":
        ch = [
            "0001000",
            "0011100",
            "0101010",
            "0101000",
            "0011100",
            "0001010",
            "0101010",
            "0011100",
            "0001000",
        ];
        break;
        case "~":
        ch = [
            "0000000",
            "0000000",
            "0100000",
            "0011100",
            "0000010",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case ">":
        ch = [
            "0100000",
            "0010000",
            "0001000",
            "0000100",
            "0001000",
            "0010000",
            "0100000",
            "0000000",
            "0000000",
        ];
        break;
        case "<":
        ch = [
            "0000010",
            "0000100",
            "0001000",
            "0010000",
            "0001000",
            "0000100",
            "0000010",
            "0000000",
            "0000000",
        ];
        break;
        case "`":
        ch = [
            "0010000",
            "0010000",
            "0001000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "░":
        ch = [
            "0001000",
            "0100010",
            "0001000",
            "0100010",
            "0001000",
            "0100010",
            "0001000",
            "0100010",
            "0001000",
        ];
        break;
        case "▒":
        ch = [
            "0101010",
            "1010101",
            "0101010",
            "1010101",
            "0101010",
            "1010101",
            "0101010",
            "1010101",
            "0101010",
        ];
        break;
        case "▓":
        ch = [
            "1101110",
            "0111011",
            "1101110",
            "0111011",
            "1101110",
            "0111011",
            "1101110",
            "0111011",
            "1101110",
        ];
        break;
        case "│":
        ch = [
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
        ];
        break;
        case "┤":
        ch = [
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "1111000",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
        ];
        break;
        case "╡":
        ch = [
            "0001000",
            "0001000",
            "0001000",
            "1111000",
            "0001000",
            "1111000",
            "0001000",
            "0001000",
            "0001000",
        ];
        break;
        case "╢":
        ch = [
            "0001010",
            "0001010",
            "0001010",
            "0001010",
            "1111010",
            "0001010",
            "0001010",
            "0001010",
            "0001010",
        ];
        break;
        case "╖":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "1111110",
            "0001010",
            "0001010",
            "0001010",
            "0001010",
        ];
        break;
        case "╕":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "1111000",
            "0001000",
            "1111000",
            "0001000",
            "0001000",
            "0001000",
        ];
        break;
        case "╣":
        ch = [
            "0001010",
            "0001010",
            "0001010",
            "1111010",
            "0000010",
            "1111010",
            "0001010",
            "0001010",
            "0001010",
        ];
        break;
        case "║":
        ch = [
            "0001010",
            "0001010",
            "0001010",
            "0001010",
            "0001010",
            "0001010",
            "0001010",
            "0001010",
            "0001010",
        ];
        break;
        case "╗":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "1111110",
            "0000010",
            "1111010",
            "0001010",
            "0001010",
            "0001010",
        ];
        break;
        case "╝":
        ch = [
            "0001010",
            "0001010",
            "0001010",
            "1111010",
            "0000010",
            "1111110",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "╜":
        ch = [
            "0001010",
            "0001010",
            "0001010",
            "0001010",
            "1111110",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "╛":
        ch = [
            "0001000",
            "0001000",
            "0001000",
            "1111000",
            "0001000",
            "1111000",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "┐":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "1111000",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
        ];
        break;
        case "└":
        ch = [
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0001111",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "┴":
        ch = [
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "1111111",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "┬":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "1111111",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
        ];
        break;
        case "├":
        ch = [
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0001111",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
        ];
        break;
        case "─":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "1111111",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "┼":
        ch = [
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "1111111",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
        ];
        break;
        case "╞":
        ch = [
            "0001000",
            "0001000",
            "0001000",
            "0001111",
            "0001000",
            "0001111",
            "0001000",
            "0001000",
            "0001000",
        ];
        break;
        case "╟":
        ch = [
            "0001010",
            "0001010",
            "0001010",
            "0001010",
            "0001011",
            "0001010",
            "0001010",
            "0001010",
            "0001010",
        ];
        break;
        case "╚":
        ch = [
            "0001010",
            "0001010",
            "0001010",
            "0001011",
            "0001000",
            "0001111",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "╔":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0001111",
            "0001000",
            "0001011",
            "0001010",
            "0001010",
            "0001010",
        ];
        break;
        case "╩":
        ch = [
            "0001010",
            "0001010",
            "0001010",
            "1111011",
            "0000000",
            "1111111",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "╦":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "1111111",
            "0000000",
            "1111011",
            "0001010",
            "0001010",
            "0001010",
        ];
        break;
        case "╠":
        ch = [
            "0001010",
            "0001010",
            "0001010",
            "0001011",
            "0001000",
            "0001011",
            "0001010",
            "0001010",
            "0001010",
        ];
        break;
        case "═":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "1111111",
            "0000000",
            "1111111",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "╬":
        ch = [
            "0001010",
            "0001010",
            "0001010",
            "1111011",
            "0000000",
            "1111011",
            "0001010",
            "0001010",
            "0001010",
        ];
        break;
        case "╧":
        ch = [
            "0001000",
            "0001000",
            "0001000",
            "1111111",
            "0000000",
            "1111111",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "╨":
        ch = [
            "0001010",
            "0001010",
            "0001010",
            "0001010",
            "1111111",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "╤":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "1111111",
            "0000000",
            "1111111",
            "0001000",
            "0001000",
            "0001000",
        ];
        break;
        case "╥":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "1111111",
            "0001010",
            "0001010",
            "0001010",
            "0001010",
        ];
        break;
        case "╙":
        ch = [
            "0001010",
            "0001010",
            "0001010",
            "0001010",
            "0001111",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "╘":
        ch = [
            "0001000",
            "0001000",
            "0001000",
            "0001111",
            "0001000",
            "0001111",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "╒":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0001111",
            "0001000",
            "0001111",
            "0001000",
            "0001000",
            "0001000",
        ];
        break;
        case "╓":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0001111",
            "0001010",
            "0001010",
            "0001010",
            "0001010",
        ];
        break;
        case "╫":
        ch = [
            "0001010",
            "0001010",
            "0001010",
            "0001010",
            "1111111",
            "0001010",
            "0001010",
            "0001010",
            "0001010",
        ];
        break;
        case "╪":
        ch = [
            "0001000",
            "0001000",
            "0001000",
            "1111111",
            "0001000",
            "1111111",
            "0001000",
            "0001000",
            "0001000",
        ];
        break;
        case "┘":
        ch = [
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "1111000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "┌":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0001111",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
        ];
        break;
        case "█":
        ch = [
            "1111111",
            "1111111",
            "1111111",
            "1111111",
            "1111111",
            "1111111",
            "1111111",
            "1111111",
            "1111111",
        ];
        break;
        case "▄":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "1111111",
            "1111111",
            "1111111",
            "1111111",
            "1111111",
        ];
        break;
        case "▌":
        ch = [
            "1111000",
            "1111000",
            "1111000",
            "1111000",
            "1111000",
            "1111000",
            "1111000",
            "1111000",
            "1111000",
        ];
        break;
        case "▐":
        ch = [
            "0000111",
            "0000111",
            "0000111",
            "0000111",
            "0000111",
            "0000111",
            "0000111",
            "0000111",
            "0000111",
        ];
        break;
        case "▀":
        ch = [
            "1111111",
            "1111111",
            "1111111",
            "1111111",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "•":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0001000",
            "0001000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "◘":
        ch = [
            "1111111",
            "1111111",
            "1111111",
            "1110111",
            "1110111",
            "1111111",
            "1111111",
            "1111111",
            "1111111",
        ];
        break;
        case "☼":
        ch = [
            "0001000",
            "0101010",
            "0010100",
            "0100010",
            "0010100",
            "0101010",
            "0001000",
            "0000000",
            "0000000",
        ];
        break;
        case "►":
        ch = [
            "1000000",
            "1100000",
            "1110000",
            "1111000",
            "1111100",
            "1111000",
            "1110000",
            "1100000",
            "1000000",
        ];
        break;
        case "◄":
        ch = [
            "0000001",
            "0000011",
            "0000111",
            "0001111",
            "0011111",
            "0001111",
            "0000111",
            "0000011",
            "0000001",
        ];
        break;
        case "▲":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0001000",
            "0011100",
            "0111110",
            "1111111",
            "0000000",
            "0000000",
        ];
        break;
        case "▼":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "1111111",
            "0111110",
            "0011100",
            "0001000",
            "0000000",
            "0000000",
        ];
        break;
        case "▬":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "1111111",
            "1111111",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "↑":
        ch = [
            "0001000",
            "0011100",
            "0111110",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0000000",
            "0000000",
        ];
        break;
        case "↓":
        ch = [
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0111110",
            "0011100",
            "0001000",
            "0000000",
            "0000000",
        ];
        break;
        case "↨":
        ch = [
            "0001000",
            "0011100",
            "0111110",
            "0001000",
            "0111110",
            "0011100",
            "0001000",
            "0000000",
            "0000000",
        ];
        break;
        case "→":
        ch = [
            "0000000",
            "0000100",
            "0000110",
            "0111111",
            "0000110",
            "0000100",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "←":
        ch = [
            "0000000",
            "0000100",
            "0001100",
            "0011111",
            "0001100",
            "0000100",
            "0000000",
            "0000000",
            "0000000",
        ];
        break;
        case "caret":
        ch = [
            "0110110",
            "0001000",
            "0001000",
            "0001000",
            "0011100",
            "0001000",
            "0001000",
            "0110110",
            "0000000"
        ];
        break;        
        case "\n":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000"
        ];
        break;
        case "|":
        ch = [
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0001000",
            "0000000"
        ];
        break;
        // U+00A0 : NO-BREAK SPACE [NBSP]
        case " ":
        ch = [
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000",
            "0000000"
        ];
        break;
        default:
        ch = [
            "0000000",
            "0000000",
            "0011100",
            "0000010",
            "0011110",
            "0100010",
            "0011101",
            "0000000",
            "0000000",
        ];
        break;
    }
    return ch;
};





let VirtualTerminal = function() {
    this.text = "";
    this.caretPosition = 0;
    this.selectionBounds = [0, 0];
    this.history = [];
    this.clear();
    this.recording = false;
    this.recordingFrame = 0;
    this.recordingSession = [];
    this.commands = [];
    this.commandID = 0;
    this.modifier = null;
};

VirtualTerminal.prototype.commandDecID = function() {
    if (this.commandID > 0) {
        this.commandID -= 1;
        let newCommand = this.commands[this.commandID];
        this.text = newCommand;
        this.caretPosition = this.text.length;
    }
};

VirtualTerminal.prototype.commandIncID = function() {
    if (this.commandID < this.commands.length - 1) {
        this.commandID += 1;
        let newCommand = this.commands[this.commandID];
        this.text = newCommand;
        this.caretPosition = this.text.length;
    }
};


VirtualTerminal.prototype.logState = function(frame) {
    this.history.push({
        frame: frame,
        text: this.text,
        caretPosition: this.caretPosition,
        selectionBounds: this.selectionBounds
    });
};

VirtualTerminal.prototype.makeTerminalString = function() {
    let s = this.text;
    let a = new Array(9);
    for (let y = 0; y < 9; y++) {
        a[y] = "";
        a[y] = a[y] + getGlyph(">")[y];
        for (let i = 0; i < s.length; i++) {
             a[y] = a[y] + getGlyph(s[i])[y];
        }
    }
    this.stringArray = a;
};

VirtualTerminal.prototype.record = function() {
    this.recordingFrame = 0;
    this.recordingSession = [];
    this.recording = true;
    this.clear();
    let commands = [];
    for (let i = 0; i < this.commands.length; i++) {
        commands.push(this.commands[i]);
    }
    this.recordingInitialState = [
        this.commandID,
        commands
    ];
};

VirtualTerminal.prototype.stopRecord = function() {
    this.recording = false;
};

VirtualTerminal.prototype.startPlayback = function() {
    this.playback = true;
    this.recordingFrame = 0;
    this.clear();
    this.commands = [];
    for (let i = 0; i < this.recordingInitialState[1].length; i++) {
        this.commands.push(this.recordingInitialState[1][i]);
    }
    this.commandID = this.recordingInitialState[0];
};

VirtualTerminal.prototype.stopPlayback = function() {
    this.playback = false;
    this.recordingFrame = 0;
};

VirtualTerminal.prototype.saveSession = function(name) {
    let bundle = [];
    for (let i = 0; i < this.recordingSession.length; i++) {
        let e = this.recordingSession[i];
        let item = [
            e[0], e[1].key, e[1].shiftKey, e[1].metaKey
        ];
        bundle.push(item);
    }
    let file = {
        name: name + ".json", 
        path: "/Users/guillaumepelletier/Desktop/Dropbox/Art/p5/Les-nouvelles-galaxies/Vert/sessions/" + name + ".json",
        data: JSON.stringify([
            this.recordingInitialState[0],
            this.recordingInitialState[1],
            bundle
        ])
    };
    socket.emit('saveFile', file);
};

VirtualTerminal.prototype.loadSession = function(s) {
    this.recordingSession = [];
    let commands = [];
    for (let i = 0; i < s[1].length; i++) {
        commands.push(s[1][i]);
    }
    this.recordingInitialState = [
        s[0],
        commands
    ];
    for (let i = 0; i < s[2].length; i++) {
        let e = s[2][i];
        this.recordingSession.push([
            e[0],
            {
                key: e[1],
                shiftKey: e[2],
                metaKey: e[3]
            }
        ]);
    }
};


VirtualTerminal.prototype.play = function() {
    // ljs("Playing!");
    for (let i = 0; i < this.recordingSession.length; i++) {
        let e = this.recordingSession[i];
        if (this.recordingFrame == e[0]) {
            // ljs("Caught one!");
            this.update(e[1]);
        }
    }
    let l = this.recordingSession.length - 1;
    let last = this.recordingSession[l][0];
    if (this.recordingFrame > last) {
        this.stopPlayback();
    };
};


VirtualTerminal.prototype.update = function(e) {
    if (this.recording) {
        this.recordingSession.push([this.recordingFrame, e]);
    }
    let s = e.key;
    // console.log(e);
    let c = this.caretPosition;
    let sel = this.selectionBounds[1] - this.selectionBounds[0] !== 0;
    if (s == "Backspace") {
        if (this.text.length && (this.caretPosition || sel)) {
          // this.text = this.text.slice(0, -1);
          if (sel) {
              this.text = this.text.slice(0, this.selectionBounds[0] - 1) + this.text.slice(this.selectionBounds[1] - 1);
              this.caretPosition = this.selectionBounds[0] - 1;
              this.selectionBounds = [0, 0];
          } else {
              this.text = this.text.slice(0, c - 1) + this.text.slice(c);
              this.caretPosition--;
          }
        }
    } else if ((s == "ArrowLeft") && (e.shiftKey) && (c > 0)) {
        if (this.selectionBounds[1] - this.selectionBounds[0] == 0) {
            this.caretPosition--;
            this.selectionBounds[0] = this.caretPosition + 1;
            this.selectionBounds[1] = this.caretPosition + 2;
            this.selDir = 0;
        } else if (sel){
            if (this.selDir == 0) {
                this.caretPosition--;
                this.selectionBounds[0] = this.caretPosition + 1;
            } else {
                this.caretPosition--;
                this.selectionBounds[1] = this.caretPosition + 1;
            }
        }
    } else if ((s == "ArrowLeft") && (e.shiftKey) && (c == 0)) {
        
    } else if ((s == "ArrowLeft") && (c > 0 || sel)) {
        if (sel) {
            this.caretPosition = this.selectionBounds[0] - 1;
        } else {
            this.caretPosition--;
        }
        this.selectionBounds = [0, 0];
    } else if ((s == "ArrowRight") && (c < this.text.length) && (e.shiftKey)) {
        // logJavaScriptConsole(this.selectionBounds[1]);
        if (this.selectionBounds[1] - this.selectionBounds[0] == 0) {
            this.caretPosition++;
            this.selectionBounds[1] = this.caretPosition + 1;
            this.selectionBounds[0] = this.caretPosition;
            this.selDir = 1;
        } else if (sel){
            if (this.selDir == 1) {
                this.caretPosition++;
                this.selectionBounds[1] = this.caretPosition + 1;
            } else {
                this.caretPosition++;
                this.selectionBounds[0] = this.caretPosition + 1;
            }
        }
    } else if ((s == "ArrowRight") && (e.shiftKey) && (c == this.text.length)) {
        
    } else if ((s == "ArrowRight") && (c < this.text.length)) {
        if (sel) {
            this.caretPosition = this.selectionBounds[1] - 1;
        } else {
            this.caretPosition++;
        }
        this.selectionBounds = [0, 0];
    } else if ((s == "ArrowRight") && sel) {
        this.selectionBounds = [0, 0];
    } else if ((s == "a" || s == "A") && (e.metaKey)) {
        this.selectionBounds = [1, this.text.length + 1];
        // logJavaScriptConsole("aaaaert");
        this.caretPosition = this.text.length;
    } else if (s == "ArrowUp") {
        this.commandDecID();
    } else if (s == "ArrowDown") {
        this.commandIncID();
    } else if (s.length == 1 && !e.metaKey) {
        // console.log("WHat?????");
        if (this.modifier == "circ") {
            if (s == "a") {s = "â"};
            if (s == "e") {s = "ê"};
            if (s == "i") {s = "î"};
            if (s == "o") {s = "ô"};
            if (s == "u") {s = "û"};
            this.modifier = null;
        }
        if (this.modifier == "trema") {
            if (s == "a") {s = "ä"};
            if (s == "e") {s = "ë"};
            if (s == "i") {s = "ï"};
            if (s == "o") {s = "ö"};
            if (s == "u") {s = "ü"};
            this.modifier = null;
        }
        if (sel) {
              this.text = this.text.slice(0, this.selectionBounds[0] - 1) + s + this.text.slice(this.selectionBounds[1] - 1);
              this.caretPosition = this.selectionBounds[0];
              this.selectionBounds = [0, 0];
          } else {
              this.text = this.text.slice(0, c) + s + this.text.slice(c);
        // this.text += s;
              this.caretPosition++;
          }
    } else if (s == "Dead" && e.code == "BracketLeft") {
        this.modifier = (e.shiftKey) ? "trema" : "circ";
    } else if (s == "Enter") {
        if (this.text !== this.commands[this.commands.length - 1]) {
            this.commands.push(this.text);
            this.commandID = this.commands.length - 1;
        }
        this.enter = 5;
        var scTest = /(^s\s|^l\s)([\s\S]*)/;
        var scMatch = scTest.exec(this.text);
        if (scMatch) {
            socket.emit('interpretSuperCollider', scMatch[2], "./");
        } else {
            eval(this.text);
        }
    }
    this.makeTerminalString();
};

VirtualTerminal.prototype.add = function(t) {
    this.commands.push(t);
    this.commandID = this.commands.length - 1;
    this.text = t;
    this.makeTerminalString();
};


VirtualTerminal.prototype.clear = function(s) {
    this.caretPosition = 0;
    this.text = "";
    this.selectionBounds = [0, 0];
    this.makeTerminalString();
    this.selDir = 0;
};


let vt = new VirtualTerminal();
// vt.stringArray = [];
let vtActive = true;


let TerminalRecorder = function() {
    this.reset();
};

TerminalRecorder.prototype.reset = function() {
    this.recording = false;
    this.frameCount = 0;
    this.session = [];
};


TerminalRecorder.prototype.record = function() {
    this.reset();
    this.recording = true;
    let that = this;
    keyDown = function() {
        if (keysActive) {
            if (vtActive) {
                vt.update(event);
                that.log(event);
                // ljs(event.keyCode);
            }
        }
    }
    document.onkeydown = keyDown;
};


TerminalRecorder.prototype.log = function() {
  this.session.push([this.frameCount])
};

TerminalRecorder.prototype.stop = function() {
    this.recording = false;
    keyDown = function() {
        if (keysActive) {
            if (vtActive) {
                vt.update(event);
                // ljs(event.keyCode);
            }
        }
    }
    document.onkeydown = keyDown;
};




let vt2 = new VirtualTerminal();
vt2.text = "Douze lunes                       Twelve Moons"
vt2.makeTerminalString();

let vt3 = new VirtualTerminal();
vt3.text = "en déphasage graduel                        in gradual phase shifting";
vt3.makeTerminalString();



let vt4 = new VirtualTerminal();
vt4.text = "my therapist peeling off layers of dead bark";
vt4.makeTerminalString();


vt.text = "";
vt.makeTerminalString();

if (false) {


ansi = `
☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼!"#$%&
'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRS
TUVWXYZ[\]^_abcdefghijklmnopqrstuvwxyz{|}
~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐
└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ `;

palette = [[0.001, 0.25, 0.4], [0.001, 0.25, 0.4], [0.001, 0.25, 0.4]]
drawing = [
    "12345.....12345.....12345.....12345.....12345.....12345.....12345.....12345.....12345.",
    "12345.....12345.....12345.....12345.....12345.....12345.....12345.....12345.....12345.",
    "12345.....12345.....12345.....12345.....12345.....12345.....12345.....12345.....12345."
];

files["js"][0].data.replace(/(ansi = `)([^`]*)(`)/g, function(a, b, c, d, e) {
//   console.log(c); return c;
// logJavaScriptConsole(a);
//     return
    let response = b + "newText" + d;
    console.log(c);
});


}

mouse = {x: 0, y: 0};

movemouse = function(e) {
    if (ge.recording) {
        ge.recordingSession.push([drawCount, {
            name: "mousemove",
            altKey: e.altKey,
            metaKey: e.metaKey,
            shiftKey: e.shiftKey,
            clientX: e.clientX,
            clientY: e.clientY
        }]);
    }
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (mode == 2 && ge.activeTab !== null) {
        resetBrushPositions();
        if (e.altKey) {
            let val = (e.shiftKey) ? 0 : 1;
            paint(val);
        }
    }
};

window.addEventListener('mousemove', movemouse);


face = [
    "aaaaaabbbbbbb..........................................................................",
    "aaaaaabbbbbbb..........................................................................",
    "aaaaaabbbbbbb..........................................................................",
    ".......................................................................................",
    ".......................................................................................",
    ".......................................................................................",
    ".......................................................................................",
    ".......................................................................................",
    ".......................................................................................",
    ".......................................................................................",
    ".......................................................................................",
    ".......................................................................................",
    ".......................................................................................",
    ".......................................................................................",
    ".......................................................................................",
    ".......................................................................................",
    ".......................................................................................",
    "......................................................................................."
];

pchar = "↨";

// mouseClicked = function(e) {
    // editing
downmouse = function(e) {
    if (ge.recording) {
        ge.recordingSession.push([drawCount, {
            name: "downmouse",
            altKey: e.altKey,
            metaKey: e.metaKey,
            shiftKey: e.shiftKey
        }]);
    }
    // console.log(e);
    if (mode == 1) {
        let t = ge.activeTab;
        if (grimoire && fmouse[1] < 25) {
            let caret = false;
            let caretAt;
            for (let i = 0; i < t.carets.length; i++) {
                let c = t.carets[i];
                if (c.x == fmouse[0] && c.y == fmouse[1] + t.scroll.y) {
                    caret = true;
                    caretAt = i;
                }
            }
            if (caret && e.metaKey) {
                t.carets.splice(caretAt, 1)
            } else if (!caret) {
                if (!e.metaKey) {
                    t.carets = [];
                }
                let x = Math.min(t.data[fmouse[1] + t.scroll.y].length, fmouse[0]);
                t.carets.push({x: x, y: fmouse[1] + t.scroll.y, dir: 0, curXRef: 0, sel: null});
            }
        }
    }
    //  drawing
    if (mode == 0) {
        let t = ge.activeTab;
        if (t !== null) {
            if (!e.shiftKey) {
                if (grimoire && fmouse[1] < 23) {
                    let y = t.data[fmouse[1] + t.scroll.y];
                    let add = pchar;
                    if (y.length < fmouse[0]) {
                        let n = fmouse[0] - y.length;
                        for (let i = 0; i < n; i++) {add = " " + add};
                    }
                    if (!t.attachedHeadState) {
                        t.history.length = t.historyIndex;
                        t.historyIndex = t.history.length;
                        t.attachedHeadState = true;
                    }
                    let updateDate = new Date();
                    if (t.lastEdited == null) {
                            t.logHistory(t.prepareHistoryState());
                            t.historyIndex++;
                            t.lastEdited = updateDate;
                            t.headState = t.prepareHistoryState();
                    } else {
                        let editDelta = updateDate.getTime() - t.lastEdited.getTime();
                        if (editDelta > 3000 && t.data[fmouse[1]][fmouse[0]] !== pchar) {
                            t.logHistory(t.prepareHistoryState());
                            t.historyIndex++;
                            t.lastEdited = updateDate;
                            t.headState = t.prepareHistoryState();
                        }
                    }
                    t.data[fmouse[1] + t.scroll.y] = y.substring(0, fmouse[0]) + add + y.substr(fmouse[0] + pchar.length);
                } else if (fmouse[1] == 23) {
                    pchar = swatchesArr[fmouse[0]];
                }
            } else {
                // console.log(face[fmouse[1]][fmouse[0]]);
                // console.log(swatchesArr[fmouse[0]]);
                let newChar;
                if (fmouse[1] == 23) {
                    newChar = swatchesArr[fmouse[0]];
                } else if (fmouse[1] == 24) {
                    if (fmouse[0] < vt.text.length + 2) {
                        newChar = vt.text[fmouse[0] - 2];
                    } else {
                        newChar = " ";
                    }
                } else {
                    if (fmouse[0] > t.data[fmouse[1] + t.scroll.y].length) {
                        newChar = " ";
                    } else {
                        newChar = t.data[fmouse[1] + t.scroll.y][fmouse[0]];
                    }
                }
                pchar = newChar;
            }
        }
        if (e.altKey) {
            if (fmouse[1] == 23) {
                vt.update({key: swatchesArr[fmouse[0]]});
            }
        }
    }
    if (mode == 2) {
        if (fmouse[1] >= 23) {
            // ge.activePattern = patterns[Math.floor(fmouse[0] / 5)]; 
            ge.activePattern = patterns[Math.floor(pmouse[0] / (7*5-2))]; 
            resetBrushPositions();
        }
        else {
            let val = (e.shiftKey) ? 0 : 1;
            // paint(fmouse[0], fmouse[1], smouse[0], smouse[1], val);
            paint(val);
            
        }
    }
};
window.addEventListener('mousedown', downmouse);

mouseDragged = function(e) {
   if (ge.recording) {
        ge.recordingSession.push([drawCount, {
            name: "dragmouse",
            altKey: e.altKey,
            metaKey: e.metaKey,
            shiftKey: e.shiftKey
        }]);
    }
    if (mode == 0) {
        if (grimoire && fmouse[1] < 23) {
            let t = ge.activeTab;
            if (t !== null) {
                let y = t.data[fmouse[1] + t.scroll.y];
                let add = pchar;
                if (y.length < fmouse[0]) {
                    let n = fmouse[0] - y.length;
                    for (let i = 0; i < n; i++) {add = " " + add};
                }
                    if (!t.attachedHeadState) {
                        t.history.length = t.historyIndex;
                        t.historyIndex = t.history.length;
                        t.attachedHeadState = true;
                    }
                    let updateDate = new Date();
                    if (t.lastEdited == null) {
                            t.logHistory(t.prepareHistoryState());
                            t.historyIndex++;
                            t.lastEdited = updateDate;
                            t.headState = t.prepareHistoryState();
                    } else {
                        let editDelta = updateDate.getTime() - t.lastEdited.getTime();
                        if (editDelta > 3000 && t.data[fmouse[1]][fmouse[0]] !== pchar) {
                            t.logHistory(t.prepareHistoryState());
                            t.historyIndex++;
                            t.lastEdited = updateDate;
                            t.headState = t.prepareHistoryState();
                        }
                    }
                    t.data[fmouse[1] + t.scroll.y] = y.substring(0, fmouse[0]) + add + y.substr(fmouse[0] + pchar.length);
            }
        }
    }
    if (mode == 2 && fmouse[1] < 23) {
        let val = (e.shiftKey) ? 0 : 1;
        // paint(fmouse[0], fmouse[1], smouse[0], smouse[1], val);
        paint(val);
    }
    if (mode == 1) {
        let t = ge.activeTab;
        if (fmouse[1] == 24 && (drawCount % 2 == 0)) {
            t.moveCaretsY(1, true);
        } else if (fmouse[1] == 0 && (drawCount % 2 == 0)) {
            t.moveCaretsY(-1, true);
        }
        if (t.carets[0].sel == null) {
            t.carets[0].sel = [t.carets[0].x, t.carets[0].y];
        }
        // t.carets = [];
        let x = Math.min(t.data[fmouse[1] + t.scroll.y].length, fmouse[0]);
        t.carets[0].x = x;
        t.carets[0].y = fmouse[1] + t.scroll.y;
            // .push({x: x, y: fmouse[1] + t.scroll.y, dir: 0, curXRef: 0, sel: [x, fmouse[1] + t.scroll.y]});
    }
};


paint = function() {
    let c = ge.activeTab.canvas.data;
    let y = fmouse[1] + ge.activeTab.scroll.y;
    let xy = smouse[0] + (smouse[1] * 7);
    if (c[y]) {
        if (c[y][fmouse[0]]) {
            c[y][fmouse[0]][xy] = 1;
        } else {
            c[y][fmouse[0]] = [];
            c[y][fmouse[0]][xy] = 1;
        }
    } else {
        c[y] = [];
        c[y][fmouse[0]] = [];
        c[y][fmouse[0]][xy] = 1;
    }
}



paintUnit = function(fx, fy, sx, sy, val = 1) {
    let c = ge.activeTab.canvas.data;
    let y = fy + ge.activeTab.scroll.y;
    let xy = sx + (sy * 7);
    if (c[y]) {
        if (c[y][fx]) {
            c[y][fx][xy] = val;
        } else {
            c[y][fx] = [];
            c[y][fx][xy] = val;
        }
    } else {
        c[y] = [];
        c[y][fx] = [];
        c[y][fx][xy] = val;
    }
}


paint = function(val = 1) {
    for (let y = 0; y < ge.brushPositions.length - (2 * 9); y++) {
        for (let x = 0; x < ge.brushPositions[y].length; x++) {
            let r = (brushRandom) ? Math.round(Math.random()) : true;
            if (ge.brushPositions[y][x] && r) {
                let rand = Math.round(Math.random() - Math.random());
                let pattern = ge.activePattern.grid;
                let pdim = [pattern[0].length, pattern.length];
                let vv = pattern[Math.floor(((ge.activeTab.scroll.y * 9 ) + y) * patternScale) % pdim[1]][Math.floor(x * patternScale) % pdim[0]];
                if (val == 0) {vv = 1 - vv};
                paintUnit(Math.floor(x/7),Math.floor(y/9), x%7,y%9, vv);
            }
        }
    }
}

typeIndex = 0;
brushIndex = 0;
quill = [];
pebble = [];
nib = [];
spray = [];
types = [quill, pebble, nib, spray];
brushRandom = false;


brushes = [];

let Brush = function(o) {
    this.anchor = o.anchor;
    this.data = o.data;
    this.type = o.type;
    this.type.push(this);
}

Brush.prototype.skew = function(offset = 32, rate = 0.5) {
    for (let i = offset, fi = 0; i > 0, fi < this.data.length; i -= rate, fi++) {
       for (let j = 0; j < i; j++) {
           this.data[fi].unshift(0);
       }
    }
}

Brush.prototype.skew2 = function(offset = 32, rate = 0.5, ratedif = 0) {
    for (let i = offset, fi = 0; i > 0, fi < this.data.length; i -= rate, fi++) {
       for (let j = 0; j < i; j++) {
           this.data[fi].unshift(0);
       }
        rate = rate + ratedif;
    }
}

patterns = [];

let Pattern = function(name) {
    this.name = name;
    patterns.push(this);
}


pattern = [
  [1, 0],
  [0, 1]
];


polka2 = new Pattern("polka2");
polka2.grid = [
  [1, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 0]
];

polka15 = new Pattern("polka15");
polka15.grid = [
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0]
];

polka12 = new Pattern("polka12");

polka12.grid = [
  [1, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 0]
];

polka25 = new Pattern("polka25");
polka25.grid = [
  [1, 0],
  [0, 1]
];


polka2b = new Pattern("polka2b");

polka2b.grid = [
  [1, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 1, 0, 0, 0, 1, 0],
  [1, 1, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 0, 1, 0, 1, 0],
  [1, 0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 0, 1, 0, 1, 0]
];


pattern = [
  [1, 0, 0, 1, 0, 0],
  [1, 0, 0, 1, 0, 0]
];

pattern = [
  [1, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 0, 0, 1, 0, 0, 0]
];

polka1 = new Pattern("polka1");
polka1.grid = [
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

polka0 = new Pattern("polka0");
polka0.grid = [
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

polka3 = new Pattern("polka3");

polka3.grid = [
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1]
];
for (let y=0;y<polka3.grid.length;y++){
    for (let x=0;x<polka3.grid[y].length;x++){
        // polka3.grid[y][x] = 1 -polka3.grid[y][x]; 
    }
}



pattern = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

pattern = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0]
];


horizontal0 = new Pattern("horizontal-0");

horizontal0.grid = [
  [1],
  [0]
];



horizontal1 = new Pattern("horizontal-1");
horizontal1.grid = [
  [1],
  [0],
  [0],
  [0]
];




vertical0 = new Pattern("vertical-0");
vertical0.grid = [
  [1, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0]
];

vertical1 = new Pattern("vertical-1");

vertical1.grid = [
  [1, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 0, 0, 1, 0, 0, 0]
];



diagonal0 = new Pattern("diagonal-0");

diagonal0.grid = [
  [1, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 1]
];


diagonal1 = new Pattern("diagonal-1");

diagonal1.grid = [
  [1, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 1]
];

fence0 = new Pattern("fence0");

fence0.grid = [
  [0, 0, 0, 0, 1, 0,  0,  0,  0,  0,  0, 0,  0,  0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0,  0,  1,  1,  1,  1, 1,  0,  0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0,  1,  1,  1,  1,  1,  1,  1,  0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 1,  1,  1,  1,  1,  1, 1,  1,  1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0, 0,  1,  1,  1,  1,  1, 1,  1,  0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0,  0,  1,  1,  1,  1, 1,  0,  0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0,  0,  0,  0,  0,  0, 0,  0,  0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1,  1,  1,  1,  1,  1, 1,  1,  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

fence1 = new Pattern("fence1");

fence1.grid = [
  [1, 0, 0, 0, 1, 0,  0,  0,  0,  0,  0, 0,  0,  0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0,  0,  1,  1,  1,  1, 1,  0,  0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0, 0,  1,  0,  0,  0,  0, 0,  1,  0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 1,  0,  0,  0,  0,  0, 0,  0,  1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0, 0,  1,  0,  0,  0,  0, 0,  1,  0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0,  0,  1,  1,  1,  1, 1,  0,  0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0,  0,  0,  0,  0,  0, 0,  0,  0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 1,  1,  1,  1,  1,  1, 1,  1,  1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
];


fence2 = new Pattern("fence2");

fence2.grid = [
  [1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0],
  [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1],
  [0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1]
];

pattern = fence2.grid;

fence3 = new Pattern("fence3");

fence3.grid = [
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
  [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0],
];

fence3.grid = [
  [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
  [1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1]
];

fence3.grid = [
  [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
  [1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1]
];

fence3.grid = [
  [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
  [1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
  [0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1]
];
pattern = fence3.grid;



haloEyeMod = new Pattern("haloEyeMod");

haloEyeMod.grid = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];



// Original Dr Halo eye
haloEyeMod.grid = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0],
  [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];



haloEyeMod.grid = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

haloEyeMod2 = new Pattern("haloEyeMod-2");
haloEyeMod2.grid = [
[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
[ 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ],
[ 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0 ],
[ 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0 ],
[ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
[ 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0 ],
[ 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
[ 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0 ],
[ 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0 ],
[ 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0 ],
[ 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0 ],
[ 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0 ],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
]


haloEyeMod2.grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

fence4 = new Pattern("fence4");

fence4.grid = [
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
  [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1]
];


fence5 = new Pattern("fence5");

fence5.grid = [
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
  [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1]
];
for (let y=0;y<fence5.grid.length;y++){
    for (let x=0;x<fence5.grid[y].length;x++){
        // fence5.grid[y][x] = 1 - fence5.grid[y][x]; 
    }
}

full = new Pattern("full");
full.grid = [[1]];

// polka25

patterns = [
    polka0, polka1, polka12, polka15, polka2, full, 
    horizontal1, horizontal0,
    vertical0, vertical1,
    diagonal0, diagonal1, 
    haloEyeMod, haloEyeMod2, fence1, fence0, fence2, fence3,
    fence4, fence5, polka2b
];

visage = [
    "aaaaaabababab...a....a...a..a.a.aaa..a...aa...aa.a.aaaaaaaaaa.a....a..a▓.a.aa.aa.aaa...",
    "aaaaaabbbbbbb..............░.░░.░░░░░░░░░.a..aa............░░░░░░░a░░.a.▓▓a.a..a.a.a...",
    "aaaaaabbbbbbb......▒...░░░░░░░░░░░░░░░░░░░░░░░.a..].].]]]░░░░░░░░░░░░.░.░▓▒▓..... .....",
    "a...................a..░░░░░░░░a░░▓ ..░░░░░░░░a░aaa.░░░░░░░░.░.a░░a░.▓░░░░▓▓   .    ...",
    "a........▓.......░░░░░░░░░░                ░░░░░░░░░░.░░░..      .  . . ▓▓▓▓      ▒ ▒..",
    "....a....▓....a░.░░░░░░░░ a       ░░░░░     ░  ]]░░░░░░         ▓▓▓▓     ░░▓      ▒ ▒..",
    "..............▓..░░░░░░▓  a   ▓░░░░░░░░░░░      ]]░aa.      ▓▓▓▓▓   ▓▓   ░░▓       ▒▓▒.",
    "..........▓.░.░.░░░░░░.....   ▓▓▓░  ░  ░▓▓ .     ]]░░aa     ░░░▓    ▓/   ░░▓       ▒▒▒.",
    "...........░░░░░░░░░░░....a     ▓▓▓▓▓▓▓▓▓         ]▓aa.a .    ░░▓▓▓▓▓   ░░░▓      ▒▓▒▓.",
    "....].a..▓..░.░░.░░░░░░░░a.           ..     ░░    /░▓a.aa.  . . .     ░░▓▓/     .▒▒▒▓.",
    ".....▓▓▓▓▓...░░░░░░░░░░░░░...  . .         ░░░░     /▓▓.░░░░░░░░.░░░░░░░▓▓/     ...▓▓..",
    "aa▓..a.▓.▓.....░░░░░░░░░░░..a.   ...   ░░░░░░░aa        ▓▓a░░░░░░░░░░░░░▓▓     a...▒...",
    "a..░aa░▓.▓..▓..░░░░░░.░..░░.a▓▓. . ░░░░░░░░▓  ▓▓▓▓▓▓▓ ▓▓▓▓▓▓.░░░░░]░░░a▓/     .........",
    "...].▓aa.▓...].]░░░░░░░░░....]a].]....                    .........]..▓▓/    ..........",
    ".....▓.░.▓....]].░░.░░░░░░░.░▓....▓▓▓.▓▓...  ......................].]▓/    ......▒....",
    "......a..▓.........░░.░░░░░░.░░░░░░▓░...V  V  V   V   V   V ..V.a.▓a▓/    .............",
    "]......▓.▓...........░░░░░░░░░░.░.░..░░..░   ....................▓▓▓/  ................",
    ".....................▓▓░░░░▓░░.▓░░.▓░░░░.░.░.░.░...▓▓▓▓▓▓▓▓▓▓▓▓▓▓/....................."
];



arbre0 = [
    "                    ▓▓▓▓    .▓▓..   ..▓▓0.     .▓▓0/  .▓▓.   .▓▓▓.0..       .▓▓▓▓.     ",
    "                   ▓▓▓0.  ..▓▓00     .▓▓▓.    ▓▓00    ▓▓.   ..▓▓000..     ..▓▓000...▓▓▓",
    "                  .▓▓▓0.  .▓▓0       ..▓▓▓0.▓▓▓00    .▓0.  ..▓▓00...▓▓▓▓▓▓▓▓0▓▓▓▓▓▓▓▓▓0",
    "... .              .▓▓0....▓00        ..▓▓▓00       .▓00. .▓▓00/.▓▓▓00000.0000.0.0000. ",
    ".                   ..▓▓▓00.00         .▓▓▓00   . .▓▓0    ▓▓00/..▓000    .▓▓0/ .       ",
    ".... . .              ..▓▓▓▓000.        .▓000/ ▓▓▓▓.00...▓00/ . ▓▓0/    ▓▓▓00/         ",
    "..     .                   ▓▓▓00        _▓0000 00000    ▓000/   ▓▓ .▓▓▓▓▓000//       . ",
    "..                            ▓000   .    ▓0000       ▓▓00/    ▓▓0 ▓▓0.0.0/           .",
    ".......                        ▓▓0000     ▓▓0/      _▓▓0000 0 000000 .0            . ..",
    "........__._                  . ▓▓▓0000  ▓▓▓0/. .. .▓.00/    . ▓▓0/.                ___",
    "         .._____     _      .     ▓▓▓▓00▓▓▓00//  ▓▓▓000/     ▓▓▓00            . .......",
    "......We drown in the endless night ▓▓▓▓▓▓▓▓000▓▓▓▓000/ ▓▓▓▓▓▓▓00            .____.....",
    "..........__..__._._               . ..▓▓▓▓▓▓▓000▓▓000.0.0.00.    ._    . _.______.....",
    "............__We drown in the endless night▓▓▓▓00000/        . ._ _    _ _____.........",
    "......       _._.___       __/        /.▓▓▓▓▓▓▓▓000   _   _ _ .      ._................",
    ".We drown in the endless night_____ _..▓▓▓▓▓▓▓▓000  .    ____._.._ _...................",
    "...................             ......▓▓▓▓▓▓▓▓▓00.         .  ............__.____.____.",
    ".......        ......................▓▓▓▓▓▓▓▓0000.  . .   .  .........................."
];




arbre1 = [
    "         !          ▓▓▓░0O  .▓▓░░0O   ▓▓░00O   ▓▓░░O   ▓▓░0O   ▓▓░░OO........▓▓▓▓░OO   ",
    "        !          ▓▓▓░░O  .▓▓░0O...  ▓▓▓░00  ▓▓░0O   ▓▓░00   ▓▓▓░0O      ▓▓▓▓░00O  ▓▓▓",
    "  !      !!        ▓▓▓░░O .▓▓░aa       ▓▓▓▓▓▓▓▓░OO   ▓▓░00   ▓▓░░00 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓0",
    ".!!    .!!!.   !    ▓▓▓░░▓▓▓░00  .......▓▓▓▓░00O    ▓▓░00  ▓▓▓░0O  ▓▓░░0O ▓▓▓░░000000  ",
    ".;!    ...!    .!     ▓▓▓▓░░░000     ....▓░░00     ▓▓000  ▓▓░000  ▓▓░OO  ▓▓▓0000O      ",
    ".!   ....!!   ...!       ▓▓▓▓▓░00        ▓▓▓░00  ▓▓░00   ▓▓▓░0   ▓▓░0O  ▓▓░000       ! ",
    "!   ...;!   ....!          ▓▓▓▓░00   .....▓▓▓▓▓▓▓░0O    ▓▓▓░0   ▓▓▓▓▓▓▓▓░000         .!","    .;;!   ....;       !     ▓▓▓▓░0O       ▓▓▓░░OO    ▓▓░000...▓▓▓▓░░░0000O  .!       !",
    "   ...;;! ....;         !!     ▓▓▓░░00O   ▓▓▓░00     ▓▓░000    ▓▓░░0000O     .!!     .!",
    "   .....;!.....;;!     .;!      ▓▓▓▓░░░0O▓▓▓▓░000O  ▓▓░000   ▓▓▓░000O        ..!!    ..",".  .......!.....;;!! ..;!         ▓▓▓▓░░░▓▓▓░░░00▓▓▓▓▓▓░0O ▓▓▓░░000O         ..;!   ...",
    "..  ..We drown in the endless night ▓▓▓▓▓▓▓▓░░░▓▓▓▓▓▓▓▓▓▓▓▓▓░░000O   !      ..;;!  ....",
    "..   ...................!              ▓▓▓▓▓▓▓▓▓▓▓░░0000000000O   .;!   .  ...;!   ....",
    "...  .........We drown in the endless night▓▓▓▓▓▓░░0000          ;;!!  .   ..;;!   ....",
    "............................_           ▓▓▓▓▓▓▓░░000  .   !     ;;!  .......;;;!!!.....",
    ".We drown in the endless night.........▓▓▓▓▓▓░░░000 ...  !!_ .  ;;!!!...........!!!....",
    "......................................▓▓▓▓▓▓░░░0000 ......!!.......!!!.................",
    ".......        ......................▓▓▓▓▓▓▓▓0000.  . .   .  .......!.................."
];



grimo = ["   ▓▓░   ▓▓▓▓░░░                         ▓▓▓▓    ░░░        ▓░░        ▓▓▓░░░░  ░░         ","▓  ▓▓░░░░░░░░                               ▓░▓▓▓░▓░░░      ▓▓▓░        ▓▓░░░░░░           ","▓   ▓░                                            ▓▓▓▓░░ ░    ▓▓░░░     ░▓░░░       ▓     ","▓░  ▓░      ▓▓▓                                       ▓▓░░░░░░░░░░░▓▓▓   ▓▓░░      ▓▓░ ","▓▓▓▓▓░     ▓   ▓         ▓▓                       ▓▓                 ▓▓▓▓▓▓░░   ▓▓▓░░  ","  ▓▓▓░    ▓                                                    ▓▓        ▓▓░▓▓▓▓▓░░░   ","  ▓▓▓░    ▓  ▓▓▓▓ ▓ ▓▓▓ ▓▓▓   ▓▓ ▓▓▓ ▓▓▓    ▓▓▓  ▓▓▓   ▓ ▓▓▓ ▓▓ ▓▓▓      ▓▓▓░░░░        ","  ▓▓▓░     ▓   ▓   ▓      ▓     ▓   ▓  ▓   ▓▓ ▓▓   ▓    ▓    ▓▓▓         ▓▓░░           ","  ▓▓▓░      ▓▓▓   ▓▓▓▓  ▓▓▓▓▓ ▓▓▓▓ ▓▓▓ ▓▓▓  ▓▓▓  ▓▓▓▓▓ ▓▓▓▓    ▓▓▓       ▓▓░░             ","  ▓▓▓a                                                                   ▓▓░░              ","░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░         ",
         "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░         ","                                                                                           ","       moonInc = moonInc.map((e,i) => inc * 2 - (i * 1e-3));                               ","       moonInc = moonInc.map((e,i) => inc * 2 - (i * 1e-3));                                             ","      a       moonInc = moonInc.map((e,i) => inc * 2 - (i * 1e-3));                                      ","      a                                              a                                    ","▓   ▓ ▓   moonInc = moonInc.map((e,i) => inc * 2 - (i * 1e-3));           ▓               ","   ▓ ▓▓                                                                    ▓              ","                    .................▓▓▓▓▓▓▓▓0000.  . .   .  .......!.........▓........"];




skull = ["          !!00!!      !!0!                                   !00!!        !!!!          ","         !!00!!        !00! ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░       !000!!        00!!           ","       !!00!!         !!!0!░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░     !00!!         !0!!           ","      !!00!!         !000!░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░ !!00!!         !0!!             ","     !!000!!        !!0!░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░00!!          !00!!          ","    !!000!!        !!0!▓▓▓▓▓▓▓▓░░░░░░░▓▓▓▓▓▓░░░░░░░░░░░░░░00!!           !!00            ","    !!000!!       !!!0!▓▓▓▓▓▓░░        ░▓▓▓░░░      ░░░░░░░0!!            !!00           ","    !!!00!!       !!!0!▓▓▓▓▓░░░       ░▓▓▓▓▓░░       ░░░░░░0!!             !!00!        ","     !!!00!!!     !!!0!░▓▓▓▓▓▓░░░░░░░▓▓▓▓▓▓▓▓░░░░░░░░░░░░░00!!              !!0!0!     ","      !!!00!!!     !!000!░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░ !!00!!!              !!00!!    ","       !!!000!!!    !!!!00!!░░▓▓▓▓▓▓▓▓▓░ ░ ▓▓▓▓░░░░░    !!!00!!!!            !!00!!!   ","        !!!!000!!!    !!!00!!!   ░░▓▓▓▓▓▓▓░▓▓░░░░        !!!000!!!!          !!!0!!!   ","         !!!!000!!!     !!0!0!!   ░▓▓▓▓▓▓▓▓▓▓▓░░          !!!0000!!!         !!000!!   ","         !!!!000!!!!    !!000!!    ▓░ ▓░  ▓░ ▓░            !!!!000!!!!      !!!00!!!   ","        !!!!0000!!!!    !0000!!!   ▓░ ▓░  ▓░ ▓░             !!!!000!!!!    !!0000!!    ","       !!!!!0000!!!    !!0000!!!                             !!!00000!!!  !!0000!!     ","                      !!!!00!!!                              !!!0!000!!! !!!000!!           ",".......        ......................▓▓▓▓▓▓▓▓0000.  . .                    !               "];


grimo = [`  \\▓▓░/ /▓▓▓▓░░░/                       \\▓▓▓▓\\   \\░░\\      \\▓░░\\      \\▓▓▓░░░░ \\░░/        `,`▓  ▓▓▓▓▓▓▓▓▓░/                             \\▓▓▓▓▓▓▓░░░\\     ▓▓▓░\\      \\▓▓░░░░░░/          `,`▓\\ \\▓░/                                         \\\\▓▓▓▓▓▓\\    \\▓▓░░░\\    ░▓░░░/     \\▓/    `,`▓░\\ ▓░      ▓▓▓                                      \\▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  \\▓▓░░     /▓▓░/`,`▓▓▓▓▓░     ▓   ▓         ▓▓                       ▓▓                \\▓▓▓▓▓▓░░  /▓▓▓░░/ `,` \\▓▓▓░    ▓                                                    ▓▓       \\▓▓░▓▓▓▓▓░░/   `,`  ▓▓▓░    ▓  ▓▓▓▓ ▓ ▓▓▓ ▓▓▓   ▓▓ ▓▓▓ ▓▓▓    ▓▓▓  ▓▓▓   ▓ ▓▓▓ ▓▓ ▓▓▓      ▓▓▓░░░░/       `,`  ▓▓▓░     ▓   ▓   ▓      ▓     ▓   ▓  ▓   ▓▓ ▓▓   ▓    ▓    ▓▓▓         ▓▓░░           `,`  ▓▓▓░      ▓▓▓   ▓▓▓▓  ▓▓▓▓▓ ▓▓▓▓ ▓▓▓ ▓▓▓  ▓▓▓  ▓▓▓▓▓ ▓▓▓▓    ▓▓▓       ▓▓░░             `,`  ▓▓▓░                                                                   ▓▓░░              `,`░░░░░░░░▓▓░▓▓░▓░▓▓▓░░░░░▓▓▓░▓░░░░▓░▓▓░░░░▓▓░▓▓▓░░░▓░░░▓░░░▓░░░░░▓░░░░░▓░░░▓░░▓░▓▓▓░░░░░      `,`░░░░░░░░░░░░▓░▓▓▓░░░░░░░░░░▓▓░▓▓▓░░░░▓░░░░░░░░▓░░░░░▓░░░▓░░▓▓▓▓░░░▓░░░░░▓░░░▓░░▓░▓▓▓░░░      `,`      /                                                               ░ !     _     ! ░    `,`       /oonInc = moonInc.map((e,i) => inc * 2 - (i * 1e-3));          ░__!!___*___!!__░    `,`     / moonInc = moonInc.map((e,i) => inc * 2 - (i * 1e-3));          ░   !!! * !!!   ░                  `,`     /a       moonInc = _oonInc.map((e,i) => inc * 2 - (i * 1e-3));   ░*______*______*░                  `,`     /a               ░░░                            a                ░     !!!!!     ░   `,`▓   ▓ ▓   moonInc = moonInc.map((e,i) => inc * 2 - (i * 1e-3));       ░  !!!  *  !!!  ░   `,` ░// \\/ /░  ▓░      ░ a     _                                         ░_!__!  _  !__!_░   `,`                    .................▓▓▓▓▓▓▓▓0000.  . .   .  .......!.........▓........`];


lac = ["▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░▓▓▓▓▓▓▓▓    ","▓▓▓▓▓▓░▓▓▓▓▓▓▓▓░▓▓▓▓▓▓░▓░▓▓▓▓▓▓▓░▓▓▓░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓░░░░░░░░░░▓▓░░░░░░░ ░░░░░▓░░░    ","▓▓░▓░▓▓▓▓░░▓░▓▓▓░▓░░░▓▓▓▓▓▓▓▓▓▓░▓▓░░░IIIIIIII░░░░░░░▓▓▓░░░░        ░░░░            ░░     ","▓▓▓▓▓░▓▓▓▓▓░▓░▓░░░░░▓▓▓▓▓▓▓▓░░▓▓░░░I         IIIII░░IIII                               ","▓▓▓▓▓▓▓░▓▓░▓░▓▓░░▓░▓▓▓▓▓░▓▓░▓▓▓░░I               III          ((     (      {{  _~ ~~~~","▓▓░▓▓▓░░▓░░▓▓░▓▓░░░▓▓▓▓▓▓▓▓▓▓░░II        (((               (~~~~{{{      __________~~~~","▓▓▓▓▓░░░░░░░▓▓▓░▓▓▓░▓░░▓░▓▓░IIII        (  {{(~~~~    (~~~~~~     ~~ ___(    __     ~   ","▓▓▓▓▓░▓░░░▓▓▓░░▓░▓░▓▓░▓▓▓▓░░III       ~(~~~(~~~   ~~~~~~~~~~~ _____~                 ~~ ","▓▓▓▓░░▓░░▓░▓▓░░▓▓░▓▓▓▓▓▓▓░░III       (~  ~~~ ~(_~~~~~~~~~~~                    ~~~~~~~    ","░▓▓▓▓▓▓░░▓░▓░▓▓▓░░▓▓░▓▓▓░░III      (~~  ~~~~   ~~~~~~                   ~ ~~~~~~~~         ","▓▓▓▓▓▓▓░░░░▓▓░░▓▓▓▓░▓▓░░░III      ~~~~~~~   (  ~                                    ~~~      ","▓▓░▓▓░░▓░░▓▓▓▓░▓░▓▓▓░▓░░░░I      (~~~~~                                                      ","▓░▓▓▓░░▓░░▓░▓░▓▓░▓▓░▓▓░░░░I      (~~~~~    (      (                             ______     ","▓▓░░▓▓▓▓░░░░▓▓░▓▓▓▓░▓░▓▓▓░░░      {{{(~~~                                   _________      ","▓▓░░▓▓▓▓▓░░░▓░▓▓▓░░▓░░▓▓▓▓░░II         ((~~       (    ~~   (  ____~~~~~_______                          ","▓▓▓░░▓▓░░▓░░▓▓░░▓░░░▓░░▓░▓▓░░░IIIIII      {((((   ~~ (  ~~~~                                             ","▓▓▓▓░░▓▓▓▓░▓░░▓▓░▓▓░░▓▓▓▓▓░▓▓▓▓░░░░░III       ((( ~~~{(~ ~~~~~~~~~~(  ____                ","▓▓▓▓▓▓▓░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░▓▓░░II           (~~ ~~~~~~~~   ~      (      (         ","▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░▓▓▓░░░░░░░░░░░░▓░░░I          ░  (( ~  ~~ ~ ~~~~~~ ░                ","                    .................▓▓▓▓▓▓▓▓0000.  . .   .  .......!.........▓........"];