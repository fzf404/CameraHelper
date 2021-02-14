function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

function suspend() {
  let img = new Image();
  let payload = ``;
  img.src = payload;
  img.onload = function () {
      let width = img.width / (utools.isMacOs() ? 2 : 1)
      let height = img.height / (utools.isMacOs() ? 2 : 1)
      let scale = width / (height * 1.0)
      //图片大小不能超过当前显示器80%，否则缩放
      let display = utools.getDisplayNearestPoint(utools.getCursorScreenPoint())
      if (display) {
          width = Math.min(width, display.size.width * 0.8);
          height = width / scale;
          height = Math.min(height, display.size.height * 0.8);
          width = height * scale;
      }
      let imgKey = uuidv4();
      //通过localStorage传参,解决url传参的大小限制问题
      localStorage.setItem(imgKey, payload);
      utools.createBrowserWindow('suspend.html?a=1#' + imgKey, {
          title: 'img',
          width: parseInt(width),
          height: parseInt(height),
          useContentSize: true,
          //不能最大最小化
          minimizable: false,
          maximizable: false,
          fullscreenable: false,
          //背景透明，防止放大缩小时出现白框
          transparent: true,
          backgroundColor: '#00000000',
          frame: false,
          alwaysOnTop: true,
          webPreferences: {
              preload: 'suspend.js'
          }
      });
  }
};