import { app,Menu,globalShortcut,BrowserWindow ,ipcMain,Tray} from 'electron';
import path from 'path'
import fs from 'fs'
import is from 'is-type-of'
app.whenReady().then(()=>{
   CreateMainWindow();
    // 主进程
    LoadApi()
    app.on('window-all-closed', (evt) => {
      app.quit() // 显示调用quit才会退出
      app.exit()
    });
})
const CreateMainWindow=()=>{
  var configdata =null
  if (process.env.VITE_DEV_SERVER_URL) {
     configdata = path.resolve(__dirname, "../resources");
  } else {
     configdata =  process.resourcesPath;
  }
  configdata =fs.readFileSync(path.join(configdata, 'config.conf'), {encoding:'utf8', flag:'r'})
  if(configdata){
    configdata= JSON.parse(configdata)
  }else{
    configdata=null
  }
  const mainWindow = EGWindow.getMainWindow(configdata);
  // 托盘图标
  var iconpath_str="../dist/"
  if (process.env.VITE_DEV_SERVER_URL) {
    iconpath_str="../public/"
  } 
 var iconPath= path.join(__dirname, iconpath_str+"logo.ico")
  mainWindow.setIcon(iconPath)
  if(configdata&&configdata.ShowTray){
      // 托盘菜单功能列表
      let trayMenuTemplate = [
        {
          label: '显示',
          icon: path.join(__dirname, iconpath_str+"open.png"),
          click: function () {
            mainWindow.show();
          }
        },
        {
          label: '退出',
          icon: path.join(__dirname, iconpath_str+"exit.png"),
          click: function () {
            app.exit()
          }
        }
      ]
      // 点击关闭，最小化到托盘
      mainWindow.on('close', (event) => {
        if (EGWindow.extra.closeWindow == true) {
          return;
        }
        mainWindow.hide();
        event.preventDefault();
      });
      // 实例化托盘
        var tray = new Tray(iconPath);
        if(configdata){
          tray.setToolTip(configdata.TrayTitle||"GoFly桌面框架");
        }
        const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
        tray.setContextMenu(contextMenu);
        tray.on('click', () => {
            mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
        })
  }
  if (process.env.VITE_DEV_SERVER_URL) {
      mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
      mainWindow.loadFile(path.resolve(__dirname, '../dist/index.html'));
  }
  var isopendev=false
  globalShortcut.register('Ctrl+Shift+I', () => {
    if(!isopendev){
      mainWindow.webContents.openDevTools()
    }else{
      mainWindow.webContents.closeDevTools()
    }
    isopendev=!isopendev
  })
  mainWindow.show();
}
/*****窗口工具 */
const EGWindow = {
  /**
   * extra
   */
  extra: {
    closeWindow: false,
  }, 
  /**
   * 获取 mainWindow
   */
  getMainWindow(configdata) {
    if (!BrowserWindow.fromId(1)) {
      return this.createMainWindow(configdata);
    }else{
      return  BrowserWindow.fromId(1)|| null;
    }
  },

  /**
   * 创建应用主窗口
   */
  createMainWindow(configdata) {
    let MainWinconfig =  {
      title: 'GoFly桌面框架',
      width:980,
      height: 650,
      webPreferences: {
        webSecurity: false,
        contextIsolation: false, // false -> 可在渲染进程中使用electron的api，true->需要bridge.js(contextBridge)
        nodeIntegration: true, // 允许html页面上的javascipt代码访问nodejs 环境api代码的能力
        enableRemoteModule: true //允许页面使用remote对象
      },
      frame: true,
      show: false,
    }
    if(configdata){
      MainWinconfig.width=configdata.MainWinWidth
      MainWinconfig.height=configdata.MainWinHeight
      MainWinconfig.title=configdata.MainwindowTitle
    }
    const win = new BrowserWindow(MainWinconfig);
    // 菜单显示/隐藏
    Menu.setApplicationMenu(null);
    return win;
  },

};
//加载主进程函数
function LoadApi(){
  //批量注册API函数
  let baseDir = path.join(app.getAppPath(), "/dist-electron");
  if (isEncrypt(app.getAppPath())) {
    baseDir = getEncryptDir(app.getAppPath());
  }
  const filePath = path.resolve(baseDir);
  fs.readdir(filePath, function (err, files) {
    if (err) return console.error('Error:(spec)', err)
    files.forEach((filename) => {
      const fullpath = path.join(filePath, filename);
      if (fs.statSync(fullpath).isFile()&&filename!="main.js"){
        let fileObj = loadFile(fullpath);
        const fns = {};
        //加载函数
        if(isBytecodeClass(fileObj)){
          let proto = fileObj.prototype;
          // 不遍历父类的方法
            const keys = Object.getOwnPropertyNames(proto);
            for (const key of keys) {
              if (key === 'constructor') {
                continue;
              }
              const d = Object.getOwnPropertyDescriptor(proto, key);
              if (is.function(d.value) && !fns.hasOwnProperty(key)) {
                fns[key] = 1;
              }
            }
        }
        const pathName = filename.split(".")[0] ;
        // console.log("main1日志"+filename+"：",pathName,fns)
        for (const key in fns) {
          let channel = pathName + '.' + key;
          console.log(filename+' register channel：%s', channel);
          // send/on 模型
          ipcMain.on(channel, async (event, params) => {
            try {
              const itemfullpath = path.join(filePath, filename);
              let itemfileObj = loadFile(itemfullpath);
             const Itemfn = new itemfileObj();
             const result = await Itemfn[key](params, event);
              event.returnValue = result;
              event.reply(`${channel}`, result);
            } catch(e) {
              console.error('[监听send/on失败/162行]:', e);
            }
          });
          // invoke/handle 模型
          ipcMain.handle(channel, async (event, params) => {
            try {
              const itemfullpath = path.join(filePath, filename);
              let itemfileObj = loadFile(itemfullpath);
              const Itemfn = new itemfileObj();
              const result = await Itemfn[key](params, event);
              return result;
            } catch(e) {
              console.error('[注册handle失败/174行]:', e);
              return e
            }
          });
        }
      }
    })
  })
}
//加载文件
function loadFile(filepath) {
  const BuiltinModule = require('module');
  const Module = module.constructor.length > 1
  ? module.constructor
  /* istanbul ignore next */
  : BuiltinModule;
  try {
    // if not js module, just return content buffer
    const extname = path.extname(filepath);
    if (extname && !Module._extensions[extname]) {
      return fs.readFileSync(filepath);
    }

    // require js module
    const obj = require(filepath);
    if (!obj) return obj;
    // it's es module
    if (obj.__esModule) return 'default' in obj ? obj.default : obj;
    return obj;
  } catch (err) {
    err.message = `[ee-core] load file: ${filepath}, error: ${err.message}`;
    throw err;
  }
}
  /**
   * 字节码类
   */
  function isBytecodeClass (exports) {
    let isClass = false;

    // 标识
    if (exports.toString().indexOf('[class') != -1) {
      isClass = true;
    }
    // TODO 更严谨的判断，应该加上文件名和路径
    
    return isClass;
  }
/**
 * is encrypt
 */
 function isEncrypt(basePath) {
  const encryptDir = getEncryptDir(basePath);
  if (fs.existsSync(encryptDir)) {
    return true;
  }
  return false;
}
/**
 * 获取加密文件路径
*/
function getEncryptDir(basePath) {
  const base = basePath || process.cwd();
  const dir = path.join(base, 'public', 'electron');
  return dir;
}
