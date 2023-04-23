drawDots = function() {
    vertices = [];
    let xOffset = (noise(frameCount * 0.0025) - 0.5) * 0.9;
    let yOffset = (noise((frameCount + 100) * 0.0025) - 0.5) * 0.9;
    let t = drawCount * 0.000005 + 2;
    let fx = 1;
    let fy = 1;
    let x = 0;
    let y = 0;
    let num = 60000;

    function ro(a, l, x, y, h) {
        return {
            x: x + Math.cos(h + a) * l,
            y: y + Math.sin(h + a) * l,
            h: h + a
        };
    }
    let amountRays = 120;
    let sj = (10 - t) * 1000000;
    let rayInc = Math.PI * 2 / amountRays;
    let numV = 0;
    let metaV = [];
    let indMetaV = 0;
    let vv = map(sin(t * 1e6), -1, 1, -0.9, 2.9);
    for (let j = sj; j < (Math.PI * 2 + sj); j += rayInc) {
        let p = { x: 0, y: 0, h: j };
        let jj = j - sj;
        metaV[indMetaV] = [];
        for (let i = 0; i < num / amountRays; i += 1) {
            let a = vv * Math.cos(i * jj * 0.05) * 0.5;
            let l = 0.5 + Math.sin(jj * i * 1e3) * 1000;
            p = ro(a, l, p.x, p.y, p.h * map(i, 0, num / amountRays, 0, 1));
            p.x += cos(t * 2e6) * 0.25;
            p.y += -0.4 + sin(t * 2e6) * 0.25;
            metaV[indMetaV].push(p.x * 0.35 * 1.5 * 0.01, p.y * 0.8 * 0.01, 0.0);
            numV += 1;
        }
        indMetaV++;
    }
    let flatV = [];
    for (let j = 0; j < metaV[0].length; j += 3) {
        for (let i = 0; i < metaV.length; i++) {
            flatV.push(metaV[i][j], metaV[i][j + 1], metaV[i][j + 2]);
        }
    }
    vertices = flatV;
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, num);
}



// drawDots = function() {
//     vertices = [];
//     let xOffset = (noise(frameCount * 0.0025) - 0.5) * 0.9;
//     let yOffset = (noise((frameCount + 100) * 0.0025) - 0.5) * 0.9;
//     let t = drawCount * 0.000005 + 2;
//     let fx = 1;
//     let fy = 1;
//     let x = 0;
//     let y = 0;
//     let num = 60000;

//     function ro(a, l, x, y, h) {
//         return {
//             x: x + Math.cos(h + a) * l,
//             y: y + Math.sin(h + a) * l,
//             h: h + a
//         };
//     }
//     let amountRays = 120;
//     let sj = (10 - t) * 1000000;
//     let rayInc = Math.PI * 2 / amountRays;
//     let numV = 0;
//     let metaV = [];
//     let indMetaV = 0;
//     let vv = map(sin(t * 1e6), -1, 1, -0.9, 2.9);
//     for (let j = sj; j < (Math.PI * 2 + sj); j += rayInc) {
//         let p = { x: 0, y: 0, h: j };
//         let jj = j - sj;
//         metaV[indMetaV] = [];
//         for (let i = 0; i < num / amountRays; i += 1) {
//             let a = vv * Math.cos(i * jj * 0.05) * 0.5;
//             let l = 0.5 + Math.sin(jj * i * 1e2) * 1000;
//             p = ro(a, l, p.x, p.y, p.h * map(i, 0, num / amountRays, 0, 1));
//             p.x += cos(t * 0.75e7) * 0.25;
//             p.y += -0.4 + sin(t * 0.75e7) * 0.25;
//             metaV[indMetaV].push(p.x * 0.35 * 1.5 * 0.006, p.y * 0.8 * 0.006, 0.0);
//             numV += 1;
//         }
//         indMetaV++;
//     }
//     let flatV = [];
//     for (let j = 0; j < metaV[0].length; j += 3) {
//         for (let i = 0; i < metaV.length; i++) {
//             flatV.push(metaV[i][j], metaV[i][j + 1], metaV[i][j + 2]);
//         }
//     }
//     vertices = flatV;
//     // Create an empty buffer object to store the vertex buffer
//     // var vertex_buffer = gl.createBuffer();
//     //Bind appropriate array buffer to it
//     // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
//     // Pass the vertex data to the buffer
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//     // Unbind the buffer
//     gl.bindBuffer(gl.ARRAY_BUFFER, null);
//     /*======== Associating shaders to buffer objects ========*/
//     // Bind vertex buffer object
//     gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
//     // Get the attribute location
//     var coord = gl.getAttribLocation(shaderProgram, "coordinates");
//     // Point an attribute to the currently bound VBO
//     gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
//     // Enable the attribute
//     gl.enableVertexAttribArray(coord);
//     /*============= Drawing the primitive ===============*/
//     // // Clear the canvas
//     // gl.clearColor(0.5, 0.5, 0.5, 0.9);
//     // Clear the color buffer bit
//     // gl.clear(gl.COLOR_BUFFER_BIT);
//     // Draw the triangle
//     gl.drawArrays(gl.POINTS, 0, num);
// }





// smoke-like spiral
// drawCount = 0;
drawSmoke = function(selectedProgram, dotAmount) {
    vertices = [];
    // let xOffset = (noise(frameCount * 0.01) - 0.5) * 0.75;
    // let yOffset = (noise((frameCount + 100) * 0.01) - 0.5) * 0.75;
    let t = drawCount * 0.00125 * 2 * 2 + 8;
    let t2 = t * 1e-4 * 20000 * 0.25;
    let xOffset = openSimplex.noise2D(t2, t2 + 1000);
    let yOffset = openSimplex.noise2D(t2 - 1000, t2 + 500);
    t2 = (t2 + 5000) * 10;
    let xOffset2 = openSimplex.noise2D(t2, t2 + 1000);
    let yOffset2 = openSimplex.noise2D(t2 - 1000, t2 + 500);
    let fx = 1;
    let fy = 1;
    let x = 1;
    let y = 1;
    let t3 = t * 1e1 * 2;
    let al = map(openSimplex.noise2D(t3, t3 + 1000), -1, 1, 0.025, 1.25);
    t *= 0.4;
    t += 115;
    for (let i = 0; i < 40000; i += 1) {
        x = fx * 0.16 + Math.sin(Math.tan(i * 24.9 + t * 0.5) + i * t * 0.000001) * i * 0.000022;
        y = fy * 0.16 + Math.cos(Math.tan(i * 24.9 + t * 0.5) + i * t * 0.000001) * i * 0.00005;
        //         x *= Math.cos(fx * fy * 0.001 * t * 5) * Math.sin(x + t * 10);
        //         x *= Math.cos(fx * fy * 0.001 * t * 7) * Math.sin(x + t * 15);
        //         y *= cos(fx * fy * 0.001) * cos(x + t + 2 * 10);
        //         x -= Math.sin(fx * fx * fy * Math.cos(fy * 400) * 0.018) * 7.5 * 2;
        //         y -= Math.sin(fy * fy * 0.018) * 7.5 * 2;
        // Below, I changed the range of the inner oscillator to [-0.65, 1]
        // to reduce the amount of time it destroys the harmonic shape.
        fx = tan(x * 0.15 * (map(sin(t * 2), -1, 1, -0.65, 1))) * 40;
        fy = tan(y * 0.15 * (map(sin(t * 2), -1, 1, -0.65, 1))) * 40;
        //         x += (Math.random() - 0.5) * 0.00005;
        //         y += (Math.random() - 0.5) * 0.00005;
        // x += xOffset * 0.125;
        // y += yOffset * 0.125;
        x += cos(t * -0.5e2 * 0.25) * i * 0.125e-4 * 2 * 0.5;
        y += sin(t * -0.5e2 * 0.25) * i * 0.125e-4 * 3 * 0.5;
        x += xOffset * 0.15 * 2 * 0.2 * 6.5 * 0.25;
        y += yOffset * 0.15 * 3 * 0.2 * 6.5 * 0.25;
        x += xOffset2 * 2 * 1e-3 * 0.5 * 6.5 * 0.25;
        y += yOffset2 * 3 * 1e-3 * 0.5 * 6.5 * 0.25;
        let xo = openSimplex.noise2D(i, t * 1e4) * 1e-3;
        let yo = openSimplex.noise2D(i, t * 1e4 + 1000) * 1e-3;
        let zo = (openSimplex.noise2D(i, (t + i) * 1e2 + 100)) * 5;
        let s = 0.7;
        vertices.push((x + xo) * 1.3 * 1.5 * s, (y + yo) * 0.9 * 1.5 * s - 0.25, 15.0 + zo, al);
    }
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, 40000);
};



// // - Animated version of the previous gorgeous broken spiral
// drawDots = function() {
//     vertices = [];
//     let xOffset = (noise(frameCount * 0.01) - 0.5) * 0.75;
//     let yOffset = (noise((frameCount + 100) * 0.01) - 0.5) * 0.75;
//     let t = drawCount + 870;
//     let fx = 1;
//     let fy = 1;
//     let x = 1;
//     let y = 1;
//     for (let i = 0; i < 20000; i += 1) {
//         x = sin(tan(i * 100 + t) + i * t * 0.0000001) * i * 0.00005;
//         y = cos(tan(i * 100 + t) + i * t * 0.0000001) * i * 0.00015;
//         //         x *= cos(fx * fy * 0.001) * sin(x + t * 20);
//         //         y *= cos(fx * fy * 0.001) * cos(x + t * 20);
//         x += fx * 0.1;
//         y += fy * 0.1;
//         fx = x;
//         fy = y * 2;
//         x += (Math.random() - 0.5) * 0.00005;
//         y += (Math.random() - 0.5) * 0.00005;
//         x += xOffset * 0.15 * 0.0125;
//         y += yOffset * 0.15 * 0.0125;
//         vertices.push(x * 1.5 * 0.5, y * 0.8 * 0.5, 0.0);
//     }
//     // Create an empty buffer object to store the vertex buffer
//     // var vertex_buffer = gl.createBuffer();
//     //Bind appropriate array buffer to it
//     // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
//     // Pass the vertex data to the buffer
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//     // Unbind the buffer
//     gl.bindBuffer(gl.ARRAY_BUFFER, null);
//     /*======== Associating shaders to buffer objects ========*/
//     // Bind vertex buffer object
//     gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
//     // Get the attribute location
//     var coord = gl.getAttribLocation(shaderProgram, "coordinates");
//     // Point an attribute to the currently bound VBO
//     gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
//     // Enable the attribute
//     gl.enableVertexAttribArray(coord);
//     /*============= Drawing the primitive ===============*/
//     // // Clear the canvas
//     // gl.clearColor(0.5, 0.5, 0.5, 0.9);
//     // Clear the color buffer bit
//     // gl.clear(gl.COLOR_BUFFER_BIT);
//     // Draw the triangle
//     gl.drawArrays(gl.POINTS, 0, 20000);
// }



// var zm = 0.1;
// drawDots = function() {
//     vertices = [];
//     let xOffset = (noise(frameCount * 0.01) - 0.5) * 0.75;
//     let yOffset = (noise((frameCount + 100) * 0.01) - 0.5) * 0.75;
//     let t = drawCount * 0.5 + 870;
//     let fx = 1;
//     let fy = 1;
//     let x = 1;
//     let y = 1;
//     for (let i = 0; i < 30000; i += 1) {
//         x = sin(tan(i * 25 + t) + i * t * 0.000000001) * i * 0.00005;
//         y = cos(tan(i * 25 + t) + i * t * 0.000000001) * i * 0.00015;
//         //         x *= cos(fx * fy * 0.001) * sin(x + t * 20);
//         //         y *= cos(fx * fy * 0.001) * cos(x + t * 20);
//         x += sin(fx * 3) * 0.15;
//         y += sin(fy * 3) * 0.15;
//         fx = x;
//         fy = y;
//         //         x += (Math.random() - 0.5) * 0.00005;
//         //         y += (Math.random() - 0.5) * 0.00005;
//         x += xOffset * 0.25;
//         y += yOffset * 0.25;
//         vertices.push(x * 1.5 * 0.35 * zm, y * 0.8 * 0.35 * zm, 0.0);
//     }
//     zm += 0.001;
//     // Create an empty buffer object to store the vertex buffer
//     // var vertex_buffer = gl.createBuffer();
//     //Bind appropriate array buffer to it
//     // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
//     // Pass the vertex data to the buffer
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//     // Unbind the buffer
//     gl.bindBuffer(gl.ARRAY_BUFFER, null);
//     /*======== Associating shaders to buffer objects ========*/
//     // Bind vertex buffer object
//     gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
//     // Get the attribute location
//     var coord = gl.getAttribLocation(shaderProgram, "coordinates");
//     // Point an attribute to the currently bound VBO
//     gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
//     // Enable the attribute
//     gl.enableVertexAttribArray(coord);
//     /*============= Drawing the primitive ===============*/
//     // // Clear the canvas
//     // gl.clearColor(0.5, 0.5, 0.5, 0.9);
//     // Clear the color buffer bit
//     // gl.clear(gl.COLOR_BUFFER_BIT);
//     // Draw the triangle
//     gl.drawArrays(gl.POINTS, 0, 30000);
// }





// An interesting shape made of harmony and chaos


// drawDots = function() {
//     vertices = [];
//     let xOffset = (noise(frameCount * 0.01) - 0.5) * 0.75;
//     let yOffset = (noise((frameCount + 100) * 0.01) - 0.5) * 0.75;
//     let t = drawCount * 0.35 + 870;
//     let fx = 1;
//     let fy = 1;
//     let x = 1;
//     let y = 1;
//     for (let i = 0; i < 30000; i += 1) {
//         x = sin(tan(i * 25 + t) + i * t * 0.0000001) * i * 0.00005;
//         y = cos(tan(i * 25 + t) + i * t * 0.0000001) * cos(t + i * 0.0002) * i * 0.00015;
//         //         x *= sin(t * 50 * cos(y * 0.002));
//         //         x *= cos(fx * fy * 0.001) * sin(x + t * 20);
//         //         y *= cos(fx * fy * 0.001) * cos(x + t * 20);
//         x += sin(fx * 0.12) * 5;
//         y += sin(fy * 0.12) * 5;
//         fx = x;
//         fy = y;
//         //         x += (Math.random() - 0.5) * 0.00005;
//         //         y += (Math.random() - 0.5) * 0.00005;
//         x += xOffset * 0.25;
//         y += yOffset * 0.25;
//         vertices.push(x * 1.5 * 0.235, y * 0.8 * 0.235 - 0.25, 0.0);
//     }
//     // Create an empty buffer object to store the vertex buffer
//     // var vertex_buffer = gl.createBuffer();
//     //Bind appropriate array buffer to it
//     // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
//     // Pass the vertex data to the buffer
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//     // Unbind the buffer
//     gl.bindBuffer(gl.ARRAY_BUFFER, null);
//     /*======== Associating shaders to buffer objects ========*/
//     // Bind vertex buffer object
//     gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
//     // Get the attribute location
//     var coord = gl.getAttribLocation(shaderProgram, "coordinates");
//     // Point an attribute to the currently bound VBO
//     gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
//     // Enable the attribute
//     gl.enableVertexAttribArray(coord);
//     /*============= Drawing the primitive ===============*/
//     // // Clear the canvas
//     // gl.clearColor(0.5, 0.5, 0.5, 0.9);
//     // Clear the color buffer bit
//     // gl.clear(gl.COLOR_BUFFER_BIT);
//     // Draw the triangle
//     gl.drawArrays(gl.POINTS, 0, 30000);
// }







// Fluctuating alligator
// beau drawCount pour alligator = 166146
// trois tiers : 463264
// 468542
// trois tiers, harmoniques : 469932
// moins de branches : 553133
// beau 587987
// grand mystère 590637 - 2000

// // drawCount = 0.5;
drawAlligator = function(selectedProgram) {
    vertices = [];
    // let xOffset = (noise(frameCount * 0.01) - 0.5) * 0.75;
    // let yOffset = (noise((frameCount + 100) * 0.01) - 0.5) * 0.75;
    let shiftedDrawCount = drawCount + 588637 - 200;
    let t = shiftedDrawCount * 0.00125 + 0.5 + 8000000;
    let t2 = t * 1e1;
    let xOffset = openSimplex.noise2D(t2, t2 + 1000);
    let yOffset = openSimplex.noise2D(t2 - 1000, t2 + 500);
    t2 = (t2 + 5000) * 100;
    let xOffset2 = openSimplex.noise2D(t2, t2 + 1000);
    let yOffset2 = openSimplex.noise2D(t2 - 1000, t2 + 500);
    let fx = 1;
    let fy = 1;
    let x = 1;
    let y = 1;
    let m = map(sin(t * 0.25e1), -1, 1, 1e-5, 1e-3);
    let t3 = t * 1e2 * 0.5;
    let al = map(openSimplex.noise2D(t3, t3 + 1000), -1, 1, 0.1, 1.25);
    for (let i = 0; i < 27000; i += 1) {
        x = sin(tan(i * 0.001) * fx + i * t * 0.001) * i * 0.00005;
        y = cos(tan(i * 0.001) * fx + i * t * 0.001) * i * 0.00015;
        //         x *= cos(fx * fy * 0.001) * sin(x + t * 20);
        //         y *= cos(fx * fy * 0.001) * cos(x + t * 20);
        fx = sin(i * m);
        fy = y * 5;
        x += (Math.random() - 0.5) * 0.00005;
        y += (Math.random() - 0.5) * 0.00005;
        x += xOffset * 0.15 * 2 * 0.2;
        y += yOffset * 0.15 * 3 * 0.2;
        x += xOffset2 * 2 * 1e-3 * 0.5;
        y += yOffset2 * 3 * 1e-3 * 0.5;
        x += cos(t * -1e2 * 0.25) * i * 1e-5 * 2;
        y += sin(t * -1e2 * 0.25) * i * 1e-5 * 3;
        let xo = openSimplex.noise2D(i, t * 1e4) * 4e-4;
        let yo = openSimplex.noise2D(i, t * 1e4 + 1000) * 4e-4;
        let zo = (openSimplex.noise2D(i, (t + i) * 1e2 + 100)) * 3;
        vertices.push((x + xo) * 1.4, (y + yo) * 0.8, 15 + zo, al);
    }
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, dotsVBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, 27000);
}



// // pulsar
// let sceneRun = false;
// drawCount = 0;
drawPulsar = function(selectedProgram) {
    // if (!sceneRun) {
    //     drawCount = 1;
    //     sceneRun = true;
    // }
    vertices = [];
    let T = (((drawCount - 100) * 0.00125));
    let xOffset = (noise(T * 1e2 * 0.0025) - 0.5) * 0.9;
    let yOffset = (noise((T * 1e2 + 100) * 0.0025) - 0.5) * 0.9;
    let t = T * 0.0000025 * 0.5 + 0;
    let fx = 1;
    let fy = 1;
    let x = 0;
    let y = 0;
    let num = 30000;

    function ro(a, l, x, y, h) {
        return {
            x: x + Math.cos(h + a) * l,
            y: y + Math.sin(h + a) * l,
            h: h + a
        };
    }
    let amountRays = 120;
    let sj = (10 - t) * 1000000;
    let rayInc = Math.PI * 2 / amountRays;
    let numV = 0;
    let metaV = [];
    let indMetaV = 0;
    let t1 = drawCount * 1e-3 * 0.125 * 0.5;
    let t2 = t1 * 1e1;
    let xO = openSimplex.noise2D(t2, t2 + 1000) * 1;
    let yO = openSimplex.noise2D(t2 - 1000, t2 + 500) * 1;
    t2 = (t2 + 5000) * 100;
    let xO2 = openSimplex.noise2D(t2, t2 + 1000) * 0.05 + xO;
    let yO2 = openSimplex.noise2D(t2 - 1000, t2 + 500) * 0.05 + yO;
    let t3 = t * 1e8 * 0.5;
    let al = map(openSimplex.noise2D(t3, t3 + 1000), -1, 1, 0.3, 1.5);
    for (let j = sj; j < (Math.PI * 2 + sj) - rayInc; j += rayInc) {
        let p = { x: 0, y: 0, h: j };
        let jj = j - sj;
        metaV[indMetaV] = [];
        var sc = 0.01 * (1 / cos(t * 4e5));
        sc = 0.25;
        sc = map(drawCount, 0, 1500, 0.25, 0.0125);
        let sc2 = map(drawCount, 0, 1500, 0.25, 0.25);
        let scOsc = map(drawCount, 0, 1100, 0.5, 2.5)
        let ssc = map(drawCount, 0, 1200 - 300, 1e7, 1e6);
        for (let i = 0; i < (num / amountRays); i += 1) {
            let a = T * -0.125 + Math.sin(p.h + jj);
            let l = 0.5;
            let ph = Math.cos(p.x) + Math.sin(p.y);
            p = ro(a, l, p.x, p.y, p.h + ph * 0.75 * Math.sin(t * ssc) * scOsc * sc2);
            //             p.x += xOffset * 2.95;
            //             p.y += yOffset * 2.95;
            p.x += Math.cos(t * 1e7) * 0.25;
            p.y += Math.sin(t * 1e7) * 0.25;
            //             let xo = openSimplex.noise2D(i, t * 1e4) * 4e-4;
            //             let yo = openSimplex.noise2D(i, t * 1e4 + 1000) * 4e-4;
            let xo = 0;
            let yo = 0;
            let zo = (openSimplex.noise2D(i, (t * 1e4 + i) * 1e2 + 100)) * 5;
            metaV[indMetaV].push((p.y + xO2 + xo) * 0.35 * 1.5 * sc, (p.x + yO2 + yo) * 0.9 * sc * -1, 15 + zo * vb * 20, al);
            numV += 1;
        }
        indMetaV++;
    }
    let flatV = [];
    for (let j = 0; j < metaV[0].length; j += 4) {
        for (let i = 0; i < metaV.length; i++) {
            flatV.push(metaV[i][j], metaV[i][j + 1], metaV[i][j + 2], metaV[i][j + 3]);
        }
    }
    vertices = flatV;
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, dotsVBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, num);
}


// drawDots = function() {
//     vertices = [];
//     let xOffset = (noise(drawCount * 1e2 * 0.0025) - 0.5) * 0.9;
//     let yOffset = (noise((drawCount * 1e2 + 100) * 0.0025) - 0.5) * 0.9;
//     let t = drawCount * 0.0000025 + 0;
//     let fx = 1;
//     let fy = 1;
//     let x = 0;
//     let y = 0;
//     let num = 30000;

//     function ro(a, l, x, y, h) {
//         return {
//             x: x + Math.cos(h + a) * l,
//             y: y + Math.sin(h + a) * l,
//             h: h + a
//         };
//     }
//     let amountRays = 120;
//     let sj = (10 - t) * 1000000;
//     let rayInc = Math.PI * 2 / amountRays;
//     let numV = 0;
//     let metaV = [];
//     let indMetaV = 0;
//     for (let j = sj; j < (Math.PI * 2 + sj) - rayInc; j += rayInc) {
//         let p = { x: 0, y: 0, h: j };
//         let jj = j - sj;
//         metaV[indMetaV] = [];
//         for (let i = 0; i < (num / amountRays); i += 1) {
//             let a = 1 + sin(p.h + jj);
//             let l = 0.5;
//             let ph = cos(p.x) + sin(p.y);
//             p = ro(a, l, p.x, p.y, p.h + ph * 1 * sin(t * 2e7));
//             //             p.x += xOffset * 2.95;
//             //             p.y += yOffset * 2.95;
//             p.x += cos(t * 1e7) * 0.125;
//             p.y += sin(t * 0.25e7) * 0.125;
//             var sc = 0.01 * (1 / cos(t * 4e5));
//             sc = 0.25;
//             metaV[indMetaV].push(p.y * 0.35 * 1.5 * sc, p.x * 0.8 * sc, 15.0);
//             numV += 1;
//         }
//         indMetaV++;
//     }
//     let flatV = [];
//     for (let j = 0; j < metaV[0].length; j += 3) {
//         for (let i = 0; i < metaV.length; i++) {
//             flatV.push(metaV[i][j], metaV[i][j + 1], metaV[i][j + 2]);
//         }
//     }
//     vertices = flatV;
//     // Create an empty buffer object to store the vertex buffer
//     // var vertex_buffer = gl.createBuffer();
//     //Bind appropriate array buffer to it
//     // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
//     // Pass the vertex data to the buffer
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//     // Unbind the buffer
//     gl.bindBuffer(gl.ARRAY_BUFFER, null);
//     /*======== Associating shaders to buffer objects ========*/
//     // Bind vertex buffer object
//     gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
//     // Get the attribute location
//     var coord = gl.getAttribLocation(shaderProgram, "coordinates");
//     // Point an attribute to the currently bound VBO
//     gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
//     // Enable the attribute
//     gl.enableVertexAttribArray(coord);
//     /*============= Drawing the primitive ===============*/
//     // // Clear the canvas
//     // gl.clearColor(0.5, 0.5, 0.5, 0.9);
//     // Clear the color buffer bit
//     // gl.clear(gl.COLOR_BUFFER_BIT);
//     // Draw the triangle
//     gl.drawArrays(gl.POINTS, 0, num);
// }


// noisy-meadow
// drawDots = function() {
//     vertices = [];
//     let xOffset = (noise(frameCount * 0.0025) - 0.5) * 0.9;
//     let yOffset = (noise((frameCount + 100) * 0.0025) - 0.5) * 0.9;
//     let t = drawCount * 0.000005 + 2;
//     let fx = 1;
//     let fy = 1;
//     let x = 0;
//     let y = 0;
//     let num = 60000;

//     function ro(a, l, x, y, h) {
//         return {
//             x: x + Math.cos(h + a) * l,
//             y: y + Math.sin(h + a) * l,
//             h: h + a
//         };
//     }
//     let amountRays = 120;
//     let sj = (10 - t) * 1000000;
//     let rayInc = Math.PI * 2 / amountRays;
//     let numV = 0;
//     let metaV = [];
//     let indMetaV = 0;
//     let vv = map(sin(t * 1e6), -1, 1, -0.9, 2.9);
//     for (let j = sj; j < (Math.PI * 2 + sj); j += rayInc) {
//         let p = { x: 0, y: 0, h: j };
//         let jj = j - sj;
//         metaV[indMetaV] = [];
//         for (let i = 0; i < num / amountRays; i += 1) {
//             let a = vv * Math.cos(i * jj * 0.05) * 0.5;
//             let l = 0.5 + Math.sin(jj * i * 1e3) * 1000;
//             p = ro(a, l, p.x, p.y, p.h * map(i, 0, num / amountRays, 0, 1));
//             p.x += cos(t * 2e6) * 0.25;
//             p.y += -0.4 + sin(t * 2e6) * 0.25;
//             metaV[indMetaV].push(p.x * 0.35 * 1.5 * 0.01, p.y * 0.8 * 0.01, 0);
//             numV += 1;
//         }
//         indMetaV++;
//     }
//     let flatV = [];
//     for (let j = 0; j < metaV[0].length; j += 3) {
//         for (let i = 0; i < metaV.length; i++) {
//             flatV.push(metaV[i][j], metaV[i][j + 1], metaV[i][j + 2]);
//         }
//     }
//     vertices = flatV;
//     // Create an empty buffer object to store the vertex buffer
//     // var vertex_buffer = gl.createBuffer();
//     //Bind appropriate array buffer to it
//     // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
//     // Pass the vertex data to the buffer
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//     // Unbind the buffer
//     gl.bindBuffer(gl.ARRAY_BUFFER, null);
//     /*======== Associating shaders to buffer objects ========*/
//     // Bind vertex buffer object
//     gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
//     // Get the attribute location
//     var coord = gl.getAttribLocation(shaderProgram, "coordinates");
//     // Point an attribute to the currently bound VBO
//     gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
//     // Enable the attribute
//     gl.enableVertexAttribArray(coord);
//     /*============= Drawing the primitive ===============*/
//     // // Clear the canvas
//     // gl.clearColor(0.5, 0.5, 0.5, 0.9);
//     // Clear the color buffer bit
//     // gl.clear(gl.COLOR_BUFFER_BIT);
//     // Draw the triangle
//     gl.drawArrays(gl.POINTS, 0, num);
// }






// noisy-meadow with fluctuations
drawMeadow = function(selectedProgram) {
    vertices = [];
    // let xOffset = (noise(frameCount * 0.0025) - 0.5) * 0.9;
    // let yOffset = (noise((frameCount + 100) * 0.0025) - 0.5) * 0.9;
    let t = drawCount * 0.00125 * 0.000005 + 2.22;
    let t2 = t * 0.25e7;
    let xOffset = openSimplex.noise2D(t2, t2 + 1000);
    let yOffset = openSimplex.noise2D(t2 - 1000, t2 + 500) * 1.5;
    t2 = (t2 + 5000) * 100;
    let xOffset2 = openSimplex.noise2D(t2, t2 + 1000);
    let yOffset2 = openSimplex.noise2D(t2 - 1000, t2 + 500) * 1.5;
    let fx = 1;
    let fy = 1;
    let x = 0;
    let y = 0;
    let num = 60000;

    function ro(a, l, x, y, h) {
        return {
            x: x + Math.cos(h + a) * l,
            y: y + Math.sin(h + a) * l,
            h: h + a
        };
    }
    let amountRays = 120;
    let sj = (10 - t) * 1000000;
    let rayInc = Math.PI * 2 / amountRays;
    let numV = 0;
    let metaV = [];
    let indMetaV = 0;
    let vv = map(sin(t * 1e6), -1, 1, -0.9, 2.9);
    let t3 = t * 1e7;
    let al = map(openSimplex.noise2D(t3, t3 + 1000), -1, 1, 0.1, 1.25);
    for (let j = sj; j < (Math.PI * 2 + sj); j += rayInc) {
        let p = { x: 0, y: 0, h: j };
        let jj = j - sj;
        metaV[indMetaV] = [];
        let fl = { x: 0, y: 0 };
        for (let i = 0; i < num / amountRays; i += 1) {
            let a = vv * Math.cos(i * jj * 0.05) * 0.5;
            let l = 0.5 + Math.sin(jj * i * 1e3) * 1000;
            p = ro(a, l, p.x, p.y, p.h * map(i, 0, num / amountRays, 0, 1));
            p.x += cos(t * 2e6) * 0.25;
            p.y += -0.4 + sin(t * 2e6) * 0.25;
            fl.x = p.x;
            fl.y = p.y;
            fl.x += xOffset * 0.15 * 2 * 20;
            fl.y += yOffset * 0.15 * 3 * 20;
            fl.x += xOffset2 * 2 * 1e-3 * 5;
            fl.y += yOffset2 * 3 * 1e-3 * 5;
            let xo = openSimplex.noise2D(i * 4000, t * 1e8) * 1e-1;
            let yo = openSimplex.noise2D(i * 4000, t * 1e7 + 10000000) * 1e-1;
            let zo = (openSimplex.noise2D(Math.sin(i * 100000), (t * 1e6 + i) * 1e2 + 100)) * 5;
            metaV[indMetaV].push((fl.x + xo) * 0.35 * 1.5 * 0.01, (fl.y + yo) * 0.8 * 0.01, 15, al);
            numV += 1;
        }
        indMetaV++;
    }
    let flatV = [];
    for (let j = 0; j < metaV[0].length; j += 4) {
        for (let i = 0; i < metaV.length; i++) {
            flatV.push(metaV[i][j], metaV[i][j + 1], metaV[i][j + 2], metaV[i][j + 3]);
        }
    }
    vertices = flatV;
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, num);
}




// swirl
drawSwirl = function(selectedProgram) {
    vertices = [];
    // let xOffset = (noise(frameCount * 0.01) - 0.5) * 0.75;
    // let yOffset = (noise((frameCount + 100) * 0.01) - 0.5) * 0.75;
    let t = drawCount * 0.00125 * 0.00005 * 1.5 + 10;
    let t2 = t * 1e1 * 2000;
    let xOffset = openSimplex.noise2D(t2, t2 + 1000);
    let yOffset = openSimplex.noise2D(t2 - 1000, t2 + 500);
    t2 = (t2 + 5000) * 100;
    let xOffset2 = openSimplex.noise2D(t2, t2 + 1000);
    let yOffset2 = openSimplex.noise2D(t2 - 1000, t2 + 500);
    let fx = 1;
    let fy = 1;
    let x = 1;
    let y = 1;
    // let al = map(sin(t * 1e6), -1, 1, 0.1, 1);
    let t3 = t * 1e5;
    let al = map(openSimplex.noise2D(t3, t3 + 1000), -1, 1, 0.5, 1);
    for (let i = 0; i < 60000; i += 1) {
        let ax = Math.pow(Math.cos(fx * 1e-4 + i * 1e-4), -1);
        let ay = Math.pow(Math.cos(fx * 1e-4 + i * 1e-4), -1);
        let aax = 0.5 - ax;
        let aay = 0.5 - ay;
        x = Math.sin(tan(i * 24.9 + t * 1e-1) * aax * Math.sin(i * 1e-10 + ax * 0.35) + i * 1e-5 + t * 11e4) * i * 0.00005 * 1.5;
        y = Math.cos(tan(i * 24.9 + t * 1e-1) * aay * Math.sin(i * 1e-10 + ax * 0.35) + i * 1e-5 + t * 11e4) * i * 0.00015 * 1.5;
        //         x *= sin(t * 50 * cos(y * 0.002));
        //         x *= cos(fx * fy * 0.001) * sin(x + t * 20);
        //         y *= cos(fx * fy * 0.001) * cos(x + t * 20);
        x *= Math.sin(fx * 0.05) + Math.cos(fy * 0.05);
        y *= Math.sin(fy * 0.05) + Math.cos(fy * 0.05);
        fx = x;
        fy = y;
        //         x += (Math.random() - 0.5) * 0.00005;
        //         y += (Math.random() - 0.5) * 0.00005;
        // x += xOffset * 0.125;
        // y += yOffset * 0.125;
        x += cos(t * -1e6 * 0.25) * i * 0.125e-4 * 2;
        y += sin(t * -1e6 * 0.25) * i * 0.125e-4 * 3;
        x += xOffset * 0.15 * 2 * 0.2 * 6.5 * 0.5;
        y += yOffset * 0.15 * 3 * 0.2 * 6.5 * 0.5;
        x += xOffset2 * 2 * 1e-3 * 0.5 * 6.5 * 0.5;
        y += yOffset2 * 3 * 1e-3 * 0.5 * 6.5 * 0.5;
        //         let xo = openSimplex.noise2D(i, t * 1e4) * 4e-4;
        //         let yo = openSimplex.noise2D(i, t * 1e4 + 1000) * 4e-4;
        let xo = 0;
        let yo = 0;
        //         let zo = (openSimplex.noise2D(i, (t + i) * 1e2 + 100)) * 5;
        vertices.push((x + xo * 6.5) * 1.5 * 0.15, (y + yo * 6.5) * 0.8 * 0.15 * 1.1, 14.0, al);
    }
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, dotsVBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    let dotsToDraw = Math.floor(map(drawCount, 0, 2400 - 672, 60000, 0));
    gl.drawArrays(gl.POINTS, 0, dotsToDraw);
}



drawAlligatorQuiet = function(selectedProgram) {
    vertices = [];
    // let xOffset = (noise(frameCount * 0.01) - 0.5) * 0.75;
    // let yOffset = (noise((frameCount + 100) * 0.01) - 0.5) * 0.75;
    let shiftedDrawCount = drawCount + 588637 - 200;
    let t = shiftedDrawCount * 0.000125 + 0.5 + 8000000;
    let t2 = t * 1e-1;
    let xOffset = openSimplex.noise2D(t2, t2 + 1000);
    let yOffset = openSimplex.noise2D(t2 - 1000, t2 + 500);
    t2 = (t2 + 5000) * 100;
    let xOffset2 = openSimplex.noise2D(t2, t2 + 1000);
    let yOffset2 = openSimplex.noise2D(t2 - 1000, t2 + 500);
    let fx = 1;
    let fy = 1;
    let x = 1;
    let y = 1;
    let m = map(sin(t * 0.25e1), -1, 1, 1e-5, 1e-3);
    let t3 = drawCount * 1e7 * 0.5;
    let al = map(openSimplex.noise2D(t3, t3 + 10000), -1, 1, 0.001, 1.25);
    // al = 0.3;
    num = 0;
    let nnn = 1500;
    let sst = Math.PI * 2, iiin = (Math.PI * 4) / nnn;
    for (let i = sst; i < (Math.PI * 4) + sst; i += iiin) {
    let al = map(openSimplex.noise2D(t3, i), -1, 1, 0.001, 1.25);
        let t = i;
        let t2 = Math.abs(Math.cos(t * 1.5 * 1.5))
        let y = Math.cos(t + drawCount * 1e-2 + 1.23) * Math.sqrt(t2) * 0.35;
        let x = Math.sin(t + drawCount * 1e-2 + 1.23) * Math.sqrt(t2) * 0.35;
        // vertices.push(x * (9 / 16), y, 15, al);
        // num++;
    }
    //     for (let i = 0; i < 1500; i += 1) {
    // let al = map(openSimplex.noise2D(t3, i), -1, 1, 0.001, 1.25);
    //     let t = i;
    //     let t2 = Math.abs(Math.cos(t * 1.75))
    //     let sc = 0.49;
    //     let y = Math.cos(t + drawCount * 1e-2) * Math.sqrt(t2) * 0.3;
    //     let x = Math.sin(t + drawCount * 1e-2) * Math.sqrt(t2) * 0.3;
    //     vertices.push(x * (9 / 16) - sc, -y + sc, 15, al);
    //     num++;
    //     vertices.push(x * (9 / 16) - sc, y - sc, 15, al);
    //     num++;
    //     y = Math.cos(t - drawCount * 1e-2) * Math.sqrt(t2) * 0.3;
    //     x = Math.sin(t - drawCount * 1e-2) * Math.sqrt(t2) * 0.3;
    //     vertices.push(x * (9 / 16) + sc, -y + sc, 15, al);
    //     num++;
    //     vertices.push(x * (9 / 16) + sc, y - sc, 15, al);
    //     num++;
    // }
    let sides = 6;
    let inc = (Math.PI * 2) / sides;
    let st = -drawCount * 1e-2;
    for (let i = st; i <= (Math.PI * 2.1) - inc + st; i += inc) {
        let p0 = [Math.cos(i), Math.sin(i)];
        let p1 = [Math.cos(i + inc), Math.sin(i + inc)];
        for (let p = 0; p < 1; p += 0.01) {
    // let al = map(openSimplex.noise2D(t3, p * 1e6), -1, 1, 0.001, 1.25);
            let x = lerp(p0[0], p1[0], p) * 0.5;
            let y = lerp(p0[1], p1[1], p) * 0.5;
            // vertices.push(x * (9 / 16), y, 15, al);
            // num++;
        }
    }
    sides = 5;
    inc = (Math.PI * 2) / sides;
    st = -drawCount * 1e-2;
    for (let i = st; i <= (Math.PI * 2.1) - inc + st; i += inc) {
        let p0 = [Math.cos(i), Math.sin(i)];
        let p1 = [Math.cos(i + inc), Math.sin(i + inc)];
        for (let p = 0; p < 1; p += 0.01) {
            for (let k = 0; k < 25; k += 5) {
            let d = Math.pow(dist(0, p, 1, Math.sin(p * 1.5)), k) * 0.65;
            let x = lerp(p0[0], p1[0], p) * 0.5 * d;
            let y = lerp(p0[1], p1[1], p) * 0.5 * d;
            // vertices.push(x * (9 / 16), y, 15, al);
            // num++;
            }
        }
    }
    // sides = 5;
    // inc = (Math.PI * 2) / sides;
    // st = -drawCount * 1e-2 - Math.PI;
    // for (let i = st; i <= (Math.PI * 2.001) - inc + st; i += inc) {
    //     let p0 = [Math.cos(i), Math.sin(i)];
    //     let a1 = i + (inc * 3 * Math.sin(drawCount * 0.5e-1)) % sides;
    //     let p1 = [Math.cos(a1), Math.sin(a1)];
    //     for (let p = 0; p < 1; p += 0.01) {
    //         let d = dist(0, p, 0, 0.5) * 1;
    //         let x = lerp(p0[0], p1[0], p) * 0.5;
    //         let y = lerp(p0[1], p1[1], p) * 0.5;
    //         for (let m = 0; m < 4; m++) {
    //             let sca = Math.pow(0.75, m);
    //             vertices.push(x * (9 / 16) * sca, y * sca, 15, al);
    //         num++;
    //         }
    //     }
    // }
    //     sides = 3;
    // inc = (Math.PI * 2) / sides;
    // st = Math.PI * 0.5;
    // for (let i = st; i <= (Math.PI * 2.1) - inc + st; i += inc) {
    //     let p0 = [Math.cos(i), Math.sin(i)];
    //     let p1 = [Math.cos(i + inc), Math.sin(i + inc)];
    //     for (let p = 0; p < 1; p += 0.005) {
    //         let x = lerp(p0[0], p1[0], p) * 1;
    //         let y = lerp(p0[1], p1[1], p) * 1;
    //         vertices.push(x * (9 / 16), -y, 15, al);
    //         num++;
    //     }
    // }
    inc = (Math.PI * 2) / 500;
    for (let i = 0 ; i < Math.PI * 2; i += inc) {
        let x = Math.cos(i) * 0.5;
        let y = Math.sin(i) * 0.5;
        // vertices.push(x * (9 / 16), y, 15, al);
        // num++;
    }
    inc = (Math.PI * 2) / 250;
    let moonPhases = [];
    for (let aa = 0; aa < Math.PI * 2; aa += Math.PI * 2 / 12) {
        let ax = Math.cos((aa + Math.PI * 2 / 12) * 0.75 * -drawCount * 1e-2 * 1);
        let ay = Math.sin((aa + Math.PI * 2 / 12) * 0.75 * -drawCount * 1e-2 * 1);
        let ii = 0;
    for (let i = Math.PI * 0.5 ; i < Math.PI * 2.5; i += inc) {
        // ii++;
        // let x = Math.cos(i) * ((i < Math.PI * 1.5) ? 1 : -0.5) * 0.5;
        let x = Math.cos(i) * 0.5;
        let y = Math.sin(i) * 0.5;
        let c = Math.cos(Math.PI * 0.65) * 0.8;
        x = (x * 2 > c) ? x : -x + c;
        let px = x;
        let rotatedX = x * ay + y * ax;
        let rotatedY = y * ay - x * ax;
        x = rotatedX * 1 + -0.85 + (Math.sin(aa) * 0.5 * 0);
        y = rotatedY * 1 + -0.66 + (Math.sin(aa) * 0);
        vertices.push(x * (9 / 16) * 0.75 + 0.7 * 1.5 + 0.1 - 0.8, y * 0.75 + 0.5, 15, al);
        num++;
        // vertices.push(-x * (9 / 16) * 0.75 - 0.7 * 1.5 - 0.1, y * 0.75 + 0.5, 15, al);
        // num++;
        
        // console.log(ii);
        if (ii == 15 || ii == 249 - 15 * 9 - 5) {
            // console.log("slops!");
            x = rotatedX * 1.2 + -0.85 + (Math.sin(aa) * 0.5 * 0);
            y = rotatedY * 1.2 + -0.66 + (Math.sin(aa) * 0);
            x = x * (9 / 16) * 0.75 + 0.7 * 1.5 + 0.1 - 0.8;
            y = y * 0.75 + 0.5;
            moonPhases.push([x, y]);
            // vertices.push(x, y, 50, al);
            // num++;
        }
        ii++;
    }
    }
    for (let i = 0; i < moonPhases.length; i++) {
        let m = moonPhases[i];
        let size = 50;
        let found = false;
        for (let j = 0; j < moonPhases.length; j++) {
            let n = moonPhases[j];
            if (i !== j) {
                let d = dist(m[0], m[1], n[0], n[1]);
                if (d < 0.01 && !found) {
                    found = true;
                    size *= 4;
                    var msgToSend = {
                    address: "/moon",
                    args: [{
                        type: "f",
                        value: random([0, 2, 4, 7, 11])
                    }]
                    };
                    socket.emit('msgToSCD', msgToSend);
                }
            }
        }
        vertices.push(m[0], m[1], size, al);
        num++;
    }
    // logJavaScriptConsole(moonPhases.length);
    // console.log(moonPhases);
    // aaa = 1000;
    // teardrop equation
    // http://paulbourke.net/geometry/teardrop/
    inc = (Math.PI * 2) / 250;
    for (let i = 0; i < Math.PI * 2; i += inc) {
        let sc = 0.25;
        let x = 0.5 * (4 * Math.cos(i * 0.5) * Math.pow(Math.sin(i * 0.5), 4)) * sc; 
        let y = -Math.cos(i) * sc; 
        // vertices.push(x * (9 / 16) + 0.7, -y - (Math.cos(0) * sc) - 0.22, 15, al);
        // num++;
                // vertices.push(x * (9 / 16) - 0.7, -y - (Math.cos(0) * sc) - 0.22, 15, al);
        // num++;
    }
    inc = PI / 500;
     for (let i = Math.PI / 4; i < Math.PI / 4 * 3; i += inc) {
         let sc = 0.75;
    let x = (Math.cos(i) * sc);
    let y = (Math.sin(i) * sc) - Math.sin(Math.PI/4) * sc;
    // ellipse(x + 60, y, 1);
    // vertex(x + 60, y);
         // vertices.push(x * (9 / 16) - 0.7, y, 15, al);
         // num++;         
         // vertices.push(x * (9 / 16) - 0.7, -y, 15, al);
         // num++;
         // vertices.push(x * (9 / 16) + 0.7, y, 15, al);
         // num++;         
         // vertices.push(x * (9 / 16) + 0.7, -y, 15, al);
         // num++;
    // ellipse(x - 55, y, 1);
    // ellipse(x + 60, y * -1 + 300 - 17, 1);
    // ellipse(x - 55, y * -1 + 300 - 17, 1);
  }
    for (let i = 0; i < 1500; i++) {
        let x = Math.cos(i + drawCount) * i * 0.0001;
        let y = Math.sin(i + drawCount) * i * 0.0001;
        // vertices.push(x * (9 / 16) + 0.7, -y, 15, al);
        // num++;
        // vertices.push(x * (9 / 16) - 0.7, -y, 15, al);
        // num++;
    }
    drawScratches();
    for (let i = 0; i < vertices.length; i += 4) {
        vertices[i] += nx;
        vertices[i + 1] += ny;
    }
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, dotsVBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
        var scalar = gl.getUniformLocation(selectedProgram, "resolution");
    // Point an attribute to the currently bound VBO
    // gl.vertexAttribPointer(coord, 1, gl.FLOAT, false, 0, 0);
    gl.uniform1f(scalar, resolutionScalar);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, num);
}

drawAlligatorQuiet = function(selectedProgram) {
    vertices = [];
    // let xOffset = (noise(frameCount * 0.01) - 0.5) * 0.75;
    // let yOffset = (noise((frameCount + 100) * 0.01) - 0.5) * 0.75;
    let shiftedDrawCount = drawCount + 588637 - 200;
    let t = shiftedDrawCount * 0.000125 + 0.5 + 8000000;
    let t2 = t * 1e-1;
    let xOffset = openSimplex.noise2D(t2, t2 + 1000);
    let yOffset = openSimplex.noise2D(t2 - 1000, t2 + 500);
    t2 = (t2 + 5000) * 100;
    let xOffset2 = openSimplex.noise2D(t2, t2 + 1000);
    let yOffset2 = openSimplex.noise2D(t2 - 1000, t2 + 500);
    let fx = 1;
    let fy = 1;
    let x = 1;
    let y = 1;
    let m = map(sin(t * 0.25e1), -1, 1, 1e-5, 1e-3);
    let t3 = drawCount * 1e7 * 0.5;
    let al = map(openSimplex.noise2D(t3, t3 + 10000), -1, 1, 0.001, 1.25);
    // al = 0.3;
    num = 0;
    let nnn = 1500;
    let sst = Math.PI * 2, iiin = (Math.PI * 4) / nnn;
    for (let i = sst; i < (Math.PI * 4) + sst; i += iiin) {
    let al = map(openSimplex.noise2D(t3, i), -1, 1, 0.001, 1.25);
        let t = i;
        let t2 = Math.abs(Math.cos(t * 1.5 * 1.5))
        let y = Math.cos(t + drawCount * 1e-2 + 1.23) * Math.sqrt(t2) * 0.35;
        let x = Math.sin(t + drawCount * 1e-2 + 1.23) * Math.sqrt(t2) * 0.35;
        // vertices.push(x * (9 / 16), y, 15, al);
        // num++;
    }
    //     for (let i = 0; i < 1500; i += 1) {
    // let al = map(openSimplex.noise2D(t3, i), -1, 1, 0.001, 1.25);
    //     let t = i;
    //     let t2 = Math.abs(Math.cos(t * 1.75))
    //     let sc = 0.49;
    //     let y = Math.cos(t + drawCount * 1e-2) * Math.sqrt(t2) * 0.3;
    //     let x = Math.sin(t + drawCount * 1e-2) * Math.sqrt(t2) * 0.3;
    //     vertices.push(x * (9 / 16) - sc, -y + sc, 15, al);
    //     num++;
    //     vertices.push(x * (9 / 16) - sc, y - sc, 15, al);
    //     num++;
    //     y = Math.cos(t - drawCount * 1e-2) * Math.sqrt(t2) * 0.3;
    //     x = Math.sin(t - drawCount * 1e-2) * Math.sqrt(t2) * 0.3;
    //     vertices.push(x * (9 / 16) + sc, -y + sc, 15, al);
    //     num++;
    //     vertices.push(x * (9 / 16) + sc, y - sc, 15, al);
    //     num++;
    // }
    let sides = 6;
    let inc = (Math.PI * 2) / sides;
    let st = -drawCount * 1e-2;
    for (let i = st; i <= (Math.PI * 2.1) - inc + st; i += inc) {
        let p0 = [Math.cos(i), Math.sin(i)];
        let p1 = [Math.cos(i + inc), Math.sin(i + inc)];
        for (let p = 0; p < 1; p += 0.01) {
    // let al = map(openSimplex.noise2D(t3, p * 1e6), -1, 1, 0.001, 1.25);
            let x = lerp(p0[0], p1[0], p) * 0.5;
            let y = lerp(p0[1], p1[1], p) * 0.5;
            // vertices.push(x * (9 / 16), y, 15, al);
            // num++;
        }
    }
    sides = 5;
    inc = (Math.PI * 2) / sides;
    st = -drawCount * 1e-2;
    for (let i = st; i <= (Math.PI * 2.1) - inc + st; i += inc) {
        let p0 = [Math.cos(i), Math.sin(i)];
        let p1 = [Math.cos(i + inc), Math.sin(i + inc)];
        for (let p = 0; p < 1; p += 0.01) {
            for (let k = 0; k < 25; k += 5) {
            let d = Math.pow(dist(0, p, 1, Math.sin(p * 1.5)), k) * 0.65;
            let x = lerp(p0[0], p1[0], p) * 0.5 * d;
            let y = lerp(p0[1], p1[1], p) * 0.5 * d;
            // vertices.push(x * (9 / 16), y, 15, al);
            // num++;
            }
        }
    }
    // sides = 5;
    // inc = (Math.PI * 2) / sides;
    // st = -drawCount * 1e-2 - Math.PI;
    // for (let i = st; i <= (Math.PI * 2.001) - inc + st; i += inc) {
    //     let p0 = [Math.cos(i), Math.sin(i)];
    //     let a1 = i + (inc * 3 * Math.sin(drawCount * 0.5e-1)) % sides;
    //     let p1 = [Math.cos(a1), Math.sin(a1)];
    //     for (let p = 0; p < 1; p += 0.01) {
    //         let d = dist(0, p, 0, 0.5) * 1;
    //         let x = lerp(p0[0], p1[0], p) * 0.5;
    //         let y = lerp(p0[1], p1[1], p) * 0.5;
    //         for (let m = 0; m < 4; m++) {
    //             let sca = Math.pow(0.75, m);
    //             vertices.push(x * (9 / 16) * sca, y * sca, 15, al);
    //         num++;
    //         }
    //     }
    // }
    //     sides = 3;
    // inc = (Math.PI * 2) / sides;
    // st = Math.PI * 0.5;
    // for (let i = st; i <= (Math.PI * 2.1) - inc + st; i += inc) {
    //     let p0 = [Math.cos(i), Math.sin(i)];
    //     let p1 = [Math.cos(i + inc), Math.sin(i + inc)];
    //     for (let p = 0; p < 1; p += 0.005) {
    //         let x = lerp(p0[0], p1[0], p) * 1;
    //         let y = lerp(p0[1], p1[1], p) * 1;
    //         vertices.push(x * (9 / 16), -y, 15, al);
    //         num++;
    //     }
    // }
    inc = (Math.PI * 2) / 500;
    for (let i = 0 ; i < Math.PI * 2; i += inc) {
        let x = Math.cos(i) * 0.5;
        let y = Math.sin(i) * 0.5;
        // vertices.push(x * (9 / 16), y, 15, al);
        // num++;
    }
    inc = (Math.PI * 2) / 250;
    let moonPhases = [];
    for (let aa = 0; aa < Math.PI * 2; aa += Math.PI * 2 / 12) {
        let ax = Math.cos((aa + Math.PI * 2 / 12) * 0.75 * -drawCount * 1e-2 * 8);
        let ay = Math.sin((aa + Math.PI * 2 / 12) * 0.75 * -drawCount * 1e-2 * 8);
        let ii = 0;
    for (let i = Math.PI * 0.5 ; i < Math.PI * 2.5; i += inc) {
        // ii++;
        // let x = Math.cos(i) * ((i < Math.PI * 1.5) ? 1 : -0.5) * 0.5;
        let x = Math.cos(i) * 0.5;
        let y = Math.sin(i) * 0.5;
        let c = Math.cos(Math.PI * 0.65) * 0.8;
        x = (x * 2 > c) ? x : -x + c;
        let px = x;
        let rotatedX = x * ay + y * ax;
        let rotatedY = y * ay - x * ax;
        x = rotatedX * 1 + -3.1 + (aa * 0.8);
        y = rotatedY * 1 + -0.66 + (Math.sin(aa) * 0);
        vertices.push(x * (9 / 16) * 0.75 + 0.7 * 1.5 + 0.1 - 0.8, y * 0.75 + 0.5, 15, al);
        num++;
        // vertices.push(-x * (9 / 16) * 0.75 - 0.7 * 1.5 - 0.1, y * 0.75 + 0.5, 15, al);
        // num++;
        
        // console.log(ii);
        if (ii == 15 || ii == 249 - 15 * 9 - 5) {
            // console.log("slops!");
            x = rotatedX * 1.2 + -3.1 + (aa * 0.8);
            y = rotatedY * 1.2 + -0.66 + (Math.sin(aa) * 0);
            x = x * (9 / 16) * 0.75 + 0.7 * 1.5 + 0.1 - 0.8;
            y = y * 0.75 + 0.5;
            moonPhases.push([x, y]);
            // vertices.push(x, y, 50, al);
            // num++;
        }
        ii++;
    }
    }
    for (let i = 0; i < moonPhases.length; i++) {
        let m = moonPhases[i];
        let size = 50;
        let found = false;
        for (let j = 0; j < moonPhases.length; j++) {
            let n = moonPhases[j];
            if (i !== j) {
                let d = dist(m[0], m[1], n[0], n[1]);
                if (d < 0.05 && !found) {
                    found = true;
                    size *= 4;
                    var msgToSend = {
                    address: "/moon",
                    args: [{
                        type: "f",
                        value: random([0, 2, 4, 7, 11])
                    }]
                    };
                    socket.emit('msgToSCD', msgToSend);
                }
            }
        }
        vertices.push(m[0], m[1], size, al);
        num++;
    }
    // logJavaScriptConsole(moonPhases.length);
    // console.log(moonPhases);
    // aaa = 1000;
    // teardrop equation
    // http://paulbourke.net/geometry/teardrop/
    inc = (Math.PI * 2) / 250;
    for (let i = 0; i < Math.PI * 2; i += inc) {
        let sc = 0.25;
        let x = 0.5 * (4 * Math.cos(i * 0.5) * Math.pow(Math.sin(i * 0.5), 4)) * sc; 
        let y = -Math.cos(i) * sc; 
        // vertices.push(x * (9 / 16) + 0.7, -y - (Math.cos(0) * sc) - 0.22, 15, al);
        // num++;
                // vertices.push(x * (9 / 16) - 0.7, -y - (Math.cos(0) * sc) - 0.22, 15, al);
        // num++;
    }
    inc = PI / 500;
     for (let i = Math.PI / 4; i < Math.PI / 4 * 3; i += inc) {
         let sc = 0.75;
    let x = (Math.cos(i) * sc);
    let y = (Math.sin(i) * sc) - Math.sin(Math.PI/4) * sc;
    // ellipse(x + 60, y, 1);
    // vertex(x + 60, y);
         // vertices.push(x * (9 / 16) - 0.7, y, 15, al);
         // num++;         
         // vertices.push(x * (9 / 16) - 0.7, -y, 15, al);
         // num++;
         // vertices.push(x * (9 / 16) + 0.7, y, 15, al);
         // num++;         
         // vertices.push(x * (9 / 16) + 0.7, -y, 15, al);
         // num++;
    // ellipse(x - 55, y, 1);
    // ellipse(x + 60, y * -1 + 300 - 17, 1);
    // ellipse(x - 55, y * -1 + 300 - 17, 1);
  }
    for (let i = 0; i < 1500; i++) {
        let x = Math.cos(i + drawCount) * i * 0.0001;
        let y = Math.sin(i + drawCount) * i * 0.0001;
        // vertices.push(x * (9 / 16) + 0.7, -y, 15, al);
        // num++;
        // vertices.push(x * (9 / 16) - 0.7, -y, 15, al);
        // num++;
    }
    drawScratches();
    for (let i = 0; i < vertices.length; i += 4) {
        vertices[i] += nx;
        vertices[i + 1] += ny;
    }
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, dotsVBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
        var scalar = gl.getUniformLocation(selectedProgram, "resolution");
    // Point an attribute to the currently bound VBO
    // gl.vertexAttribPointer(coord, 1, gl.FLOAT, false, 0, 0);
    gl.uniform1f(scalar, resolutionScalar);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, num);
}




drawAlligatorQuiet = function(selectedProgram) {
    vertices = [];
    let t3 = drawCount * 1e7 * 0.5;
    let al = map(openSimplex.noise2D(t3, t3 + 10000), -1, 1, 0.001, 1.25);
    num = 0;
    inc = (Math.PI * 2) / 500;
    for (let i = 0 ; i < Math.PI * 2; i += inc) {
        let x = Math.cos(i) * fsizeR;
        let y = Math.sin(i) * fsizeR;
        vertices.push(x * (9 / 16), y, 15, al);
        num++;
    }
    if (fsizeR !== fsize) {
        fsizeR = lerp(fsizeR, fsize, 0.1);
        if (Math.abs(fsize - fsizeR) < 0.0001) {
            fsizeR = fsize;
        }
    }
    // drawScratches();
    for (let i = 0; i < vertices.length; i += 4) {
        vertices[i] += nx;
        vertices[i + 1] += ny;
    }
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, dotsVBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
        var scalar = gl.getUniformLocation(selectedProgram, "resolution");
    // Point an attribute to the currently bound VBO
    // gl.vertexAttribPointer(coord, 1, gl.FLOAT, false, 0, 0);
    gl.uniform1f(scalar, resolutionScalar);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, num);
}



moonAngles = Array(12).fill(0);
moonPos = Array(12).fill([0, 0]);
moonPosR = Array(12).fill([0, 0]);
speed = 1, speedR = 1;

moonPos = [
    [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
    [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]
];
moonPosR = [
    [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
    [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]
];

moonAngles = Array(12).fill(0);
var inc = Math.PI * 2 / 12 / 12;
moonInc = Array.from(Array(12), (e, i) => (0 + 1) * 0.5 * inc * 1);

// moonInc = Array(12).fill(0);
// moonPos = Array.from(Array(12), (e, i) => [map(i, 0, 11, -1, 1) * 0, 0]);
// moonPos = Array.from(Array(12), (e, i) => [map(i, 0, 11, -1, 1) * 0.9, i * 0.025]);

spread = function(u = 0.9) {
    moonPos = Array.from(Array(12), (e, i) => [map(i, 0, 11, -1, 1) * u * 0.95, 0]);
}

moonSize = 1;
moonSizeR = 1;
moonVox = Array(12).fill(0);

if (false) {

moonAngles = Array(12).fill(0)
moonInc = Array.from(Array(12), (e, i) => (i + 1) * 0 + inc * 1);
moonInc = moonInc.map((x,i) => inc * 0.5 + i * 0);
moonInc = moonInc.map((x,i) => x + i * 0.0005);
moonAngles = Array(12).fill(0); moonInc = Array(12).fill(inc);
// The best combo
moonInc = moonInc.map((x,i) => inc);
moonInc = moonInc.map((x,i) => x - (i + 1) * 0.001);

moonPos = [
    [-1.2, 0], [-1.2, 0], [0, 0.5], [0, 0.5], [1.2, 0], [1.2, 0],
    [0, -0.5], [0, -0.5], [-0.5, 0], [-0.5, 0], [0.5, 0], [0.5, 0]
];

moonPos = [
    [-0.5, 0], [-0.5, 0], [0, 0.25], [0, 0.25], [0.5, 0], [0.5, 0],
    [0, -0.25], [0, -0.25], [-0.25, 0], [-0.25, 0], [0.25, 0], [0.25, 0]
];

moonPos = [
    [-1, 0.5], [-1, 0.5], [-0.5, 0], [-0.5, 0], [-1, -0.5], [-1, -0.5], 
    [1, 0.5], [1, 0.5], [1, -0.5], [1, -0.5], [0.5, 0], [0.5, 0]
];
moonVox = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1];

antiphon = function() {
    moonPos = [
        [-1, 0.5], [-1, 0.5], [-0.5, 0], [-0.5, 0], [-1, -0.5], [-1, -0.5], 
        [1, 0.5], [1, 0.5], [1, -0.5], [1, -0.5], [0.5, 0], [0.5, 0]
    ];
    moonVox = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1];
}

moonInc = moonInc.map((e,i) => i>5 ? 0 : 0.125 * (i + 1));
moonInc = moonInc.map((e,i) => i<6 ? 0 : 0.125 * (i + 1));
    
    
moonInc = moonInc.map((e,i) => inc * 2 - (i * 1e-3));
moonInc = moonInc.map((e,i) => inc * 2);
vt.add("moonInc = moonInc.map((e,i) => inc * 2 - (i * 1e-3));");
vt.add("moonInc = moonInc.map((e,i) => inc * 2);");

vt.add("moonInc = moonInc.map((e,i) => i>5 ? 0 : 0.5 * (i + 1))");
vt.add("moonInc = moonInc.map((e,i) => i<6 ? 0 : 0.5 * (i + 1))");

vt.text = "moonAngles = Array(12).fill(0)";
moonInc = moonInc.map((e,i) => i>5 ? 0 : 0.5 * (i + 1));
moonInc = moonInc.map((e,i) => i<6 ? 0 : 0.5 * (i + 1));
moonInc = rotate(moonInc, 2); moonPos = rotate(moonPos, 2);

vt.add("moonInc = rotate(moonInc, 2); moonPos = rotate(moonPos, 2);");


rotate = function(arr, n = 1) {
  // if (reverse) arr.unshift(arr.pop());
for (let i = 0; i < n; i++) {
  arr.push(arr.shift());
}
  return arr;
}

}



Array.prototype.rotate = (function() {
    // save references to array functions to make lookup faster
    var push = Array.prototype.push,
        splice = Array.prototype.splice;
    return function(count) {
        var len = this.length >>> 0, // convert to uint
            count = count >> 0; // convert to int
        // convert count to value in range [0, len)
        count = ((count % len) + len) % len;
        // use splice.call() instead of this.splice() to make function generic
        push.apply(this, splice.call(this, 0, count));
        return this;
    };
})();

// moonInc = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; 
drawAlligatorQuiet = function(selectedProgram) {
    vertices = [];
    let t3 = drawCount * 0.5e7;
    let al = map(openSimplex.noise2D(t3, t3 + 10000), -1, 1, 0.001, 1.25);
    num = 0;
    // inc = (Math.PI * 2) / (350 * moonSizeR);
    inc = (Math.PI * 2) / Math.max(250, 350 * moonSizeR);
    // inc = (Math.PI * 2) / (250);
    let moonPhases = [];
    for (let aa = 0; aa < 12; aa++) {
        let p = moonPosR[aa];
        // if(aa==0){console.log("deb " + moonPosR[aa][0]);}
        let a = moonAngles[aa];
        let ax = Math.cos(-a);
        let ay = Math.sin(-a);
        let ii = 0;
        for (let i = Math.PI * 0.5 ; i < Math.PI * 2.5; i += inc) {
            let x = Math.cos(i) * 0.5 * moonSizeR;
            let y = Math.sin(i) * 0.5 * moonSizeR;
            let c = Math.cos(Math.PI * 0.65) * 0.8 * moonSizeR;
            x = (x * 2 > c) ? x : -x + c;
            let rotatedX = x * ay + y * ax;
            let rotatedY = y * ay - x * ax;
            x = rotatedX * (9 / 16) + p[0] * (9 / 16);
            y = rotatedY + p[1];
            vertices.push(x, y, 15, al);
            num++;
            if (ii == 15 || ii == 110) {
                // x = rotatedX * (9 / 16) * 1.15 + p[0] * (9 / 16);
                // y = rotatedY * 1.15 + p[1];
                x = Math.cos(Math.PI * 0.65 * 0.95) * 0.55 * moonSizeR;
                y = Math.sin(Math.PI * 0.65 * 0.95) * 0.55 * moonSizeR;
                let rotatedX = x * ay + y * ax;
                let rotatedY = y * ay - x * ax;
                x = rotatedX * (9 / 16) * 1 + p[0] * (9 / 16);
                y = rotatedY * 1 + p[1];
                moonPhases.push([x, y, aa]);
                x = Math.cos(Math.PI * 0.65 * 0.95) * 0.55 * moonSizeR;
                y = Math.sin(Math.PI * -0.65 * 0.95) * 0.55 * moonSizeR;
                rotatedX = x * ay + y * ax;
                rotatedY = y * ay - x * ax;
                x = rotatedX * (9 / 16) * 1 + p[0] * (9 / 16);
                y = rotatedY * 1 + p[1];
                moonPhases.push([x, y, aa]);
            }
            ii++;
        }
    }
    for (let i = 0; i < moonPhases.length; i++) {
        let m = moonPhases[i];
        let size = 50;
        let found = false;
        for (let j = 0; j < moonPhases.length; j++) {
            let n = moonPhases[j];
            if (i !== j) {
                let d = dist(m[0], m[1], n[0], n[1]);
                if (d < 0.01 * speedR && !found && (m[0] !== n[0] && m[1] !== n[1])) {
                    found = true;
                    size *= 4;
                    var msgToSend = {
                    address: "/moon",
                    args: [{
                        type: "f",
                        value: moonVox[m[2]]
                    }]
                    };
                    socket.emit('msgToSCD', msgToSend);
                }
            }
        }
        vertices.push(m[0], m[1], size, al);
        num++;
    }
    for (let i = 0; i < 12; i++) {
        moonAngles[i] += moonInc[i] * speedR % (Math.PI * 2);
    }
    if (speedR !== speed) {
        speedR = lerp(speedR, speed, 0.1);
        if (Math.abs(speed - speedR) < 0.0001) {
            speedR = speed;
        }
    }
    if (moonSizeR !== moonSize) {
        moonSizeR = lerp(moonSizeR, moonSize, 0.1);
        if (Math.abs(moonSize - moonSizeR) < 0.0001) {
            moonSizeR = moonSize;
        }
    }
    for (let i = 0; i < 12; i++) {
    // {
        // let i = 0;
        if (moonPosR[i][0] !== moonPos[i][0]) {
            // console.log("faaa");
            // console.log(moonPosR[i][0], moonPos[i][0]);
            // if(i==0){console.log(moonPosR[0][0]);}
            moonPosR[i][0] = lerp(moonPosR[i][0], moonPos[i][0], 0.05);
            // if(i==0){console.log("aaa " + moonPosR[0][0]);}
            if (Math.abs(moonPos[i][0] - moonPosR[i][0]) < 0.0001) {
                moonPosR[i][0] = moonPos[i][0];
            }
        }
        if (moonPosR[i][1] !== moonPos[i][1]) {
            moonPosR[i][1] = lerp(moonPosR[i][1], moonPos[i][1], 0.05);
            if (Math.abs(moonPos[i][1] - moonPosR[i][1]) < 0.0001) {
                moonPosR[i][1] = moonPos[i][1];
            }
        }
    }
    // console.log("after " + moonPosR[0][0]);
    drawScratches();
    for (let i = 0; i < vertices.length; i += 4) {
        vertices[i] += nx;
        vertices[i + 1] += ny;
    }
    // vertices = [];
    // num = 0;
    // vertices.push(mx, my, 100, 1);
    // num++;
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, dotsVBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
        var scalar = gl.getUniformLocation(selectedProgram, "resolution");
    // Point an attribute to the currently bound VBO
    // gl.vertexAttribPointer(coord, 1, gl.FLOAT, false, 0, 0);
    gl.uniform1f(scalar, resolutionScalar);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, num);
}

drawAlligatorQuietVert = function(selectedProgram) {
    // vertices = [];
    // // let xOffset = (noise(frameCount * 0.01) - 0.5) * 0.75;
    // // let yOffset = (noise((frameCount + 100) * 0.01) - 0.5) * 0.75;
    // let shiftedDrawCount = drawCount + 588637 - 200;
    // let t = shiftedDrawCount * 0.000125 + 0.5 + 8000000;
    // let t2 = t * 1e-1;
    // let xOffset = openSimplex.noise2D(t2, t2 + 1000);
    // let yOffset = openSimplex.noise2D(t2 - 1000, t2 + 500);
    // t2 = (t2 + 5000) * 100;
    // let xOffset2 = openSimplex.noise2D(t2, t2 + 1000);
    // let yOffset2 = openSimplex.noise2D(t2 - 1000, t2 + 500);
    // let fx = 1;
    // let fy = 1;
    // let x = 1;
    // let y = 1;
    // let m = map(sin(t * 0.25e1), -1, 1, 1e-5, 1e-3);
    // let t3 = t * 1e1 * 0.5;
    // let al = map(openSimplex.noise2D(t3, t3 + 1000), -1, 1, 0.1, 1.25);
    // al = 0.3;
    // for (let i = 0; i < 27000; i += 1) {
    //     // al = map(i, 0, 27000, 15, 80);
    //     x = sin(tan(i * 0.001) * fx + i * t * 0.001) * i * 0.00005;
    //     y = cos(tan(i * 0.001) * fx + i * t * 0.001) * i * 0.00015;
    //     //         x *= cos(fx * fy * 0.001) * sin(x + t * 20);
    //     //         y *= cos(fx * fy * 0.001) * cos(x + t * 20);
    //     fx = sin(i * m);
    //     fy = y * 5;
    //     x += (Math.random() - 0.5) * 0.00005;
    //     y += (Math.random() - 0.5) * 0.00005;
    //     x += xOffset * 0.15 * 2 * 0.2;
    //     y += yOffset * 0.15 * 3 * 0.2;
    //     x += xOffset2 * 2 * 1e-3 * 0.5;
    //     y += yOffset2 * 3 * 1e-3 * 0.5;
    //     x += cos(t * -1e2 * 0.25) * i * 1e-5 * 2;
    //     y += sin(t * -1e2 * 0.25) * i * 1e-5 * 3;
    //     // let xo = openSimplex.noise2D(i, t * 1e4) * 4e-4;
    //     let xo = 0;
    //     // let yo = openSimplex.noise2D(i, t * 1e4 + 1000) * 4e-4;
    //     let yo = 0;
    //     let zo = (openSimplex.noise2D(i, (t + i) * 1e2 + 100)) * 3;
    //     vertices.push((x + xo) * 1.4, (y + yo) * 0.8, 15 + zo, al);
    // }
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, dotsVBuf);
    gl.bufferData(gl.ARRAY_BUFFER, fvertices, gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "vertexID");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 1, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    var time = gl.getUniformLocation(selectedProgram, "time");
    // Point an attribute to the currently bound VBO
    // gl.vertexAttribPointer(coord, 1, gl.FLOAT, false, 0, 0);
    gl.uniform1f(time, drawCount);    
    var scalar = gl.getUniformLocation(selectedProgram, "resolution");
    // Point an attribute to the currently bound VBO
    // gl.vertexAttribPointer(coord, 1, gl.FLOAT, false, 0, 0);
    gl.uniform1f(scalar, resolutionScalar);
    // Enable the attribute
    // gl.enableVertexAttribArray(coord);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, 147456 * 1);
}


drawScratches = function() {
    mS = 1;
    amountOfScratches = Math.max(0, amountOfScratches);
    if (drawCount % 100 == 0) {
        mS = random(0.8, 1);
    }
    if (drawCount % 10 == 0) {
        if (Math.random() > 0.9) {
            amountOfScratches += random(20, 60);
            // fluctuation = 4;
        } else {
            amountOfScratches += 12;
            // fluctuation = 1;
        }
        // amountOfScratches = (Math.random() > 0.95) ? random(160, 60) : 3;
        // fluctuation = (Math.random() > 0.95) ? 4 : 1;
    }
    amountOfScratches -= 5;
    // vertices = [];
    for (let i = 0; i < 50; i++) {
        let v = Math.random();
        let s = (v >  0.99) ? 10 : 1;
        s = (v > 0.9995) ? s * random(1, 4) : s;
        s *= mS;
        vertices.push(Math.random() * 2.5 - 1, Math.random() * 2.5 - 1, s + Math.random() * 0.25 * s, Math.random());
        num++;
    }
    let n = Math.PI * 1 / 100;
    for (let m = 0; m < amountOfScratches; m++) {
        let s = Math.random() * Math.PI * 2;
        let sX = Math.random() * 2 - 1;
        let sY = Math.random() * 2 - 1;
        let sC = (Math.random() < 0.5) ? 0.01 : 1;
        let osc = Math.sin(drawCount * m);
        for (let i = s; i < Math.PI + s; i += n) {
            //         let x = cos(i) * cos(i * osc) * 0.1 + sX;
            //         let y = sin(i) * sin(i * osc) * 0.175 + sY;
            let x = Math.cos(i * 0.1) * Math.tan(osc * 10) * Math.cos(i * osc) * 0.1 + sX;
            let y = Math.sin(i * 0.1) * Math.tan(osc * 10) * Math.sin(i * osc) * 0.175 + sY;
            vertices.push(x * 1.5, y * 1.5, random(2, 20) * sC * mS, Math.random());
            num++;
        }
    }
}