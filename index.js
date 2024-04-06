// 窗口元素
const element = {
  photo: document.getElementById("photo"), // 拍照

  record: document.getElementById("record"), // 录制
  stop: document.getElementById("stop"), // 停止

  mirror: document.getElementById("mirror"), // 镜像

  float: document.getElementById("float"), // 悬浮

  choice: document.getElementById("choice"), // 选择
  change: document.getElementById("change"), // 切换

  remove: document.getElementById("remove"), // 解除
  resume: document.getElementById("resume"), // 恢复

  video: document.getElementById("video"), // 视频
  canvas: document.getElementById("canvas"), // 绘制
  download: document.getElementById("download"), // 下载
};

// 音视频选项
const media = {
  record: null, // 记录对象
  option: {
    video: true, // 开启视频
    audio: true, // 关闭音频
  },
};

// 拍照
element.photo.addEventListener("click", () => {
  // 图像大小
  element.canvas.width = element.video.videoWidth;
  element.canvas.height = element.video.videoHeight;

  // 绘制
  element.canvas.getContext("2d").drawImage(element.video, 0, 0);

  // 下载
  element.download.href = element.canvas.toDataURL("image/jpeg");
  element.download.download = `photo-${new Date()
    .toLocaleString()
    .replace(/[/: ]/gi, "-")}.jpeg`;
  element.download.click();
});

// 录像
element.record.addEventListener("click", () => {
  // 开启音频
  media.option.audio = true;

  // 获取音视频流
  navigator.mediaDevices
    .getUserMedia(media.option)
    .then((stream) => {
      // 初始化记录对象
      media.record = new MediaRecorder(stream);

      // 下载
      media.record.ondataavailable = (e) => {
        element.download.href = URL.createObjectURL(e.data);
        element.download.download = `video-${new Date()
          .toLocaleString()
          .replace(/[/: ]/gi, "-")}.webm`;
        element.download.click();
      };

      // 销毁
      media.record.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      // 开始录制
      media.record.start();

      // 更换按钮
      element.record.classList.add("hidden");
      element.stop.classList.remove("hidden");
    })
    .catch((err) => {
      alert(`媒体设备录制失败：${err.message}`);
    });
});

// 停止
element.stop.addEventListener("click", () => {
  // 停止录制
  media.record.stop();

  // 更换按钮
  element.stop.classList.add("hidden");
  element.record.classList.remove("hidden");
});

// 镜像
element.mirror.addEventListener("click", () => {
  localStorage["mirror"] = element.video.classList.toggle("mirror");
});

// 悬浮
element.float.addEventListener("click", () => {
  utools.createBrowserWindow("float.html", {
    title: "float",
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
    backgroundColor: "#00000000",
  });
});

// 切换媒体设备
element.change.addEventListener("click", () => {
  localStorage.setItem("media", element.choice.value);
  StartMedia();
});

// 解除占用
element.remove.addEventListener("click", () => {
  element.remove.classList.add("hidden");
  element.resume.classList.remove("hidden");
  stopMedia();
});

// 恢复占用
element.resume.addEventListener("click", () => {
  element.resume.classList.add("hidden");
  element.remove.classList.remove("hidden");
  StartMedia();
});

// 初始化媒体设备
const initMedia = () => {
  // 镜像状态
  if (localStorage.mirror == "true") {
    element.video.classList.add("mirror");
  }

  // 读取设备列表
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        // 增加 select 标签
        if (device.kind === "videoinput") {
          element.choice.add(new Option(device.label, device.deviceId));
        }
      });
      // 设置选项
      if (localStorage.media) {
        element.choice.value = localStorage.media;
      }
    })
    .catch((err) => {
      alert(`媒体设备读取失败：${err.message}`);
    });
};

// 启动媒体设备
const startMedia = () => {
  // 关闭音频
  media.option.audio = false;

  // 媒体设备
  if (localStorage.media) {
    // 选择媒体设备
    media.option.video = {
      optional: [
        {
          sourceId: localStorage.media,
        },
      ],
    };
  }

  // 初始化媒体设备
  navigator.mediaDevices
    .getUserMedia(media.option)
    .then((media) => {
      // 写入流
      element.video.srcObject = media;
    })
    .catch((err) => {
      alert(`媒体设备启动失败：${err.message}`);
    });
};

// 关闭媒体设备
const stopMedia = () => {
  element.video.srcObject.getTracks().forEach((v) => {
    v.stop();
  });
};

// 初始化媒体设备
initMedia();
// 开启媒体设备
startMedia();
