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
  Elements.canvas.width = Elements.video.videoWidth
  Elements.canvas.height = Elements.video.videoHeight

  // 绘制
  Elements.canvas.getContext('2d').drawImage(Elements.video, 0, 0)

  // 下载
  Elements.download.href = Elements.canvas.toDataURL('image/jpeg')
  Elements.download.download = `photo-${new Date().toLocaleString().replace(/[/: ]/gi, '-')}.jpeg`
  Elements.download.click()
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
        Elements.download.href = URL.createObjectURL(e.data)
        Elements.download.download = `video-${new Date().toLocaleString().replace(/[/: ]/gi, '-')}.webm`
        Elements.download.click()
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
      alert(`媒体设备录制失败：${err.message}`)
    })
})

// 停止
Elements.stop.addEventListener('click', () => {
  // 停止录制
  Media.record.stop()

  // 更换按钮
  Elements.stop.classList.add('hidden')
  Elements.record.classList.remove('hidden')
})

// 镜像
Elements.mirror.addEventListener('click', () => {
  localStorage['mirror'] = Elements.video.classList.toggle('mirror')
})

// 悬浮
Elements.suspend.addEventListener('click', () => {
  utools.createBrowserWindow('suspend.html', {
    title: 'suspend',
    // 使用内容大小
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

// 切换媒体设备
Elements.change.addEventListener('click', () => {
  localStorage.setItem('media', Elements.choice.value)
  StartMedia()
})

// 解除占用
Elements.remove.addEventListener('click', () => {
  Elements.remove.classList.add('hidden')
  Elements.resume.classList.remove('hidden')
  stopMedia()
})

// 恢复占用
Elements.resume.addEventListener('click', () => {
  Elements.resume.classList.add('hidden')
  Elements.remove.classList.remove('hidden')
  StartMedia()
})

// 初始化媒体设备
const InitMedia = () => {
  // 镜像状态
  if (localStorage.mirror == 'true') {
    Elements.video.classList.add('mirror')
  }

  // 读取设备列表
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        // 增加 select 标签
        if (device.kind === 'videoinput') {
          Elements.choice.add(new Option(device.label, device.deviceId))
        }
      })
      // 设置选项
      if (localStorage.media) {
        Elements.choice.value = localStorage.media
      }
    })
    .catch((err) => {
      alert(`媒体设备读取失败：${err.message}`)
    })
}

// 启动媒体设备
const StartMedia = () => {
  // 关闭音频
  Media.option.audio = false

  // 媒体设备
  if (localStorage.media) {
    // 选择媒体设备
    Media.option.video = {
      optional: [
        {
          sourceId: localStorage.media,
        },
      ],
    }
  }

  // 初始化媒体设备
  navigator.mediaDevices
    .getUserMedia(Media.option)
    .then((media) => {
      // 写入流
      Elements.video.srcObject = media
    })
    .catch((err) => {
      alert(`媒体设备启动失败：${err.message}`)
    })
}

// 关闭媒体设备
const stopMedia = () => {
  Elements.video.srcObject.getTracks().forEach((v) => {
    v.stop()
  })
}

// 初始化媒体设备
InitMedia()
// 开启媒体设备
StartMedia()
