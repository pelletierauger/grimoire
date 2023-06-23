makeFlame = function() {
    let a = [];
    let w = 100;
    let hw = w/2;
    for (let y = 0; y < w; y++) {
        a[y] = [];
        for (let x = 0; x < w; x++) {
            let v = dist(x, y * 0.95, hw, hw * 0.95);
            v = (v < 40.5) ? 1 : 0;
            a[y][x] = v;
        }
    }
    // Cut the ellipse to make it look like a flame.
    let cut = 25;
    for (let i = 0; i < a.length; i++) {
        a[i].splice(hw - cut, cut * 2);
    }
    // Slice the lower part of the cut ellipse to improve the flame shape.
    let top = 30;
    let rest = a.length - top;
    for (let i = top; i < rest; i++) {
        if (i % 2 == 0) {
            a.splice(i, 1);
        }
    }
    // Pad the shape horizontally to make room for the flicker.
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < 50; j++) {
            a[i].push(0);
            a[i].unshift(0);
        }
    }
    // Make the flame flicker
    for (let i = a.length - 1; i > 0; i--) {
        let rw = map(i, a.length, 0, 0, a.length);
        rw *= Math.sin(i * 0.1 + drawCount);
        rw *= Math.sin(drawCount * 0.1);
        a[i].rotate(Math.floor(rw * 0.5));
    }
    candleFlame = new Brush({
        type: circular,
        anchor: [hw, hw],
        data: a

    });
    let xy = [pmouse[0], (ge.t.scroll.y * 9) + pmouse[1]];
    paintStaticAddSubstract(ge.t.name, xy[0], xy[1], candleFlame, full);
};
makeFlame();



paintStaticAddSubstract = function(c, x, y, brush, pattern) {
    c = ge.getTab(c).canvas.data;
    pattern = pattern.grid;
    x = x - brush.anchor[0];
    y = y - brush.anchor[1];
    let pdim = [pattern[0].length, pattern.length];
    for (let j = y; j < y + brush.data.length; j++) {
        for (let i = x; i < x + brush.data[0].length; i++) {
            if (j >= 0 && i >= 0 && i < (109 * 7)) {
                let fx, fy, sx, sy;
                fx = Math.floor(i / 7);
                fy = Math.floor(j / 9);
                sx = i % 7;
                sy = j % 9;
                let vv = pattern[Math.floor(j * patternScale) % pdim[1]][Math.floor(i * patternScale) % pdim[0]];    
                paintUnit(fx, fy, sx, sy, vv * brush.data[j - y][i - x]);
            }
        }
    }
    function paintUnit(fx, fy, sx, sy, val = 1) {
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
};