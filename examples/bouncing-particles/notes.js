    particles = [];
    let n = 50;
    for (let x = 0; x < n; x++) {
        for (let y = 0; y <  n; y++) {
            let p = {
                x: x / n + 0.0125,
                xVel: 1,
                y: y / n + 0.0125,
                yVel: 1
            };
            particles.push(p);
        }
    }
    draw = function() {
        clear();
        var notesToSend = 0;
        var frequency = frameCount * 0.1;
        var extraVelocity = Math.sin(frequency) * 0.01;
        var velocityScalar = 0.0001;
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            // This is a chaotic function because its input is the previous
            // state of the function, resulting in chaotic feedback and
            // attractors.
            p.x += Math.cos(p.x * p.y * 20) * p.xVel * velocityScalar;
            p.y += Math.sin(p.x * 20) * p.yVel * velocityScalar;
            let note = 0;
            p.x = constrain(p.x, 0, 1);
            p.y = constrain(p.y, 0, 1);
            if (p.x == 0 || p.x == 1) {
                p.xVel *= -1;
                note = 1;
            }
            if (p.y == 0 || p.y == 1) {
                p.yVel *= -1;
                note = 1;
            }
            notesToSend += note;
            let size = 3 + (6 * note);
            ellipse(10 + p.x * 580, 10 + p.y * 580, size);
            if (note && notesToSend <  5) {
            var msgToSend = {
                address: "/bouncy",
                args: [{
                    type: "s",
                    value: notes[noteIndex].name
                }]
            };
            noteIndex = (noteIndex + 1) % notes.length;
                socket.emit('msgToSCD', msgToSend);
            }
        }
    };



notes = [
    {
      "name": "D5",
      "midi": 74,
      "time": 0,
      "velocity": 0.8582677165354331,
      "duration": 1.75
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 0,
      "velocity": 0.8582677165354331,
      "duration": 1.1875
    },
    {
      "name": "G2",
      "midi": 43,
      "time": 0,
      "velocity": 0.6771653543307087,
      "duration": 1
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 1,
      "velocity": 0.9921259842519685,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 1,
      "velocity": 0.9921259842519685,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 1,
      "velocity": 0.9921259842519685,
      "duration": 1
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 1.25,
      "velocity": 0.7401574803149606,
      "duration": 0.25
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 1.5,
      "velocity": 0.6535433070866141,
      "duration": 12.500000000000002
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 1.75,
      "velocity": 0.8582677165354331,
      "duration": 0.25
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 2,
      "velocity": 0.7401574803149606,
      "duration": 0.125
    },
    {
      "name": "C3",
      "midi": 48,
      "time": 2,
      "velocity": 0.7559055118110236,
      "duration": 1
    },
    {
      "name": "C5",
      "midi": 72,
      "time": 2.125,
      "velocity": 0.6692913385826772,
      "duration": 0.125
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 2.25,
      "velocity": 0.8503937007874016,
      "duration": 4
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 3,
      "velocity": 0.952755905511811,
      "duration": 1
    },
    {
      "name": "C4",
      "midi": 60,
      "time": 3,
      "velocity": 0.952755905511811,
      "duration": 1
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 3,
      "velocity": 0.952755905511811,
      "duration": 1
    },
    {
      "name": "A2",
      "midi": 45,
      "time": 4,
      "velocity": 0.7165354330708661,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 5,
      "velocity": 0.9606299212598425,
      "duration": 1
    },
    {
      "name": "C4",
      "midi": 60,
      "time": 5,
      "velocity": 0.9606299212598425,
      "duration": 1
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 5,
      "velocity": 0.9606299212598425,
      "duration": 1
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 6,
      "velocity": 0.7086614173228346,
      "duration": 1
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 6.25,
      "velocity": 0.8582677165354331,
      "duration": 0.25
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 6.5,
      "velocity": 0.8740157480314961,
      "duration": 0.25
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 6.75,
      "velocity": 0.8503937007874016,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 7,
      "velocity": 0.8582677165354331,
      "duration": 0.16458333333333375
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 7,
      "velocity": 1,
      "duration": 1.0000000000000018
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 7,
      "velocity": 1,
      "duration": 1.0000000000000018
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 7,
      "velocity": 1,
      "duration": 1.0000000000000018
    },
    {
      "name": "C6",
      "midi": 84,
      "time": 7.164583333333334,
      "velocity": 0.8661417322834646,
      "duration": 0.16458333333333375
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 7.3291666666666675,
      "velocity": 0.889763779527559,
      "duration": 0.1708333333333334
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 7.500000000000001,
      "velocity": 0.937007874015748,
      "duration": 0.16458333333333375
    },
    {
      "name": "F#6",
      "midi": 90,
      "time": 7.664583333333335,
      "velocity": 0.937007874015748,
      "duration": 0.16458333333333375
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 7.829166666666668,
      "velocity": 0.8267716535433071,
      "duration": 0.1708333333333334
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 8.000000000000002,
      "velocity": 0.8110236220472441,
      "duration": 0.25
    },
    {
      "name": "G2",
      "midi": 43,
      "time": 8.000000000000002,
      "velocity": 0.7795275590551181,
      "duration": 1
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 8.250000000000002,
      "velocity": 0.8110236220472441,
      "duration": 0.25
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 8.500000000000002,
      "velocity": 0.952755905511811,
      "duration": 1
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 9.000000000000002,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 9.000000000000002,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 9.000000000000002,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C6",
      "midi": 84,
      "time": 9.500000000000002,
      "velocity": 0.8110236220472441,
      "duration": 0.25
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 9.750000000000002,
      "velocity": 0.9606299212598425,
      "duration": 0.25
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 10.000000000000002,
      "velocity": 0.7716535433070866,
      "duration": 1.75
    },
    {
      "name": "D2",
      "midi": 38,
      "time": 10.000000000000002,
      "velocity": 0.7874015748031497,
      "duration": 1
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 11.000000000000002,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 11.000000000000002,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 11.000000000000002,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 11.750000000000002,
      "velocity": 0.9291338582677166,
      "duration": 0.25
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 12.000000000000002,
      "velocity": 0.7716535433070866,
      "duration": 1
    },
    {
      "name": "B1",
      "midi": 35,
      "time": 12.000000000000002,
      "velocity": 0.7952755905511811,
      "duration": 1
    },
    {
      "name": "B4",
      "midi": 71,
      "time": 13.000000000000002,
      "velocity": 0.7086614173228346,
      "duration": 0.5
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 13.000000000000002,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 13.000000000000002,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 13.000000000000002,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 13.500000000000002,
      "velocity": 0.9763779527559056,
      "duration": 0.9229166666666675
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 14.000000000000002,
      "velocity": 0.968503937007874,
      "duration": 0.1416666666666675
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 14.000000000000002,
      "velocity": 0.8031496062992126,
      "duration": 1.0000000000000018
    },
    {
      "name": "B4",
      "midi": 71,
      "time": 14.14166666666667,
      "velocity": 0.8031496062992126,
      "duration": 0.1395833333333325
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 14.281250000000002,
      "velocity": 0.9291338582677166,
      "duration": 0.5708333333333346
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 14.42291666666667,
      "velocity": 0.968503937007874,
      "duration": 0.14791666666666714
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 14.570833333333336,
      "velocity": 0.968503937007874,
      "duration": 0.1395833333333325
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 14.710416666666669,
      "velocity": 0.8110236220472441,
      "duration": 19.289583333333333
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 14.852083333333336,
      "velocity": 1,
      "duration": 0.14791666666666714
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 15.000000000000004,
      "velocity": 0.8267716535433071,
      "duration": 0.9458333333333329
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 15.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 15.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 15.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 15.945833333333336,
      "velocity": 1,
      "duration": 0.05416666666666714
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 16.000000000000004,
      "velocity": 1,
      "duration": 1.8979166666666671
    },
    {
      "name": "D2",
      "midi": 38,
      "time": 16.000000000000004,
      "velocity": 0.8346456692913385,
      "duration": 1
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 17.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 17.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 17.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 18.000000000000004,
      "velocity": 0.9133858267716536,
      "duration": 1
    },
    {
      "name": "B1",
      "midi": 35,
      "time": 18.000000000000004,
      "velocity": 0.8031496062992126,
      "duration": 1
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 19.000000000000004,
      "velocity": 0.8267716535433071,
      "duration": 0.25
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 19.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 19.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 19.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 19.250000000000004,
      "velocity": 0.9133858267716536,
      "duration": 0.25
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 19.500000000000004,
      "velocity": 0.8582677165354331,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 19.750000000000004,
      "velocity": 0.984251968503937,
      "duration": 0.25
    },
    {
      "name": "C6",
      "midi": 84,
      "time": 20.000000000000004,
      "velocity": 0.9291338582677166,
      "duration": 0.75
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 20.000000000000004,
      "velocity": 0.8188976377952756,
      "duration": 1
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 20.750000000000004,
      "velocity": 0.984251968503937,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 21.000000000000004,
      "velocity": 0.8031496062992126,
      "duration": 0.125
    },
    {
      "name": "E3",
      "midi": 52,
      "time": 21.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G#3",
      "midi": 56,
      "time": 21.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 21.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 21.125000000000004,
      "velocity": 0.8503937007874016,
      "duration": 0.125
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 21.250000000000004,
      "velocity": 0.968503937007874,
      "duration": 0.625
    },
    {
      "name": "C6",
      "midi": 84,
      "time": 21.875000000000004,
      "velocity": 0.9448818897637795,
      "duration": 0.125
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 22.000000000000004,
      "velocity": 0.7716535433070866,
      "duration": 1.75
    },
    {
      "name": "A2",
      "midi": 45,
      "time": 22.000000000000004,
      "velocity": 0.8346456692913385,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 23.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C#4",
      "midi": 61,
      "time": 23.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#4",
      "midi": 66,
      "time": 23.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G#5",
      "midi": 80,
      "time": 23.750000000000004,
      "velocity": 0.9212598425196851,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 24.000000000000004,
      "velocity": 0.968503937007874,
      "duration": 0.125
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 24.000000000000004,
      "velocity": 0.8267716535433071,
      "duration": 1
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 24.125000000000004,
      "velocity": 1,
      "duration": 0.125
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 24.250000000000004,
      "velocity": 1,
      "duration": 0.125
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 24.375000000000004,
      "velocity": 0.984251968503937,
      "duration": 0.125
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 24.500000000000004,
      "velocity": 0.968503937007874,
      "duration": 0.125
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 24.625000000000004,
      "velocity": 0.952755905511811,
      "duration": 0.125
    },
    {
      "name": "G#5",
      "midi": 80,
      "time": 24.750000000000004,
      "velocity": 0.9212598425196851,
      "duration": 0.125
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 24.875000000000004,
      "velocity": 0.9133858267716536,
      "duration": 0.125
    },
    {
      "name": "G#5",
      "midi": 80,
      "time": 25.000000000000004,
      "velocity": 1,
      "duration": 0.75
    },
    {
      "name": "E3",
      "midi": 52,
      "time": 25.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G#3",
      "midi": 56,
      "time": 25.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 25.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 25.750000000000004,
      "velocity": 0.8661417322834646,
      "duration": 0.25
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 26.000000000000004,
      "velocity": 1,
      "duration": 2
    },
    {
      "name": "A2",
      "midi": 45,
      "time": 26.000000000000004,
      "velocity": 0.7952755905511811,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 27.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C#4",
      "midi": 61,
      "time": 27.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#4",
      "midi": 66,
      "time": 27.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 28.000000000000004,
      "velocity": 1,
      "duration": 1.75
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 28.000000000000004,
      "velocity": 0.8031496062992126,
      "duration": 1
    },
    {
      "name": "E3",
      "midi": 52,
      "time": 29.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G#3",
      "midi": 56,
      "time": 29.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 29.000000000000004,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 29.750000000000004,
      "velocity": 0.905511811023622,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 30.000000000000004,
      "velocity": 0.7952755905511811,
      "duration": 0.25
    },
    {
      "name": "G2",
      "midi": 43,
      "time": 30.000000000000004,
      "velocity": 0.8031496062992126,
      "duration": 1
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 30.250000000000004,
      "velocity": 0.7795275590551181,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 30.500000000000004,
      "velocity": 0.9133858267716536,
      "duration": 0.25
    },
    {
      "name": "C6",
      "midi": 84,
      "time": 30.750000000000004,
      "velocity": 0.952755905511811,
      "duration": 0.25
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 31.000000000000004,
      "velocity": 0.9448818897637795,
      "duration": 0.16458333333333286
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 31.000000000000004,
      "velocity": 1,
      "duration": 0.9999999999999964
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 31.000000000000004,
      "velocity": 1,
      "duration": 0.9999999999999964
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 31.000000000000004,
      "velocity": 1,
      "duration": 0.9999999999999964
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 31.164583333333336,
      "velocity": 0.9448818897637795,
      "duration": 0.16458333333333286
    },
    {
      "name": "G6",
      "midi": 91,
      "time": 31.32916666666667,
      "velocity": 0.984251968503937,
      "duration": 0.17083333333333428
    },
    {
      "name": "F#6",
      "midi": 90,
      "time": 31.500000000000004,
      "velocity": 0.8661417322834646,
      "duration": 0.375
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 31.875000000000004,
      "velocity": 0.7165354330708661,
      "duration": 0.12499999999999645
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 32,
      "velocity": 0.968503937007874,
      "duration": 1.65625
    },
    {
      "name": "D2",
      "midi": 38,
      "time": 32,
      "velocity": 0.7874015748031497,
      "duration": 1
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 33,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 33,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 33,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 33.75,
      "velocity": 0.6692913385826772,
      "duration": 21.414583333333333
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 34,
      "velocity": 0.9763779527559056,
      "duration": 1.65625
    },
    {
      "name": "G2",
      "midi": 43,
      "time": 34,
      "velocity": 0.7952755905511811,
      "duration": 1
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 35,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 35,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 35,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 35.75,
      "velocity": 0.8740157480314961,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 36,
      "velocity": 1,
      "duration": 1.25
    },
    {
      "name": "B2",
      "midi": 47,
      "time": 36,
      "velocity": 0.7952755905511811,
      "duration": 1
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 37,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 37,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 37,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 37.25,
      "velocity": 0.8661417322834646,
      "duration": 0.25
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 37.5,
      "velocity": 0.7952755905511811,
      "duration": 0.25
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 37.75,
      "velocity": 0.9291338582677166,
      "duration": 0.25
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 38,
      "velocity": 0.889763779527559,
      "duration": 0.125
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 38,
      "velocity": 0.8267716535433071,
      "duration": 1
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 38.125,
      "velocity": 0.7874015748031497,
      "duration": 0.125
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 38.25,
      "velocity": 0.9606299212598425,
      "duration": 0.25
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 38.5,
      "velocity": 0.9133858267716536,
      "duration": 1.8291666666666657
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 39,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 39,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 39,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A2",
      "midi": 45,
      "time": 40,
      "velocity": 0.8188976377952756,
      "duration": 1
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 40.329166666666666,
      "velocity": 0.8188976377952756,
      "duration": 0.33541666666666714
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 40.66458333333333,
      "velocity": 0.9212598425196851,
      "duration": 0.33541666666666714
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 41,
      "velocity": 0.9448818897637795,
      "duration": 0.3291666666666657
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 41,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C#4",
      "midi": 61,
      "time": 41,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G4",
      "midi": 67,
      "time": 41,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 41.329166666666666,
      "velocity": 0.9763779527559056,
      "duration": 0.33541666666666714
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 41.66458333333333,
      "velocity": 0.968503937007874,
      "duration": 0.28125
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 41.94583333333333,
      "velocity": 0.9763779527559056,
      "duration": 0.05416666666666714
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 42,
      "velocity": 0.9763779527559056,
      "duration": 0.27291666666666714
    },
    {
      "name": "D2",
      "midi": 38,
      "time": 42,
      "velocity": 0.8031496062992126,
      "duration": 1
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 42.27291666666667,
      "velocity": 1,
      "duration": 0.05624999999999858
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 42.329166666666666,
      "velocity": 1,
      "duration": 1.5854166666666671
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 43,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 43,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#4",
      "midi": 66,
      "time": 43,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 44,
      "velocity": 0.9448818897637795,
      "duration": 0.75
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 44,
      "velocity": 0.8346456692913385,
      "duration": 1
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 44.75,
      "velocity": 0.9921259842519685,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 45,
      "velocity": 0.7952755905511811,
      "duration": 0.25
    },
    {
      "name": "E3",
      "midi": 52,
      "time": 45,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G#3",
      "midi": 56,
      "time": 45,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 45,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 45.25,
      "velocity": 0.8110236220472441,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 45.5,
      "velocity": 0.952755905511811,
      "duration": 0.375
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 45.875,
      "velocity": 0.9212598425196851,
      "duration": 0.125
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 46,
      "velocity": 0.7716535433070866,
      "duration": 1.75
    },
    {
      "name": "A2",
      "midi": 45,
      "time": 46,
      "velocity": 0.7952755905511811,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 47,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C#4",
      "midi": 61,
      "time": 47,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#4",
      "midi": 66,
      "time": 47,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G#5",
      "midi": 80,
      "time": 47.75,
      "velocity": 0.9133858267716536,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 48,
      "velocity": 0.9606299212598425,
      "duration": 0.125
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 48,
      "velocity": 0.8267716535433071,
      "duration": 1
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 48.125,
      "velocity": 1,
      "duration": 0.125
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 48.25,
      "velocity": 1,
      "duration": 0.125
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 48.375,
      "velocity": 0.9763779527559056,
      "duration": 0.125
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 48.5,
      "velocity": 0.8976377952755905,
      "duration": 0.125
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 48.625,
      "velocity": 0.9133858267716536,
      "duration": 0.125
    },
    {
      "name": "G#5",
      "midi": 80,
      "time": 48.75,
      "velocity": 0.8740157480314961,
      "duration": 0.125
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 48.875,
      "velocity": 0.8661417322834646,
      "duration": 0.125
    },
    {
      "name": "G#5",
      "midi": 80,
      "time": 49,
      "velocity": 0.905511811023622,
      "duration": 0.75
    },
    {
      "name": "E3",
      "midi": 52,
      "time": 49,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G#3",
      "midi": 56,
      "time": 49,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 49,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 49.75,
      "velocity": 0.8267716535433071,
      "duration": 0.25
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 50,
      "velocity": 1,
      "duration": 2
    },
    {
      "name": "A2",
      "midi": 45,
      "time": 50,
      "velocity": 0.8188976377952756,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 51,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C#4",
      "midi": 61,
      "time": 51,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#4",
      "midi": 66,
      "time": 51,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 52,
      "velocity": 0.7480314960629921,
      "duration": 1.75
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 52,
      "velocity": 0.8267716535433071,
      "duration": 1
    },
    {
      "name": "E3",
      "midi": 52,
      "time": 53,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G#3",
      "midi": 56,
      "time": 53,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 53,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 53.75,
      "velocity": 0.8110236220472441,
      "duration": 0.25
    },
    {
      "name": "B4",
      "midi": 71,
      "time": 54,
      "velocity": 0.7637795275590551,
      "duration": 0.25
    },
    {
      "name": "G2",
      "midi": 43,
      "time": 54,
      "velocity": 0.8031496062992126,
      "duration": 1
    },
    {
      "name": "A4",
      "midi": 69,
      "time": 54.25,
      "velocity": 0.8188976377952756,
      "duration": 0.25
    },
    {
      "name": "B4",
      "midi": 71,
      "time": 54.5,
      "velocity": 0.9291338582677166,
      "duration": 0.25
    },
    {
      "name": "C5",
      "midi": 72,
      "time": 54.75,
      "velocity": 0.9448818897637795,
      "duration": 0.25
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 55,
      "velocity": 0.9606299212598425,
      "duration": 2.65625
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 55,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 55,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 55,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 55.16458333333333,
      "velocity": 0.9291338582677166,
      "duration": 0.16458333333333286
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 55.329166666666666,
      "velocity": 0.9606299212598425,
      "duration": 0.17083333333333428
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 55.5,
      "velocity": 0.8503937007874016,
      "duration": 0.375
    },
    {
      "name": "A4",
      "midi": 69,
      "time": 55.875,
      "velocity": 0.6929133858267716,
      "duration": 0.125
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 56,
      "velocity": 0.9606299212598425,
      "duration": 2
    },
    {
      "name": "D2",
      "midi": 38,
      "time": 56,
      "velocity": 0.7952755905511811,
      "duration": 1
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 57,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 57,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 57,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 57.75,
      "velocity": 0.937007874015748,
      "duration": 2
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 58,
      "velocity": 1,
      "duration": 1.25
    },
    {
      "name": "G2",
      "midi": 43,
      "time": 58,
      "velocity": 0.8031496062992126,
      "duration": 1
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 59,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 59,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 59,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 59.25,
      "velocity": 0.84251968503937,
      "duration": 0.25
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 59.5,
      "velocity": 0.7716535433070866,
      "duration": 12.500000000000028
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 59.75,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 60,
      "velocity": 0.8346456692913385,
      "duration": 0.125
    },
    {
      "name": "C3",
      "midi": 48,
      "time": 60,
      "velocity": 0.8582677165354331,
      "duration": 1
    },
    {
      "name": "C5",
      "midi": 72,
      "time": 60.125,
      "velocity": 0.7952755905511811,
      "duration": 0.125
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 60.25,
      "velocity": 0.984251968503937,
      "duration": 0.25
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 60.5,
      "velocity": 0.8818897637795275,
      "duration": 3.75
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 61,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C4",
      "midi": 60,
      "time": 61,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 61,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A2",
      "midi": 45,
      "time": 62,
      "velocity": 0.8503937007874016,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 63,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C4",
      "midi": 60,
      "time": 63,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 63,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 64,
      "velocity": 0.7874015748031497,
      "duration": 1
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 64.25,
      "velocity": 0.9212598425196851,
      "duration": 0.25
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 64.5,
      "velocity": 0.937007874015748,
      "duration": 0.25
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 64.75,
      "velocity": 0.984251968503937,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 65,
      "velocity": 0.9921259842519685,
      "duration": 0.16458333333333997
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 65,
      "velocity": 1,
      "duration": 1.0000000000000284
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 65,
      "velocity": 1,
      "duration": 1.0000000000000284
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 65,
      "velocity": 1,
      "duration": 1.0000000000000284
    },
    {
      "name": "C6",
      "midi": 84,
      "time": 65.16458333333334,
      "velocity": 0.984251968503937,
      "duration": 0.16458333333333997
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 65.32916666666668,
      "velocity": 1,
      "duration": 0.17083333333333428
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 65.50000000000001,
      "velocity": 1,
      "duration": 0.16458333333333997
    },
    {
      "name": "F#6",
      "midi": 90,
      "time": 65.66458333333335,
      "velocity": 1,
      "duration": 0.16458333333333997
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 65.8291666666667,
      "velocity": 0.9291338582677166,
      "duration": 0.17083333333333428
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 66.00000000000003,
      "velocity": 0.9133858267716536,
      "duration": 0.25
    },
    {
      "name": "G2",
      "midi": 43,
      "time": 66.00000000000003,
      "velocity": 0.9291338582677166,
      "duration": 1
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 66.25000000000003,
      "velocity": 0.9212598425196851,
      "duration": 0.25
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 66.50000000000003,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 67.00000000000003,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 67.00000000000003,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 67.00000000000003,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C6",
      "midi": 84,
      "time": 67.50000000000003,
      "velocity": 0.905511811023622,
      "duration": 0.25
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 67.75000000000003,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 68.00000000000003,
      "velocity": 0.8503937007874016,
      "duration": 1.75
    },
    {
      "name": "D2",
      "midi": 38,
      "time": 68.00000000000003,
      "velocity": 0.9133858267716536,
      "duration": 1
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 69.00000000000003,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 69.00000000000003,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 69.00000000000003,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 69.75000000000003,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 70.00000000000003,
      "velocity": 0.8740157480314961,
      "duration": 1
    },
    {
      "name": "B1",
      "midi": 35,
      "time": 70.00000000000003,
      "velocity": 0.9606299212598425,
      "duration": 1
    },
    {
      "name": "B4",
      "midi": 71,
      "time": 71.00000000000003,
      "velocity": 0.8110236220472441,
      "duration": 0.5
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 71.00000000000003,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 71.00000000000003,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 71.00000000000003,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 71.50000000000003,
      "velocity": 1,
      "duration": 0.9229166666666657
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 72.00000000000003,
      "velocity": 1,
      "duration": 0.14166666666666572
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 72.00000000000003,
      "velocity": 0.9291338582677166,
      "duration": 0.9999999999999858
    },
    {
      "name": "B4",
      "midi": 71,
      "time": 72.1416666666667,
      "velocity": 0.8740157480314961,
      "duration": 0.13958333333333428
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 72.28125000000003,
      "velocity": 1,
      "duration": 0.5708333333333258
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 72.4229166666667,
      "velocity": 1,
      "duration": 0.14791666666666003
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 72.57083333333335,
      "velocity": 1,
      "duration": 0.13958333333333428
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 72.71041666666669,
      "velocity": 0.905511811023622,
      "duration": 5.9541666666666515
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 72.85208333333335,
      "velocity": 1,
      "duration": 0.14791666666666003
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 73.00000000000001,
      "velocity": 0.9212598425196851,
      "duration": 0.94583333333334
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 73.00000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 73.00000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 73.00000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 73.94583333333335,
      "velocity": 1,
      "duration": 0.054166666666660035
    },
    {
      "name": "C6",
      "midi": 84,
      "time": 74.00000000000001,
      "velocity": 1,
      "duration": 1.1875
    },
    {
      "name": "C2",
      "midi": 36,
      "time": 74.00000000000001,
      "velocity": 0.905511811023622,
      "duration": 1
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 75.00000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C4",
      "midi": 60,
      "time": 75.00000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 75.00000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 75.25000000000001,
      "velocity": 0.952755905511811,
      "duration": 0.25
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 75.50000000000001,
      "velocity": 0.905511811023622,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 75.75000000000001,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 76.00000000000001,
      "velocity": 0.968503937007874,
      "duration": 0.125
    },
    {
      "name": "F2",
      "midi": 41,
      "time": 76.00000000000001,
      "velocity": 0.9133858267716536,
      "duration": 1
    },
    {
      "name": "F5",
      "midi": 77,
      "time": 76.12500000000001,
      "velocity": 0.9212598425196851,
      "duration": 0.125
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 76.25000000000001,
      "velocity": 1,
      "duration": 2.0791666666666657
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 77.00000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C4",
      "midi": 60,
      "time": 77.00000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F4",
      "midi": 65,
      "time": 77.00000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G2",
      "midi": 43,
      "time": 78.00000000000001,
      "velocity": 0.937007874015748,
      "duration": 0.9999999999999858
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 78.32916666666668,
      "velocity": 0.84251968503937,
      "duration": 17.670833333333306
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 78.66458333333334,
      "velocity": 1,
      "duration": 0.33541666666666003
    },
    {
      "name": "F5",
      "midi": 77,
      "time": 79,
      "velocity": 1,
      "duration": 0.3291666666666657
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 79,
      "velocity": 1,
      "duration": 0.9999999999999858
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 79,
      "velocity": 1,
      "duration": 0.9999999999999858
    },
    {
      "name": "F4",
      "midi": 65,
      "time": 79,
      "velocity": 1,
      "duration": 0.9999999999999858
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 79.32916666666667,
      "velocity": 1,
      "duration": 0.33541666666666003
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 79.66458333333333,
      "velocity": 1,
      "duration": 0.28125
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 79.94583333333333,
      "velocity": 1,
      "duration": 0.054166666666660035
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 79.99999999999999,
      "velocity": 1,
      "duration": 0.27291666666666003
    },
    {
      "name": "C2",
      "midi": 36,
      "time": 79.99999999999999,
      "velocity": 0.8976377952755905,
      "duration": 0.9999999999999858
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 80.27291666666665,
      "velocity": 1,
      "duration": 0.056250000000005684
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 80.32916666666665,
      "velocity": 1,
      "duration": 0.3125
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 80.66458333333331,
      "velocity": 1,
      "duration": 1.33541666666666
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 80.99999999999997,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C4",
      "midi": 60,
      "time": 80.99999999999997,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 80.99999999999997,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 81.99999999999997,
      "velocity": 1,
      "duration": 0.75
    },
    {
      "name": "D2",
      "midi": 38,
      "time": 81.99999999999997,
      "velocity": 0.9448818897637795,
      "duration": 1
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 82.74999999999997,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 82.99999999999997,
      "velocity": 0.8740157480314961,
      "duration": 0.25
    },
    {
      "name": "D3",
      "midi": 50,
      "time": 82.99999999999997,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 82.99999999999997,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C4",
      "midi": 60,
      "time": 82.99999999999997,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 83.24999999999997,
      "velocity": 0.905511811023622,
      "duration": 0.25
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 83.49999999999997,
      "velocity": 1,
      "duration": 0.375
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 83.87499999999997,
      "velocity": 1,
      "duration": 0.125
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 83.99999999999997,
      "velocity": 0.8188976377952756,
      "duration": 1.75
    },
    {
      "name": "G2",
      "midi": 43,
      "time": 83.99999999999997,
      "velocity": 0.9291338582677166,
      "duration": 1
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 84.99999999999997,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 84.99999999999997,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 84.99999999999997,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 85.74999999999997,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 85.99999999999997,
      "velocity": 1,
      "duration": 0.125
    },
    {
      "name": "D2",
      "midi": 38,
      "time": 85.99999999999997,
      "velocity": 0.889763779527559,
      "duration": 1
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 86.12499999999997,
      "velocity": 1,
      "duration": 0.125
    },
    {
      "name": "C6",
      "midi": 84,
      "time": 86.24999999999997,
      "velocity": 1,
      "duration": 0.125
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 86.37499999999997,
      "velocity": 0.9763779527559056,
      "duration": 0.125
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 86.49999999999997,
      "velocity": 0.9291338582677166,
      "duration": 0.125
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 86.62499999999997,
      "velocity": 0.9291338582677166,
      "duration": 0.125
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 86.74999999999997,
      "velocity": 0.889763779527559,
      "duration": 0.125
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 86.87499999999997,
      "velocity": 0.8346456692913385,
      "duration": 0.125
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 86.99999999999997,
      "velocity": 0.937007874015748,
      "duration": 0.75
    },
    {
      "name": "D3",
      "midi": 50,
      "time": 86.99999999999997,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 86.99999999999997,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C4",
      "midi": 60,
      "time": 86.99999999999997,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 87.74999999999997,
      "velocity": 0.8582677165354331,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 87.99999999999997,
      "velocity": 1,
      "duration": 2
    },
    {
      "name": "G2",
      "midi": 43,
      "time": 87.99999999999997,
      "velocity": 0.8188976377952756,
      "duration": 1
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 88.99999999999997,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 88.99999999999997,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 88.99999999999997,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 89.99999999999997,
      "velocity": 0.9606299212598425,
      "duration": 1.75
    },
    {
      "name": "D2",
      "midi": 38,
      "time": 89.99999999999997,
      "velocity": 0.8267716535433071,
      "duration": 1
    },
    {
      "name": "D3",
      "midi": 50,
      "time": 90.99999999999997,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 90.99999999999997,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C4",
      "midi": 60,
      "time": 90.99999999999997,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 91.74999999999997,
      "velocity": 0.8976377952755905,
      "duration": 0.25
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 91.99999999999997,
      "velocity": 0.7637795275590551,
      "duration": 0.25
    },
    {
      "name": "F2",
      "midi": 41,
      "time": 91.99999999999997,
      "velocity": 0.8346456692913385,
      "duration": 1
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 92.24999999999997,
      "velocity": 0.8503937007874016,
      "duration": 0.25
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 92.49999999999997,
      "velocity": 0.9212598425196851,
      "duration": 0.25
    },
    {
      "name": "A#5",
      "midi": 82,
      "time": 92.74999999999997,
      "velocity": 0.937007874015748,
      "duration": 0.25
    },
    {
      "name": "C6",
      "midi": 84,
      "time": 92.99999999999997,
      "velocity": 0.9291338582677166,
      "duration": 0.16458333333333997
    },
    {
      "name": "F3",
      "midi": 53,
      "time": 92.99999999999997,
      "velocity": 1,
      "duration": 1.0000000000000142
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 92.99999999999997,
      "velocity": 1,
      "duration": 1.0000000000000142
    },
    {
      "name": "C4",
      "midi": 60,
      "time": 92.99999999999997,
      "velocity": 1,
      "duration": 1.0000000000000142
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 93.16458333333331,
      "velocity": 0.9448818897637795,
      "duration": 0.16458333333333997
    },
    {
      "name": "F6",
      "midi": 89,
      "time": 93.32916666666665,
      "velocity": 0.952755905511811,
      "duration": 0.17083333333333428
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 93.49999999999999,
      "velocity": 0.84251968503937,
      "duration": 0.375
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 93.87499999999999,
      "velocity": 0.6850393700787402,
      "duration": 0.125
    },
    {
      "name": "C6",
      "midi": 84,
      "time": 93.99999999999999,
      "velocity": 0.9763779527559056,
      "duration": 1.75
    },
    {
      "name": "C2",
      "midi": 36,
      "time": 93.99999999999999,
      "velocity": 0.7559055118110236,
      "duration": 1
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 94.99999999999999,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C4",
      "midi": 60,
      "time": 94.99999999999999,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 94.99999999999999,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 95.74999999999999,
      "velocity": 0.7244094488188977,
      "duration": 2
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 95.99999999999999,
      "velocity": 0.9763779527559056,
      "duration": 1.25
    },
    {
      "name": "G2",
      "midi": 43,
      "time": 95.99999999999999,
      "velocity": 0.8346456692913385,
      "duration": 1
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 96.99999999999999,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 96.99999999999999,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 96.99999999999999,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 97.24999999999999,
      "velocity": 0.8267716535433071,
      "duration": 0.25
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 97.49999999999999,
      "velocity": 0.7480314960629921,
      "duration": 12.500000000000028
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 97.74999999999999,
      "velocity": 0.968503937007874,
      "duration": 0.25
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 97.99999999999999,
      "velocity": 0.8267716535433071,
      "duration": 0.125
    },
    {
      "name": "C3",
      "midi": 48,
      "time": 97.99999999999999,
      "velocity": 0.8110236220472441,
      "duration": 1
    },
    {
      "name": "C5",
      "midi": 72,
      "time": 98.12499999999999,
      "velocity": 0.8267716535433071,
      "duration": 0.125
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 98.24999999999999,
      "velocity": 0.984251968503937,
      "duration": 0.25
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 98.49999999999999,
      "velocity": 0.889763779527559,
      "duration": 3.75
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 98.99999999999999,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C4",
      "midi": 60,
      "time": 98.99999999999999,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 98.99999999999999,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A2",
      "midi": 45,
      "time": 99.99999999999999,
      "velocity": 0.8110236220472441,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 100.99999999999999,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C4",
      "midi": 60,
      "time": 100.99999999999999,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 100.99999999999999,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 101.99999999999999,
      "velocity": 0.8031496062992126,
      "duration": 1
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 102.24999999999999,
      "velocity": 0.968503937007874,
      "duration": 0.25
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 102.49999999999999,
      "velocity": 0.984251968503937,
      "duration": 0.25
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 102.74999999999999,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 102.99999999999999,
      "velocity": 0.952755905511811,
      "duration": 0.16458333333333997
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 102.99999999999999,
      "velocity": 1,
      "duration": 1.0000000000000284
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 102.99999999999999,
      "velocity": 1,
      "duration": 1.0000000000000284
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 102.99999999999999,
      "velocity": 1,
      "duration": 1.0000000000000284
    },
    {
      "name": "C6",
      "midi": 84,
      "time": 103.16458333333333,
      "velocity": 1,
      "duration": 0.16458333333333997
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 103.32916666666667,
      "velocity": 1,
      "duration": 0.17083333333333428
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 103.5,
      "velocity": 1,
      "duration": 0.16458333333333997
    },
    {
      "name": "F#6",
      "midi": 90,
      "time": 103.66458333333334,
      "velocity": 1,
      "duration": 0.16458333333333997
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 103.82916666666668,
      "velocity": 0.9212598425196851,
      "duration": 0.17083333333333428
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 104.00000000000001,
      "velocity": 0.8976377952755905,
      "duration": 0.25
    },
    {
      "name": "G2",
      "midi": 43,
      "time": 104.00000000000001,
      "velocity": 0.9291338582677166,
      "duration": 1
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 104.25000000000001,
      "velocity": 0.8818897637795275,
      "duration": 0.25
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 104.50000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 105.00000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 105.00000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 105.00000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C6",
      "midi": 84,
      "time": 105.50000000000001,
      "velocity": 0.9212598425196851,
      "duration": 0.25
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 105.75000000000001,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 106.00000000000001,
      "velocity": 0.8740157480314961,
      "duration": 1.75
    },
    {
      "name": "D2",
      "midi": 38,
      "time": 106.00000000000001,
      "velocity": 0.9133858267716536,
      "duration": 1
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 107.00000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 107.00000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 107.00000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 107.75000000000001,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 108.00000000000001,
      "velocity": 0.905511811023622,
      "duration": 1
    },
    {
      "name": "B1",
      "midi": 35,
      "time": 108.00000000000001,
      "velocity": 0.905511811023622,
      "duration": 1
    },
    {
      "name": "B4",
      "midi": 71,
      "time": 109.00000000000001,
      "velocity": 0.7795275590551181,
      "duration": 0.5
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 109.00000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 109.00000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 109.00000000000001,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 109.50000000000001,
      "velocity": 1,
      "duration": 0.9229166666666657
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 110.00000000000001,
      "velocity": 1,
      "duration": 0.14166666666666572
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 110.00000000000001,
      "velocity": 0.8976377952755905,
      "duration": 0.9999999999999858
    },
    {
      "name": "B4",
      "midi": 71,
      "time": 110.14166666666668,
      "velocity": 0.8582677165354331,
      "duration": 0.13958333333333428
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 110.28125000000001,
      "velocity": 1,
      "duration": 0.5708333333333258
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 110.42291666666668,
      "velocity": 1,
      "duration": 0.14791666666666003
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 110.57083333333334,
      "velocity": 1,
      "duration": 0.13958333333333428
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 110.71041666666667,
      "velocity": 0.937007874015748,
      "duration": 1.2895833333333258
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 110.85208333333334,
      "velocity": 1,
      "duration": 0.14791666666666003
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 111,
      "velocity": 0.9448818897637795,
      "duration": 0.94583333333334
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 111,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 111,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 111,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 111.94583333333334,
      "velocity": 1,
      "duration": 18.05416666666666
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 112,
      "velocity": 1,
      "duration": 1.89791666666666
    },
    {
      "name": "D2",
      "midi": 38,
      "time": 112,
      "velocity": 0.8976377952755905,
      "duration": 1
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 113,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 113,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 113,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 114,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B1",
      "midi": 35,
      "time": 114,
      "velocity": 0.9212598425196851,
      "duration": 1
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 115,
      "velocity": 0.9763779527559056,
      "duration": 0.25
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 115,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 115,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 115,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 115.25,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 115.5,
      "velocity": 0.905511811023622,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 115.75,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 116,
      "velocity": 1,
      "duration": 0.75
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 116,
      "velocity": 0.9133858267716536,
      "duration": 1
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 116.75,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 117,
      "velocity": 0.889763779527559,
      "duration": 0.25
    },
    {
      "name": "E3",
      "midi": 52,
      "time": 117,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G#3",
      "midi": 56,
      "time": 117,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 117,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 117.25,
      "velocity": 0.9133858267716536,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 117.5,
      "velocity": 1,
      "duration": 0.375
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 117.875,
      "velocity": 1,
      "duration": 0.125
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 118,
      "velocity": 0.8346456692913385,
      "duration": 1.75
    },
    {
      "name": "A2",
      "midi": 45,
      "time": 118,
      "velocity": 0.9291338582677166,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 119,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C#4",
      "midi": 61,
      "time": 119,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#4",
      "midi": 66,
      "time": 119,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G#5",
      "midi": 80,
      "time": 119.75,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 120,
      "velocity": 1,
      "duration": 0.125
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 120,
      "velocity": 0.9212598425196851,
      "duration": 1
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 120.125,
      "velocity": 1,
      "duration": 0.125
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 120.25,
      "velocity": 1,
      "duration": 0.125
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 120.375,
      "velocity": 0.9448818897637795,
      "duration": 0.125
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 120.5,
      "velocity": 0.9291338582677166,
      "duration": 0.125
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 120.625,
      "velocity": 0.9448818897637795,
      "duration": 0.125
    },
    {
      "name": "G#5",
      "midi": 80,
      "time": 120.75,
      "velocity": 0.968503937007874,
      "duration": 0.125
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 120.875,
      "velocity": 0.9212598425196851,
      "duration": 0.125
    },
    {
      "name": "G#5",
      "midi": 80,
      "time": 121,
      "velocity": 1,
      "duration": 0.75
    },
    {
      "name": "E3",
      "midi": 52,
      "time": 121,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G#3",
      "midi": 56,
      "time": 121,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 121,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 121.75,
      "velocity": 0.9448818897637795,
      "duration": 0.25
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 122,
      "velocity": 1,
      "duration": 2
    },
    {
      "name": "A2",
      "midi": 45,
      "time": 122,
      "velocity": 0.9212598425196851,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 123,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C#4",
      "midi": 61,
      "time": 123,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#4",
      "midi": 66,
      "time": 123,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 124,
      "velocity": 1,
      "duration": 1.75
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 124,
      "velocity": 0.9212598425196851,
      "duration": 1
    },
    {
      "name": "E3",
      "midi": 52,
      "time": 125,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G#3",
      "midi": 56,
      "time": 125,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 125,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 125.75,
      "velocity": 0.9921259842519685,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 126,
      "velocity": 0.8740157480314961,
      "duration": 0.25
    },
    {
      "name": "G2",
      "midi": 43,
      "time": 126,
      "velocity": 0.9291338582677166,
      "duration": 1
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 126.25,
      "velocity": 0.9212598425196851,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 126.5,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "C6",
      "midi": 84,
      "time": 126.75,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 127,
      "velocity": 1,
      "duration": 0.16458333333333997
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 127,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 127,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 127,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 127.16458333333334,
      "velocity": 1,
      "duration": 0.16458333333333997
    },
    {
      "name": "F#6",
      "midi": 90,
      "time": 127.32916666666668,
      "velocity": 1,
      "duration": 0.17083333333333428
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 127.50000000000001,
      "velocity": 0.952755905511811,
      "duration": 0.375
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 127.87500000000001,
      "velocity": 0.8031496062992126,
      "duration": 0.12499999999998579
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 128,
      "velocity": 1,
      "duration": 1.65625
    },
    {
      "name": "D2",
      "midi": 38,
      "time": 128,
      "velocity": 0.9133858267716536,
      "duration": 1
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 129,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 129,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 129,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 129.75,
      "velocity": 0.7165354330708661,
      "duration": 24.250000000000057
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 130,
      "velocity": 1,
      "duration": 1.65625
    },
    {
      "name": "G2",
      "midi": 43,
      "time": 130,
      "velocity": 0.9133858267716536,
      "duration": 1
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 131,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 131,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 131,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 131.75,
      "velocity": 0.9763779527559056,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 132,
      "velocity": 1,
      "duration": 1.25
    },
    {
      "name": "B2",
      "midi": 47,
      "time": 132,
      "velocity": 0.937007874015748,
      "duration": 1
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 133,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 133,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 133,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 133.25,
      "velocity": 0.937007874015748,
      "duration": 0.25
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 133.5,
      "velocity": 0.8976377952755905,
      "duration": 0.25
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 133.75,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 134,
      "velocity": 0.9212598425196851,
      "duration": 0.125
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 134,
      "velocity": 0.9133858267716536,
      "duration": 1
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 134.125,
      "velocity": 0.8740157480314961,
      "duration": 0.125
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 134.25,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 134.5,
      "velocity": 0.9763779527559056,
      "duration": 1.82916666666668
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 135,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 135,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 135,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A2",
      "midi": 45,
      "time": 136,
      "velocity": 0.905511811023622,
      "duration": 1.0000000000000284
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 136.32916666666668,
      "velocity": 0.8976377952755905,
      "duration": 0.33541666666667425
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 136.66458333333335,
      "velocity": 1,
      "duration": 0.33541666666667425
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 137.00000000000003,
      "velocity": 1,
      "duration": 0.32916666666667993
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 137.00000000000003,
      "velocity": 1,
      "duration": 1.0000000000000284
    },
    {
      "name": "C#4",
      "midi": 61,
      "time": 137.00000000000003,
      "velocity": 1,
      "duration": 1.0000000000000284
    },
    {
      "name": "G4",
      "midi": 67,
      "time": 137.00000000000003,
      "velocity": 1,
      "duration": 1.0000000000000284
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 137.3291666666667,
      "velocity": 1,
      "duration": 0.33541666666667425
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 137.66458333333338,
      "velocity": 1,
      "duration": 0.28125
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 137.94583333333338,
      "velocity": 1,
      "duration": 0.054166666666674246
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 138.00000000000006,
      "velocity": 1,
      "duration": 0.27291666666667425
    },
    {
      "name": "D2",
      "midi": 38,
      "time": 138.00000000000006,
      "velocity": 0.9291338582677166,
      "duration": 1.0000000000000284
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 138.27291666666673,
      "velocity": 1,
      "duration": 0.056250000000005684
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 138.32916666666674,
      "velocity": 1,
      "duration": 0.3125
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 138.6645833333334,
      "velocity": 1,
      "duration": 1.3354166666666742
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 139.00000000000009,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 139.00000000000009,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#4",
      "midi": 66,
      "time": 139.00000000000009,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 140.00000000000009,
      "velocity": 1,
      "duration": 0.75
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 140.00000000000009,
      "velocity": 0.9133858267716536,
      "duration": 1
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 140.75000000000009,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 141.00000000000009,
      "velocity": 0.8582677165354331,
      "duration": 0.25
    },
    {
      "name": "E3",
      "midi": 52,
      "time": 141.00000000000009,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G#3",
      "midi": 56,
      "time": 141.00000000000009,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 141.00000000000009,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 141.25000000000009,
      "velocity": 0.905511811023622,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 141.50000000000009,
      "velocity": 1,
      "duration": 0.375
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 141.87500000000009,
      "velocity": 1,
      "duration": 0.125
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 142.00000000000009,
      "velocity": 0.8031496062992126,
      "duration": 1.75
    },
    {
      "name": "A2",
      "midi": 45,
      "time": 142.00000000000009,
      "velocity": 0.9133858267716536,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 143.00000000000009,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C#4",
      "midi": 61,
      "time": 143.00000000000009,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#4",
      "midi": 66,
      "time": 143.00000000000009,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G#5",
      "midi": 80,
      "time": 143.75000000000009,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 144.00000000000009,
      "velocity": 1,
      "duration": 0.125
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 144.00000000000009,
      "velocity": 0.9212598425196851,
      "duration": 1
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 144.12500000000009,
      "velocity": 1,
      "duration": 0.125
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 144.25000000000009,
      "velocity": 1,
      "duration": 0.125
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 144.37500000000009,
      "velocity": 0.9291338582677166,
      "duration": 0.125
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 144.50000000000009,
      "velocity": 0.9133858267716536,
      "duration": 0.125
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 144.62500000000009,
      "velocity": 0.9448818897637795,
      "duration": 0.125
    },
    {
      "name": "G#5",
      "midi": 80,
      "time": 144.75000000000009,
      "velocity": 0.9133858267716536,
      "duration": 0.125
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 144.87500000000009,
      "velocity": 0.968503937007874,
      "duration": 0.125
    },
    {
      "name": "G#5",
      "midi": 80,
      "time": 145.00000000000009,
      "velocity": 1,
      "duration": 0.75
    },
    {
      "name": "E3",
      "midi": 52,
      "time": 145.00000000000009,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G#3",
      "midi": 56,
      "time": 145.00000000000009,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 145.00000000000009,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 145.75000000000009,
      "velocity": 0.9606299212598425,
      "duration": 0.25
    },
    {
      "name": "C#6",
      "midi": 85,
      "time": 146.00000000000009,
      "velocity": 1,
      "duration": 2
    },
    {
      "name": "A2",
      "midi": 45,
      "time": 146.00000000000009,
      "velocity": 0.8976377952755905,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 147.00000000000009,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C#4",
      "midi": 61,
      "time": 147.00000000000009,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#4",
      "midi": 66,
      "time": 147.00000000000009,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 148.00000000000009,
      "velocity": 1,
      "duration": 1.75
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 148.00000000000009,
      "velocity": 0.905511811023622,
      "duration": 1
    },
    {
      "name": "E3",
      "midi": 52,
      "time": 149.00000000000009,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G#3",
      "midi": 56,
      "time": 149.00000000000009,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 149.00000000000009,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 149.75000000000009,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 150.00000000000009,
      "velocity": 0.84251968503937,
      "duration": 0.25
    },
    {
      "name": "G2",
      "midi": 43,
      "time": 150.00000000000009,
      "velocity": 0.9133858267716536,
      "duration": 1
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 150.25000000000009,
      "velocity": 0.9133858267716536,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 150.50000000000009,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "C6",
      "midi": 84,
      "time": 150.75000000000009,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 151.00000000000009,
      "velocity": 1,
      "duration": 0.16458333333332575
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 151.00000000000009,
      "velocity": 1,
      "duration": 0.9999999999999716
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 151.00000000000009,
      "velocity": 1,
      "duration": 0.9999999999999716
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 151.00000000000009,
      "velocity": 1,
      "duration": 0.9999999999999716
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 151.1645833333334,
      "velocity": 1,
      "duration": 0.16458333333332575
    },
    {
      "name": "G6",
      "midi": 91,
      "time": 151.32916666666674,
      "velocity": 1,
      "duration": 0.17083333333332007
    },
    {
      "name": "F#6",
      "midi": 90,
      "time": 151.50000000000006,
      "velocity": 0.9448818897637795,
      "duration": 0.375
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 151.87500000000006,
      "velocity": 0.7795275590551181,
      "duration": 0.125
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 152.00000000000006,
      "velocity": 1,
      "duration": 1.65625
    },
    {
      "name": "D2",
      "midi": 38,
      "time": 152.00000000000006,
      "velocity": 0.9212598425196851,
      "duration": 1
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 153.00000000000006,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 153.00000000000006,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 153.00000000000006,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 153.75000000000006,
      "velocity": 0.7559055118110236,
      "duration": 2
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 154.00000000000006,
      "velocity": 1,
      "duration": 1.25
    },
    {
      "name": "G2",
      "midi": 43,
      "time": 154.00000000000006,
      "velocity": 0.8976377952755905,
      "duration": 1
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 155.00000000000006,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 155.00000000000006,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 155.00000000000006,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 155.25000000000006,
      "velocity": 0.937007874015748,
      "duration": 0.25
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 155.50000000000006,
      "velocity": 0.8818897637795275,
      "duration": 12.499999999999943
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 155.75000000000006,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 156.00000000000006,
      "velocity": 0.968503937007874,
      "duration": 0.125
    },
    {
      "name": "C3",
      "midi": 48,
      "time": 156.00000000000006,
      "velocity": 0.8818897637795275,
      "duration": 1
    },
    {
      "name": "C5",
      "midi": 72,
      "time": 156.12500000000006,
      "velocity": 0.8740157480314961,
      "duration": 0.125
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 156.25000000000006,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 156.50000000000006,
      "velocity": 0.9921259842519685,
      "duration": 3.75
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 157.00000000000006,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C4",
      "midi": 60,
      "time": 157.00000000000006,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 157.00000000000006,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A2",
      "midi": 45,
      "time": 158.00000000000006,
      "velocity": 0.905511811023622,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 159.00000000000006,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C4",
      "midi": 60,
      "time": 159.00000000000006,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 159.00000000000006,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 160.00000000000006,
      "velocity": 0.905511811023622,
      "duration": 1
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 160.25000000000006,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 160.50000000000006,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 160.75000000000006,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 161.00000000000006,
      "velocity": 1,
      "duration": 0.16458333333332575
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 161.00000000000006,
      "velocity": 1,
      "duration": 0.9999999999999432
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 161.00000000000006,
      "velocity": 1,
      "duration": 0.9999999999999432
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 161.00000000000006,
      "velocity": 1,
      "duration": 0.9999999999999432
    },
    {
      "name": "C6",
      "midi": 84,
      "time": 161.16458333333338,
      "velocity": 1,
      "duration": 0.16458333333332575
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 161.3291666666667,
      "velocity": 1,
      "duration": 0.17083333333332007
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 161.50000000000003,
      "velocity": 1,
      "duration": 0.16458333333332575
    },
    {
      "name": "F#6",
      "midi": 90,
      "time": 161.66458333333335,
      "velocity": 1,
      "duration": 0.16458333333332575
    },
    {
      "name": "E6",
      "midi": 88,
      "time": 161.82916666666668,
      "velocity": 0.968503937007874,
      "duration": 0.17083333333332007
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 162,
      "velocity": 0.9291338582677166,
      "duration": 0.25
    },
    {
      "name": "G2",
      "midi": 43,
      "time": 162,
      "velocity": 0.905511811023622,
      "duration": 1
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 162.25,
      "velocity": 0.9133858267716536,
      "duration": 0.25
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 162.5,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 163,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 163,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 163,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "C6",
      "midi": 84,
      "time": 163.5,
      "velocity": 0.937007874015748,
      "duration": 0.25
    },
    {
      "name": "D6",
      "midi": 86,
      "time": 163.75,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "A5",
      "midi": 81,
      "time": 164,
      "velocity": 0.8740157480314961,
      "duration": 1.75
    },
    {
      "name": "D2",
      "midi": 38,
      "time": 164,
      "velocity": 0.9212598425196851,
      "duration": 1
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 165,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "A3",
      "midi": 57,
      "time": 165,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 165,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B5",
      "midi": 83,
      "time": 165.75,
      "velocity": 1,
      "duration": 0.25
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 166,
      "velocity": 0.8818897637795275,
      "duration": 1
    },
    {
      "name": "B1",
      "midi": 35,
      "time": 166,
      "velocity": 0.905511811023622,
      "duration": 1
    },
    {
      "name": "B4",
      "midi": 71,
      "time": 167,
      "velocity": 0.7716535433070866,
      "duration": 0.5
    },
    {
      "name": "F#3",
      "midi": 54,
      "time": 167,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 167,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D4",
      "midi": 62,
      "time": 167,
      "velocity": 1,
      "duration": 1
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 167.5,
      "velocity": 1,
      "duration": 0.9229166666666799
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 168,
      "velocity": 1,
      "duration": 0.14166666666667993
    },
    {
      "name": "E2",
      "midi": 40,
      "time": 168,
      "velocity": 0.8976377952755905,
      "duration": 1.0000000000000284
    },
    {
      "name": "B4",
      "midi": 71,
      "time": 168.14166666666668,
      "velocity": 0.8976377952755905,
      "duration": 0.13958333333332007
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 168.28125,
      "velocity": 1,
      "duration": 0.5708333333333542
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 168.42291666666668,
      "velocity": 1,
      "duration": 0.14791666666667425
    },
    {
      "name": "F#5",
      "midi": 78,
      "time": 168.57083333333335,
      "velocity": 1,
      "duration": 0.13958333333332007
    },
    {
      "name": "D5",
      "midi": 74,
      "time": 168.71041666666667,
      "velocity": 0.905511811023622,
      "duration": 0
    },
    {
      "name": "G5",
      "midi": 79,
      "time": 168.85208333333335,
      "velocity": 1,
      "duration": 0.14791666666667425
    },
    {
      "name": "E5",
      "midi": 76,
      "time": 169.00000000000003,
      "velocity": 0.952755905511811,
      "duration": 1.5
    },
    {
      "name": "G3",
      "midi": 55,
      "time": 169.00000000000003,
      "velocity": 1,
      "duration": 1.5
    },
    {
      "name": "B3",
      "midi": 59,
      "time": 169.00000000000003,
      "velocity": 1,
      "duration": 1.5
    },
    {
      "name": "E4",
      "midi": 64,
      "time": 169.00000000000003,
      "velocity": 1,
      "duration": 1.5
    }
];