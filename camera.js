// DOM 元素
const Elements = {
  photo: document.getElementById('photo'), // 拍照

  record: document.getElementById('record'), // 录制
  stop: document.getElementById('stop'), // 停止

  mirror: document.getElementById('mirror'), // 镜像

  suspend: document.getElementById('suspend'), // 悬浮

  choice: document.getElementById('choice'), // 选择
  change: document.getElementById('change'), // 切换

  remove: document.getElementById('remove'), // 解除
  resume: document.getElementById('resume'), // 恢复

  video: document.getElementById('video'), // 视频
  canvas: document.getElementById('canvas'), // 绘制
  download: document.getElementById('download'), // 下载
}

// Media 选项
const Media = {
  record: null, // 记录对象
  option: {
    video: true, // 开启视频
    audio: false, // 关闭音频
  },
}

// 拍照
Elements.photo.addEventListener('click', () => {
  // 图像大小
  canvasElement.width = videoElement.videoWidth
  canvasElement.height = videoElement.videoHeight

  // 绘制
  canvasContext.drawImage(videoElement, 0, 0)

  // 下载
  downloadElement.href = canvasElement.toDataURL('image/jpeg')
  downloadElement.download = `photo-${new Date().toLocaleString().replace(/[/: ]/gi, '-')}.jpeg`
  downloadElement.click()
})

// 录像
Elements.record.addEventListener('click', () => {
  // 开启音频
  Media.option.audio = true

  // 获取音视频流
  navigator.mediaDevices
    .getUserMedia(Media.option)
    .then((stream) => {
      // 初始化记录对象
      Media.record = new MediaRecorder(stream)

      // 下载
      Media.record.ondataavailable = (e) => {
        downloadElement.href = URL.createObjectURL(e.data)
        downloadElement.download = `video-${new Date().toLocaleString().replace(/[/: ]/gi, '-')}.webm`
      }

      // 销毁
      Media.record.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
      }

      // 开始录制
      Media.record.start()

      // 更换按钮
      Elements.record.classList.add('hidden')
      Elements.stop.classList.remove('hidden')
    })
    .catch((err) => {
      alert(`设备录制失败：${err.message}`)
    })
})

// 停止
Elements.stop.addEventListener('click', () => {
  // 停止录制
  Media.record.stop()

  // 更换按钮
  Elements.record.classList.add('hidden')
  Elements.stop.classList.remove('hidden')
})

// 镜像
Elements.mirror.addEventListener('mirror', () => {
  localStorage['mirror'] = videoElement.classList.toggle('mirror')
})

// 悬浮
Elements.suspend.addEventListener('click', () => {
  utools.createBrowserWindow('suspend.html', {
    title: 'suspend',
    width: videoElement.videoWidth,
    height: videoElement.videoHeight,
    useContentSize: true,
    // 阻止最大化、最小化、全屏
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    // 隐藏边框、透明、置顶、背景色
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    backgroundColor: '#00000000',
  })
})

// 切换
Elements.change.addEventListener('click', () => {
  localStorage.setItem('media', Elements.choice.value)
  InitMedia()
})

// 解除占用
Elements.remove.addEventListener('click', () => {
  Elements.video.srcObject.getTracks().forEach((v) => {
    v.stop()
  })
  Elements.remove.classList.add('hidden')
  Elements.resume.classList.remove('hidden')
})

// 恢复占用
Elements.remove.addEventListener('click', () => {
  Elements.resume.classList.add('hidden')
  Elements.remove.classList.remove('hidden')
  InitMedia()
})

const InitMedia = () => {
  // 镜像状态
  if (localStorage.mirror == 'true') {
    Elements.video.classList.add('mirror')
  }

  // 媒体设备
  if (localStorage.media) {
    Media.option.video = {
      optional: [
        {
          sourceId: localStorage.media,
        },
      ],
    }
  }

  // 关闭音频
  Media.audio = false

  // 读取设备列表
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        // 增加 select 标签
        if (device.kind === 'videoinput') {
          choiceElement.insertAdjacentHTML('beforeend', `<option value="${device.deviceId}">${device.label}</option>`)
        }
      })
    })
    .catch((err) => {
      alert(`设备读取失败：${err.message}`)
    })

  // 初始化媒体设备
  navigator.mediaDevices
    .getUserMedia(Media.option)
    .then((media) => {
      // 写入流
      videoElement.srcObject = media
      // 自动播放
      videoElement.onloadedmetadata = () => {
        mediaStart = true
        videoElement.play()
      }
    })
    .catch((err) => {
      alert(`设备启动失败：${err.message}`)
    })
}

InitMedia()
