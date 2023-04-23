let GET = {};
let query = window.location.search.substring(1).split("&");

for (let i = 0; i < query.length; i++) {
    if (query[i] === "") // check for trailing & with no param
        continue;
    var param = query[i].split("=");
    GET[param[0]] = param[1];
}

let exporting = (GET["exporting"] && GET["exporting"] == "true") ? true : false;
// let batchexport = (GET["batchexport"] && GET["batchexport"] == "true") ? true : false;
let batchMin = (GET["batchmin"]) ? parseInt(GET["batchmin"], 10) : null;
let batchMax = (GET["batchmin"]) ? parseInt(GET["batchmax"], 10) : null;
let batchExport = (batchMin && batchMax) ? true : false;

function frameExport() {
    var formattedFrameCount = "" + exportCount;
    while (formattedFrameCount.length < 5) {
        formattedFrameCount = "0" + formattedFrameCount;
    }
    var dataUrl = canvasDOM.toDataURL();
    var data = {
        dataUrl: dataUrl,
        name: fileName + "-" + formattedFrameCount
    }
    if (batchExport) {
        socket.emit('imageSequence', data);
    } else {
        socket.emit('image', data);
    }
}