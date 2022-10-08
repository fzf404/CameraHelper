// video 元素
const videoElement = document.getElementById('video')

// video 大小百分比
let videoWidth = 50

// mirror 开启
if (localStorage['mirror'] == 'true') {
  videoElement.classList.add('mirror')
}

// camera 选项
let cameraOption = {
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

// 读取设备
navigator.mediaDevices
  .getUserMedia(cameraOption)
  .then((mediaStream) => {
    // 写入 video
    videoElement.srcObject = mediaStream
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
