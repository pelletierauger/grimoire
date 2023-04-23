                            let sc = 1.28;
                            tx = openSimplex.noise3D((x*7 + (xx)) * 0.05, (y*9 + (yy)) * 0.05, drawCount * 0.5e-1) * 0.01;
                            ty = openSimplex.noise3D((x*7 + (xx)) * 0.05, (y*9 + (yy)) * 0.05, drawCount * 0.5e-1 + 1e4) * 0.01;
                            vertices.push(((x * 7 + xx) * 0.00303 - 1.155 + nx) * sc + tx + 0.2, ((y * 9 + yy) * -0.0095 + 1.062 + ny) * sc + ty, 11 * sc, 1);