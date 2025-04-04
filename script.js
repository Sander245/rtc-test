let localConnection = null;
let remoteConnection = null;
let sendChannel = null;
let receiveChannel = null;

const localText = document.getElementById('localText');
const remoteText = document.getElementById('remoteText');
const sendButton = document.getElementById('sendButton');

// Create local and remote peer connections
localConnection = new RTCPeerConnection();
remoteConnection = new RTCPeerConnection();

// Create a data channel for local peer connection
sendChannel = localConnection.createDataChannel("chat");
sendChannel.onmessage = (event) => {
    remoteText.value += `You: ${event.data}\n`;
};

// Handle remote peer connection's data channel
remoteConnection.ondatachannel = (event) => {
    receiveChannel = event.channel;
    receiveChannel.onmessage = (event) => {
        remoteText.value += `Remote: ${event.data}\n`;
    };
};

// ICE candidate exchange
localConnection.onicecandidate = (event) => {
    if (event.candidate) {
        remoteConnection.addIceCandidate(event.candidate);
    }
};

remoteConnection.onicecandidate = (event) => {
    if (event.candidate) {
        localConnection.addIceCandidate(event.candidate);
    }
};

// Establish connection between peers
localConnection.createOffer().then((offer) => {
    localConnection.setLocalDescription(offer);
    remoteConnection.setRemoteDescription(offer);

    return remoteConnection.createAnswer();
}).then((answer) => {
    remoteConnection.setLocalDescription(answer);
    localConnection.setRemoteDescription(answer);
});

// Send message over data channel
sendButton.addEventListener('click', () => {
    const message = localText.value.trim();
    if (message) {
        sendChannel.send(message);
        localText.value = '';
    }
});
