// griArr = files.js[8].data.split("\n");

swatchesArr = "░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■";

swatchesArr = "░▒▓█▀▄▌▐┌─┬┐│┤┘┴└├┼╔═╦╗║╣╝╩╚╠╬╒╤╕╡╛╧╘╞╓╥╖╢╜╨╙╟╫╪•◘☼►◄▲▼▬↑↓↨→←≡±≥≤αßΓπΣσµτΦΘΩδ∞φε∩⌠⌡÷≈°∙·√ⁿ²■";

swatchesArr = "░▒▓█▀▄▌▐┌─┬┐│┤┘┴└├┼╔═╦╗║╣╝╩╚╠╬╒╤╕╡╛╧╘╞╓╥╖╢╜╨╙╟╫╪•◘☼►◄▲▼▬↑↓↨→←";

// files.js[8].data = griArr.join("\n")

nt = 2725;
glitchDist = 0;

showPatterns = true;

tab = function(s, y) {
    if (s == null) {
        ge.activeTab = null;
        mode = 0;
        return;
    }
    let match = false;
    for (let i = 0; i < ge.tabs.length; i++) {
        if (ge.tabs[i].name == s && (ge.activeTab == null || ge.tabs[i].name !== ge.t.name)) {
            match = true;
            ge.activeTab = ge.tabs[i];
            if (ge.activeTab.canvas == null) {
                ge.activeTab.canvas = new GrimoireCanvas();
            }
            if (ge.activeBrush == null) {
                ge.activeBrush = types[typeIndex][brushIndex];
            }
            if (ge.activePattern == null) {
                ge.activePattern = patterns[5];
            }
            resetBrushPositions();
        }
    }
    // for (let i = 0; i < ge.files.js.length; i++) {
    //     // logJavaScriptConsole(griFiles.js[i]);
    //     if (ge.files.js[i].name == s) {
    //         ge.activeTab = ge.files.js[i];
    //         if (ge.activeTab.canvas == null) {
    //             ge.activeTab.canvas = new GrimoireCanvas();
    //         }
    //         if (ge.activeBrush == null) {
    //             ge.activeBrush = types[typeIndex][brushIndex];
    //         }
    //         if (ge.activePattern == null) {
    //             ge.activePattern = patterns[5];
    //         }
    //         resetBrushPositions();
    //     }
    // }
    if (match) {
        ge.t = ge.activeTab;
        if (y == 0 || y) {
            ge.t.scroll.y = y;
        }
        if (!ge.paintingOther) {
            ge.activeCanvas = ge.t.canvas;
        }
        return ge.activeTab;
    } else {
        return null;
    }
}

go_to = function(s, y) {
    window.setTimeout(function() {  
        let t = tab(s, y);
        if (t) {
            nt = 0;
            if (s !== null && ge.activeTab !== null) {
                mode = 1;
            }
        }
    }, 125);
};

tb = function(s) {
    let t = tab(s);
    if (s !== null && ge.activeTab !== null) {
        mode = 1;
    }
    return t;
};

let GrimoireEditor = function() {
    this.tabs = [];
    this.activeTab = null;
    this.activeCanvas = null;
    this.t = null;
    this.activeBrush = null;
    this.activePattern = null;
    this.evaluated = 0;
    this.evaluatedLines = [0, 0, 0];
    this.playback = false;
    this.recording = false;
    this.paintingFunction = paintUnit;
    this.paintingOther = false;
    this.paintingOffsetY = 0;
    this.lastOther = null;
};

GrimoireEditor.prototype.paintOther = function(s, offsetY = 0) {
    let c = this.getTab(s).canvas;
    if (c) {
        this.activeCanvas = c;
    }
    this.paintingOther = true;
    this.paintingOffsetY = offsetY;
    // mode = 2;
    this.lastOther = [s, offsetY];
};

GrimoireEditor.prototype.paintSame = function() {
    this.activeCanvas = this.t.canvas;
    this.paintingOther = false;
    this.paintingOffsetY = 0;
    mode = 2;
};

GrimoireEditor.prototype.toggleOther = function() {
    if (this.lastOther !== null) {
        if (this.paintingOther) {
            this.paintSame();
        } else {
            this.paintOther(this.lastOther[0], this.lastOther[1]);
        }
    }
};

GrimoireEditor.prototype.revertCanvas = function() {
    this.t.canvas.data = decodeAsciiString(this.t.canvasData);
};

GrimoireEditor.prototype.record = function() {
    // this.recordingFrame = 0;
    drawCount = 0;
    this.recordingSession = [];
    this.recording = true;
    vt.clear();
};

GrimoireEditor.prototype.r = function() {
    this.record();
};

GrimoireEditor.prototype.stopRecord = function() {
    this.recording = false;
};

GrimoireEditor.prototype.sr = function() {
    this.stopRecord();
};

GrimoireEditor.prototype.startPlayback = function() {
    this.playback = true;
    drawCount = 0;
    vt.clear();
};

GrimoireEditor.prototype.p = function() {
    this.startPlayback();
};

GrimoireEditor.prototype.play = function() {
    for (let i = 0; i < this.recordingSession.length; i++) {
        let e = this.recordingSession[i];
        if (drawCount == e[0]) {
            if (e[1].name == "mousemove") {
                movemouse(e[1]);
            } else if (e[1].name == "keyDown") {
                keyDown(e[1]);
            } else if (e[1].name == "dragmouse") {
                mouseDragged(e[1]);
            } else if (e[1].name == "downmouse") {
                downmouse(e[1]);
            } else if (e[1].name == "wheel") {
                wheelY(e[1]);
            }
        }
    }
    let l = this.recordingSession.length - 1;
    let last = this.recordingSession[l][0];
    if (drawCount > last) {
        this.stopPlayback();
    };
};

GrimoireEditor.prototype.stopPlayback = function() {
    this.playback = false;
};

GrimoireEditor.prototype.sp = function() {
    this.stopPlayback();
};

GrimoireEditor.prototype.saveSession = function(name) {
    let file = {
        path: "/Users/guillaumepelletier/Desktop/Dropbox/Art/p5/Les-nouvelles-galaxies/Vert/sessions/" + name + ".json",
        data: JSON.stringify(this.recordingSession)
    };
    socket.emit('saveFile', file);
};

GrimoireEditor.prototype.loadSession = function(s) {
    for (let i = 0; i < JSONs.length; i++) {
        if (JSONs[i].name == s) {
            this.recordingSession = JSONs[i].data.slice();
        }
    }
};

GrimoireEditor.prototype.ls = function(s) {
    this.loadSession(s);
};

GrimoireEditor.prototype.getTab = function(name) {
    let tab = null;
    for (let i = 0; i < this.tabs.length; i++) {
        if (name == this.tabs[i].name) {
            tab = this.tabs[i];
        }
    }
    return tab;
};

GrimoireEditor.prototype.saveCanvas = function() {
    if (this.activeTab !== null) {
        this.activeTab.saveCanvas();
    }
};


GrimoireEditor.prototype.canvasToCanvas = function(c0, x0, y0, x1, y1, c1, x, y) {
    c0 = this.getTab(c0);
    c1 = this.getTab(c1);
    // console.log(c0);
    // console.log(c1);
    for (let i = y0; i < y1; i++) {
        for (let j = x0; j < x1; j++) {
            if (x + j - x0 < 109) {
                if (c0.canvas.data[i] == null) {
                    c1.canvas.data[y + i - y0] = [];
                } else {
                    if (c1.canvas.data[y + i - y0] == null) {
                        c1.canvas.data[y + i - y0] = [];
                    }
                    if (c0.canvas.data[i][j] == null) {
                        c1.canvas.data[y + i - y0][x + j - x0] = null;
                    } else {
                        c1.canvas.data[y + i - y0][x + j - x0] = c0.canvas.data[i][j].slice();
                    }                
                }
            }
        }
    }
};


GrimoireEditor.prototype.c2c = function(y0, y1, c0, c1) {
    if (y0 == null) {
        y0 = ge.t.scroll.y;
    }
    if (y1 == null) {
        y1 = ge.t.scroll.y + 25;
    }
    if (c0 == null) {
        c0 = this.t.name;
    }
    if (c1 == null) {
        c1 = this.t.name;
    }
    this.canvasToCanvas(c0, 0, y0, 109, y0 + 25, c1, 0, y1);
};

GrimoireEditor.prototype.canvasToCanvasAdd = function(c0, x0, y0, x1, y1, c1, x, y) {
    c0 = this.getTab(c0).canvas.data;
    c1 = this.getTab(c1).canvas.data;
    for (let i = y0; i < y1; i++) {
        if (c0[i]) {
            for (let j = x0; j < x1; j++) {
                if (c0[i][j]) {
                    for (let k = 0; k < 63; k++) {
                        if (c0[i][j][k] == 1) {
                            let i2 = y + i - y0, j2 = x + j - x0;
                            if (c1[i2] == null) {c1[i2] = []};
                            if (c1[i2][j2] == null) {c1[i2][j2] = []};
                            c1[i2][j2][k] = 1;
                        }
                    } 
                }
            }
        }
    }
};


GrimoireEditor.prototype.canvasToCanvasSubtract = function(c0, x0, y0, x1, y1, c1, x, y) {
    c0 = this.getTab(c0).canvas.data;
    c1 = this.getTab(c1).canvas.data;
    for (let i = y0; i < y1; i++) {
        if (c0[i]) {
            for (let j = x0; j < x1; j++) {
                if (c0[i][j]) {
                    for (let k = 0; k < 63; k++) {
                        if (c0[i][j][k] == 1) {
                            let i2 = y + i - y0, j2 = x + j - x0;
                            if (c1[i2] == null) {c1[i2] = []};
                            if (c1[i2][j2] == null) {c1[i2][j2] = []};
                            c1[i2][j2][k] = 0;
                        }
                    } 
                }
            }
        }
    }
};

GrimoireEditor.prototype.clearCanvas = function() {
    this.t.canvas = new GrimoireCanvas();
};

GrimoireEditor.prototype.clearTab = function() {
    let t = this.t.data;
    for (let i = 0; i < t.length; i++) {
        t[i] = "";
    }
};

GrimoireEditor.prototype.eraseCanvas = function(c, x0, y0, x1, y1) {
    c = ge.getTab(c).canvas.data;
    for (let i = y0; i < y1; i++) {
        for (let j = x0; j < x1; j++) {
            if (c[i]) {
                if (c[i][j]) {
                    c[i][j] = [];
                }
            }
        }
    }
};

newTab = function(name, lang) {
    new GrimoireTab({
        name: name,
        lang: lang,
        scroll: {x: 0, y: 0},
        carets: [{x: 0, y: 0, dir: 0, curXRef: 0, sel: null}],
        data: [[]],
        canvasData: null,
        canvasPath: null
    });
}

let GrimoireTab = function(o) {
    this.name = o.name,
    this.lang = o.lang;
    this.scroll = o.scroll;
    this.carets = o.carets;
    this.data = o.data;
    this.canvasData = o.canvasData;
    this.canvasPath = o.canvasPath;
    if (this.canvasData !== null && this.canvasPath !== null) {
        this.canvas = new GrimoireCanvas();
        this.canvas.data = decodeAsciiString(this.canvasData);
    }
    this.history = [];
    this.historyIndex = 0;
    this.lastEdited = null;
    this.headState = null;
    this.attachedHeadState = true;
    ge.tabs.push(this);
};

GrimoireTab.prototype.clear = function() {
    let t = this.data;
    for (let i = 0; i < t.length; i++) {
        t[i] = "";
    }
};

GrimoireTab.prototype.saveCanvas = function() {
    let data = "";
    let gc = this.canvas;
    if (gc.data.length > 0) {
        for (let i = 0; i < gc.data.length; i++) {
            for (let j = 0; j < 109; j++) {
                for (let k = 0; k < 63; k++) {
                    if (gc.data[i] && gc.data[i][j] && gc.data[i][j][k]) {
                        data = data + "1";
                    } else {
                        data = data + "0"
                    }
                    // data = data + ((gc.data[i][j][k] == 1) ? "1" : "0");
                }
            }
        }
        let asciiString = "";
        for (let i = 0; i < data.length; i += 7) {
            let ss = data.substring(i, Math.min(i + 7, data.length));
            // ss = ss.padStart(7, "0");
            let n = parseInt(ss, 2);
            if (n < 32) {
                ascii = "éÉèÈêÊëËçÇàÀùÙÇüÜäÄöÖÿŸćńóśźĄąĘę"[n];
            } else if (n == 127) {
                ascii = "Ż";
            } else {
                ascii = String.fromCharCode(n);
            }
            // let ascii = String.fromCharCode(parseInt(ss,2));
            asciiString = asciiString + ascii;
            // console.log (ss + ", " + ascii);
        }
        // console.log(asciiString.length);
        
        asciiString = asciiString.replace(/(é)(\1*)/g, (a, b, c) => {
            return (a.length > 3) ? "Ć" + a.length + "Ć" : a;
        });
        asciiString = asciiString.replace(/(Ż)(\1*)/g, (a, b, c) => {
            return (a.length > 3) ? "Ł" + a.length + "Ł" : a;
        });
        // console.log(asciiString.length);
        // console.log(data.length);
        socket.emit('saveFile', {path: this.canvasPath, data: asciiString});
        this.canvasData = asciiString;
    }
};


GrimoireTab.prototype.applyHistoryState = function(n) {
    let h = this.history[n];
    this.data = [];
    for (let i = 0; i < h.data.length; i++) {
        this.data.push(h.data[i]);
    }
    this.carets = [];
    for (let i = 0; i < h.carets.length; i++) {
        this.carets.push(h.carets[i]);
    }
    this.scroll = {x: h.scroll.x, y: h.scroll.y};
    this.historyIndex = n;
    this.sel = h.sel;
};

GrimoireTab.prototype.applyHeadState = function() {
    let h = this.headState;
    this.data = [];
    for (let i = 0; i < h.data.length; i++) {
        this.data.push(h.data[i]);
    }
    this.carets = [];
    for (let i = 0; i < h.carets.length; i++) {
        this.carets.push(h.carets[i]);
    }
    this.scroll = {x: h.scroll.x, y: h.scroll.y};
    this.historyIndex = this.history.length;
    this.sel = h.sel;
};

GrimoireTab.prototype.prepareHistoryState = function() {
    let data = [];
    for (let i = 0; i < this.data.length; i++) {
        data.push(this.data[i]);
    }
    let carets = [];
    for (let i = 0; i < this.carets.length; i++) {
        let c = this.carets[i]
        carets.push({x: c.x, y: c.y, dir: c.dir, curXRef: c.curXRef, sel: c.sel});
    }
    let scroll = {x: this.scroll.x, y: this.scroll.y};
    return {scroll: scroll, carets: carets, data: data};
};

GrimoireTab.prototype.logHistory = function(h) {
    this.history.push(h);
};

GrimoireTab.prototype.moveCaretsX = function(x, sel = false) {
    let t = this;
    for (let i = 0; i < t.carets.length; i++) {
        t.carets[i].dir = 0;
    }
    if (x == 1) {
        for (let i = 0; i < t.carets.length; i++) {
            let c = t.carets[i];
            if (c.x == t.data[c.y].length
                &&
                c.y < t.data.length - 1
                ) {
                c.x = 0;
                c.y++;
            } else if (c.x < t.data[c.y].length) {
                c.x += x;
            }
        }
    } else if (x == -1) {
        for (let i = 0; i < t.carets.length; i++) {
            let c = t.carets[i];
            if (c.x == 0 && c.y > 0) {
                c.y--;
                c.x = t.data[c.y].length;
                // c.x = 0;
            } else if (c.x > 0) {
                c.x += x;
            }
        }
    }
    for (let i = 0; i < t.carets.length; i++) {
        let c = t.carets[i];
        for (let j = t.carets.length -1; j > i; j--) {
            let c2 = t.carets[j];
            if (c.x == c2.x && c.y == c2.y) {
                t.carets.splice(j, 1);
            }
        }
        if (sel == false) {
            c.sel = null;
        }
    }
};

GrimoireTab.prototype.moveCaretsY = function(y, sel = false) {
    let t = this;
    for (let i = 0; i < t.carets.length; i++) {
        let c = t.carets[i];
        if (c.dir == 0) {
            c.dir = 1;
            c.curXRef = c.x;
        }
    }
    if (y == 1) {
        for (let i = 0; i < t.carets.length; i++) {
            let c = t.carets[i];
            if (c.y < t.data.length - 1) {
                c.y++;
                c.x = Math.min(t.data[c.y].length, c.curXRef);
            } else if (c.y == t.data.length - 1) {
                c.x = t.data[c.y].length;
            }
        }
    } else if (y == -1) {
        for (let i = 0; i < t.carets.length; i++) {
            let c = t.carets[i];
            if (c.y > 0) {
                c.y--;
                c.x = Math.min(t.data[c.y].length, c.curXRef);
            } else if (c.y == 0) {
                c.x = 0;
            }
        }
    }
    for (let i = 0; i < t.carets.length; i++) {
         let c = t.carets[i];
        if (c.y < t.scroll.y) {
            t.scroll.y--;
            break;
        } else if (c.y > t.scroll.y + 24) {
            t.scroll.y++;
            break;
        }
    }
    for (let i = 0; i < t.carets.length; i++) {
        let c = t.carets[i];
        for (let j = t.carets.length -1; j > i; j--) {
            let c2 = t.carets[j];
            if (c.x == c2.x && c.y == c2.y) {
                t.carets.splice(j, 1);
            }
        }
        if (sel == false) {
            c.sel = null;
        }
    }    
};

GrimoireTab.prototype.scroll = function(x, y) {

};

GrimoireTab.prototype.addLine = function() {
    let t = this;
    if (t.carets.length == 1) {
        let c = t.carets[0];
        let bef = t.data[c.y].substring(0, c.x);
        let aft = t.data[c.y].substring(c.x);
        t.data[c.y] = bef;
        let whitespace = "";
        t.data[c.y].replace(/^\s*/, function(a, b, c) {whitespace = a});
        t.data.splice(c.y + 1, 0, whitespace + aft);
        c.y++;
        c.x = whitespace.length;
        if (c.y - t.scroll.y > 24) {
            t.scroll.y++;
        }
    }
};


GrimoireTab.prototype.saveTab = function() {
    let t = this;
    let f = files[t.lang];
    for (let i = 0; i < f.length; i++) {
        let ff = f[i];
        if (t.name == ff.name) {
            ff.data = t.data.join("\n");
            if (t.lang == "scd") {
                checkIfScdSaved(i);
            } else {
                checkIfJsSaved(i);
            }
        }
    }
};

GrimoireTab.prototype.fetchTab = function() {
    let t = this;
    let f = files[t.lang];
    for (let i = 0; i < f.length; i++) {
        let ff = f[i];
        if (t.name == ff.name) {
            t.data = ff.data.split("\n");
            t.history = [];
            t.historyIndex = 0;
            t.lastEdited = null;
            t.headState = null;
            t.attachedHeadState = true;
        }
    }
};

GrimoireTab.prototype.deleteLine = function() {

};


// GrimoireTab.prototype.updateSelection = function() {

// };


GrimoireTab.prototype.evaluateLine = function() {
    let t = this;
    let line = t.data[t.carets[0].y];
    if (t.lang == "scd") {
        socket.emit('interpretSuperCollider', line, t.canvasPath);
    } else if (t.lang == "js") {
        eval(line);
    }
    let firstX = Infinity;
    t.data[t.carets[0].y].replace(/^\s*/,function(a){firstX = Math.min(firstX, a.length)});
    ge.evaluated = 5;
    ge.evaluatedLines = [t.carets[0].y, t.carets[0].y + 1, firstX];
};

GrimoireTab.prototype.evaluateBlock = function() {
    let t = this;
    if (t.lang == "scd") {
        let line = t.carets[0].y;
        let up = false, down = false;
        while (line >= 0 && !up) {
            up = t.data[line].replace(/^\s*/,'') == "(";
            if (!up) {line--};
        }
        if (up) {
            up = line;
            while (line < t.data.length && !down) {
                down = t.data[line].replace(/^\s*/,'') == ")";
                if (!down) {line++};
            }
            if (line >= t.carets[0].y && down) {
                down = line + 1;
                let firstX = Infinity;
                let block = "";
                for (let i = up; i < down; i++) {
                    t.data[i].replace(/^\s*/,function(a){firstX = Math.min(firstX, a.length)});
                    block += t.data[i] + "\n";
                }
                socket.emit('interpretSuperCollider', block, t.canvasPath);
                ge.evaluated = 5;
                ge.evaluatedLines = [up, down, firstX];
            }
        }
    } else if (t.lang == "js") {
        // var pos = editor.getCursor()
        var startline = t.carets[0].y;
        var endline = t.carets[0].y;
        while (startline > 0 && t.data[startline] !== '') {
            startline--
        }
        while (endline < t.data.length && t.data[endline] !== '') {
            endline++
        }
                // console.log(startline);
        // console.log(endline);
        // startline, endline;
        let block = "";
        for (let i = startline; i < endline; i++) {
            block = block + "\n" + t.data[i];
        }
        // console.log(block);
        eval(block);
        ge.evaluated = 5;
        let firstX = Infinity;
        for (let i = startline; i < endline; i++) {
            t.data[i].replace(/^\s*/,function(a){firstX = Math.min(firstX, a.length)});
        }
        ge.evaluatedLines = [startline, endline, firstX];
    }
};


GrimoireTab.prototype.update = function(s) {
    let t = this;
    let sel = false;
    for (let i = 0; i < t.carets.length; i++) {
        let c = t.carets[i];
        if (c.sel !== null) {
            sel = true;
        }
    }
    if (sel) {
        // console.log(sel);
        for (let i = 0; i < t.carets.length; i++) {
        // for (let i = 0; i < 1; i++) {
            let c = t.carets[i];
            let yOffset = 0;
            let xOffset = 0;
            let anchor = false;
            // A selection is "anchored" when the caret is at its end.
            if (c.y > c.sel[1]) {
                anchor = true;
            } else if (c.y == c.sel[1]) {
                anchor = c.x > c.sel[0];
            }
            // console.log(c);
            if (c.y == c.sel[1]) {
                xOffset = (anchor) ? c.x - c.sel[0] : c.sel[0] - c.x;
                let baseX = (anchor) ? c.sel[0] : c.x;
                let endX = baseX + xOffset;
                t.data[c.y] = t.data[c.y].slice(0, baseX) + s + t.data[c.y].slice(endX);
                c.x = (anchor) ? c.sel[0] + s.length : c.x + s.length;
                c.sel = null;
                for (let j = 0; j < t.carets.length; j++) {
                    let d = t.carets[j];
                    if (c !== d && c.y == d.y) {
                        if (d.x > c.x) {
                            // console.log(xOffset);
                            d.x -= xOffset - s.length;
                            if (d.sel !== null) {d.sel[0] -= xOffset - s.length};
                        }
                    }
                }
            } else {
                // Multi-line selections
                xOffset = (anchor) ? c.x : c.sel[0];
                yOffset = (anchor) ? c.y - c.sel[1] : c.sel[1] - c.y;
                let baseX = (anchor) ? c.sel[0] : c.x;
                let baseY = (anchor) ? c.sel[1] : c.y;
                t.data[baseY] = t.data[baseY].slice(0, baseX) + s + t.data[baseY + yOffset].slice(xOffset);
                // for (let i = 0; i < yOffset; i++) {
                t.data.splice(baseY + 1, yOffset);
                // }
                c.x = (anchor) ? c.sel[0] + s.length : c.x + s.length;
                c.y = (anchor) ? c.sel[1] : c.y;
                // console.log(yOffset);
                c.sel = null;
                for (let j = 0; j < t.carets.length; j++) {
                    let d = t.carets[j];
                    if (c !== d && c.y == d.y) {
                        if (d.x > c.x) {
                            // console.log(xOffset);
                            d.x -= xOffset - s.length;
                            if (d.sel !== null) {d.sel[0] -= xOffset - s.length};
                            d.y -= yOffset;
                            if (d.sel !== null) {d.sel[1] -= yOffset};
                        }
                    }
                }
            }
        }   
    }
    if (s.length == 1 && !sel) {
        for (let i = 0; i < t.carets.length; i++) {
            let c = t.carets[i];
            // let line = t.data[c.y];
            t.data[c.y] = t.data[c.y].slice(0, c.x) + s + t.data[c.y].slice(c.x);
            let y = c.y;
            let x = c.x;
            for (let j = 0; j < t.carets.length; j++) {
               let d = t.carets[j];
               if (d.y == y && d.x >= x) {
                   d.x++;
               }
           }
         }
            // c.x++;
        } else if (s == "" && !sel) {
            for (let i = 0; i < t.carets.length; i++) {
            let c = t.carets[i];
            // let line = t.data[c.y];
            t.data[c.y] = t.data[c.y].slice(0, c.x - 1) + t.data[c.y].slice(c.x);
            let y = c.y;
            let x = c.x;
            for (let j = 0; j < t.carets.length; j++) {
               let d = t.carets[j];
               if (d.y == y && d.x >= x) {
                   d.x--;
               }
           }
         }
        }
};

// GrimoireTab.prototype.getGridPosition = function(x, y, mx, my) {
//     let g = this.data;
//     let nx = x;
//     let ny = y;
//     if (x == 0) {
//         if (y == 0) {
//             if (mx == 1) {
//                 if (g[y].length == 0) {
//                     ny++;
//                 } else {
//                     nx++;
//                 }
//             } else if (my == 1) {
//                 if (g.length > 1) {
//                     ny++;
//                 }
//             }
//         } else {
//             if (mx == -1) {
//                 ny--;
//                 nx = g[ny].length;
//             } else if (mx == 1) {
//                 if (x < g[y].length) {
//                     nx++;
//                 } else {
//                     ny++;
//                 }
//             } else if (my == -1) {
//                 ny--;
//             } else if (my == 1) {
//                 ny = Math.min(ny + 1, g[y].length - 1);
//             }
//         }
//     } else {
//         if (x < g[y])
//     }
//     return [nx, ny];
// };


GrimoireTab.prototype.select = function() {
    let t = this;
    // // if (t.selections.length == 0) {
    // //     for (let i = 0; i < t.carets.length; i++) {
    // //         let c = t.carets[i];
    // //         let sel = true;
    // //         if (c.x == 0 && c.y == 0 && (x == -1 || y == -1)) {
    // //             sel = false;               
    // //         }
    // //         if (c.x == t.data[c.y].length - 1 &&
    // //             c.y == t.data.length - 1 &&
    // //             (x == 1 || y == 1)
    // //             ) {
    // //             sel = false;
    // //         }
    // //         if (sel) {
    // //             // c.sel = []
    // //         }
    // //     }
    // // }
    // for (let i = 0; i < t.carets.length; i++) {
    //     let c = t.carets[i];
    //     if (x == -1 || y == -1) {
    //         if (c.sel == null) {c.sel == []}
    //     } else if (x == 1 || y == 1) {

    //     }
    //     // c.sel = [];
    //     // c.sel[0] = c.x;
    //     // c.sel[1] = 
    // }
    for (let i = 0; i < t.carets.length; i++) {
        let c = t.carets[i];
        if (c.sel == null) {
            c.sel = [c.x, c.y];
        }
    }
};

GrimoireTab.prototype.tick = function(s) {
    
};


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
    // drawAlligatorQuietVert(currentProgram);
    currentProgram = getProgram("new-flickering-dots");
    gl.useProgram(currentProgram);
    drawAlligatorQuiet(currentProgram);
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

GrimoireEditor.prototype.saveTab = function() {
    this.activeTab.saveTab();
};

GrimoireEditor.prototype.update = function(e) {
    let s = e.key;
    let t = this.activeTab;
    if (t !== null) {
        let updated = true;
        let updateDate = new Date();
        let historyState;
        let updateHistory = false;
        if (t.lastEdited == null) {
            historyState = t.prepareHistoryState();
            updateHistory = true;
        } else {
            let editDelta = updateDate.getTime() - t.lastEdited.getTime();
            // console.log(editDelta);
            if (editDelta > 3000) {
                historyState = t.prepareHistoryState();
                updateHistory = true;
            }
        };
    
        if (s == "ArrowDown" && e.altKey && t.scroll.y < t.data.length) {
            t.scroll.y++;
            t.moveCaretsY(1);
            updateHistory = false;
        } else if (s == "ArrowDown" && e.metaKey) {
            for (let i = 0; i < 23; i++) {t.moveCaretsY(1);}
            updateHistory = false;
        } else if (s == "ArrowUp" && e.metaKey) {
            for (let i = 0; i < 23; i++) {t.moveCaretsY(-1);}
            updateHistory = false;
        } else if (s == "ArrowUp" && e.altKey && t.scroll.y > 0) {
            t.scroll.y--;
            t.moveCaretsY(-1);
            updateHistory = false;
        } else if (s == "ArrowRight" && e.shiftKey) {
            t.select();
            t.moveCaretsX(1, true);
            // updateHistory = false;
        } else if (s == "ArrowRight") {
            t.moveCaretsX(1);
            updateHistory = false;
        } else if (s == "ArrowLeft" && e.shiftKey) {
            t.select();
            t.moveCaretsX(-1, true);
            // updateHistory = false;
        } else if (s == "ArrowLeft") {
            t.moveCaretsX(-1);
            updateHistory = false;
        } else if (s == "ArrowUp" && e.shiftKey) {
            t.select();
            t.moveCaretsY(-1, true);
            // updateHistory = false;
        } else if (s == "ArrowUp") {
            t.moveCaretsY(-1);
            updateHistory = false;
        } else if (s == "ArrowDown" && e.shiftKey) {
            t.select();
            t.moveCaretsY(1, true);
            // updateHistory = false;
        } else if (s == "ArrowDown") {
            t.moveCaretsY(1);
            updateHistory = false;
        } else if (s == "PageUp") {
            for (let i = 0; i < 23; i++) {t.moveCaretsY(-1);}
            updateHistory = false;
        } else if (s == "PageDown") {
            for (let i = 0; i < 23; i++) {t.moveCaretsY(1);}
            updateHistory = false;
        } else if (s == "z" && e.metaKey && e.shiftKey) {
            if (t.historyIndex < t.history.length - 1){
                t.applyHistoryState(t.historyIndex + 1);
            } else if (t.historyIndex == t.history.length - 1) {
                t.applyHeadState();
                t.attachedHeadState = true;
            }
            updated = false;
        } else if (s == "z" && e.metaKey) {
            if (t.attachedHeadState) {
                // t.logHistory(t.prepareHistoryState());
                // t.historyIndex++;
                // t.lastEdited = updateDate;
                t.headState = t.prepareHistoryState();
                t.attachedHeadState = false;
            }
            if (!t.attachedHeadState) {
                if (t.historyIndex > 0) {
                    t.applyHistoryState(t.historyIndex - 1);
                }
            }
            updated = false;
        } else if (s == "Enter" && e.shiftKey) {
            t.evaluateLine();
            updated = false;
        } else if (s == "Enter" && e.metaKey) {
            t.evaluateBlock();
            updated = false;
        } else if (s == "." && e.metaKey) {
            // if (t.lang == "scd") {
                socket.emit('interpretSuperCollider', 'CmdPeriod.run;', t.canvasPath)
            // }
            updated = false;
        } else if (s == "Enter") {
            t.addLine();
            // updated = false;
        } else if (s.length == 1) {
            t.update(s);
        } else if (s == "Backspace") {
            t.update("");
        } else {
            updated = false;
        }
        // if (updated && t.historyIndex < t.history.length) {
        if (updated && !t.attachedHeadState) {
            t.history.length = t.historyIndex;
            t.historyIndex = t.history.length;
            t.attachedHeadState = true;
        }
        if (updated && updateHistory) {
            t.logHistory(historyState);
            t.historyIndex++;
            t.lastEdited = updateDate;
            t.headState = t.prepareHistoryState();
        }
    }
};


marr = [];
for (let y = 0; y < 25; y++) {
    marr.push([]);
    for (let x = 0; x < 110; x++) {
        marr[y].push(0);
    }
}
updateHole = function() {
    if (ge.activeTab !== null) {
        for (let i = 0; i < 40; i++) {
            let x = Math.cos(i * 0.5 + drawCount * 0.125e2) * i / 40;
            let y = Math.sin(i * 0.5 + drawCount * 0.125e2) * i / 40;
            x = Math.floor(map(x, -1, 1, 0, 70) + 18);
            y = Math.floor(map(y, -1, 1, 0, 25));
            marr[y][x] = 10;
        }
        let g = ge.activeTab;
        for (let y = 0; y < 25; y++) {
            let padding = "";
            let row = [];
            for (let x = 0; x < 110; x++) {
                marr[y][x] = Math.max(0, marr[y][x] - Math.abs(Math.sin(drawCount * 1e-2)) * 0.25);
                let str = " .;jO0░▒▓█";
                row.push(str[Math.floor(marr[y][x])]);
                // g.data[y + 2 + g.scroll.y][x + 25] = str[marr[y][x]];
                // let yS = g.data[y + 2 + g.scroll.y];
                // g.data[y + 2 + g.scroll.y] = yS.substring(0, x) + str[marr[y][x]] + yS.substr(x);
            }
            g.data[y] = padding + row.join("") + padding;
        }
    }
};



search = function(s) {
    var re = new RegExp(s, 'g')
    for (let y = ge.activeTab.scroll.y + 1; y < ge.activeTab.data.length; y++) {
        let text = ge.activeTab.data[y];
        let t = text.match(re);
        if (t) {
            text.replace(re, function(a, x) {
                // console.log("x" + x);
                ge.activeTab.scroll.y = y;
                ge.activeTab.carets[0].y = y;
                ge.activeTab.carets[0].x = x + s.length;
            });
            break;
            // console.log(t);
        }
    }
}


updateDrawing = function(e) {
        let s = e.key;
    let t = ge.activeTab;
    if (t !== null) {
        if (s == "z" && e.metaKey && e.shiftKey) {
            if (t.historyIndex < t.history.length - 1){
                t.applyHistoryState(t.historyIndex + 1);
            } else if (t.historyIndex == t.history.length - 1) {
                t.applyHeadState();
                t.attachedHeadState = true;
            }
            // updated = false;
        } else if (s == "z" && e.metaKey) {
            if (t.attachedHeadState) {
                // t.logHistory(t.prepareHistoryState());
                // t.historyIndex++;
                // t.lastEdited = updateDate;
                t.headState = t.prepareHistoryState();
                t.attachedHeadState = false;
            }
            if (!t.attachedHeadState) {
                if (t.historyIndex > 0) {
                    t.applyHistoryState(t.historyIndex - 1);
                }
            }
            // updated = false;
        }
    }
}



let GrimoireCanvas = function() {
    this.data = [];
};

GrimoireCanvas.prototype.addBlankLine = function(n) {
    // let a = [];
    // for (let i = 0; i < 109; i++) {
    //     a[i] = 0;
    // }
    this.data[n] = [];    
};
GrimoireCanvas.prototype.addBlankGlyph = function(x, y) {
    if (this.data[y]) {
        this.data[y][x] = [];            
    }
};

// gc = new GrimoireCanvas();




// window.addEventListener('mousemove', e => {
//     if (e.altKey && ge.activeTab && mode == 2) {
//         let val = (e.shiftKey) ? 0 : 1;
//         // paint(fmouse[0], fmouse[1], smouse[0], smouse[1], val);
//         paint(val);
//     }
// });

// window.addEventListener('dragstart', e => {
//     if (mode == 1) {
//         let t = ge.activeTab;
//         t.carets = [];
//         let x = Math.min(t.data[fmouse[1] + t.scroll.y].length, fmouse[0]);
//         t.carets.push({x: x, y: fmouse[1] + t.scroll.y, dir: 0, curXRef: 0, sel: [x, fmouse[1] + t.scroll.y]});
//     }
// });
// window.addEventListener('dragend', e => {
//     if (mode == 1) {
//         let t = ge.activeTab;
//         // t.carets = [];
//         let x = Math.min(t.data[fmouse[1] + t.scroll.y].length, fmouse[0]);
//         t.carets[0].x = x;
//         t.carets[0].y = fmouse[1] + t.scroll.y;
//             // .push({x: x, y: fmouse[1] + t.scroll.y, dir: 0, curXRef: 0, sel: [x, fmouse[1] + t.scroll.y]});
//     }
// });

// socket.emit('saveFile', {path: "/Users/guillaumepelletier/Desktop/grimoirePainting.json", data: JSON.stringify(gc.data).replace(/null/g, "0")});




savePainting2 = function() {
    let path = "/Users/guillaumepelletier/Desktop/grimoirePaintingTest.json";
    // let data = JSON.stringify(gc.data).replace(/null/g, "0").replace(/0,/g, "2").replace(/1,/g, "3");
    let data = JSON.stringify(gc.data).replace(/null/g, "0");
    // data = data.replace(/(2)(\1*)/g, (a, b, c) => {
    //     // console.log(a);
    //     if (a.length > 3) {
    //         return "<" + a.length + ">"
    //     } else {
    //         return a;
    //     }
    // });
    // data = data.replace(/23/g, ".");
    // data = data.replace(/32/g, "-");
    // data = data.replace(/2\./g, "_");
    // data = data.replace(/33/g, "+");
    // data = data.replace(/33/g, "+");
    // data = data.replace(/\.\./g, "=");
    // data = data.replace(/\+\+/g, "/");
    socket.emit('saveFile', {path: path, data: data});
}


savePainting3 = function() {
    let path = "/Users/guillaumepelletier/Desktop/grimoirePaintingWork.txt";
    // let data = JSON.stringify(gc.data).replace(/null/g, "0").replace(/0,/g, "2").replace(/1,/g, "3");
    // let data = JSON.stringify(gc.data).replace(/null/g, "0");
    let data = "";
    for (let i = 0; i < gc.data.length; i++) {
        for (let j = 0; j < 109; j++) {
            for (let k = 0; k < 63; k++) {
                if (gc.data[i] && gc.data[i][j] && gc.data[i][j][k]) {
                    data = data + "1";
                } else {
                    data = data + "0"
                }
                // data = data + ((gc.data[i][j][k] == 1) ? "1" : "0");
            }
        }
    }
    asciiString = "";
    for (let i = 0; i < data.length; i += 7) {
        let ss = data.substring(i, Math.min(i + 7, data.length));
        // ss = ss.padStart(7, "0");
        let n = parseInt(ss, 2);
        if (n < 32) {
            ascii = "éÉèÈêÊëËçÇàÀùÙÇüÜäÄöÖÿŸćńóśźĄąĘę"[n];
        } else if (n == 127) {
            ascii = "Ż";
        } else {
            ascii = String.fromCharCode(n);
        }
        // let ascii = String.fromCharCode(parseInt(ss,2));
        asciiString = asciiString + ascii;
        // console.log (ss + ", " + ascii);
    }
    // console.log(asciiString.length);
    
    asciiString = asciiString.replace(/(é)(\1*)/g, (a, b, c) => {
        return (a.length > 3) ? "é" + a.length + "é" : a;
    });
    asciiString = asciiString.replace(/(Ż)(\1*)/g, (a, b, c) => {
        return (a.length > 3) ? "Ż" + a.length + "Ż" : a;
    });
    // console.log(asciiString.length);
    console.log(data.length);
    socket.emit('saveFile', {path: path, data: asciiString});
}
// savePainting3();

decodeAsciiString = function(s) {
    let str = "";
    str = s.replace(/(Ć)(\d+)(Ć)/g, (a, b, c) => {
        let mid = "";
        for (let i = 0; i < parseInt(c); i++) {mid = mid + "é";}
        return mid;
    });
    str = str.replace(/(Ł)(\d+)(Ł)/g, (a, b, c) => {
        let mid = "";
        for (let i = 0; i < parseInt(c); i++) {mid = mid + "Ż";}
        return mid;
    });
    // console.log(str.length);
    let bin = "";
    for (let i = 0; i < str.length; i++) {
        let match = false, matchIndex = null;
        let ref = "éÉèÈêÊëËçÇàÀùÙÇüÜäÄöÖÿŸćńóśźĄąĘę";
        for (let j = 0; j < ref.length; j++) {
            if (str[i] == ref[j]) {match = true; matchIndex = j;}
        }
        if (str[i] == "Ż") {
            bin = bin + (127).toString(2).padStart(7, "0");
        } else if (match) {
            if (i == (str.length - 1) && false) {
                bin = bin + matchIndex.toString(2);
            } else {
                bin = bin + matchIndex.toString(2).padStart(7, "0");
            }
                // (match ? ).charCodeAt(0).toString(2)
        } else {
            if (i == (str.length - 1) && false) {
                bin = bin + str[i].charCodeAt(0).toString(2);
            } else {
                bin = bin + str[i].charCodeAt(0).toString(2).padStart(7, "0");
            }
        }
    }
    // console.log(bin.length);
    let newGC = [];
    for (let h = 0; h < (bin.length/63/109); h += 1) {
        newGC.push([]);
        for (let i = 0; i < 109; i++) {
            newGC[h].push([]);
            for (let j = 0; j < 63; j++) {
                newGC[h][i][j] = parseInt(bin[j + (i * 63) + (h * 63 * 109)]);
            }
        }
    }
    return newGC;
}
// decodeAsciiString(asciiString)


makeFlatCanvas = function() {
    // let path = "/Users/guillaumepelletier/Desktop/grimoirePaintingFakerAscii.txt";
    // let data = JSON.stringify(gc.data).replace(/null/g, "0").replace(/0,/g, "2").replace(/1,/g, "3");
    // let data = JSON.stringify(gc.data).replace(/null/g, "0");
    let data = "";
    flatCanvas = [];
    for (let i = 0; i < gc.data.length; i++) {
        for (let j = 0; j < 109; j++) {
            for (let k = 0; k < 63; k++) {
                if (gc.data[i] && gc.data[i][j] && gc.data[i][j][k]) {
                    // data = data + "1";
                    flatCanvas.push(1);
                } else {
                    flatCanvas.push(0);
                    // data = data + "0"
                }
           }
        }
    }
   //  console.log(asciiString);
    // socket.emit('saveFile', {path: path, data: asciiString});
}
// makeFlatCanvas();



savePainting = function() {
    let path = "/Users/guillaumepelletier/Desktop/grimoirePainting2.json";
    let data = [];
    for (let y = 0; y < gc.data.length; y++){
        if (gc.data[y]) {
            for (let x = 0; x < gc.data[y].length; x++){
                if (gc.data[y][x]) {
                    for (let xy = 0; xy < gc.data[y][x].length; xy++) {
                        if (gc.data[y][x][xy]) {
                            data.push([y, x, xy]);
                        }
                    }
                }
            }
        }
    }
    socket.emit('saveFile', {path: path, data: JSON.stringify(data)});
};

// if (false) {

// ge.activeBrush = {
//     anchor: [3, 3],
//     data: [
//         [1, 0, 0, 0, 0, 0, 0, 1],
//         [0, 1, 0, 0, 0, 0, 1, 0],
//         [0, 0, 1, 0, 0, 1, 0, 0],
//         [0, 0, 0, 1, 1, 0, 0, 0],
//         [0, 0, 1, 0, 0, 1, 0, 0],
//         [0, 1, 0, 0, 0, 0, 1, 0],
//         [1, 0, 0, 0, 0, 0, 0, 1]
//     ]
// };

// ge.activeBrush = {
//     anchor: [0, 0],
//     data: [
//         [1]
//     ]
// };
    


    

//         ge.activeBrush = {
//     anchor: [2, 1],
//     data: getGlyph("O")
// };

let dot = new Brush({
    type: nib,
    anchor: [0, 0],
    data: [
        [1]
    ]
});


let smallQuillForward = new Brush({
    type: nib,
    anchor: [2, 1],
    data: [
        [0, 0, 0, 1, 1],
        [0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0],
        [1, 1, 0, 0, 0]
    ]
});


let smallQuillBackward = new Brush({
    type: nib,
    anchor: [2, 1],
    data: [
        [1, 1, 0, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 0, 1, 1]
    ]
});


// ge.activeBrush = {
//     anchor: [7, 7],
//     data: [
//         [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
//         [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
//         [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
//         [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
//         [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
//         [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
//         [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
//         [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
//         [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
//         [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
//         [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
//         [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
//         [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
//         [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1]
//     ]
// };



let bigQuillForward = new Brush({
    type: nib,
    anchor: [6, 6],
    data: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
});

thickerQuillForward = new Brush({
    type: quill,
    anchor: [6, 6],
    data:  [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
});

thickerQuillForward.data = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];




thickerQuillBackward = new Brush({
    type: quill,
    anchor: [6, 6],
    data:  [
        [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    ]
});

// // array 2d rotate algorithm
// let a = thickerQuillForward.data;
// let b = [];
// for (let y = 0; y < a[0].length; y++) {
//     b[y] = [];
//     for (let x = 0; x < a.length; x++) {
//         b[y][x] = a[x][y];
//     }
// }
// a = b;



thinQuillForward = new Brush({
    type: quill,
    anchor: [9, 9],
    data: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
});



thinQuillBackward = new Brush({
    type: quill,
    anchor: [9, 9],
    data: [
        [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0 ]
    ]
});


// Beautiful circle
if (false) {

let a = [];
let w = 100;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w; x++) {
        let v = dist(x, y * 1.75, hw, hw * 1.75);
        // let xx = Math.cos(v) * v * 0.01, yy = Math.sin(v) * v * 0.01;
        // v = dist(xx, yy * 1.9, hw, hw * 1.9);
         // 46.5, 36.5, 26.9, 17.85, 18.2, 11.95, 5
        // v = (v < 6.75) ? 1 : 0;
        // v = (xx + yy < 0.5) ? 1 : 0;
        v = (v < 46.5) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v * 2) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [hw, hw];
thinQuillBackward.data = a;

}


// Weird magical monolith
if (false) {

let a = [];
let w = 100;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w; x++) {
        let v = dist(x, y * 1.9, hw, hw * 1.9);
        let xx = Math.cos(v) * v * 0.01, yy = Math.sin(v) * v * 0.01;
        // v = dist(xx, yy * 1.9, hw, hw * 1.9);
         // 46.5, 36.5, 26.9, 17.85, 11.95, 5
        // v = (v < 6.75) ? 1 : 0;
        v = (xx + yy < 0.5) ? 1 : 0;
        // v = (v < 46.5) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v * 2) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [hw, hw];
thinQuillBackward.data = a;

}


if (false) {

let a = [];
let w = 100;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w * 2; x++) {
        let v = dist(x - (hw), y * 1.9, hw, hw * 1.9);
        let xx = Math.cos(v * 0.5) * v * 0.01, yy = Math.sin(v * 0.5) * v * 0.01;
        // v = dist(xx, yy * 1.9, hw, hw * 1.9);
         // 46.5, 36.5, 26.9, 17.85, 11.95, 5
        // v = (v < 6.75) ? 1 : 0;
        v = (xx + yy < 0.5) ? 1 : 0;
        // v = (v < 46.5) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v * 2) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [w, hw];
thinQuillBackward.data = a;

}



if (false) {

let a = [];
let w = 100;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w * 2; x++) {
        let v = dist(x - (hw), y * 1.9, hw, hw * 1.9);
        let xx = Math.cos(x + (y * w * 2)) * v * 0.01, yy = Math.sin(x + (y * w * 2)) * v * 0.01;
        // v = dist(xx, yy * 1.9, hw, hw * 1.9);
         // 46.5, 36.5, 26.9, 17.85, 11.95, 5
        // v = (v < 6.75) ? 1 : 0;
        v = (xx * yy < 0.25) ? 1 : 0;
        // v = (v < 46.5) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v * 2) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [w, hw];
thinQuillBackward.data = a;

}



if (false) {

let a = [];
let w = 100;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w * 2; x++) {
        let v = dist(x - (hw), y * 1.9, hw, hw * 1.9);
        let xx = Math.cos((x + (y * w * 2)) * 8) * v * 0.01, yy = Math.sin((x + (y * w * 2)) * 8) * v * 0.01;
        // v = dist(xx, yy * 1.9, hw, hw * 1.9);
         // 46.5, 36.5, 26.9, 17.85, 11.95, 5
        // v = (v < 6.75) ? 1 : 0;
        v = (xx * yy > 0.25) ? 1 : 0;
        // v = (v < 46.5) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v * 2) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [w, hw];
thinQuillBackward.data = a;

}



if (false) {

let a = [];
let w = 100;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w * 2; x++) {
        let v = dist(x - (hw), y * 1.9, hw, hw * 1.9);
        let xx = Math.cos((x + (y * w * 2)) * 8) * v * 0.01, yy = Math.sin((x + (y * w * 2)) * 8) * v * 0.01;
        // v = dist(xx, yy * 1.9, hw, hw * 1.9);
         // 46.5, 36.5, 26.9, 17.85, 11.95, 5
        // v = (v < 6.75) ? 1 : 0;
        v = (xx * yy > 0.05) ? 1 : 0;
        // v = (v < 46.5) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v * 2) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [w, hw];
thinQuillBackward.data = a;

}



if (false) {

let a = [];
let w = 100;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w * 2; x++) {
        let v = dist(x - (hw), y * 1.9, hw, hw * 1.9);
        let xx = Math.cos((x + (y * w * 2)) * 0.1) * v * 0.01, yy = Math.sin((x + (y * w * 2)) * 0.1) * v * 0.01;
        // v = dist(xx, yy * 1.9, hw, hw * 1.9);
         // 46.5, 36.5, 26.9, 17.85, 11.95, 5
        // v = (v < 6.75) ? 1 : 0;
        v = (xx * yy > 0.05) ? 1 : 0;
        // v = (v < 46.5) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v * 2) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [w, hw];
thinQuillBackward.data = a;

}


if (false) {

let a = [];
let w = 100;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w * 2; x++) {
        let v = dist(x - (hw), y * 1.9, hw, hw * 1.9);
        let xx = Math.cos((x + (y * w * 2)) * 0.1) * v * 0.005, yy = Math.sin((x + (y * w * 2)) * 0.1) * v * 0.005;
        // v = dist(xx, yy * 1.9, hw, hw * 1.9);
         // 46.5, 36.5, 26.9, 17.85, 11.95, 5
        // v = (v < 6.75) ? 1 : 0;
        v = (xx * yy > -0.02) ? 1 : 0;
        // v = (v < 46.5) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v * 2) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [w, hw];
thinQuillBackward.data = a;

}



if (false) {

let a = [];
let w = 100;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w * 2; x++) {
        let v = dist(x - (hw), y * 1.9, hw, hw * 1.9);
        let xx = Math.cos((x + (y * w * 2)) * 0.4) * v * 0.005, yy = Math.sin((x + (y * w * 2)) * 0.4) * v * 0.005;
        // v = dist(xx, yy * 1.9, hw, hw * 1.9);
         // 46.5, 36.5, 26.9, 17.85, 11.95, 5
        // v = (v < 6.75) ? 1 : 0;
        v = (xx * yy > -0.02) ? 1 : 0;
        // v = (v < 46.5) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v * 2) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [w, hw];
thinQuillBackward.data = a;

}



if (false) {

let a = [];
let w = 100;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w * 2; x++) {
        let v = dist(x - (hw), y * 1.9, hw, hw * 1.9);
        let x3 = Math.floor(x * 0.5), y3 = Math.floor(y * 0.5);
        let xx = Math.cos((x3 + (y3 * w * 2)) * 8) * v * 0.005, yy = Math.sin((x3 + (y3 * w * 2)) * 8) * v * 0.005;
        // v = dist(xx, yy * 1.9, hw, hw * 1.9);
         // 46.5, 36.5, 26.9, 17.85, 11.95, 5
        // v = (v < 6.75) ? 1 : 0;
        v = (xx * yy > -0.02) ? 1 : 0;
        // v = (v < 46.5) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v * 2) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [w, hw];
thinQuillBackward.data = a;

}


if (false) {

let a = [];
let w = 200;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w * 2; x++) {
        let v = dist(x - (hw), y * 1.9, hw, hw * 1.9);
        let x3 = Math.floor(x * 0.5), y3 = Math.floor(y * 0.5);
        let xx = Math.cos((x3 + (y3 * w * 2)) * v * 1e-3) * v * 0.003;
        let yy = Math.sin((x3 + (y3 * w * 2)) * v * 1e-3) * v * 0.003;
        // v = dist(xx, yy * 1.9, hw, hw * 1.9);
         // 46.5, 36.5, 26.9, 17.85, 11.95, 5
        // v = (v < 6.75) ? 1 : 0;
        v = (xx * yy < -0.02) ? 1 : 0;
        // v = (v < 46.5) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v * 2) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [w, hw];
thinQuillBackward.data = a;

}



if (false) {

let a = [];
let w = 200;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w * 2; x++) {
        let v = dist(x - (hw), y * 1.9, hw, hw * 1.9);
        let x3 = Math.floor(x * 0.125), y3 = Math.floor(y * 0.125);
        let xx = Math.cos((x3 + (y3 * w * 0.25)) * Math.sin(v * 0.05) * 1e-1) * v * 0.003;
        let yy = Math.sin((x3 + (y3 * w * 0.25)) * Math.sin(v * 0.05) * 1e-1) * v * 0.003;
        // v = dist(xx, yy * 1.9, hw, hw * 1.9);
         // 46.5, 36.5, 26.9, 17.85, 11.95, 5
        // v = (v < 6.75) ? 1 : 0;
        v = (xx * yy < -0.03) ? 1 : 0;
        // v = (v < 46.5) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v * 2) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [w, hw];
thinQuillBackward.data = a;

}


if (false) {

let a = [];
let w = 200;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w * 2; x++) {
        let v = dist(x - (hw), y * 1.9, hw, hw * 1.9);
        let x3 = Math.floor(x * 0.0625);
        let y3 = Math.floor(y * 0.0625);
        let xx = Math.cos((x3 + (y3 * w * 0.25)) * Math.sin(v * 0.05) * 1e-1) * v * 0.003;
        let yy = Math.sin((x3 + (y3 * w * 0.25)) * Math.sin(v * 0.05) * 1e-1) * v * 0.003;
        // v = dist(xx, yy * 1.9, hw, hw * 1.9);
         // 46.5, 36.5, 26.9, 17.85, 11.95, 5
        // v = (v < 6.75) ? 1 : 0;
        v = (xx + yy < -0.03) ? 1 : 0;
        // v = (v < 46.5) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v * 2) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [w, hw];
thinQuillBackward.data = a;

}



if (false) {

let a = [];
let w = 200;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w * 2; x++) {
        let v = dist(x - (hw), y * 1.9, hw, hw * 1.9);
        let x3 = Math.floor(x * 1);
        let y3 = Math.floor(y * 1);
        let xx = Math.cos((x3 + (y3 * w * 0.25)) * Math.sin(v * 0.05) * 1e-1) * v * 0.0003;
        let yy = Math.sin((x3 + (y3 * w * 0.25)) * Math.sin(v * 0.05) * 1e-1) * v * 0.0003;
        // v = dist(xx, yy * 1.9, hw, hw * 1.9);
         // 46.5, 36.5, 26.9, 17.85, 11.95, 5
        // v = (v < 6.75) ? 1 : 0;
        v = (xx + yy < -0.03) ? 1 : 0;
        // v = (v < 46.5) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v * 2) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [w, hw];
thinQuillBackward.data = a;

}



if (false) {

let a = [];
let w = 200;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w * 2; x++) {
        let v = dist(x - (hw), y * 1.9, hw, hw * 1.9);
        let x3 = Math.floor(x * 1);
        let y3 = Math.floor(y * 1);
        let xx = Math.cos((x3 + (y3 * w * 0.25)) * Math.sin(v * 0.0125) * 1e-1) * v * 0.0003;
        let yy = Math.sin((x3 + (y3 * w * 0.25)) * Math.sin(v * 0.0125) * 1e-1) * v * 0.0003;
        // v = dist(xx, yy * 1.9, hw, hw * 1.9);
         // 46.5, 36.5, 26.9, 17.85, 11.95, 5
        // v = (v < 6.75) ? 1 : 0;
        v = (xx + yy < -0.03) ? 1 : 0;
        // v = (v < 46.5) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v * 2) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [w, hw];
thinQuillBackward.data = a;

}



if (false) {

let a = [];
let w = 200;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w * 2; x++) {
        let v = dist(x - (hw), y * 1.9, hw, hw * 1.9);
        let x3 = Math.floor(x * 1);
        let y3 = Math.floor(y * 1);
        let xx = Math.cos((x3 + (y3 * w * 0.25) * Math.sin(v * 0.0125) * 1e-2)) * v * 0.0003;
        let yy = Math.sin((x3 + (y3 * w * 0.25) * Math.sin(v * 0.0125) * 1e-2)) * v * 0.0003;
        // v = dist(xx, yy * 1.9, hw, hw * 1.9);
         // 46.5, 36.5, 26.9, 17.85, 11.95, 5
        // v = (v < 6.75) ? 1 : 0;
        v = (xx + yy < -0.03) ? 1 : 0;
        // v = (v < 46.5) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v * 2) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [w, hw];
thinQuillBackward.data = a;

}



if (false) {

let a = [];
let w = 200;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w * 2; x++) {
        let v = dist(x - (hw), y * 1.9, hw, hw * 1.9);
        let x3 = Math.floor(x * 1);
        let y3 = Math.floor(y * 1);
        let xx = Math.cos((x3 + (y3 * w * 0.25) * Math.sin(v * 0.025) * 1e-2)) * v * 0.0003;
        let yy = Math.sin((x3 + (y3 * w * 0.25) * Math.sin(v * 0.025) * 1e-2)) * v * 0.0003;
        // v = dist(xx, yy * 1.9, hw, hw * 1.9);
         // 46.5, 36.5, 26.9, 17.85, 11.95, 5
        // v = (v < 6.75) ? 1 : 0;
        v = (xx + yy < -0.03) ? 1 : 0;
        // v = (v < 46.5) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v * 2) * 0.9 < -0.6) ? 1 : 0;
        // v = (v < 36.5 && Math.sin(v) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [w, hw];
thinQuillBackward.data = a;

}



if (false) {

let a = [];
let w = 200;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w * 2; x++) {
        let v = dist(x - (hw), y * 2, hw, hw * 2);
       v = (Math.random() > 0.5 && 
             (v < 156.5) && 
             Math.sin(v * 0.125) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [w, hw];
thinQuillBackward.data = a;

}



if (false) {

let a = [];
let w = 200;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w * 2; x++) {
        let v = dist(x - (hw), y * 2, hw, hw * 2);
       v = (Math.random() > 0.5 && 
             (v < 156.5) && 
             Math.sin(v * 0.25) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [w, hw];
thinQuillBackward.data = a;

}



if (false) {

let a = [];
let w = 150;
let hw = w/2;
for (let y = 0; y < w; y++) {
    a[y] = [];
    for (let x = 0; x < w * 2; x++) {
        let v = dist(x - (hw), y * 2, hw, hw * 2);
       v = (Math.random() > 0.5 && 
             (v < 156.5) && 
             Math.sin(v * 0.25) * 0.9 < -0.6) ? 1 : 0;
        a[y][x] = v;
    }
}
thinQuillBackward.anchor = [w, hw];
thinQuillBackward.data = a;

}

let thickQuillForward = new Brush({
    type: quill,
    anchor: [6, 6],
    data: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
});

thickQuillForward.data = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];


thickQuillBackward = new Brush({
    type: quill,
    anchor: [6, 6],
    data: [
        [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
        [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
        [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
        [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1 ]
   ]
});




thickQuillForward2 = new Brush({
    type: quill,
    anchor: [6, 6],
    data: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
});


thickQuillForward2.data = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];



thickQuillBackward2 = new Brush({
    type: quill,
    anchor: [6, 6],
    data: [
        [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 ]
    ]
});


thickQuillForward3 = new Brush({
    type: quill,
    anchor: [6, 6],
    data: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
});


thickQuillForward3.data = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];


thickQuillBackward3 = new Brush({
    type: quill,
    anchor: [6, 6],
    data: [
        [ 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
        [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
        [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
        [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
        [ 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 ]
    ]
});


thickQuillForward4 = new Brush({
    type: quill,
    anchor: [6, 6],
    data: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
});

thickQuillForward4.data = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];


thickQuillDownward4 = new Brush({
    type: quill,
    anchor: [6, 6],
    data: [
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
    ]
});



thickQuillForward5 = new Brush({
    type: quill,
    anchor: [6, 6],
    data: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
});

thickQuillForward5.data = [
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
];


thickQuillBackward5 = new Brush({
    type: quill,
    anchor: [6, 6],
    data: [
        [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 ]
    ]
});

let bigQuillBackWard = new Brush({
    type: nib,
    anchor: [6, 6],
    data: [
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]
    ]
});

let bigBlock = new Brush({
    type: pebble,
    anchor: [6, 6],
    data: [
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
    ]
});

let biggerBlock = new Brush({
    type: pebble,
    anchor: [11, 11],
    data: [
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
    ]
});


smallBlock = new Brush({
    type: pebble,
    anchor: [6, 6],
    data: [
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
    ]
});


smallBlock2 = new Brush({
    type: pebble,
    anchor: [6, 6],
    data: [
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0]
    ]
});

smallBlock3 = new Brush({
    type: pebble,
    anchor: [6, 6],
    data: [
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0]
    ]
});


smallBlock3.data = [
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0]
];



bigBlock2 = new Brush({
    type: pebble,
    anchor: [6, 6],
    data: [
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
    ]
});



bigBlock3 = new Brush({
    type: pebble,
    anchor: [6, 6],
    data: [
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
    ]
});

bigBlock4 = new Brush({
    type: pebble,
    anchor: [6, 6],
    data: [
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
    ]
});

bigBlock5 = new Brush({
    type: pebble,
    anchor: [6, 6],
    data: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
});

bigBlock6 = new Brush({
    type: pebble,
    anchor: [6, 6],
    data: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
});

let bigBubble = new Brush({
    type: pebble,
    anchor: [11, 11],
    data: [
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]
    ]
});


bigBubble.data = [
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];


let airBrush0 = new Brush({
    type: spray,
    anchor: [6, 6],
    data: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
    ]
});


let airBrush1 = new Brush({
    type: spray,
    anchor: [6, 6],
    data: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
});

resetBrushPositions = function() {
    ge.brushPositions = [];
    for (let y = 0; y < 25 * 9; y++) {
        ge.brushPositions[y] = [];
        for (let x = 0; x < 109 * 7; x++) {
            ge.brushPositions[y][x] = 0;
        }
    }
    // console.log("reset!");
    let yPaintMax = (showPatterns) ? 23 : 25;
    if (fmouse[1] < yPaintMax) {
        let b = ge.activeBrush;
        let tx = (fmouse[0] * 7) + smouse[0];
        let tox = Math.max(0, tx - b.anchor[0]);
        // let bix = (tx - tox) - b.anchor[0];
        let bix = Math.max(0, b.anchor[0] - tx);
        // let fox = Math.floor(tox / 7);
        // let sox = tox % 7;
        // let bixmax = Math.min(b.data[0].length, 763 - (tox + b.data[0].length));
        let bixmax = b.data[0].length - (Math.max((tx - b.anchor[0] + b.data[0].length) - 770, 0));
        // logJavaScriptConsole(bixmax);
        let ty = (fmouse[1] * 9) + smouse[1];
        let toy = Math.max(0, ty - b.anchor[1]);
        // let biy = ((ty - toy) - b.anchor[1]);
        let biy = Math.max(0, b.anchor[1] - ty);
        // logJavaScriptConsole(biy);
        // biy = Math.max(0, b.anchor[1] - ty);
        // biy = (b.anchor[1] > ty) ? b.anchor[1] - ty : 0;
        // let foy = Math.floor(toy / 9);
        // let soy = toy % 9;
        // let biymax = Math.min(b.data.length, 180 - (toy + b.data.length));
        let biymax = b.data.length - (Math.max((ty - b.anchor[1] + b.data.length) - (yPaintMax * 9), 0));
        // logJavaScriptConsole(biymax);
        // logJavaScriptConsole("ty: " + ty + " ,  b.anchor[1] :" +  b.anchor[1] + " , biy: " + biy + ", biymax: " + biymax);
        for (let y = biy; y < biymax; y++) {
            for (let x = bix; x < bixmax; x++) {
                     // console.log("x: " + x + ", y: " + y);
                let brush = b.data[y][x];
                if (brush == 1 || brush == "1") {
                    // if (y == biy) {logJavaScriptConsole(toy + y - b.anchor[1]);}
                    ge.brushPositions[toy + y - biy][tox + x - bix] = 1;
                }
            }
        }
    }
}



applyPointer = function() {
    // console.log("reset!");
    let b = [
        [2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2],
        [2, 0, 0, 2, 2, 0, 1, 1, 0, 0, 0, 0, 2, 2, 2],
        [0, 1, 1, 0, 2, 0, 1, 1, 0, 1, 0, 1, 0, 0, 2],
        [2, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0],
        [2, 2, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
        [2, 2, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2],
        [2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2],
        [2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 2]
    ];
    let tx = (fmouse[0] * 7) + smouse[0];
    // let tox = Math.max(0, tx - b.anchor[0]);
    // let bix = (tx - tox) - b.anchor[0];
    // let bix = Math.max(0, b.anchor[0] - tx);
    bix = 0;
    // let fox = Math.floor(tox / 7);
    // let sox = tox % 7;
    // let bixmax = Math.min(b.data[0].length, 763 - (tox + b.data[0].length));
    let bixmax = b[0].length - (Math.max((tx + b[0].length) - 763, 0));
    // logJavaScriptConsole(bixmax);
    let ty = (fmouse[1] * 9) + smouse[1];
    // let toy = Math.max(0, ty - b.anchor[1]);
    // let biy = ((ty - toy) - b.anchor[1]);
    // let biy = Math.max(0, b.anchor[1] - ty);
    let biy = 0;
    // logJavaScriptConsole(biy);
    // biy = Math.max(0, b.anchor[1] - ty);
    // biy = (b.anchor[1] > ty) ? b.anchor[1] - ty : 0;
    // let foy = Math.floor(toy / 9);
    // let soy = toy % 9;
    // let biymax = Math.min(b.data.length, 180 - (toy + b.data.length));
    let biymax = b.length - (Math.max((ty + b.length) - 225, 0));
    // logJavaScriptConsole(biymax);
    // logJavaScriptConsole("ty: " + ty + " ,  b.anchor[1] :" +  b.anchor[1] + " , biy: " + biy + ", biymax: " + biymax);
    for (let y = biy; y < biymax; y++) {
        for (let x = bix; x < bixmax; x++) {
                 // console.log("x: " + x + ", y: " + y);
            let brush = b[y][x];
            if (brush == 1) {
                ge.brushPositions[ty + y][tx + x - 8] = 0;
            } else if (brush == 0) {
                // console.log("Bruh");
                ge.brushPositions[ty + y][tx + x - 8] = 1;
            }
        }
    }
}

// resetBrushPositions();


// }

patternScale = 1;
paintingMode = 0;
paintingKeys = function(e) {
    let s = e.key;
    let t = ge.activeTab;
    if (s == "ArrowDown") {
        // t.moveCaretsY(1);
        t.scroll.y++;
    } else if (s == "ArrowUp") {
        // t.moveCaretsY(-1);
        t.scroll.y = Math.max(0, t.scroll.y - 1);
    } else if (s == "s") {
        switch(patternScale) {
            case 1: patternScale = 0.5; break;
            case 0.5: patternScale = 0.25; break;
            case 0.25: patternScale = 1; break;
        }
    } else if (s == "m") {
        paintingMode = (paintingMode + 1) % 3;
        ge.paintingFunction = [paintUnit, paintUnitAdd, paintUnitSubtract][paintingMode];
    } else if (s == "t") {
        brushIndex = 0;
        typeIndex = (typeIndex + 1) % types.length;
        ge.activeBrush = types[typeIndex][brushIndex];
        resetBrushPositions(); 
    } else if (s == "b") {
        brushIndex = (brushIndex + 1) % types[typeIndex].length;
        ge.activeBrush = types[typeIndex][brushIndex];
        resetBrushPositions(); 
    } else if (s == "r") {
        brushRandom = !brushRandom;
    } else if (s == "o") {
        ge.toggleOther();
    } else if (s == "Tab") {
        showPatterns = !showPatterns;
        resetBrushPositions();
    } else if (s == "PageUp") {
        ge.t.scroll.y = Math.max(0, ge.t.scroll.y - 25);
    } else if (s == "PageDown") {
        ge.t.scroll.y += 25;
    }
    // console.log(s);
};



wheelY = function(e) {
   if (ge.recording) {
        ge.recordingSession.push([drawCount, {
            name: "wheel",
            deltaY: e.deltaY
        }]);
    }
    if (ge.activeTab !== null && grimoire) {
        let delta = Math.floor(e.deltaY * 0.5);
        if (e.deltaY > 0) {
            ge.activeTab.scroll.y = Math.min(ge.activeTab.scroll.y + delta, ge.activeTab.data.length - 25);
        } else if (e.deltaY < 0) {
            ge.activeTab.scroll.y = Math.max(ge.activeTab.scroll.y + delta, 0);
        }
    }
};

window.addEventListener('wheel', wheelY);

let GrimoireControl = function(o) {
    this.tab = o.tab;
    this.spanX = [40, 60];
    this.spanY = [250, 260];
    this.active = true;
}

GrimoireControl.prototype.click = function(fx, fy, sx, sy) {
};

GrimoireControl.prototype.deactivate = function() {
};

GrimoireControl.prototype.activate = function() {
};


BrushFromString = function(s = "a", x = 1, y = 1) {
    let data = [];
    for (let i = 0; i < (y * 9); i++) {
        data.push([]);
        for (let j = 0; j < (x * 7) * s.length; j++) {
            let g = getGlyph(s[Math.floor(j/(x * 7))]);
            data[i][j] = parseInt(g[Math.floor(i/y)][Math.floor(j/x) - Math.floor(j/(x * 7))*7]);
        }
    }
    let o = {
        anchor: [0, y * 7 - 1],
        type: spray,
        data: data
    };
    let br = new Brush(o);
    return br;
};


BrushFromString2 = function(s = "a", xs = 1, ys = 1, x = [1, 1, 1, 1, 1, 1, 1], y = [1, 1, 1, 1, 1, 1, 1, 1, 1]) {
    let data = [];
    for (let i = 0; i < 9; i++) {
        data.push([]);
        for (let j = 0; j < 7 * s.length; j++) {
            let g = getGlyph(s[Math.floor(j / 7)]);
            data[i][j] = g[i][j % 7];
        }
    }
    for (let i = data.length - 1; i >= 0; i--) {
        for (let m = 1; m < (y[i] * ys); m++) {
            data.splice(i, 0, data[i].slice());
        }
    }
    for (let i = 0; i < data.length; i++) {
        for (let j = data[i].length - 1; j >= 0; j--) {
            for (let m = 1; m < (x[j % 7] * xs); m++) {
                data[i].splice(j, 0, data[i][j]);
            }
        }
    }
    let o = {
        anchor: [0, data.length - 1],
        type: spray,
        data: data
    };
    let br = new Brush(o);
    return br;
};


BrushFromString3 = function(s = "a", x = [1, 1, 1, 1, 1, 1, 1], y = [1, 1, 1, 1, 1, 1, 1, 1, 1], freq = 1, amp = 1) {
    let data = [];
    for (let i = 0; i < 9; i++) {
        data.push([]);
        for (let j = 0; j < 7 * s.length; j++) {
            let g = getGlyph(s[Math.floor(j / 7)]);
            data[i][j] = g[i][j % 7];
        }
    }
    for (let i = data.length - 1; i >= 0; i--) {
        for (let m = 1; m < y[i]; m++) {
            data.splice(i, 0, data[i].slice());
        }
    }
    for (let i = 0; i < data.length; i++) {
        for (let j = data[i].length - 1; j >= 0; j--) {
            for (let m = 1; m < x[j % 7]; m++) {
                data[i].splice(j, 0, data[i][j]);
            }
        }
    }
    for (let i = 0; i < data.length; i++) {
        arrayRotate(data[i], Math.floor(Math.sin(i * freq) * amp));
    }
    function arrayRotate(arr, count) {
        count -= arr.length * Math.floor(count / arr.length);
        arr.push.apply(arr, arr.splice(0, count));
        return arr;
    }
    let o = {
        anchor: [0, data.length - 1],
        type: spray,
        data: data
    };
    let br = new Brush(o);
    return br;
};

// Basic xFade with white noise

makeXFadeArray = function() {
    xFadeArray = new Uint8Array(109 * 25 * 7 * 9);
    for (let y = 0; y < 25 * 9; y++) {
        for (let x = 0; x < 109 * 7; x++) {
            xFadeArray[x + (y * 109 * 7)] = Math.floor(Math.random() * 256);
        }
    }
};
// makeXFadeArray();

// Fancier xFade with OpenSimplex noise

makeXFadeArray = function() {
    xFadeArray = new Uint8Array(109 * 25 * 7 * 9);
    let lerp = function(e,t,r){return r*(t-e)+e};
    for (let y = 0; y < 25 * 9; y++) {
        for (let x = 0; x < 109 * 7; x++) {
            let nA = Math.floor((openSimplex.noise2D(x * 0.025, y * 0.025) * 0.5 + 0.5) * 256);
            let nB = Math.floor(Math.random() * 256);
            let nC = Math.floor(lerp(nA, nB, 0.25));
            xFadeArray[x + (y * 109 * 7)] = nC;
        }
    }
};
makeXFadeArray();


GrimoireEditor.prototype.xFadeCanvases = function(cA, xA0, yA0, xA1, yA1, cB, xB, yB, cC, xC, yC, interpolation, interpolationArray = xFadeArray) {
    cA = this.getTab(cA).canvas.data;
    cB = this.getTab(cB).canvas.data;
    cC = this.getTab(cC).canvas.data;
    interpolation = Math.floor(interpolation * 256);
    for (let i = yA0; i < yA1; i++) {
        for (let j = xA0; j < xA1; j++) {
            for (let k = 0; k < 7 * 9; k++) {
                let x = (j - xA0) * 7 + (k % 7);
                let y = (i - yA0) * 9 + Math.floor(k / 7);
                let oneD = x + (y * 109 * 7);
                if (interpolationArray[oneD] < interpolation) {
                    cC[yC + i - yA0][xC + j - xA0][k] = cA[i][j][k];
                } else {
                    cC[yC + i - yA0][xC + j - xA0][k] = cB[yB + i - yA0][xB + j - xA0][k];
                }
            }
        }
    }
};

GrimoireEditor.prototype.xFadeWithZeroes = function(cA, xA0, yA0, xA1, yA1, cC, xC, yC, interpolation, interpolationArray = xFadeArray) {
    cA = this.getTab(cA).canvas.data;
    cC = this.getTab(cC).canvas.data;
    interpolation = Math.floor(interpolation * 256);
    for (let i = yA0; i < yA1; i++) {
        for (let j = xA0; j < xA1; j++) {
            for (let k = 0; k < 7 * 9; k++) {
                let x = (j - xA0) * 7 + (k % 7);
                let y = (i - yA0) * 9 + Math.floor(k / 7);
                let oneD = x + (y * 109 * 7);
                if (interpolationArray[oneD] > interpolation) {
                    cC[yC + i - yA0][xC + j - xA0][k] = cA[i][j][k];
                } else {
                    cC[yC + i - yA0][xC + j - xA0][k] = 0;
                }
            }
        }
    }
};

GrimoireEditor.prototype.xFadeWithZeroesAdd = function(cA, xA0, yA0, xA1, yA1, cC, xC, yC, interpolation, interpolationArray = xFadeArray) {
    cA = this.getTab(cA).canvas.data;
    cC = this.getTab(cC).canvas.data;
    interpolation = Math.floor(interpolation * 256);
    for (let i = yA0; i < yA1; i++) {
        for (let j = xA0; j < xA1; j++) {
            for (let k = 0; k < 7 * 9; k++) {
                let x = (j - xA0) * 7 + (k % 7);
                let y = (i - yA0) * 9 + Math.floor(k / 7);
                let oneD = x + (y * 109 * 7);
                if (interpolationArray[oneD] > interpolation) {
                    if (cC[yC + i - yA0][xC + j - xA0][k] == 0) {
                        cC[yC + i - yA0][xC + j - xA0][k] = cA[i][j][k];
                    }
                }
            }
        }
    }
};

GrimoireEditor.prototype.makeBlurredArray = function(c0, x0, y0, x1, y1) {
    let w = (x1 - x0) * 7;
    let h = (y1 - y0) * 9;
    let data = new Uint8Array(w * h);
    let oneD = 0;
    let gc = ge.getTab(c0).canvas.data;
    // Transforming the canvas data into a one-dimensional array.
    if (gc.length > 0) {
        for (let i = y0; i < y1; i++) {
            for (let j = x0; j < x1; j++) {
                for (let k = 0; k < 63; k++) {
                    let x = (j - x0) * 7 + (k % 7);
                    let y = (i - y0) * 9 + Math.floor(k / 7);
                    let oneD = Math.floor(x + (y * w));
                    data[oneD] = (gc[i] && gc[i][j] && gc[i][j][k]) ? 255 : 0;
                }
            }
        }
    }
    // Blurring the array
    function getValue(x, y) {
        let v;
        if (x >= 0 && x < w && y >= 0 && y < h) {
            let oneD = x + (y * w);
            v = [data[oneD], 1];
        } else {
            v = [0, 0];
        }
        return v;
    }
    function calculateNeighbors(x, y) {
        var n = [];
        n.push(getValue(x - 1, y - 1));
        n.push(getValue(x, y - 1));
        n.push(getValue(x + 1, y - 1));
        n.push(getValue(x - 1, y));
        n.push(getValue(x + 1, y));
        n.push(getValue(x - 1, y + 1));
        n.push(getValue(x, y + 1));
        n.push(getValue(x + 1, y + 1));
        
        n.push(getValue(x - 2, y - 2));
        n.push(getValue(x - 1, y - 2));
        n.push(getValue(x, y - 2));
        n.push(getValue(x + 1, y - 2));
        n.push(getValue(x + 2, y - 2));
        
        n.push(getValue(x + 2, y - 1));
        n.push(getValue(x + 2, y));
        n.push(getValue(x + 2, y + 1));
        n.push(getValue(x + 2, y + 2));
        
        n.push(getValue(x + 1, y + 2));
        n.push(getValue(x, y + 2));
        n.push(getValue(x - 1, y + 2));
        n.push(getValue(x - 2, y + 2));
        
        n.push(getValue(x - 2, y + 1));
        n.push(getValue(x - 2, y));
        n.push(getValue(x - 2, y - 1));
        return n;
    };
    function blur() {
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                let oneD = x + (y * w);
                let neighbors = calculateNeighbors(x, y);
                let n = 0;
                let sum = 0;
                for (let i = 0; i < neighbors.length; i++) {
                    if (neighbors[i][1] == 1) {
                        sum += neighbors[i][0];
                        n++;
                    }
                }
                let newValue = data[oneD] * 0 + (sum / n * 1);
                data2[oneD] = Math.min(newValue, 250);
            }
        }
    };
    let dataOriginal = Uint8Array.from(data);
    let data2;
    for (let i = 0; i < 16; i++) {
        data2 = new Uint8Array(w * h);
        blur();
        data = data2;
    }
    // Adding some white noise to the blurred array
    function lerp(e,t,r){return r*(t-e)+e};
    let data3 = new Uint8Array(109 * 25 * 7 * 9);
    for (let i = 0; i < data.length; i++) {
        let nA = data[i];
        let nB = Math.floor(Math.random() * 256);
        let nC = Math.floor(lerp(nA, nB, 0.25));
        data3[i] = nC;
    }
    return data3;
};

GrimoireEditor.prototype.blurCanvas = function(c0, x0, y0, x1, y1, c1, x2, y2) {
    let w = (x1 - x0) * 7;
    let h = (y1 - y0) * 9;
    let data = new Uint8Array(w * h);
    let oneD = 0;
    let gc = ge.getTab(c0).canvas.data;
    // Transforming the canvas data into a one-dimensional array.
    if (gc.length > 0) {
        for (let i = y0; i < y1; i++) {
            for (let j = x0; j < x1; j++) {
                for (let k = 0; k < 63; k++) {
                    let x = (j - x0) * 7 + (k % 7);
                    let y = (i - y0) * 9 + Math.floor(k / 7);
                    let oneD = Math.floor(x + (y * w));
                    data[oneD] = (gc[i] && gc[i][j] && gc[i][j][k]) ? 255 : 0;
                }
            }
        }
    }
    // Blurring the array
    function getValue(x, y) {
        let v;
        if (x >= 0 && x < w && y >= 0 && y < h) {
            let oneD = x + (y * w);
            v = [data[oneD], 1];
        } else {
            v = [0, 0];
        }
        return v;
    }
    function calculateNeighbors(x, y) {
        var n = [];
        n.push(getValue(x - 1, y - 1));
        n.push(getValue(x, y - 1));
        n.push(getValue(x + 1, y - 1));
        n.push(getValue(x - 1, y));
        n.push(getValue(x + 1, y));
        n.push(getValue(x - 1, y + 1));
        n.push(getValue(x, y + 1));
        n.push(getValue(x + 1, y + 1));
        
        n.push(getValue(x - 2, y - 2));
        n.push(getValue(x - 1, y - 2));
        n.push(getValue(x, y - 2));
        n.push(getValue(x + 1, y - 2));
        n.push(getValue(x + 2, y - 2));
        
        
        n.push(getValue(x + 2, y - 1));
        n.push(getValue(x + 2, y));
        n.push(getValue(x + 2, y + 1));
        n.push(getValue(x + 2, y + 2));
        
        n.push(getValue(x + 1, y + 2));
        n.push(getValue(x, y + 2));
        n.push(getValue(x - 1, y + 2));
        n.push(getValue(x - 2, y + 2));
        
        n.push(getValue(x - 2, y + 1));
        n.push(getValue(x - 2, y));
        n.push(getValue(x - 2, y - 1));
        return n;
    };
    blur = function() {
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                let oneD = x + (y * w);
                let neighbors = calculateNeighbors(x, y);
                let n = 0;
                let sum = 0;
                for (let i = 0; i < neighbors.length; i++) {
                    if (neighbors[i][1] == 1) {
                        sum += neighbors[i][0];
                        n++;
                    }
                }
                let newValue = data[oneD] * 0 + (sum / n * 1);
                newValue = Math.max(38, newValue);
                data2[oneD] = Math.min(newValue, 255);
                // sums += newValue;
            }
        }
    };
    let dataOriginal = Uint8Array.from(data);
    let data2;
    for (let i = 0; i < 4; i++) {
        data2 = new Uint8Array(w * h);
        blur();
        data = data2;
    }
    //  Dithering the blurred array
    let dith = Uint8Array.from(data2);
    for (let i = 0; i < w * h; i++) {
        let newPixel = dith[i] < 129 ? 0 : 255;
        let err = Math.floor((dith[i] - newPixel) / 8);
        dith[i] = newPixel;
        let m = Math.floor(Math.random() * 6);
        // m += 5 + Math.floor(i * 0.1);
        m = 3;
        dith[i       + 1*m ] += err;
        dith[i       + 2*m ] += err;
        dith[i + 1*m*w - 1*m ] += err;
        dith[i + 1*m*w     ] += err;
        dith[i + 1*m*w + 1*m ] += err;
        dith[i + 2*m*w     ] += err;
        // sums += dith[i];
    }
    //  Drawing the dithered array back into the visible canvas.
    let canvasDestination = ge.getTab(c1).canvas.data;
    paintStatic = function(fx, fy, sx, sy, val = 1) {
        let c = canvasDestination;
        let y = fy;
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
    };
    for (let x = x2 * 7; x < w + x2 * 7; x++) {
        for (let y = y2 * 9; y < h + y2 * 9; y++) {
            let oneD = x - (x2 * 7) + ((y - y2*9) * w);
            let val = (dith[oneD] == 255) ? 1 : 0;
            // let val2 = (dataOriginal[oneD] == 255) ? 1 : 0;
            // val = (Math.round(Math.random() * 1)) ? val : Math.min(val2 + val, 1);
            paintStatic(Math.floor(x/7),Math.floor(y/9), x%7,y%9, val);
        }
    }
    return data;
};
// sss = ge.blurCanvas("sssss.scd", 0, 365, 109, 365 + 25, "sketch.js", 0, 0);





GrimoireEditor.prototype.blurCanvas = function(c0, x0, y0, x1, y1, c1, x2, y2) {
    let w = (x1 - x0) * 7;
    let h = (y1 - y0) * 9;
    let data = new Uint8Array(w * h);
    let oneD = 0;
    let gc = ge.getTab(c0).canvas.data;
    // Transforming the canvas data into a one-dimensional array.
    if (gc.length > 0) {
        for (let i = y0; i < y1; i++) {
            for (let j = x0; j < x1; j++) {
                for (let k = 0; k < 63; k++) {
                    let x = (j - x0) * 7 + (k % 7);
                    let y = (i - y0) * 9 + Math.floor(k / 7);
                    let oneD = Math.floor(x + (y * w));
                    data[oneD] = (gc[i] && gc[i][j] && gc[i][j][k]) ? 255 : 0;
                }
            }
        }
    }
    // Blurring the array
    function getValue(x, y) {
        let v;
        if (x >= 0 && x < w && y >= 0 && y < h) {
            let oneD = x + (y * w);
            v = [data[oneD], 1];
        } else {
            v = [0, 0];
        }
        return v;
    }
    function calculateNeighbors(x, y) {
        var n = [];
        n.push(getValue(x - 1, y - 1));
        n.push(getValue(x, y - 1));
        n.push(getValue(x + 1, y - 1));
        n.push(getValue(x - 1, y));
        n.push(getValue(x + 1, y));
        n.push(getValue(x - 1, y + 1));
        n.push(getValue(x, y + 1));
        n.push(getValue(x + 1, y + 1));
        
        n.push(getValue(x - 2, y - 2));
        n.push(getValue(x - 1, y - 2));
        n.push(getValue(x, y - 2));
        n.push(getValue(x + 1, y - 2));
        n.push(getValue(x + 2, y - 2));
        
        
        n.push(getValue(x + 2, y - 1));
        n.push(getValue(x + 2, y));
        n.push(getValue(x + 2, y + 1));
        n.push(getValue(x + 2, y + 2));
        
        n.push(getValue(x + 1, y + 2));
        n.push(getValue(x, y + 2));
        n.push(getValue(x - 1, y + 2));
        n.push(getValue(x - 2, y + 2));
        
        n.push(getValue(x - 2, y + 1));
        n.push(getValue(x - 2, y));
        n.push(getValue(x - 2, y - 1));
        return n;
    };
    blur = function() {
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                let oneD = x + (y * w);
                let neighbors = calculateNeighbors(x, y);
                let n = 0;
                let sum = 0;
                for (let i = 0; i < neighbors.length; i++) {
                    if (neighbors[i][1] == 1) {
                        sum += neighbors[i][0];
                        n++;
                    }
                }
                let newValue = data[oneD] * 0 + (sum / n * 1);
                // newValue = Math.max(40, newValue);
                data2[oneD] = Math.min(newValue, 250);
                // sums += newValue;
            }
        }
    };
    let dataOriginal = Uint8Array.from(data);
    let data2;
    for (let i = 0; i < 16; i++) {
        data2 = new Uint8Array(w * h);
        blur();
        data = data2;
    }
    //  Dithering the blurred array
    let dith = Float32Array.from(data2);
    for (let i = 0; i < w * h; i++) {
        let newPixel = dith[i] < 129 ? 0 : 255;
        let err = Math.floor((dith[i] - newPixel));
        dith[i] = newPixel;
        let m = Math.floor(Math.random() * 10);
        m = 50 + Math.floor(i * 0.1);
        m = 1;
        dith[i       + 1*m ] += err * 7 / 16;
        dith[i + 1*m*w - 1*m ] += err * 3 / 16;
        dith[i + 1*m*w     ] += err * 5 / 16;
        dith[i + 1*m*w + 1*m ] += err * 1 / 16;
        // sums += dith[i];
    }
    //  Drawing the dithered array back into the visible canvas.
    let canvasDestination = ge.getTab(c1).canvas.data;
    paintStatic = function(fx, fy, sx, sy, val = 1) {
        let c = canvasDestination;
        let y = fy;
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
    };
    for (let x = x2 * 7; x < w + x2 * 7; x++) {
        for (let y = y2 * 9; y < h + y2 * 9; y++) {
            let oneD = x - (x2 * 7) + ((y - y2*9) * w);
            let val = (dith[oneD] > 129) ? 1 : 0;
            let val2 = (dataOriginal[oneD] == 255) ? 1 : 0;
            val = (Math.round(Math.random() * 0.25)) ? val : Math.min(val2 + val, 1);
            paintStatic(Math.floor(x/7),Math.floor(y/9), x%7,y%9, val);
        }
    }
    return data;
};
// sss = ge.blurCanvas("sssss.scd", 0, 411, 109, 411 + 25, "sketch.js", 0, 0);




GrimoireEditor.prototype.blurCanvas = function(c0, x0, y0, x1, y1, c1, x2, y2) {
    let w = (x1 - x0) * 7;
    let h = (y1 - y0) * 9;
    let data = new Uint8Array(w * h);
    let oneD = 0;
    let gc = ge.getTab(c0).canvas.data;
    // Transforming the canvas data into a one-dimensional array.
    if (gc.length > 0) {
        for (let i = y0; i < y1; i++) {
            for (let j = x0; j < x1; j++) {
                for (let k = 0; k < 63; k++) {
                    let x = (j - x0) * 7 + (k % 7);
                    let y = (i - y0) * 9 + Math.floor(k / 7);
                    let oneD = Math.floor(x + (y * w));
                    data[oneD] = (gc[i] && gc[i][j] && gc[i][j][k]) ? 255 : 0;
                }
            }
        }
    }
    // Blurring the array
    function getValue(x, y) {
        let v;
        if (x >= 0 && x < w && y >= 0 && y < h) {
            let oneD = x + (y * w);
            v = [data[oneD], 1];
        } else {
            v = [0, 0];
        }
        return v;
    }
    function calculateNeighbors(x, y) {
        var n = [];
        n.push(getValue(x - 1, y - 1));
        n.push(getValue(x, y - 1));
        n.push(getValue(x + 1, y - 1));
        n.push(getValue(x - 1, y));
        n.push(getValue(x + 1, y));
        n.push(getValue(x - 1, y + 1));
        n.push(getValue(x, y + 1));
        n.push(getValue(x + 1, y + 1));
        
        n.push(getValue(x - 2, y - 2));
        n.push(getValue(x - 1, y - 2));
        n.push(getValue(x, y - 2));
        n.push(getValue(x + 1, y - 2));
        n.push(getValue(x + 2, y - 2));
        
        
        n.push(getValue(x + 2, y - 1));
        n.push(getValue(x + 2, y));
        n.push(getValue(x + 2, y + 1));
        n.push(getValue(x + 2, y + 2));
        
        n.push(getValue(x + 1, y + 2));
        n.push(getValue(x, y + 2));
        n.push(getValue(x - 1, y + 2));
        n.push(getValue(x - 2, y + 2));
        
        n.push(getValue(x - 2, y + 1));
        n.push(getValue(x - 2, y));
        n.push(getValue(x - 2, y - 1));
        return n;
    };
    blur = function() {
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                let oneD = x + (y * w);
                let neighbors = calculateNeighbors(x, y);
                let n = 0;
                let sum = 0;
                for (let i = 0; i < neighbors.length; i++) {
                    if (neighbors[i][1] == 1) {
                        sum += neighbors[i][0];
                        n++;
                    }
                }
                let newValue = data[oneD] * 0 + (sum / n * 1);
                // newValue = Math.max(40, newValue);
                data2[oneD] = Math.min(newValue, 250);
                // sums += newValue;
            }
        }
    };
    let dataOriginal = Uint8Array.from(data);
    let data2;
    for (let i = 0; i < 16; i++) {
        data2 = new Uint8Array(w * h);
        blur();
        data = data2;
    }
    //  Dithering the blurred array
    let bayerThresholdMap = [
          [  15, 135,  45, 165 ],
          [ 195,  75, 225, 105 ],
          [  60, 180,  30, 150 ],
          [ 240, 120, 210,  90 ]
        ];
    let dith = Float32Array.from(data2);
    for (let i = 0; i < w * h; i++) {
        let x = i % w;
        let y = Math.floor(i / w);
        let map = Math.floor((dith[i] + bayerThresholdMap[x % 4][y % 4]) / 2 );
        dith[i] = (map < lerp(127, Math.random() * 127, 0.125)) ? 0 : 255;
    }
    //  Drawing the dithered array back into the visible canvas.
    let canvasDestination = ge.getTab(c1).canvas.data;
    paintStatic = function(fx, fy, sx, sy, val = 1) {
        let c = canvasDestination;
        let y = fy;
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
    };
    for (let x = x2 * 7; x < w + x2 * 7; x++) {
        for (let y = y2 * 9; y < h + y2 * 9; y++) {
            let oneD = x - (x2 * 7) + ((y - y2*9) * w);
            let val = (dith[oneD] > 129) ? 1 : 0;
            let val2 = (dataOriginal[oneD] == 255) ? 1 : 0;
            val = (Math.round(Math.random() * 0.25)) ? val : Math.min(val2 + val, 1);
            paintStatic(Math.floor(x/7),Math.floor(y/9), x%7,y%9, val);
        }
    }
    return data;
};
// sss = ge.blurCanvas("sssss.scd", 0, 365, 109, 365 + 25, "sketch.js", 0, 0);