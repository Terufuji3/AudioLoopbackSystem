// 開始ボタン
const startButton = document.getElementById('start');

// 停止ボタン
const stopButton = document.getElementById('stop');

// タイマー表示
const timer = document.getElementById('timer');

// リセットボタン
const resetButton = document.getElementById('reset');

// 開始ボタン押下時
startButton.addEventListener('click', start);

// 停止ボタン押下時
stopButton.addEventListener('click', stop);

// リセットボタン押下時
resetButton.addEventListener('click', reset);

let audioContext;
let mediaStreamSource;
let delayNode;
let mediaRecorder;

// 開始時間
let startTime;
// 停止時間
let stopTime = 0;
// タイムアウトId
let timeoutId;

/**
 * 開始ボタン押下時の処理
 */
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

    startTime = Date.now();

    startButton.disabled = true;
    stopButton.disabled = false;
    resetButton.disabled = true;

    // ストップウォッチの表示
    displayTime();
}

/**
 * 停止ボタン押下時の処理
 */
function stop() {
    mediaStreamSource.disconnect();
    delayNode.disconnect();
    audioContext.close();

    startButton.disabled = false;
    stopButton.disabled = true;
    resetButton.disabled = false;

    clearTimeout(timeoutId);
    stopTime += Date.now() - startTime;
}

/**
 * リセットボタン押下時の処理
 */
function reset() {
    timer.textContent = "00:00:00";
    stopTime = 0;
}

/**
 * 時間を表示する関数
 */ 
function displayTime() {
  const currentTime = new Date(Date.now() - startTime + stopTime);
  const h = String(currentTime.getHours() - 9).padStart(2, "0");
  const m = String(currentTime.getMinutes()).padStart(2, "0");
  const s = String(currentTime.getSeconds()).padStart(2, "0");

  timer.textContent = `${h}:${m}:${s}`;
  timeoutId = setTimeout(displayTime, 1000);
}
