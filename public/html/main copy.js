import { app,Menu, BrowserWindow ,ipcMain,dialog} from 'electron';
import path from 'path'
import fs from 'fs'
import is from 'is-type-of'
const EGMainWindow = Symbol('Eg#electron#mainWindow');
app.whenReady().then(()=>{
   getMainWindow();
    // 主进程
    LoadApi()
})
  /**
   * 获取 mainWindow
   */
  const getMainWindow= () => {
    if (!this[EGMainWindow]) {
      this[EGMainWindow] = createdWindow();
    }
    return this[EGMainWindow] || null;
  }
const createdWindow = () => {
    var iconpath="../dist/logo.ico"
    if (process.env.VITE_DEV_SERVER_URL) {
        iconpath="../public/logo.ico"
    } 
    const win = new BrowserWindow({
        width:1300,
        height:900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation:false,
        },
        icon: path.join(__dirname, iconpath)
    })
    this[EGMainWindow] = win;
    //隐藏顶部菜单
    win.setMenu(null);
    if (process.platform === 'darwin') {//mac
        var mac_iconpath="../dist/logo.jpg"
        if (process.env.VITE_DEV_SERVER_URL) {
            iconpath="../public/logo.jpg"
        } 
        app.dock.setIcon(path.join(__dirname, mac_iconpath));
    }    
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        win.loadFile(path.resolve(__dirname, '../dist/index.html'));
    }
    return win;
}
//加载主进程函数
function LoadApi(){
  //批量注册API函数
  var API_directory="/dist"
  if (process.env.VITE_DEV_SERVER_URL) {
      API_directory="/dist-electron"
  }
  let baseDir = path.join(app.getAppPath(), API_directory);
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
        // console.log("main日志：fileObj",fileObj)
        const fns = {};
        const selfapp = new fileObj();
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
              console.error('[监听send/on失败/111行]:', e);
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
              console.error('[注册handle失败/120行]:', e);
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
