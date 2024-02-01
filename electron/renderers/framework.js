const { app: electronApp, BrowserWindow} = require('electron');
const { autoUpdater } = require("electron-updater");
import path from 'path'
import fs from 'fs'
const { exec } = require('child_process');
const dayjs = require('dayjs');
/**
 *  API操作
 * @class
 */
class ElectronAPI   {
   
  /**
   * 检测http服务是否开启
   */ 
  async checkHttpServer() {
   
    return  false;
  }
  /**
   * 检查是否有新版本
   */
  checkForUpdater() { 
    autoUpdater.checkForUpdates();
    return;
  }
  /**
   * 下载新版本
   */
    downloadApp() {
      autoUpdater.downloadUpdate();
      return;
    }
    
  /**
   * 下载进度
   */
  downProgress(c) {
      const INCREMENT = 0.03
      const win =BrowserWindow.getFocusedWindow();
      win.setProgressBar(c)
      if (c>-1&&c <1) {
        c += INCREMENT
      } else {
        c =-1
      }
      return c;
    }
    /**
     * 重启应用
     */
    relaunchApp(){
      // electronApp.relaunch()
      electronApp.relaunch();//重新启动
      electronApp.exit(0);//退出当前程序
    }
   /**
   * 调用其它程序（exe、bash等可执行程序）
   */
   openSoftware(softName) {
    if (!softName) {
      return false;
    }
    var dir="../dist/extraResources/"
    if (process.env.VITE_DEV_SERVER_URL) {
      dir="../public/extraResources/"
    } 
  
    let softwarePath = path.join(dir, softName);
    softwarePath= path.join(__dirname, softwarePath)
    // 检查程序是否存在
    if (!fs.existsSync(softwarePath)) {
      return false;
    }
    // 命令行字符串 并 执行
    let cmdStr = 'start ' + softwarePath;
    exec(cmdStr);
    return true;
  }  
  
  /**
   * 检测http服务是否开启
   */ 
  async checkHttpServer() {
    //内置http服务
    const httpServerConfig = {
     enable: false,
     https: {
       enable: false, 
       key: '/public/ssl/localhost+1.key',
       cert: '/public/ssl/localhost+1.pem'
     },
     protocol: 'http://',
     host: '127.0.0.1',
     port: 7071,
     cors: {
       origin: "*"
     },
     body: {
       multipart: true,
       formidable: {
         keepExtensions: true
       }
     },
     filterRequest: {
       uris:  [
         'favicon.ico'
       ],
       returnData: ''
     }
   };
    const url = httpServerConfig.protocol + httpServerConfig.host + ':' + httpServerConfig.port;

    const data = {
      enable: httpServerConfig.enable,
      server: url
    }
    return data;
  }

  /**
   * 一个http请求访问此方法
   */ 
  async doHttpRequest() {
    const { CoreApp } = EE;
    // http方法
    const method = CoreApp.request.method;
    // http get 参数
    let params = CoreApp.request.query;
    params = (params instanceof Object) ? params : JSON.parse(JSON.stringify(params));
    // http post 参数
    const body = CoreApp.request.body;

    const httpInfo = {
      method,
      params,
      body
    }
    Log.info('httpInfo:', httpInfo);

    if (!body.id) {
      return false;
    }
    const dir = electronApp.getPath(body.id);
    shell.openPath(dir);
    
    return true;
  } 
 
  /**
   * 一个socket io请求访问此方法
   */ 
  async doSocketRequest(args) {
    if (!args.id) {
      return false;
    }
    const dir = electronApp.getPath(args.id);
    shell.openPath(dir);
    
    return true;
  }
  
  /**
   * 异步消息类型
   */ 
  async ipcInvokeMsg(args, event) {
    let timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const data = args + ' - ' + timeNow;
    
    return data;
  }  

  /**
   * 同步消息类型
   */ 
  async ipcSendSyncMsg(args) {
    let timeNow = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const data = args + ' - ' + timeNow;
    return data;
  }  

  /**
   * 双向异步通信
   */
  async ipcSendMsg(args, event) {
    const { type, content } = args;
    const data = bothWayMessage(type, content, event);
    return data;
  }
   /**
   * json数据库操作
   */   
   async jsondbOperation(args) {
    const { action, info, delete_name, update_name, update_age, search_age, data_dir } = args;

    const data = {
      action,
      result: null,
      all_list: []
    };

    return data;
  }

}
ElectronAPI.toString = () => '[class]';
module.exports = ElectronAPI;  

 var myTimer
  /**
   * ipc通信(双向)
   */
  function bothWayMessage(type, content, event) {
    // 前端ipc频道 channel
    const channel = 'framework.ipcSendMsg';
    if (type == 'start') {
      // 每隔1秒，向前端页面发送消息
      // 用定时器模拟
       myTimer = setInterval(function(e, c, msg) {
        let timeNow = Date.now();
        let data = msg + ':' + timeNow;
        e.reply(`${c}`, data)
      }, 1000, event, channel, content)

      return '开始了'
    } else if (type == 'end') {
      clearInterval(myTimer);
      return '停止了'    
    } else {
      return 'ohther'
    }
  }