<script>
  let videoEl;
  let stream;
  let recorder;
  let chunks = [];

  async function startRecording() {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoEl.srcObject = stream;
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = saveVideo;
    recorder.start();
  }

  function stopRecording() {
    recorder.stop();
    stream.getTracks().forEach(track => track.stop());
  }

  function saveVideo() {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teleprompter-recording.webm';
    a.click();
  }
</script>

<div class="vid-div">
  <video bind:this={videoEl} autoplay playsinline></video>

  <button id="startBtn" on:click={startRecording}>Start Recording</button>
  <button id="stopBtn" on:click={stopRecording}>Stop & Download</button>
</div>

<style>
button {
    padding: 6px;
    margin: 4px;
    cursor: pointer;
}
#startBtn {
    background-color: green;
    color: white;
    border: none;
}
#stopBtn {
    background-color: red;
    color: white;
    border: none;
}
.vid-div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
  video {
    /* width: 100%; */
    width: 35%;
    height: 50%;
    border: 1px solid #444;
    margin-top: 0.1rem;
  }
</style>