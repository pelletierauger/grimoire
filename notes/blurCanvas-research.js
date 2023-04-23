blurCanvas = function(c0, x0, y0, x1, y1, c1, x2, y2) {
    let w = (x1 - x0) * 7;
    let h = (y1 - y0) * 9;
    let data = new Uint8Array(w * h);
    let oneD = 0;
    let gc = ge.getTab(c0).canvas.data;
    let sums = 0;
    // Transforming the data into a one dimension array.
    if (gc.length > 0) {
        for (let i = y0; i < y1; i++) {
            for (let j = x0; j < x1; j++) {
                for (let k = 0; k < 63; k++) {
                    let x = j * 7 + (k % 7);
                    let y = i * 9 + Math.floor(k / 7);
                    let oneD = Math.floor(x + (y * (x1 - x0) * 7));
                    data[oneD] = (gc[i] && gc[i][j] && gc[i][j][k]) ? 255 : 0;
                    // sums += data[oneD];
                }
            }
        }
    }
        // console.log("sums: " + sums);
    // Blurring the array
    let data2 = new Uint8Array(w * h);
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
                data2[oneD] = newValue;
                // sums += newValue;
            }
        }
    };
    for (let i = 0; i < 32; i++) {
        data2 = new Uint8Array(w * h);
        blur();
        data = data2;
    }
    let dith = Uint8Array.from(data2);
    for (let i = 0; i < w * h; i++) {
        let newPixel = dith[i] < 129 ? 0 : 255;
        let err = Math.floor((dith[i] - newPixel) / 8);
        dith[i] = newPixel;
        dith[i       + 1 ] += err;
        dith[i       + 2 ] += err;
        dith[i + 1*w - 1 ] += err;
        dith[i + 1*w     ] += err;
        dith[i + 1*w + 1 ] += err;
        dith[i + 2*w     ] += err;
        sums += dith[i];
    }
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
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            let oneD = x + (y * w);
            let val = (dith[oneD] == 255) ? 1 : 0;
            paintStatic(Math.floor(x/7),Math.floor(y/9), x%7,y%9, val);
        }
    }
    console.log("sums: " + sums);
    return data;
};
sss = blurCanvas("vibra.scd", 0, 0, 109, 0 + 25, "sketch.js", 0, 0);