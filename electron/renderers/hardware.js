const { app: electronApp, BrowserWindow, Menu,dialog } = require('electron');
import path from 'path'
/**
 *  API操作
 * @class
 */
class ElectronAPI   {
 
  /**
   * 获取打印机列表
   */
  async getPrinterList () {

    //主线程获取打印机列表
    const win =BrowserWindow.getFocusedWindow();
    const list = await win.webContents.getPrintersAsync();
    return list;
  }  

  /**
   * 打印
   */
  print (args, event) {
    const { view, deviceName } = args;
    let content = null;
    if (view.type == 'html') {
      content = path.join('file://', process.env.EE_HOME, view.content)
    } else {
      content = view.content;
    }

    let opt = {
      title: 'printer window',
      x: 10,
      y: 10,
      width: 980, 
      height: 650 
    }
    const name = 'window-printer';
    const printWindow = Addon.get('window').create(name, opt);

    printWindow.loadURL(content);
    printWindow.webContents.once('did-finish-load', () => {
      // 页面完全加载完成后，开始打印
      printWindow.webContents.print({
        silent: false, // 显示打印对话框
        printBackground: true,
        deviceName,
      }, (success, failureReason) => {
        const channel = 'controller.hardware.printStatus';
        event.reply(`${channel}`, { success, failureReason });
        printWindow.close();
      });
    });

    return true;
  }  
  
}
ElectronAPI.toString = () => '[class]';
module.exports = ElectronAPI;  