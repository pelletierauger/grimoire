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
    // function lerp(e,t,r){return r*(t-e)+e};
    // let data3 = new Uint8Array(109 * 25 * 7 * 9);
    // for (let i = 0; i < data.length; i++) {
    //     let nA = data[i];
    //     let nB = Math.floor(Math.random() * 256);
    //     let nC = Math.floor(lerp(nA, nB, 0.25));
    //     data3[i] = nC;
    // }
    return data;
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
                let nA = interpolationArray[oneD];
                let nB = Math.floor(Math.random() * 256);
                let nC = Math.floor(lerp(nA, nB, 0.25));
                if (nC  > interpolation) {
                    let takeVal = (cA[i] && cA[i][j] && cA[i][j][k]) ? cA[i][j][k] : 0;
                    if (cC[yC + i - yA0]) {
                        if (cC[yC + i - yA0][xC + j - xA0]) {
                            cC[yC + i - yA0][xC + j - xA0][k] = takeVal;
                        } else {
                            cC[yC + i - yA0][xC + j - xA0] = [];
                            cC[yC + i - yA0][xC + j - xA0][k] = takeVal;
                        }
                    } else {
                        cC[yC + i - yA0] = [];
                        cC[yC + i - yA0][xC + j - xA0] = [];
                        cC[yC + i - yA0][xC + j - xA0][k] = takeVal;
                    }
                } else {
                    if (cC[yC + i - yA0]) {
                        if (cC[yC + i - yA0][xC + j - xA0]) {
                            cC[yC + i - yA0][xC + j - xA0][k] = 0;
                        } else {
                            cC[yC + i - yA0][xC + j - xA0] = [];
                            cC[yC + i - yA0][xC + j - xA0][k] = 0;
                        }
                    } else {
                        cC[yC + i - yA0] = [];
                        cC[yC + i - yA0][xC + j - xA0] = [];
                        cC[yC + i - yA0][xC + j - xA0][k] = 0;
                    }
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
                let nA = interpolationArray[oneD];
                let nB = Math.floor(Math.random() * 256);
                let nC = Math.floor(lerp(nA, nB, 0.25));
                if (nC  > interpolation) {
                    if (cC[yC + i - yA0] && 
                        cC[yC + i - yA0][xC + j - xA0] &&
                        cC[yC + i - yA0][xC + j - xA0][k] == 0) {
                        let takeVal = (cA[i] && cA[i][j] && cA[i][j][k]) ? cA[i][j][k] : 0;
                        if (cC[yC + i - yA0]) {
                            if (cC[yC + i - yA0][xC + j - xA0]) {
                                cC[yC + i - yA0][xC + j - xA0][k] = takeVal;
                            } else {
                                cC[yC + i - yA0][xC + j - xA0] = [];
                                cC[yC + i - yA0][xC + j - xA0][k] = takeVal;
                            }
                        } else {
                            cC[yC + i - yA0] = [];
                            cC[yC + i - yA0][xC + j - xA0] = [];
                            cC[yC + i - yA0][xC + j - xA0][k] = takeVal;
                        }
                    }
                }
            }
        }
    }
};
