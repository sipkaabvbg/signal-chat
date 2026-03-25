const peer = new Peer(); // Създава връзка със сървъра за сигнализация
let localStream;

// 1. Вземи камерата си
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    localStream = stream;
    document.getElementById('localVideo').srcObject = stream;
});

// 2. Покажи твоето ID, което да дадеш на приятел
peer.on('open', id => {
    document.getElementById('my-id').innerText = id;
});

// 3. Когато някой ти се обади
peer.on('call', call => {
    call.answer(localStream); // Отговори с твоето видео
    call.on('stream', remoteStream => {
        document.getElementById('remoteVideo').srcObject = remoteStream;
    });
});

// 4. Функция за звънене
function makeCall() {
    const friendId = document.getElementById('peer-id').value;
    const call = peer.call(friendId, localStream);
    call.on('stream', remoteStream => {
        document.getElementById('remoteVideo').srcObject = remoteStream;
    });
}