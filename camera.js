// 获取元素
const videoElement = document.getElementById('video') // 视频
const downloadElement = document.getElementById('download') // 下载
const choiceElement = document.getElementById('choice') // 相机选择
const recordElement = document.getElementById('record') // 录像按钮

// 拍照绘图
const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')

let recorder, // 录制对象
  mediaStart = false // 是否开启设备

// 媒体配置
let mediaOption = {
  video: true,
  audio: false,
}

// 获取镜像状态
if (localStorage['mirror'] == 'true') {
  videoElement.classList.add('mirror')
}

// 获取媒体设备
if (localStorage['media']) {
  mediaOption = {
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
    .then((mediaStream) => {
      // 写入流
      videoElement.srcObject = mediaStream
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
  //创建 canvas 标签
  canvas.width = videoElement.videoWidth
  canvas.height = videoElement.videoHeight
  // 利用 canvas 画图
  context.drawImage(videoElement, 0, 0)
  // 生成图片
  let image = canvas.toDataURL('image/jpeg')
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
    .then((mediaStream) => {
      // 初始化记录对象
      recorder = new MediaRecorder(mediaStream)
      // 停止回调
      recorder.ondataavailable = (e) => {
        downloadElement.href = URL.createObjectURL(e.data)
        downloadElement.download = `camera-video-${new Date().toLocaleString().replace(/[/: ]/gi, '-')}.webm`
      }
      // 销毁
      recorder.onstop = () => {
        mediaStream.getTracks().forEach((track) => track.stop())
      }
      // 开始
      recorder.start()
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
  recorder.stop()
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
const exit = () => {
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