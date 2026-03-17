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
   // saveVideo();
  }

  function saveVideo() {
    //const blob = new Blob(chunks, { type: 'video/webm' });
    const blob = new Blob(chunks, { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    //a.download = 'forcue-recording.webm';
    a.download = 'forcue-recording.mp4';
    a.click();
  }
</script>

<div class="vid-div">
  <video bind:this={videoEl} autoplay playsinline></video>

  <div id="controls-div">
    <div id="startBtn" role="button" tabindex="-1" on:keydown={startRecording} on:click={startRecording}>
      <img src="/play-button.svg" alt="Play"  width="32px" height="32px"/>
    </div>
      <div id="stopBtn" role="button" tabindex="-1" on:keydown={stopRecording} on:click={stopRecording}>
      <img src="/stop-button.svg" alt="Stop" width="30px" height="30px" />
    </div>

  </div>

  <!-- <button id="startBtn" on:click={startRecording}>Start Recording</button>
  <button id="stopBtn" on:click={stopRecording}>Stop & Download</button> -->
</div>

<style>
/* button {
    padding: 6px;
    margin: 4px;
    cursor: pointer;
} */
#controls-div {
  display: flex;
  justify-content: space-around;
  margin: 6px;
}
#startBtn {
    /* background-color: green;
    color: white;
    border: none; */
    width: 68px;
    cursor: pointer;
}
#stopBtn {
    /* background-color: red;
    color: white;
    border: none; */
    width: 68px;
    cursor: pointer;
}
.vid-div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
  video {
    /* width: 100%; */
    width: 50%;
    height: 50%;
    border: 1px solid #444;
    margin-top: 0.1rem;
  }
</style>