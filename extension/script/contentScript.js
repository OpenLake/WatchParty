console.log("content script hit - watchparty");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.greeting === "hello") {
    startRecording();
  } else if (request.greeting === "stopRecording") {
    stopRecording();
  }
});

let mediaRecorder;
let chunks = [];
let audioURL = "";
let isRecording = false;

function startRecording() {
  console.log("startRecording funtion called");
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        console.log("Recording started...");

        alert("Speak Now - Recording started . . . ");

        isRecording = true;
        mediaRecorder.start();
      })
      .catch((error) => {
        console.log("Error accessing microphone:", error);
        isRecording = false;
      });
  } else {
    console.log(
      "Recording is already in progress or getUserMedia not supported"
    );
  }
}

function stopRecording() {
  console.log("Stop recording  🛑");

  mediaRecorder.stop();
  isRecording = false;

  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
    chunks = [];
    audioURL = window.URL.createObjectURL(blob);
    console.log("Recording stopped. Audio available for download.");
    downloadAudio();
  };
}

function downloadAudio() {
  const downloadLink = document.createElement("a");
  downloadLink.href = audioURL;
  downloadLink.setAttribute("download", "recorded_audio.ogg");
  downloadLink.click();
}

// ---------------------- xxx --- Uploading the file logic starts here --- xxx ----------------------
