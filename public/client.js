var webSocket = new WebSocket("ws://" + location.hostname + ":" + location.port + "/chat/");
var userName = "";
console.log(webSocket);
webSocket.onmessage = function (msg) {
    receievMsg(JSON.parse(msg.data))
};
webSocket.onclose = function() {
    alert("Server Disconnect You");
};
webSocket.onopen = function() {
    var name = "";
    while (name === "") name = prompt("Enter your name");
    sendMessage("join", name);
    userName = name
};

$("#leave").click(function () {
    sendMessage("leave", userName)
    webSocket.close()
});

$("#send").click(function () {
    var message = $("#message").val();
    console.log(message);
    console.log(message.charAt(0) === '@');
    if(message.charAt(0) === '@') {
        var end = message.indexOf(" ");
        var receiver = message.substring(1, end);
        console.log(receiver);
        sendMessage("privateMessage", {
            sender: userName,
            receiver: receiver,
            message: message
        });
    } else {
        sendMessage("message", {
            sender: userName,
            message: message
        });
    }
});

$("#message").keypress(function(e) {
    if(e.which === 13) {
        var message = $("#message").val();
        console.log(message);
        console.log(message.charAt(0) === '@');
        if(message.charAt(0) === '@') {
            var end = message.indexOf(" ");
            var receiver = message.substring(1, end);
            console.log(receiver);
            sendMessage("privateMessage", {
                sender: userName,
                receiver: receiver,
                message: message
            });
        } else {
            sendMessage("message", {
                sender: userName,
                message: message
            });
        }
    }
});

function sendMessage(type, data) {
    if (data !== "") {
        webSocket.send(JSON.stringify({type: type, data: data}));
        $("#message").val("");
        $("#message").focus();
    }
}

function receievMsg(msg) {
    if (msg.type === "message") {
        $("#chat").append("<p class='card-text'>"+msg.data.sender + ": " + msg.data.message+"</p>");
    }
    else if (msg.type === "privateMessage") {
        console.log(msg.data);
        if(userName === msg.data.sender || userName === msg.data.receiver) {
            $("#chat").append("<p class='card-text' style='color:blue'>"+msg.data.sender + ": " + msg.data.message+"</p>");
        }
    }
    else if (msg.type === "join") {
        addUser(msg.data);
        $("#chat").append("<p class='card-text' style='color:green'>"+msg.data.name + " joined the chat!</p>");
    }
    else if (msg.type === "users") {
        msg.data.forEach(function(el) { addUser(el); });
    }
    else if (msg.type === "left") {
        $("#chat").append("<p class='card-text' style='color:red'>"+msg.data.name + " left the chat!</p>");
        $("#user-"+msg.data.id).remove();
    }
}

function addUser(user) {
    $("#userlist").append("<li id='user-"+user.id+"'>"+user.name+"</li>");
}