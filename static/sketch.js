let looping = false;
let grimoire = false;
let tabsLoaded = false;
let gr;
let mode = 0;
let keysActive = true;
let cnvs, ctx, canvasDOM;
let fileName = "/Volumes/Volumina/frames/grimoire/gri";
let JSONs = [];
let maxFrames = Infinity;
let gl;
let time;
let positive = true;
let intensity;
let drawCount = 0;
let exportCount = 0;
let drawIncrement = 1;
let vertexBuffer;
let fvertices = [];
const seed = 10;
const openSimplex = openSimplexNoise(seed);
let mS = 1;
let amountOfScratches = 3;
let fluctuation = 1;
let namedPrograms = {};

// a shader variable
let texcoordShader;
let dotsVBuf, termVBuf, dotsCBuf, bgVBuf;
let texture, texture2, framebuf, framebuf2;
let vb;
let nx, ny;
fvertices = [];
for (let i = 0; i < 1000000; i++) {
    fvertices.push(i);
}
fvertices = new Float32Array(fvertices);

let resolutionScalar = 0.5;
let resolutionBG;

let fmouse = [0, 0];
let pmouse = [0, 0];
let smouse = [0, 0];


// ------------------------------------------------------------
// Grimoire Animate
// ------------------------------------------------------------

var stop = false;
var fps, fpsInterval, startTime, now, then, elapsed;
var animationStart;
var framesRendered = 0;
var framesOfASecond = 0;
var secondStart, secondFrames;
var fps = 24;
var envirLooping = false;


startAnimating = function() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    animationStart = Date.now();
    secondStart = Date.now();
    startTime = then;
    framesRendered = 0;
    envirLooping = true;
    animate();
}

function queryFrameRate() {
    let timeElapsed = Date.now() - animationStart;
    let seconds = timeElapsed / 1000;
    logJavaScriptConsole(framesRendered / seconds);
    // logJavaScriptConsole(timeElapsed);
}

// the animation loop calculates time elapsed since the last loop
// and only draws if your specified fps interval is achieved

function animate() {

    // request another frame
    if (envirLooping) {

        requestAnimationFrame(animate);


        // calc elapsed time since last loop

        now = Date.now();
        elapsed = now - then;

        // if enough time has elapsed, draw the next frame

        if (elapsed > fpsInterval) {

            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            then = now - (elapsed % fpsInterval);
            // Put your drawing code here
            draw();
            framesRendered++;
            framesOfASecond++;
            if (framesOfASecond == fps) {
                secondFrames = fps / ((Date.now() - secondStart) * 0.001);
                // logJavaScriptConsole(secondFrames);
                framesOfASecond = 0;
                secondStart = Date.now();
            }
        }
    }
}

// ------------------------------------------------------------


function setup() {
    // socket = io.connect('http://localhost:8080');
    // socket.on('pushJSONs', function(data) {
        // JSONs = data;
        // draw();
    // });
    // socket.emit('pullJSONs', "/Users/guillaumepelletier/Desktop/Dropbox/Art/p5/Les-nouvelles-galaxies/Vert/sessions");
    // socket.on('receiveOSC', receiveOSC);
    // pixelDensity(1);
    // cnvs = createCanvas(windowWidth, windowWidth * 9 / 16, WEBGL);
    // canvasDOM = document.getElementById('defaultCanvas0');
    // noCanvas();
    // cnvs = document.getElementById('my_Canvas');
    // gl = canvas.getContext('webgl');
    // canvasDOM = document.getElementById('my_Canvas');
    // canvasDOM = document.getElementById('defaultCanvas0');
    // gl = canvasDOM.getContext('webgl');
    // gl = cnvs.drawingContext;

    pixelDensity(1);
    noCanvas();
    // cnvs = createCanvas(windowWidth, windowWidth * 9 / 16, WEBGL);
    // cnvs = createCanvas(1280, 1280 * 9 / 16, WEBGL);
    cnvs = document.createElement('canvas');

    cnvs.id = "defaultCanvas0";
    cnvs.width = 2560 * resolutionScalar;
    cnvs.height = 1440 * resolutionScalar;
    cnvs.style.cursor= "none";
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(cnvs);
    canvasDOM = document.getElementById('defaultCanvas0');

    // noCanvas();
    // cnvs = document.getElementById('my_Canvas');
    // gl = canvas.getContext('webgl');
    gl = cnvs.getContext('webgl');





    // gl = canvasDOM.getContext('webgl', { premultipliedAlpha: false });



    // gl.colorMask(false, false, false, true);
    // gl.colorMask(false, false, false, true);

    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(false);

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.colorMask(true, true, true, true);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
    // Set the view port
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    frameRate(20);
    // background(0);
    // fill(255, 50);
    noStroke();
    vertex_buffer = gl.createBuffer();
    dotsVBuf = gl.createBuffer();
    bgVBuf = gl.createBuffer(); 
    dotsCBuf = gl.createBuffer();
    termVBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    if (!looping) {
        noLoop();
    }
    shadersReadyToInitiate = true;
    initializeShaders();
    createWhiteDots();
    time = gl.getUniformLocation(getProgram("pulsar-fog"), "time");
    resolutionBG = gl.getUniformLocation(getProgram("pulsar-fog"), "resolution");
    texture = createTexture();
    framebuf = createFrameBuffer(texture);
    texture2 = createTexture();
    framebuf2 = createFrameBuffer(texture2);

    // setTimeout( function() {
    //         // keysControl.style.cursor = 'none';
    //     keysControl.addEventListener("mouseenter", function(event) {
    //         document.body.style.cursor = "none";
    //         document.body.style.backgroundColor = "#000000";
    //     appControl.setAttribute("style", "display:none;");
    //     let tabs = document.querySelector("#file-tabs");
    //     tabs.setAttribute("style", "display:none;");
    //     // let slider = document.querySelector("#timeline-slider");
    //     // slider.setAttribute("style", "display:none;");
    //     // slider.style.display = "none";
    //     // canvasDOM.style.bottom = "0";
    //     cinemaMode = true;
    //     scdArea.style.display = "none";
    //     scdConsoleArea.style.display = "none";
    //     jsArea.style.display = "none";
    //     jsConsoleArea.style.display = "none";
    // }, false);
    // keysControl.addEventListener("mouseleave", function(event) {
    //         if (!grimoire) {
    //             document.body.style.cursor = "default";
    //             document.body.style.backgroundColor = "#1C1C1C";
    //             appControl.setAttribute("style", "display:block;");
    //             let tabs = document.querySelector("#file-tabs");
    //             tabs.setAttribute("style", "display:block;");
    //             // let slider = document.querySelector("#timeline-slider");
    //             // slider.setAttribute("style", "display:block;");
    //             // slider.style.display = "block";
    //             // canvasDOM.style.bottom = null;
    //             if (displayMode === "both") {
    //                 scdArea.style.display = "block";
    //                 scdConsoleArea.style.display = "block";
    //                 jsArea.style.display = "block";
    //                 jsConsoleArea.style.display = "block";
    //             } else if (displayMode == "scd") {
    //                 scdArea.style.display = "block";
    //                 scdConsoleArea.style.display = "block";
    //             } else if (displayMode == "js") {
    //                 jsArea.style.display = "block";
    //                 jsConsoleArea.style.display = "block";
    //             }
    //             cinemaMode = false;
    //             clearSelection();
    //         }   
    //     }, false);
    // }, 1);
    if (batchExport) {
        exportCount = batchMin;
        exporting = true;
        redraw();
        songPlay = false;
        noLoop();
        looping = false;
    }
    // socket.on('getNextImage', function(data) {
    //     if (drawCount <= batchMax) {
    //         // redraw();
    //         window.setTimeout(function() {
    //             redraw();
    //         }, 3000);
    //     }
    // });
}

function clearSelection() {
    if (window.getSelection) {window.getSelection().removeAllRanges();}
    else if (document.selection) {document.selection.empty();}
}

draw = function() {
    // We bind the framebuffer...
    bindFrameBuffer(texture, framebuf);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // draw the scene, presumably on a framebuffer
    let currentProgram = getProgram("pulsar-fog");
    gl.useProgram(currentProgram);
    // drawBG(currentProgram);
    currentProgram = getProgram("new-flickering-dots-vert");
    gl.useProgram(currentProgram);
    nx = openSimplex.noise2D(0, drawCount * 5e-2) * 0.0025;
    ny = openSimplex.noise2D(0, drawCount * 5e-2 + 1e5) * 0.0025;
    // drawAlligatorQuietVert(currentProgram);
    currentProgram = getProgram("new-flickering-dots");
    gl.useProgram(currentProgram);
    // drawAlligatorQuiet(currentProgram);
// 
// 
    if (ge.t) {
        ge.t.display();
    } else {
        GrimoireTab.prototype.display();
    }

    // drawSwirl(currentProgram);
    // drawPulsar(currentProgram);
// 
    // vb = map(cos(frameCount * 0.01), -1, 1, 0, 4);
// 
    // // Here, the original image should be redrawned
    // // from "texture" to "texture2"
// 
    // let processProgram = getProgram("process");
    // // console.log(processProgram);
    // gl.useProgram(processProgram);
// 
// 
// 
    // let aspect = cnvs.width / cnvs.height;
    // let vertices = new Float32Array([-1, 1, 1, 1, 1, -1, // Triangle 1
    //     -1, 1, 1, -1, -1, -1 // Triangle 2
    // ]);
    // let vbuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    // let itemSize = 2;
    // let numItems = vertices.length / itemSize;
    // processProgram.aVertexPosition = gl.getAttribLocation(processProgram, "a_position");
    // gl.enableVertexAttribArray(processProgram.aVertexPosition);
    // gl.vertexAttribPointer(processProgram.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);
// 
// 
// 
// 
    // var resolutionLocation = gl.getUniformLocation(processProgram, "u_resolution");
    // var textureSizeLocation = gl.getUniformLocation(processProgram, "u_textureSize");
    // var kernelLocation = gl.getUniformLocation(processProgram, "u_kernel[0]");
    // var kernelWeightLocation = gl.getUniformLocation(processProgram, "u_kernelWeight");
    // var flipYLocation = gl.getUniformLocation(processProgram, "u_flipY");
// 
    // var directionLocation = gl.getUniformLocation(processProgram, "direction");
// 
    // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // bindFrameBuffer(texture2, framebuf2);
    // gl.viewport(0, 0, 1280, 720);
    // gl.bindTexture(gl.TEXTURE_2D, texture);
// 
    // let name = "myBlur";
    // gl.uniform2f(resolutionLocation, 1280, 720);
    // gl.uniform2f(textureSizeLocation, 1280, 720);
    // gl.uniform2f(directionLocation, 8 * vb, 0);
    // gl.uniform1f(flipYLocation, 1);
    // gl.uniform1fv(kernelLocation, kernels[name]);
    // gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[name]));
// 
// 
// 
    // // shader.uniforms.direction = i % 2 === 0 ? [radius, 0] : [0, radius]
// 
// 
// 
    // var textureLocation = gl.getUniformLocation(processProgram, "u_texture");
    // gl.uniform1i(textureLocation, 0);
    // var texcoordLocation = gl.getAttribLocation(processProgram, "a_texcoord");
    // gl.enableVertexAttribArray(texcoordLocation);
// 
    // // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    // var size = 2; // 2 components per iteration
    // var type = gl.FLOAT; // the data is 32bit floats
    // var normalize = false; // don't normalize the data
    // var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    // var offset = 0; // start at the beginning of the buffer
    // gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);
// 
// 
// 
// 
    // // Draw the rectangle.
    // gl.drawArrays(gl.TRIANGLES, 0, 6);
// 
// 
// 
    // gl.uniform2f(directionLocation, 0, 7 * vb);
// 
    // bindFrameBuffer(texture, framebuf);
    // gl.bindTexture(gl.TEXTURE_2D, texture2);
    // gl.drawArrays(gl.TRIANGLES, 0, 6);
// 
// 
    // gl.uniform2f(directionLocation, 6 * vb, 0);
// 
    // bindFrameBuffer(texture2, framebuf2);
    // gl.bindTexture(gl.TEXTURE_2D, texture);
    // gl.drawArrays(gl.TRIANGLES, 0, 6);
// 
// 
    // gl.uniform2f(directionLocation, 0, 5 * vb);
    // bindFrameBuffer(texture, framebuf);
    // gl.bindTexture(gl.TEXTURE_2D, texture2);
    // gl.drawArrays(gl.TRIANGLES, 0, 6);
// 
// 
    // gl.uniform2f(directionLocation, 4 * vb, 0);
    // bindFrameBuffer(texture2, framebuf2);
    // gl.bindTexture(gl.TEXTURE_2D, texture);
    // gl.drawArrays(gl.TRIANGLES, 0, 6);
// 
    // gl.uniform2f(directionLocation, 0, 3 * vb);
// 
    // bindFrameBuffer(texture, framebuf);
    // gl.bindTexture(gl.TEXTURE_2D, texture2);
    // gl.drawArrays(gl.TRIANGLES, 0, 6);
// 
// 
    // gl.uniform2f(directionLocation, 2 * vb, 0);
// 
    // bindFrameBuffer(texture2, framebuf2);
    // gl.bindTexture(gl.TEXTURE_2D, texture);
    // gl.drawArrays(gl.TRIANGLES, 0, 6);
// 
    // gl.uniform2f(directionLocation, 0, 1 * vb);
// 
    // bindFrameBuffer(texture, framebuf);
    // gl.bindTexture(gl.TEXTURE_2D, texture2);
    // gl.drawArrays(gl.TRIANGLES, 0, 6);
// 
    // gl.uniform2f(directionLocation, 1 * vb, 0);
// 
    // bindFrameBuffer(texture2, framebuf2);
    // gl.bindTexture(gl.TEXTURE_2D, texture);
    // gl.drawArrays(gl.TRIANGLES, 0, 6);
// 
// 
    // // bindFrameBuffer(texture, framebuf);
    // // gl.bindTexture(gl.TEXTURE_2D, texture2);
    // // gl.drawArrays(gl.TRIANGLES, 0, 6);
// 
    // // bindFrameBuffer(texture2, framebuf2);
    // // gl.bindTexture(gl.TEXTURE_2D, texture);
    // // gl.drawArrays(gl.TRIANGLES, 0, 6);
// 
// 
    // currentProgram = getProgram("new-flickering-dots");
    // gl.useProgram(currentProgram);
    // // drawAlligatorQuiet(currentProgram);
    // // drawSwirl(currentProgram);
    // drawPulsar(currentProgram);
// 
// 
    // unbind the buffer and draw the resulting texture....
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
// 
    gl.bindTexture(gl.TEXTURE_2D, texture);
// 
    gl.clearColor(0, 0, 0, 1); // clear to white
// 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
// 
    var textureShader = getProgram("textu");
    gl.useProgram(textureShader);
// 
    aspect = cnvs.width / cnvs.height;
    let vertices = new Float32Array([-1, 1, 1, 1, 1, -1, // Triangle 1
        -1, 1, 1, -1, -1, -1 // Triangle 2
    ]);
    vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    itemSize = 2;
    numItems = vertices.length / itemSize;
    textureShader.aVertexPosition = gl.getAttribLocation(textureShader, "a_position");
    gl.enableVertexAttribArray(textureShader.aVertexPosition);
    gl.vertexAttribPointer(textureShader.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);
// 
    var textureLocation = gl.getUniformLocation(textureShader, "u_texture");
    gl.uniform1i(textureLocation, 0);
    var timeLocation = gl.getUniformLocation(textureShader, "time");
    gl.uniform1f(timeLocation, drawCount * 0.01);
// 
    var scalar = gl.getUniformLocation(textureShader, "resolution");
    gl.uniform1f(scalar, resolutionScalar);
// 
    var texcoordLocation = gl.getAttribLocation(textureShader, "a_texcoord");
    gl.enableVertexAttribArray(texcoordLocation);
// 
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);
// 
    gl.drawArrays(gl.TRIANGLES, 0, numItems);
// 
    // if (tabsLoaded) {
    //     if (exporting && exportCount < maxFrames) {
    //         frameExport();
    //     }    
    //     drawCount += drawIncrement;
    //     exportCount++;
    // }
    drawCount += drawIncrement;
}

// function keyPressed() {
//     if (keysActive) {
//         if (keyCode === 32) {
//             if (looping) {
//                 noLoop();
//                 looping = false;
//             } else {
//                 loop();
//                 looping = true;
//             }
//         }
//         if (key == 'r' || key == 'R') {
//             window.location.reload();
//         }
//         if (key == 'm' || key == 'M') {
//             redraw();
//         }
//     }
// }


keyPressed = function() {
    if (keysActive) {
        // if (keyCode === 32) {
        //     if (looping) {
        //         noLoop();
        //         looping = false;
        //     } else {
        //         loop();
        //         looping = true;
        //     }
        // }
        // if (key == 'r' || key == 'R') {
        //     window.location.reload();
        // }
        // if (key == 'm' || key == 'M') {
        //     redraw();
        // }
        // if (key == 'a' || key == 'A') {
        //     logJavaScriptConsole("yur!");
        // }
        // logJavaScriptConsole(key);
    if (vtActive) {
                    // vt.update(event);
         // if (keyCode === 8) {
            // vt.update("delete");
             // // logJavaScriptConsole(event);
        // }  else {
            // vt.update(event);
        // }
                     // logJavaScriptConsole(event.key);
        // logJavaScriptConsole(event.shiftKey);
        // if (key == 'a' || key == 'A') {
            // vt.update("a");
            // logJavaScriptConsole(event.key);
        // }
        }
    }
}


tl = function(d = 0) {
    setTimeout(function() {
                if (looping) {
                noLoop();
                looping = false;
            } else {
                loop();
                looping = true;
            }
    }, d * 1e3);
};


tl = function(d = 0) {
    setTimeout(function() {
                if (envirLooping) {
                // noLoop();
                envirLooping = false;
            } else {
                envirLooping = true;
                startAnimating();
            }
    }, d * 1e3);
};

tl0 = function(d = 0) {
    setTimeout(function() {
                if (envirLooping) {
                // noLoop();
                envirLooping = false;
            } else {
                drawCount = 0;
                envirLooping = true;
                startAnimating();
            }
    }, d * 1e3);
};


keyDown = function(e) {
    if (keysActive) {
        if (ge.recording) {
            ge.recordingSession.push([drawCount, {
                name: "keyDown",
                key: e.key,
                keyCode: e.keyCode,
                altKey: e.altKey,
                metaKey: e.metaKey,
                shiftKey: e.shiftKey
            }]);
        }
        // console.log(event.keyCode);
        if (e.keyCode == 27 && ge.activeTab !== null) {
            mode = (mode + 1) % 3;
        }
        if (mode == 0) {
                if (vtActive) {
                    vt.update(e);
                    // ljs(event.keyCode);
                }
            updateDrawing(e);
        } else if (mode == 1) {
            ge.update(e);
        } else if (mode == 2) {
            paintingKeys(e);
        }
    }
}

document.onkeydown = keyDown;       




function setResolutionScalar(sc) {
    resolutionScalar = sc;
    cnvs.width = 2560 * resolutionScalar;
    cnvs.height = 1440 * resolutionScalar;
    texture = createTexture();
    framebuf = createFrameBuffer(texture);
    texture2 = createTexture();
    framebuf2 = createFrameBuffer(texture2);
    drawCount--;
    redraw();
}

function sr(sc) {
    setResolutionScalar(sc);
}

function exportOne() {
    exporting = true;
    redraw();
    exporting = false;
}

gr = function() {
    grimoire = !grimoire;
}

if (false) {


receiveOSC = function(s) {
    trigger(s);
    // logJavaScriptConsole(s);
    if (s.address == "/eval") {
        eval(s.args[0].value);
    }
};

trigger = function(s) {
    // console.log(s);
};

socket.off('receiveOSC', receiveOSC);
socket.on('receiveOSC', receiveOSC);


buzz = 0.1;
scdDisplay = function() {
    let c = ge.activeTab.canvas.data;
    for (let y = 20; y < 25; y++) {
        for (let x = 65; x < 105; x++)  {
            if (c[y] == null) {c[y] = []};
            let v = Math.round(Math.random());
            if (c[y][x] == null) {c[y][x] = []};
            for (let i = 0; i < 63; i++) {
                let xx = x * 7 + (i % 7);
                let yy = y * 9 + (i / 7);
                let d = dist(xx, yy, 0, 0);
                let v = Math.round(Math.sin(d + drawCount * Math.cos(xx * buzz)) * 0.5 + 0.5);
                c[y][x][i] = v;
            }
        }
    }
}

buzz = 0.1;
buzzY = 1;
    scdDisplay = function() {
    let c = ge.activeTab.canvas.data;
        let t = drawCount;
    for (let y = 20; y < 28; y++) {
        for (let x = 65; x < 105; x++)  {
            if (c[y] == null) {c[y] = []};
            let v = Math.round(Math.random());
            if (c[y][x] == null) {c[y][x] = []};
            for (let i = 0; i < 63; i++) {
                let xx = x * 7 + (i % 7);
                let yy = y * 9 + (i / 7);
                let d = dist(xx, yy, 0, buzzY);
                let v = Math.round(usin(d + drawCount * Math.cos(xx * 0.1)));
                v = Math.round(usin(Math.tan(d * buzz + t)));
                c[y][x][i] = v;
            }
        }
    }
    function usin(t) {
        return Math.sin(t) * 0.5 + 0.5;
    }
}

}

buzz = 0.1;
buzzY = 1;
scdDisplay = function() {
    let t = drawCount;
    let c = ge.activeTab.canvas.data;
   c = ge.getTab("sh.js").canvas.data;
    let w = 100;
    let hw = w / 2;
    for (let y = 2; y < 23; y++) {
        for (let x = 31; x < 78; x++)  {
            if (c[y] == null) {c[y] = []};
            let v = Math.round(Math.random());
            if (c[y][x] == null) {c[y][x] = []};
            for (let i = 0; i < 63; i++) {
                let xx = x * 7 + (i % 7);
                let yy = y * 9 + (i / 7);
                let d = dist(xx * 0.94, yy * (5 / 3), 109 * 7 / 2 - 26, 25 * 9 / 2 * (5/3));
                let v = Math.round(usin(d * 100 + drawCount * 0.5 + Math.sin(xx)));
                v *= Math.round(usin(d * 5 + drawCount * 1e-1));
                // v = Math.round(usin(d + drawCount * Math.cos(xx * 0.1)));
                // v *= Math.round(usin(Math.sin(d * buzz + t)));
                
                if (d < 150.5) {
                    c[y][x][i] = v;
                } else {
                    // c[y][x][i] = 0;
                }
            }
        }
    }
    function usin(t) {
        return Math.sin(t) * 0.5 + 0.5;
    }
}
// scdDisplay();





logLatency = function() {
    logJavaScriptConsole((Date.now() - animationStart)/1000 - (drawCount/24));
}