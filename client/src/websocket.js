function JsonObj(eventType, data, end, isVisible, manualFlag){
    return {
        event: eventType,
        meetCode: initMsg.meetCode,
        uid: initMsg.uid,
        role: initMsg.role,
        data: data,
        end: end,
        isVisible: isVisible,
        manualFlag: manualFlag
    };
}

function closeConnection() {
    if (ws)
        ws.close();
}

function openConnection() {
    closeConnection();
    var url = "ws://localhost:8001/";
    // var url = "wss://studengage.herokuapp.com/";
    console.log("Attempting connection");
    ws = new WebSocket(url);
    ws.onopen = onOpen;
    ws.onclose = onClose;
    ws.onmessage = onMessage;
    ws.onerror = onError;
}

function onOpen() {
    console.log("Websocket connected.");
    ws.send(JSON.stringify(initMsg));
}

function onClose() {
    console.log("Websocket disconnected.");
    ws = null;
}

function onError(event) {
    console.log("Websocket error." + event);
}

function onMessage(msg) {
    // console.log(msg.data);
    reply = JSON.parse(msg.data);
    // console.log(reply);
    switch(reply.event){
        case "Add new":
            appendChart(document.getElementById("Charts"), reply.name, reply.uid);
            break;
        case "Update":
            makeChart(reply.uid, Math.floor(Math.random() * (100 - 60) + 60));
            break;
        case "Request Frames":
            manualFlag = reply.manualFlag;
            sendFrames();
            break;
        case "Add Row":
            table = document.getElementById("Table1");
            var row = table.insertRow(1);
            addRow(row, table, [(new Date()).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}), reply.score, reply.aggregate], false);
            break;
        case "Stop Frames":
            stopFlag = true;
            break;
    }
}

function sendRequestToServer(){
    if(ws){
        ws.send(JSON.stringify(JsonObj("request", "", false, true, manualFlag)));
    }
    else{
        console.log("Error in sendRequestToServer");
    }
}

function sendContentToServer(img) {
    if (ws){
        ws.send(JSON.stringify(JsonObj("content", img, false, true, false)));
    }
    else{
        console.log("Error in sendContentToServer");
    }
}


function sendSnapshotToServer(img, endFrame, isTabVisible) {
    if (ws){
        ws.send(JSON.stringify(JsonObj("reply", img, endFrame, isTabVisible, false)));
    }
    else{
        console.log("Error in sendSnapshotToServer");
    }
}
