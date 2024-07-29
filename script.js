document.getElementById('start').addEventListener('click', start);
document.getElementById('stop').addEventListener('click', stop);

let audioContext;
let mediaStreamSource;
let delayNode;
let mediaRecorder;

async function start() {
    const delayTime = parseFloat(document.getElementById('delay').value);

    // Create audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Get user media
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create delay node
    delayNode = audioContext.createDelay();
    delayNode.delayTime.value = delayTime;

    // Connect nodes
    mediaStreamSource.connect(delayNode);
    delayNode.connect(audioContext.destination);
}

function stop() {
    mediaStreamSource.disconnect();
    delayNode.disconnect();
    audioContext.close();
}
