
const { BrowserWindow, Menu,dialog } = require('electron');
const _ = require('lodash');
/**
 *  API操作
 * @class
 */
class ElectronAPI   {
  /**
   * 提示弹框
   * @param {*} someArgument 
   * @returns 
   */
  showMessage(someArgument){
    dialog.showMessageBoxSync({
      type: 'info', // "none", "info", "error", "question" 或者 "warning"
      title: '自定义标题-message',
      message: '自定义消息内容',
      detail: '其它的额外信息'
    })
     return someArgument
  }
  /**
   * 选择文件
   */
  selectFile() {
    const filePaths = dialog.showOpenDialogSync({
      properties: ['openFile']
    });

    if (_.isEmpty(filePaths)) {
      return null
    }
    return filePaths[0];
  }
    /**
   * login window
   */
    loginWindow(args) {
      const { width, height,windowTitle } = args;
      let win = BrowserWindow.getFocusedWindow()
      const size = {
        width: width || 400,
        height: height || 300
      }
      win.setSize(size.width, size.height);
      win.setResizable(true);
      win.setTitle(windowTitle);
      win.center();
      win.show();
      win.focus();
    }
  /**
   * restore window
   */
  restoreWindow(args) {
    const { width, height,windowTitle} = args;
    let win = BrowserWindow.getFocusedWindow()
    const size = {
      width: width || 980,
      height: height || 650
    }
    win.setSize(size.width, size.height);
    win.setResizable(true);
    win.setTitle(windowTitle);
    win.center();
    win.show();
    win.focus();
  }  
}

ElectronAPI.toString = () => '[class]';
module.exports = ElectronAPI;  