let showLabel = document.querySelector('.show');
let showWidth = 100;
let showOpt = {
  audio: false,
  video: {
    optional: [{
      sourceId: localStorage['mediaKey']
    }]
  },
}

let showVideo = () => {
  navigator.mediaDevices.getUserMedia(showOpt)
    .then(mediaStream => {
      showLabel.srcObject = mediaStream;
      showLabel.onloadedmetadata = e => {
        showLabel.play();
      };
    })
    .catch(err => {
      console.log(`${err.name}:${err.message}`);
    });
}

showVideo();
document.addEventListener("keydown", event => {
  switch (event.key) {
    case "Escape":
      window.close();
      break;
    case "-":
      if (showWidth > 20) {
        showWidth -= 10;
      }
      showLabel.style.width = `${showWidth}vw`;
      break;
    case "=":
      if (showWidth < 100) { 
        showWidth += 10;
      }
      showLabel.style.width = `${showWidth}vw`;
      break;
  }
})