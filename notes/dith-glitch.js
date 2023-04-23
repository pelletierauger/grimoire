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
    for (let i = 0; i < 8; i++) {
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
            val = (1 - Math.round(Math.random())) ? val : Math.min(val2 + val, 1);
            if (Math.sin(Math.tan((y + 950) * 1.75e-3) * 0.125e-1) < 0) {val2 = val};
            if (Math.sin(Math.tan((y + 950) * 1.75e-3) * 0.125e-1) > 0.25) {val2 = val};
            let yy = y - (y2 * 9);
            if (yy > 5 && yy < 20 ) {val2 = val};
            if (yy > 55 && yy < 60 ) {val2 = val};
            if (yy > 90 && yy < 95 ) {val2 = val};
            // val2 = 1 - val2;
paintStatic(Math.floor(x/7),Math.floor(y/9), x%7,y%9, val2);
        }
    }
    return data;
};
let h = 404;
sss = ge.blurCanvas("sh.js", 0, h, 109, h + 25, "sh.js", 0, h + 25);