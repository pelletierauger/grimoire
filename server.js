var http = require('http');
var path = require('path');
var fs = require('fs');
var url = require('url');
var sc = require('supercolliderjs');
var osc = require("osc");
var config = require("./config.js");
var htmlSources = {
    head: fs.readFileSync("html/head.html", { encoding: "utf8" }),
    body: fs.readFileSync("html/body.html", { encoding: "utf8" }),
};
var selectedPath;
// let JSONs = [];

let sketchFolder, sketchName, sketchIndex;

var getIPAddresses = function() {
    var os = require("os"),
        interfaces = os.networkInterfaces(),
        ipAddresses = [];

    for (var deviceName in interfaces) {
        var addresses = interfaces[deviceName];
        for (var i = 0; i < addresses.length; i++) {
            var addressInfo = addresses[i];
            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
};

if (!process.argv[2]) {
    console.log("A sketch name must be provided.");
    return;
} else {
    sketchName = process.argv[2];
    let match = false;
    for (let i = 0; i < config.pathsToSketches.length; i++) {
        sketchFolder = config.pathsToSketches[i] + sketchName;
        if (fs.existsSync(sketchFolder)) {
            console.log(`The sketch '${sketchName}' exists.`);
            // console.log(sketchFolder);
            sketchIndex = fs.readFileSync(sketchFolder + "/index.html", { encoding: "utf8" });
            selectedPath = i;
            match = true;
            break;
        }
    }
    if (!match) {
        console.log(`The sketch '${sketchName}' does not exist.`);
        return;
    }
}

let startSC = (process.argv[3] && process.argv[3] == "nosc") ? false : true; 

let environsIndex = sketchIndex;
environsIndex = environsIndex.replace(/<\/head>/g, `${htmlSources.head}
</head>`);
environsIndex = environsIndex.replace(/<\/body>/g, `${htmlSources.body}
</body>`);

// console.log(environsIndex);
// return;

// I now need to scrape all the files that might be used during live coding.

let files;

function gatherFiles() {
    let files = {
        scd: [],
        js: []
    };
    if (fs.existsSync(sketchFolder + "/SuperCollider")) {
        let allFiles = fs.readdirSync(sketchFolder + "/SuperCollider");
        for (let i = 0; i < allFiles.length; i++) {
            if (allFiles[i].substr(allFiles[i].length - 3) == "scd") {
                files.scd.push({
                    name: allFiles[i],
                    path: sketchFolder + "/SuperCollider/" + allFiles[i],
                    active: false,
                    changed: false,
                    scrollHeight: 0,
                    canvasPath: sketchFolder + "/paintings/" + allFiles[i] + ".txt"
                });
            }
        }
    }
    sketchIndex.replace(/(script src=")(.*?)(")/g, function(a, b, c) {
        if (!c.match(/libraries/g) &&
            !c.match(/frame-export/g) &&
            !c.match(/http/g)
        ) {
            files.js.unshift({
                name: c,
                path: sketchFolder + "/" + c,
                active: false,
                scrollHeight: 0,
                canvasPath: sketchFolder + "/paintings/" + c + ".txt"
            });
        }
    });

    files.js.unshift({
        name: "terminal.js",
        path: "./terminal.js",
        active: false,
        scrollHeight: 0,
        canvasPath: sketchFolder + "/paintings/" + "terminal.js" + ".txt"  
    });
    files.js.unshift({
        name: "gri.js",
        path: "./gri.js",
        active: false,
        scrollHeight: 0,
        canvasPath: sketchFolder + "/paintings/" + "gri.js" + ".txt"  
    });


    for (let i = 0; i < files.scd.length; i++) {
        files.scd[i].data = fs.readFileSync(files.scd[i].path, { encoding: "utf8" });
    }
    for (let i = 0; i < files.js.length; i++) {
        files.js[i].data = fs.readFileSync(files.js[i].path, { encoding: "utf8" });
    }


    if (fs.existsSync(sketchFolder + "/paintings")) {
        let allFiles = fs.readdirSync(sketchFolder + "/paintings");
        for (let i = 0; i < allFiles.length; i++) {
            let extension = allFiles[i].substr(allFiles[i].length - 4);
            if (extension == ".txt") {
                let fileName = allFiles[i].substr(0, allFiles[i].length - 4);
                for (let j = 0; j < files.scd.length; j++) {
                    if (files.scd[j].name == fileName) {
                        let path = sketchFolder + "/paintings/" + allFiles[i];
                        files.scd[j].canvasData = fs.readFileSync(path, { encoding: "utf8" });
                        // files.scd[i].canvasPath = path;
                    }
                }
                for (let j = 0; j < files.js.length; j++) {
                    if (files.js[j].name == fileName) {
                        let path = sketchFolder + "/paintings/" + allFiles[i];
                        files.js[j].canvasData = fs.readFileSync(path, { encoding: "utf8" });
                        // files.js[i].canvasPath = path;
                    }
                }
            }
        }
    }

    return files;
}


var udpPort = new osc.UDPPort({
    // This is the port we're listening on.
    localAddress: "127.0.0.1",
    localPort: 57121,

    // This is where sclang is listening for OSC messages.
    remoteAddress: "127.0.0.1",
    remotePort: 57120,
    metadata: true
});

udpPort.on("ready", function() {
    var ipAddresses = getIPAddresses();
    console.log("Listening for OSC over UDP.");
    ipAddresses.forEach(function(address) {
        console.log(" Host:", address + ", Port:", udpPort.options.localPort);
    });
});

udpPort.on("message", function(oscMessage) {
    // console.log(oscMessage);
    io.sockets.emit('receiveOSC', oscMessage);
    // console.log(JSON.parse(oscMessage));
});

udpPort.on("error", function(err) {
    console.log(err);
});

udpPort.open();

var sclang;

function handleRequest(req, res) {
    // console.log(req.url);
    // What did we request?

    // var filePath = path.join('../', req.url);
    // if (req.url === '/') {
    //     console.log("catched ya!");
    // }

    // var pathname = (req.url === '/') ? req.url : path.join('../', req.url);

    var pathname = req.url;

    // console.log(pathname);


    var pathnametest = pathname;
    // console.log(req.url);
    var query = url.parse(req.url, true).query;

    var r = /\?/g;
    if (pathname.match(r)) {
        var re = /\?(.*)/gi;
        pathnametest = pathnametest.replace(re, ``);
        // console.log(pathnametest);
    }
    pathname = pathnametest;

    // console.log(query);
    // If blank let's ask for index.html

    // If the path is empty, we return the injected sketch.
    if (pathname == '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(environsIndex);
        return;
        // pathname = '/index.html';
    }

    // If the path is non-empty, we check whether it relates to Les environs.

    var testEnvirons = /les-environs\//g;
    if (pathname.match(testEnvirons)) {
        // let injecting = pathname;
        // injecting = injecting.replace(/les-environs\//g, "");
        // pathname = config.pathToSketches + "Les-environs" + injecting;
        pathname = "./" + pathname.replace(/les-environs\//g, "");
    } else if (!pathname.match(/http/g)) {
        pathname = config.pathsToSketches[selectedPath] + sketchName + pathname;
    }

    // console.log("The pathname is : " + pathname);



    // Ok what's our file extension
    var ext = path.extname(pathname);
    // Map extension to file type
    var typeExt = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css'
    };

    //What is it?  Default to plain text
    var contentType = typeExt[ext] || 'text/plain';
    // Now read and write back the file with the appropriate content type
    // fs.readFile(__dirname + pathname, function(err, data) {
    fs.readFile(pathname, function(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading ' + pathname);
        }
        // Dynamically setting content type
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
    // res.end(JSON.stringify(query));
}

// Create a server with the handleRequest callback
var server = http.createServer(handleRequest);
// Listen on port 8080
server.listen(8080);
console.log('Server started on port 8080');

var io = require('socket.io')(server);

var clients = {};

io.sockets.on('connection', function(socket) {
    console.log("Client " + socket.id + " is connected.");
    files = gatherFiles();

    socket.on('pullJSONs', function(folder) {
        console.log("Pushing the JSON files to client " + socket.id + ".");
        let JSONs = loadJSONs(folder);
        io.sockets.emit('pushJSONs', JSONs);
    });

    socket.on('pullFiles', function() {
        io.sockets.emit('pushFiles', files);
        console.log("Pushing files.");
    });

    socket.on('pullSketchFolder', function() {
        io.sockets.emit('pushSketchFolder', sketchFolder);
        // console.log("Pushing files.");
    });

    // socket.on('pullMessage', function() {
    //     io.sockets.emit('pushMessage', files);
    //     // console.log("Pushing files.");
    // });

    socket.on('mouse', function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'mouse' " + data.x + " " + data.y);
        // Send it to all other clients
        socket.broadcast.emit('mouse', data);
    });

    socket.on('bounce', function(data) {
        console.log(data);
    });

    socket.on('image', function(data) {
        // console.log(dataUrl);

        // var imageBuffer = new Buffer(dataUrl, 'base64'); //console = <Buffer 75 ab 5a 8a ...
        // fs.writeFile("test.jpg", imageBuffer, function(err) { //... });

        var imageBuffer = decodeBase64Image(data.dataUrl);
        console.log(imageBuffer);

        fs.writeFile(data.name + ".png", imageBuffer.data, function(err) {
            if (err) {
                return console.error(err);
            } else {
                console.log(data.name + ".png written successfully.");
            }
        });
    });

    socket.on('imageSequence', function(data) {
        let imageBuffer = decodeBase64Image(data.dataUrl);
        fs.writeFile(data.name + ".png", imageBuffer.data, function(err) {
            if (err) {
                return console.error(err);
            } else {
                let date = getTimeStamp();
                let msg = data.name + '.png written successfully on ' + date.day + " at " + date.time + ".";
                console.log(msg);
                // console.log(data.name + ".png written successfully.");
                io.sockets.emit('pushMessage', msg);
                io.sockets.emit('getNextImage');
            }
        });
    });

    socket.on('interpretSuperCollider', function(msg, path) {
        if (sclang) {
            sclang.interpret(msg, path, true, true, false)
                .then(function(result) {
                    io.sockets.emit('toscdconsole', result);
                })
                .catch(function(error) {
                    var errorStringArray = JSON.stringify(error.error, null, ' ');
                    io.sockets.emit('toscdconsole', errorStringArray + '\n\n\n');
                });
        };
    });

    socket.on('note', function(data) {
        var msg = {
            address: "/hello/from/oscjs",
            args: [{
                type: "f",
                value: data
            }]
        };
        // console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
        udpPort.send(msg);
    });
    socket.on('msgToSCD', function(msg) {
        // console.log(msg);
        udpPort.send(msg);
    });

    socket.on('sendOSC', function(message) {
        let arguments = [];
        if (Array.isArray(message.value)) {
            for (let i = 0; i < message.value.length; i++) {
                arguments.push({
                    type: message.type,
                    value: message.value[i]
                });
            }
        } else {
            arguments.push({
                type: message.type,
                value: message.value
            });
        }
        var msg = {
            address: message.address,
            args: arguments
        };
        udpPort.send(msg);
    });

    // socket.on('savePoints', function(data) {
    //     console.log(data);
    //     data = JSON.stringify(data);
    //     var fileName = filenameFormatter(Date());
    //     fileName = fileName.slice(0, fileName.length - 13);
    //     fs.writeFile("./JSONs/" + fileName + '.json', data, function(err) {
    //         if (err) {
    //             return console.error(err);
    //         } else {
    //             console.log("./JSONs/" + fileName + '.json written successfully.');
    //         }
    //     });
    // });
    socket.on('saveFile', function(file) {
        // console.log(data);
        // data = JSON.stringify(data);
        // var fileName = filenameFormatter(Date());
        // fileName = fileName.slice(0, fileName.length - 13);
        fs.writeFile(file.path, file.data, function(err) {
            if (err) {
                return console.error(err);
            } else {
                let date = getTimeStamp();
                let msg = file.path + ' written successfully on ' + date.day + " at " + date.time + ".";
                console.log(msg);
                io.sockets.emit('pushMessage', msg);
            }
        });
    });
    socket.on('saveJSON', function(file) {
        // console.log(data);
        // data = JSON.stringify(data);
        // var fileName = filenameFormatter(Date());
        // fileName = fileName.slice(0, fileName.length - 13);
        fs.writeFile(file.path, JSON.stringify(file.data), function(err) {
            if (err) {
                return console.error(err);
            } else {
                let date = getTimeStamp();
                let msg = file.path + ' written successfully on ' + date.day + " at " + date.time + ".";
                console.log(msg);
                io.sockets.emit('pushMessage', msg);
            }
        });
    });
});


function startSclang() {
    sc.lang.boot({ stdin: false, echo: false, debug: false }).then(function(lang) {
        sclang = lang;
        sclang.on('stdout', function(text) {
            io.sockets.emit('toscdconsole', text);
        });
        sclang.on('state', function(text) {
            io.sockets.emit('toscdconsole', JSON.stringify(text));
        });
        sclang.on('stderror', function(text) {
            io.sockets.emit('toscdconsole', JSON.stringify(text));
        });
        sclang.on('error', function(text) {
            io.sockets.emit('toscdconsole', JSON.stringify(text.error.errorString));
        });
    });
    // sc.server.boot();
}
if (startSC) {
    startSclang();
}


function loadJSONs(folder) {
    let JSONs = [];
    try {
        var files = fs.readdirSync(folder);
    } catch (e) {
        return;
    }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = folder + "/" + files[i];

            var fileType = filePath.slice(filePath.length - 5, filePath.length);
            if (fileType == ".json" || fileType == ".JSON") {
                var fileName = "" + files[i];
                fileName = fileName.slice(0, fileName.length - 5);
                // var obj = new graphJSON(filePath, fileName);
                console.log(fileName + " loaded successfully.");
                JSONs.push({
                    name: fileName,
                    data: JSON.parse(fs.readFileSync(filePath))
                })
            }
        }
    return JSONs;
}

// loadJSONs();


function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    // response.data = new Buffer(matches[2], 'base64');
    response.data = Buffer.from(matches[2], 'base64');
// Buffer.alloc()
    return response;
}

function getTimeStamp() {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    month = (month < 10) ? "0" + month : month;
    let dayOfTheMonth = d.getDate();
    dayOfTheMonth = (dayOfTheMonth < 10) ? "0" + dayOfTheMonth : dayOfTheMonth;
    let day = year + "-" + month + "-" + dayOfTheMonth;
    let hours = d.getHours();
    hours = (hours < 10) ? "0" + hours : hours;
    let minutes = d.getMinutes();
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    let seconds = d.getSeconds();
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    let time = hours + ":" + minutes + ":" + seconds;
    return {
        day: day,
        time: time
    };
}