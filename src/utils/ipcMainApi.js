
/**
 * 主进程与渲染进程通信频道定义
 * Definition of communication channels between main process and rendering process
 */
const ipcApiRoute = {
  // framework
  test: 'example.test',
  checkForUpdater: 'framework.checkForUpdater',
  downloadApp: 'framework.downloadApp',
  relaunchApp: 'framework.relaunchApp',
  downProgress: 'framework.downProgress',
  jsondbOperation: 'framework.jsondbOperation',
  sqlitedbOperation: 'framework.sqlitefdbOperastion',
  uploadFile: 'framework.uploadFile',
  checkHttpServer: 'framework.checkHttpServer',
  doHttpRequest: 'framework.doHttpRequest',
  doSocketRequest: 'framework.doSocketRequest',
  ipcInvokeMsg: 'effect.showMessage',
  ipcSendSyncMsg: 'framework.ipcSendSyncMsg',
  ipcSendMsg: 'framework.ipcSendMsg',
  startJavaServer: 'framework.startJavaServer',
  closeJavaServer: 'framework.closeJavaServer',
  timerJobProgress: 'framework.timerJobProgress',
  createPool: 'framework.createPool',
  createPoolNotice: 'framework.createPoolNotice',
  someJobByPool: 'framework.someJobByPool',
  hello: 'framework.hello',
  openSoftware: 'framework.openSoftware', 

  // os
  messageShow: 'os.messageShow',
  messageShowConfirm: 'os.messageShowConfirm',
  selectFolder: 'os.selectFolder',
  selectPic: 'os.selectPic',
  openDirectory: 'os.openDirectory',
  loadViewContent: 'os.loadViewContent',
  removeViewContent: 'os.removeViewContent',
  createWindow: 'os.createWindow',
  getWCid: 'os.getWCid',
  sendNotification: 'os.sendNotification',
  initPowerMonitor: 'os.initPowerMonitor',
  getScreen: 'os.getScreen',
  autoLaunch: 'os.autoLaunch',
  setTheme: 'os.setTheme',
  getTheme: 'os.getTheme',

  // hardware
  getPrinterList: 'hardware.getPrinterList',
  print: 'hardware.print',
  printStatus: 'hardware.printStatus',

  // effect
  selectFile: 'effect.selectFile',
  loginWindow: 'effect.loginWindow',
  restoreWindow: 'effect.restoreWindow',
}

/**
 * 自定义频道
 * custom chennel
 */
const specialIpcRoute = {
  appUpdater: 'app.updater', // updater channel
  window1ToWindow2: 'window1-to-window2', // windows channel
  window2ToWindow1: 'window2-to-window1', // windows channel
}

export {
  ipcApiRoute, specialIpcRoute
}

