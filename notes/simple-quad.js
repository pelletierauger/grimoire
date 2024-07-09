function makeQuad(r) {
    let c = {
        r: r.c[0],
        g: r.c[1],
        b: r.c[2],
        a: r.c[3]
    };
    let v0 = {
        x: r.v[0][0],
        y: r.v[0][1]
    };
    let v1 = {
        x: r.v[1][0],
        y: r.v[1][1]
    };
    let v2 = {
        x: r.v[2][0],
        y: r.v[2][1]
    };
    let v3 = {
        x: r.v[3][0],
        y: r.v[3][1]
    };

    // for (let i = 0; i < a.v.length; i++) {
    //     ellipse(a.v[i][0], a.v[i][1], 15);
    // }


    // line(v0.x, v0.y, v1.x, v1.y);
    // line(v0.x, v0.y, v3.x, v3.y);
    // line(v2.x, v2.y, v1.x, v1.y);
    // line(v2.x, v2.y, v3.x, v3.y);

    function drawExtension(vec0, vec1, vec2, ext) {
        var angle = Math.atan2(vec1.y - vec0.y, vec1.x - vec0.x);
        var angle2 = Math.atan2(vec2.y - vec0.y, vec2.x - vec0.x);
        let aa = getAverageAngle(angle, angle2);
        // console.log(aa);
        let midAngle = getAverageAngle(angle, angle2) + Math.PI;
        var v0e = {
            x: vec0.x + Math.cos(midAngle) * (r.blurFactor + aa * 0),
            y: vec0.y + Math.sin(midAngle) * (r.blurFactor + aa * 0)
        };
        // ellipse(v0e.x, v0e.y, 5);
        return v0e;
    }
    // stroke(255, 0, 0);
    let v4 = drawExtension(v0, v1, v3, 40);
    let v5 = drawExtension(v1, v0, v2, 40);
    let v6 = drawExtension(v2, v1, v3, 40);
    let v7 = drawExtension(v3, v2, v0, 40);
    // line(v4.x, v4.y, v5.x, v5.y);
    // line(v4.x, v4.y, v7.x, v7.y);
    // line(v6.x, v6.y, v5.x, v5.y);
    // line(v6.x, v6.y, v7.x, v7.y);
    let vertices = [
        v0.x, v0.y, 0,
        v1.x, v1.y, 0,
        v2.x, v2.y, 0,
        v3.x, v3.y, 0,
        v4.x, v4.y, 0,
        v5.x, v5.y, 0,
        v6.x, v6.y, 0,
        v7.x, v7.y, 0,
    ];

    let indices = [
        0, 1, 2,
        0, 2, 3,
        4, 5, 1,
        4, 1, 0,
        5, 6, 2,
        5, 2, 1,
        6, 7, 3,
        6, 3, 2,
        7, 4, 0,
        7, 0, 3
    ];
    for (let i = 0; i < indices.length; i++) {
        indices[i] += rectangles * 8;
    }

    let colors = [];
    for (let i = 0; i < 4; i++) {
        colors.push(c.r, c.g, c.b, c.a);
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