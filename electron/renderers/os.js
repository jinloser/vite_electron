const { app: electronApp, BrowserWindow, Menu,dialog,ipcMain,
  Notification,powerMonitor,screen, nativeTheme,BrowserView
 } = require('electron');
import path from 'path'
const _ = require('lodash');
const Conf={
    mainServer : {
        protocol: 'file://',
        indexPath: '/public/dist/index.html',
        host: '127.0.0.1',
        port: 7072,
      }
    
}
/**
 *  API操作
 * @class
 */
class ElectronAPI   {
   
  /**
   * 所有方法接收两个参数
   * @param args 前端传的参数
   * @param event - ipc通信时才有值。详情见：控制器文档
   */

  /**
   * 消息提示对话框
   */
  messageShow() {
    dialog.showMessageBoxSync({
      type: 'info', // "none", "info", "error", "question" 或者 "warning"
      title: '自定义标题-message',
      message: '自定义消息内容',
      detail: '其它的额外信息'
    })
    return '打开了消息框';
  }
  /**
   * 消息提示与确认对话框
   */
  messageShowConfirm() {
    const res = dialog.showMessageBoxSync({
      type: 'info',
      title: '自定义标题-message',
      message: '自定义消息内容',
      detail: '其它的额外信息',
      cancelId: 1, // 用于取消对话框的按钮的索引
      defaultId: 0, // 设置默认选中的按钮
      buttons: ['确认', '取消'], // 按钮及索引
    })
    let data = (res === 0) ? '点击确认按钮' : '点击取消按钮';
    return data;
  }

  /**
   * 选择目录
   */
    selectFolder() {
      const filePaths = dialog.showOpenDialogSync({
        properties: ['openDirectory', 'createDirectory']
      });
  
      if (_.isEmpty(filePaths)) {
        return null
      }
  
      return filePaths[0];
    } 
   /**
   * 打开目录
   */
   openDirectory(args) {
    if (!args.id) {
      return false;
    }
    let dir = '';
    if (path.isAbsolute(args.id)) {
      dir = args.id;
    } else {
      dir = electronApp.getPath(args.id);
    }

    shell.openPath(dir);
    return true;
  }
  /**
   * 选择图片
   */
  selectPic() {
    const filePaths = dialog.showOpenDialogSync({
      title: 'select pic',
      properties: ['openFile'],
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
      ]
    });
    if (_.isEmpty(filePaths)) {
      return null
    }

    return filePaths[0];
  }   

  /**
   * 加载视图内容
   */
  loadViewContent(args) {
    const { type, content } = args;
    let contentUrl = content;
    if (type == 'html') {
      contentUrl = path.join('file://', electronApp.getAppPath(), content);
    }

   createBrowserView(contentUrl);

    return true
  }

  /**
   * 移除视图内容
   */
  removeViewContent() {
   removeBrowserView();
    return true
  }  

  /**
   * 打开新窗口
   */
  createWindow(args) {
    const { type, content, windowName,width,height, windowTitle } = args;
    let contentUrl = null;
    if (type == 'html') {
      contentUrl =path.resolve(__dirname, "../public/html/view_example.html")// path.join('file://', electronApp.getAppPath(), content)
    } else if (type == 'web') {
      contentUrl = content;
    } else if (type == 'vue') {
      let addr = process.env.VITE_DEV_SERVER_URL
      if (isProd()) {
        const mainServer = Conf.mainServer;
        if (isFileProtocol(mainServer)) {
          addr = mainServer.protocol + path.join(getHomeDir(), mainServer.indexPath);
        } else {
          addr = mainServer.protocol + mainServer.host + ':' + mainServer.port;
        }
      }
      contentUrl = addr + content;
    } else {
      // some
    }
    console.log('contentUrl: ', contentUrl);
    // const win = Addon.get('window').create(windowName, opt);
      const win = Window.createMainWindow();
      const size = {
        width: width || 980,
        height: height || 650
      }
      win.setSize(size.width, size.height);
      win.setResizable(true);
      win.setTitle(windowTitle);
       const winContentsId = win.webContents.id;
    // load page
      win.loadURL(contentUrl);
      win.show()
      //程序间通信
      BrowserWindow.fromId(1).webContents.send('sendtosubwin', -1);
      ipcMain.on('frommainwin', function(event, arg) {
        console.log("在os.js文件日志",arg);  // prints "我是渲染进程的test2"
        event.sender.send('sendtosubwin', '收到消息回复-我是主进程的test1');
      });
    return winContentsId;
  }
  /**
   * 获取主窗口ID
   */
  getWCid(){
    const maindata=BrowserWindow.getMainWindow
    console.log("获取主窗口ID",maindata)
  }
  /**
   * 创建系统通知
   */
  sendNotification(args, event) {
    const { title, subtitle, body, silent} = args;

    if (!Notification.isSupported()) {
      return '当前系统不支持通知';
    }

    let options = {};
    if (!_.isEmpty(title)) {
      options.title = title;
    }
    if (!_.isEmpty(subtitle)) {
      options.subtitle = subtitle;
    }
    if (!_.isEmpty(body)) {
      options.body = body;
    }
    if (!_.isEmpty(silent)) {
      options.silent = silent;
    }
    const channel = 'os.sendNotification';
    var myNotification = new Notification(options);
    if (options.clickEvent) {
       myNotification.on('click', (e) => {
        let data = {
          type: 'click',
          msg: '您点击了通知消息'
        }
        event.reply(`${channel}`, data)
      });
    }
    if (options.closeEvent) {
      myNotification.on('close', (e) => {
        let data = {
          type: 'close',
          msg: '您关闭了通知消息'
        }
        event.reply(`${channel}`, data)
      });
    }
    myNotification.show();
    return true
  }  

  /**
   * 电源监控
   */
  initPowerMonitor(args, event) {
    const channel = 'os.initPowerMonitor';
    powerMonitor.on('on-ac', (e) => {
      let data = {
        type: 'on-ac',
        msg: '接入了电源'
      }
      console.log("供电：",data)
      event.reply(`${channel}`, data)
    });

    powerMonitor.on('on-battery', (e) => {
      let data = {
        type: 'on-battery',
        msg: '使用电池中'
      }
      event.reply(`${channel}`, data)
    });

    powerMonitor.on('lock-screen', (e) => {
      let data = {
        type: 'lock-screen',
        msg: '锁屏了'
      }
      event.reply(`${channel}`, data)
    });

    powerMonitor.on('unlock-screen', (e) => {
      let data = {
        type: 'unlock-screen',
        msg: '解锁了'
      }
      event.reply(`${channel}`, data)
    });

    return true
  }  

  /**
   * 获取屏幕信息
   */
  getScreen(args) {
    let data = [];
    let res = {};
    if (args == 0) {
      let res = screen.getCursorScreenPoint();
      data = [
        {
          title: '横坐标',
          desc: res.x
        },
        {
          title: '纵坐标',
          desc: res.y
        },
      ]
      
      return data;
    }
    if (args == 1) {
      res = screen.getPrimaryDisplay();
    }
    if (args == 2) {
      let resArr = screen.getAllDisplays();
      // 数组，只取一个吧
      res = resArr[0];
    }
    // Log.info('[electron] [ipc] [example] [getScreen] res:', res);
    data = [
      {
        title: '分辨率',
        desc: res.bounds.width + ' x ' + res.bounds.height
      },
      {
        title: '单色显示器',
        desc: res.monochrome ? '是' : '否'
      },
      {
        title: '色深',
        desc: res. colorDepth
      },
      {
        title: '色域',
        desc: res.colorSpace
      },
      {
        title: 'scaleFactor',
        desc: res.scaleFactor
      },
      {
        title: '加速器',
        desc: res.accelerometerSupport
      },
      {
        title: '触控',
        desc: res.touchSupport == 'unknown' ? '不支持' : '支持'
      },
    ]

    return data;
  }

  /**
   * 获取系统主题
   */
  getTheme() {
    let theme = 'system';
    if (nativeTheme.shouldUseDarkColors) {
      theme = 'dark';
    } else {
      theme = 'light';
    }
    return theme;
  }

  /**
   * 设置系统主题
   */
  setTheme(args) {
    // TODO 好像没有什么明显效果
    nativeTheme.themeSource = args;
    return args;
  }  
  
}
ElectronAPI.toString = () => '[class]';
module.exports = ElectronAPI;  




function isProd() {
  return (process.env.EE_SERVER_ENV === 'prod');
}
  /**
   * isFileProtocol
   */
  function isFileProtocol(config) {
    if (config.protocol == 'file://') {
      return true;
    }
    return false;
  }
/**
 * 获取home路径
 */
  function getHomeDir () {
    return process.env.EE_HOME;
  }
  //窗口
const EEMainWindow = Symbol('Eg#electron#mainWindow');
const Window = {
  /**
   * 获取 mainWindow
   */
  getMainWindow() {
    if (!this[EEMainWindow]) {
      this[EEMainWindow] = this.createMainWindow();
    }
    return this[EEMainWindow] || null;
  },

  /**
   * 创建应用主窗口
   */
  createMainWindow() {
    var iconpath="../dist/logo.ico"
    if (process.env.VITE_DEV_SERVER_URL) {
        iconpath="../public/logo.ico"
    } 
    const config_windowsOption = {
      title: '登录',
      width: 980,
      height: 650,
      minWidth: 400,
      minHeight: 300,
      webPreferences: {
        webSecurity: false,
        contextIsolation: false, // false -> 可在渲染进程中使用electron的api，true->需要bridge.js(contextBridge)
        nodeIntegration: true,
      },
      frame: true,
      show: false,
      icon: path.join(__dirname, iconpath),
    };
    const win = new BrowserWindow(config_windowsOption);
    this[EEMainWindow] = win;
    // 菜单显示/隐藏
    Menu.setApplicationMenu(null);
    this[EEMainWindow] = win;
    return win;
  },

  /**
   * 还原窗口
   */
  restoreMainWindow() {
    if (this[EEMainWindow]) {
      if (this[EEMainWindow].isMinimized()) {
        this[EEMainWindow].restore();
      }
      this[EEMainWindow].show();
      this[EEMainWindow].focus();
    }
  }
};
  /**
   * createBrowserView
   */
  var myBrowserView 
  function createBrowserView(contentUrl) {
    // electron 实验性功能，慎用
    const win = Window.getMainWindow();
    myBrowserView= new BrowserView();
    win.setBrowserView(myBrowserView);
    myBrowserView.setBounds({
      x: 300,
      y: 170,
      width: 650,
      height: 400
    });
    myBrowserView.webContents.loadURL(contentUrl);
  }
    /**
   * removeBrowserView
   */
  function removeBrowserView() {
    myBrowserView.webContents.destroy();
  }