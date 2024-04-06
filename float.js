// DOM 元素
const element = {
  video: document.getElementById("video"), // 视频
};

const media = {
  width: 50, // 宽度百分比
  option: {
    audio: false,
    video: {
      optional: [
        {
          sourceId: localStorage.media,
        },
      ],
    },
  },
};

// 监听按键
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "Escape": // Esc 退出
      window.close();
      break;
    case "-": // - 缩小
      if (media.width > 20) {
        media.width -= 5;
      }
      return (element.video.style.width = `${media.width}vw`);
    case "=": // = 放大
      if (media.width < 100) {
        media.width += 5;
      }
      return (element.video.style.width = `${media.width}vw`);
  }
});

// 镜像状态
if (localStorage["mirror"] == "true") {
  element.video.classList.add("mirror");
}

// 读取媒体设备
navigator.mediaDevices
  .getUserMedia(media.option)
  .then((stream) => {
    element.video.srcObject = stream;
  })
  .catch((err) => {
    alert(`媒体设备读取失败：${err.message}`);
  });
