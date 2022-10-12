// DOM 元素
const Element = {
  photo: document.getElementById('photo'), // 拍照
  record: document.getElementById('record'), // 录制
  mirror: document.getElementById('mirror'), // 镜像
  suspend: document.getElementById('suspend'), // 悬浮
  choice: document.getElementById('choice'), // 选择
  toggle: document.getElementById('toggle'), // 开关
  canvas: document.getElementById('canvas'), // 绘制
  video: document.getElementById('video'), // 视频
  download: document.getElementById('download'), // 下载
}

// Media 选项
const Media = {
  start: false, // 是否启动
  record: null, // 记录对象
  option: {
    video: true, // 开启视频
    audio: false, // 关闭音频
  },
}

// 镜像状态
if (localStorage['mirror'] == 'true') {
  videoElement.classList.add('mirror')
}

// 媒体设备
if (localStorage['media']) {
  Media.option = {
    video: {
      optional: [
        {
          sourceId: localStorage['media'],
        },
      ],
    },
    audio: false,
  }
}

// 读取设备列表
navigator.mediaDevices
  .enumerateDevices()
  .then((devices) => {
    devices.forEach((device) => {
      // 是否为视频输入
      if (device.kind === 'videoinput') {
        // 增加 select 标签
        choiceElement.insertAdjacentHTML('beforeend', `<option value="${device.deviceId}">${device.label}</option>`)
      }
    })
  })
  .catch((err) => {
    alert(`设备读取失败：${err.message}`)
  })

// 启动相机
const showVideo = () => {
  navigator.mediaDevices
    .getUserMedia(mediaOption)
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

// 切换相机
const changeMedia = () => {
  // 获取设备 ID
  let mediaID = choiceElement.value
  mediaOption = {
    audio: false,
    video: {
      optional: [
        {
          sourceId: mediaID,
        },
      ],
    },
  }
  // 保存
  localStorage.setItem('media', mediaID)
  showVideo()
}

// 拍照
const takePhoto = () => {
  //创建 canvasElement 标签
  canvasElement.width = videoElement.videoWidth
  canvasElement.height = videoElement.videoHeight
  // 利用 canvasElement 画图
  canvasContext.drawImage(videoElement, 0, 0)
  // 生成图片
  let image = canvasElement.toDataURL('image/jpeg')
  // 下载
  downloadElement.href = image
  downloadElement.download = `camera-photo-${new Date().toLocaleString().replace(/[/: ]/gi, '-')}.jpeg`
  downloadElement.click()
}

// 录像
const startRecord = () => {
  let recordOption = mediaOption

  // 开启音频
  recordOption.audio = true

  // 获取音视频流
  navigator.mediaDevices
    .getUserMedia(recordOption)
    .then((media) => {
      // 初始化记录对象
      mediaRecord = new MediaRecorder(media)
      // 停止回调
      mediaRecord.ondataavailable = (e) => {
        downloadElement.href = URL.createObjectURL(e.data)
        downloadElement.download = `camera-video-${new Date().toLocaleString().replace(/[/: ]/gi, '-')}.webm`
      }
      // 销毁
      mediaRecord.onstop = () => {
        media.getTracks().forEach((track) => track.stop())
      }
      // 开始
      mediaRecord.start()
      // 更改按钮内容
      recordElement.onclick = stopRecord
      recordElement.classList.replace('btn-b', 'btn-o')
      recordElement.innerHTML = '停止'
    })
    .catch((err) => {
      alert(`设备录制失败：${err.message}`)
    })
}

// 停止录制
const stopRecord = () => {
  mediaRecord.stop()
  // 按钮更改内容
  recordElement.onclick = startRecord
  recordElement.classList.replace('btn-o', 'btn-b')
  recordElement.innerHTML = '录制'
  // 延时下载
  setTimeout(() => downloadElement.click(), 1000)
}

// 镜像视频
let mirrorVideo = () => {
  mirror = videoElement.classList.toggle('mirror')
  localStorage.setItem('mirror', mirror)
}

// 悬浮
const suspendVideo = () => {
  // 创建悬浮
  utools.createBrowserWindow('suspend.html', {
    title: 'camera',
    width: parseInt(videoElement.videoWidth),
    height: parseInt(videoElement.videoHeight),
    useContentSize: true,
    // 阻止最大化、最小化、全凭
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    // 隐藏边框、透明、置顶、背景颜色
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    backgroundColor: '#00000000',
  })
}

// 退出
const toggleMedia = () => {
  if (mediaStart) {
    // 遍历并停止
    videoElement.srcObject.getTracks().forEach((v) => {
      v.stop()
    })
    mediaStart = false
  } else {
    showVideo()
  }
}

showVideo()
