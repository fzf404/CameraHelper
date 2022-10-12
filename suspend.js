// DOM 元素
const Elements = {
  video: document.getElementById('video'), // 视频
}

const Media = {
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
}

// 监听按键
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'Escape': // Esc 退出
      window.close()
      break
    case '-': // - 缩小
      if (Media.width > 20) {
        Media.width -= 5
      }
      return (Elements.video.style.width = `${Media.width}vw`)
    case '=': // = 放大
      if (Media.width < 100) {
        Media.width += 5
      }
      return (Elements.video.style.width = `${Media.width}vw`)
  }
})

// 镜像状态
if (localStorage['mirror'] == 'true') {
  Elements.video.classList.add('mirror')
}

// 读取设备
navigator.mediaDevices
  .getUserMedia(Media.option)
  .then((stream) => {
    Elements.video.srcObject = stream
  })
  .catch((err) => {
    alert(`摄像头读取失败：${err.message}`)
  })
