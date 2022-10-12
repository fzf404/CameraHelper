// DOM 元素
const videoElement = document.getElementById('video')

// Video 宽度百分比
let videoWidth = 50

// Media 配置
let mediaOption = {
  audio: false,
  video: {
    optional: [
      {
        // 获取参数
        sourceId: localStorage['media'],
      },
    ],
  },
}

// 镜像状态
if (localStorage['mirror'] == 'true') {
  videoElement.classList.add('mirror')
}

// 读取设备
navigator.mediaDevices
  .getUserMedia(mediaOption)
  .then((media) => {
    // 写入 video
    videoElement.srcObject = media
    videoElement.onloadedmetadata = (e) => {
      videoElement.play()
    }
  })
  .catch((err) => {
    alert(`摄像头读取失败：${err.message}`)
  })

// 监听按键
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'Escape': // esc 退出
      window.close()
      break
    case '-': // - 缩小
      if (videoWidth > 20) {
        videoWidth -= 5
      }
      videoElement.style.width = `${videoWidth}vw`
      break
    case '=': // = 放大
      if (videoWidth < 100) {
        videoWidth += 5
      }
      videoElement.style.width = `${videoWidth}vw`
      break
  }
})
