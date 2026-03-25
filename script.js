const peer = new Peer();
let localStream;
let currentConn; // Тук ще пазим чат връзката

// 1. Камера
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    localStream = stream;
    document.getElementById('localVideo').srcObject = stream;
});

peer.on('open', id => {
    const shareLink = window.location.origin + window.location.pathname + '?room=' + id;
    document.getElementById('share-link').value = shareLink;

    const urlParams = new URLSearchParams(window.location.search);
    const roomToJoin = urlParams.get('room');
    
    if (roomToJoin) {
        // Потребител В звъни за Видео
        const call = peer.call(roomToJoin, localStream);
        handleCall(call);
        // Потребител В се свързва за Чат
        const conn = peer.connect(roomToJoin);
        handleChat(conn);
    }
});

// Когато Потребител А получи обаждане/връзка
peer.on('call', call => {
    call.answer(localStream);
    handleCall(call);
});

peer.on('connection', conn => {
    handleChat(conn);
});

function handleCall(call) {
    call.on('stream', remoteStream => {
        document.getElementById('remoteVideo').srcObject = remoteStream;
    });
}

function handleChat(conn) {
    currentConn = conn;
    conn.on('data', data => {
        displayMessage("Приятел: " + data);
    });
}

function sendMessage() {
    const msg = document.getElementById('chat-input').value;
    if (currentConn && msg) {
        currentConn.send(msg);
        displayMessage("Аз: " + msg);
        document.getElementById('chat-input').value = "";
    }
}

function displayMessage(text) {
    const msgDiv = document.getElementById('messages');
    msgDiv.innerHTML += `<div>${text}</div>`;
    msgDiv.scrollTop = msgDiv.scrollHeight;
}