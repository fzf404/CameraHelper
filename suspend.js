let showLabel = document.querySelector('.show');
// 默认窗口大小
let showWidth = 50;
// 相机id
let showOpt = {
  audio: false,
  video: {
    optional: [{
      // 获取参数
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
// 监听按键
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