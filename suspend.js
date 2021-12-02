let showLabel = document.getElementById("video");

// 默认窗口大小
let showWidth = 50;

// 是否镜像
localStorage["mirror"] == "true" ? showLabel.classList.add("mirror") : null;

// 相机id
let showOpt = {
  audio: false,
  video: {
    optional: [
      {
        // 获取参数
        sourceId: localStorage["mediaKey"],
      },
    ],
  },
};

// 展示
let showVideo = () => {
  navigator.mediaDevices
    .getUserMedia(showOpt)
    .then((mediaStream) => {
      showLabel.srcObject = mediaStream;
      showLabel.onloadedmetadata = (e) => {
        showLabel.play();
      };
    })
    .catch((err) => {
      console.log(`${err.name}:${err.message}`);
    });
};

showVideo();

// 监听按键
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "Escape":
      window.close();
      break;
    case "-":
      if (showWidth > 20) {
        showWidth -= 5;
      }
      showLabel.style.width = `${showWidth}vw`;
      break;
    case "=":
      if (showWidth < 100) {
        showWidth += 5;
      }
      showLabel.style.width = `${showWidth}vw`;
      break;
  }
});
