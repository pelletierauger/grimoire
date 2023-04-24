ge = new GrimoireEditor();
// disturb = 1;
var canvasD;
var client = new XMLHttpRequest();
client.open('GET', 'static/paintings/sh.js.txt');
client.onreadystatechange = function() {
  // alert(client.responseText);
  canvasD = client.responseText;
  let dss = `
    // gl = cnvs.drawingContext;
    pixelDensity(1);
    noCanvas();
    // cnvs = createCanvas(windowWidth, windowWidth * 9 / 16, WEBGL);
`;
// new GrimoireTab({
//     name: "sh.js",
//     lang: "js",
//     scroll: {x: 0, y: 0},
//     carets: [{x: 0, y: 0, dir: 0, curXRef: 0, sel: null}],
//     data: dss.split("\n"),
//     canvasData: canvasD,
//     canvasPath: "dummyPath"
// });

tb("intro");
tl();
ge.activeTab.carets[0].x = 79;
ge.activeTab.carets[0].y = 24;
grimoire = true;
}
client.send();

let tabsToLoad = ["intro.js", "sketch.js"];

for (let i = 0; i < tabsToLoad.length; i++) {
    let name = tabsToLoad[i];
    fetch("static/" + name)
    .then(response => response.text())
    .then((data) => {
        // console.log(data)
        new GrimoireTab({
            name: name,
            lang: "js",
            scroll: {x: 0, y: 0},
            carets: [{x: 0, y: 0, dir: 0, curXRef: 0, sel: null}],
            data: data.split("\n"),
            canvasData: null,
            canvasPath: "dummyPath"
        });
    });
}




  GrimoireTab.prototype.display = function() {
    bindFrameBuffer(texture, framebuf);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // draw the scene, presumably on a framebuffer
    let currentProgram = getProgram("pulsar-fog");
    gl.useProgram(currentProgram);
    // drawBG(currentProgram);
    currentProgram = getProgram("new-flickering-dots-vert");
    gl.useProgram(currentProgram);
    drawAlligatorQuietVert(currentProgram);
    currentProgram = getProgram("new-flickering-dots");
    gl.useProgram(currentProgram);
    // drawAlligatorQuiet(currentProgram);
    currentProgram = getProgram("rounded-square");
    time = gl.getUniformLocation(currentProgram, "time"); 
    disturb = gl.getUniformLocation(currentProgram, "disturb"); 
    gl.useProgram(currentProgram);
    drawTerminal(currentProgram);
    // drawSwirl(currentProgram);
    // drawPulsar(currentProgram);
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
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);
    gl.drawArrays(gl.TRIANGLES, 0, numItems);
};