// 展示用标签
let showLabel = document.getElementById("video"); // 视频
let recordDownload = document.querySelector("a"); // 下载
let choiceLabel = document.getElementById("choice"); // 摄像头选择
let recordButton = document.getElementById("record"); // 录像按钮
// 拍照绘图
let canvas = document.createElement("canvas");
let context = canvas.getContext("2d");
// 录制对象
let recorder;

// 默认配置
let showOpt = {
  audio: false,
  video: true,
};

// 摄像头是否关闭
let flag = true;
// 是否开启镜像
let mirror = false;
// 是否有媒体设备
let hasMedia = false;

// 获取媒体设备列表
let getMedia = () => {
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        // 判断设备是否为视频类型
        if (device.kind === "videoinput") {
          // 增加select标签
          choiceLabel.insertAdjacentHTML(
            "beforeend",
            `<option value="${device.deviceId}">${device.label}</option>`
          );
          hasMedia = true;
        }
      });
      if (hasMedia == false) {
        alert("没有找到相机设备");
      }
    })
    .catch((err) => {
      console.log(`${err.name}:${err.message}`);
    });
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

// 切换摄像头
let chVideo = () => {
  // 获取列表元素的id值
  let deviceId = choiceLabel.value;
  showOpt = {
    audio: false,
    video: {
      optional: [
        {
          sourceId: deviceId,
        },
      ],
    },
  };
  showVideo();
};

// 拍照
let takePhoto = () => {
  //创建canvas标签
  canvas.width = showLabel.videoWidth;
  canvas.height = showLabel.videoHeight;
  //利用video画图
  context.drawImage(showLabel, 0, 0);
  //将canvas图像转换为base64字符串，设置格式以及压缩比例
  let image = canvas.toDataURL("image/jpeg", 90 / 100);

  // 下载标签更新并点击
  recordDownload.href = image;
  recordDownload.click();
  return image;
};

// 录像
let startRecord = () => {
  // 转换Opt为局部变量
  let recordOpt = showOpt;
  // 开启音频录制
  recordOpt.audio = true;
  console.log("start");
  // 获取音视频流
  navigator.mediaDevices
    .getUserMedia(recordOpt)
    .then((mediaStream) => {
      // 初始化记录对象
      recorder = new MediaRecorder(mediaStream);
      recorder.ondataavailable = (e) => {
        let recordData = e.data;
        recordDownload.href = URL.createObjectURL(recordData);
      };
      recorder.start();
      // 按钮更改内容
      recordButton.onclick = stopRecord;
      recordButton.classList.replace("btn-b", "btn-o");
      recordButton.innerHTML = "停止";
    })
    .catch((err) => {
      console.log(`${err.name}:${err.message}`);
    });
};

// 停止录制
let stopRecord = () => {
  recorder.stop();
  console.log("stop!");
  // 按钮更改内容
  recordButton.onclick = startRecord;
  recordButton.classList.replace("btn-o", "btn-b");
  recordButton.innerHTML = "录制";
  // 延时加载
  setTimeout(() => recordDownload.click(), 1000);
};

// 镜像视频
let mirrorVideo = () => {
  mirror
    ? showLabel.classList.remove("mirror")
    : showLabel.classList.add("mirror");

  mirror = !mirror;
};

// 悬浮
let suspend = () => {
  // 传入摄像头id
  localStorage.setItem("mediaKey", choiceLabel.value);
  // 传入镜像情况
  localStorage.setItem("mirror", mirror);
  utools.createBrowserWindow("suspend.html", {
    title: "camera",
    width: parseInt(showLabel.videoWidth),
    height: parseInt(showLabel.videoHeight),
    useContentSize: true,
    //不能最大最小化
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    //背景透明，防止放大缩小时出现白框
    transparent: true,
    backgroundColor: "#00000000",
    frame: false,
    alwaysOnTop: true,
  });
};

// 启动
let start = () => {
  showVideo();
  flag = true;
};

// 退出
let exit = () => {
  if (flag == true) {
    // 遍历并停止
    showLabel.srcObject.getTracks().forEach((v) => {
      v.stop();
    });
    flag = false;
  } else {
    start();
  }
};

getMedia();
start();
