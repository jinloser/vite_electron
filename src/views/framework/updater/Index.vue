<template>
  <div id="app-demo-window">
    <div class="one-block-1">
      <span>
        1. 自动更新
      </span>
    </div>  
    <div class="one-block-2">
      <a-space>
        <a-button @click="checkForUpdater()">检查更新</a-button>
        <a-button @click="download()">下载并安装</a-button>
      </a-space>
    </div>
    <div class="one-block-1">
      <span>
        2. 下载进度
      </span>
    </div>  
    <div class="one-block-2">
      <a-progress :percent="percentNumber" status="active" />
      <a-space>
        {{ progress }}
      </a-space>
    </div>
    <div class="one-block-1">
      <span>
        3. 重启
      </span>
    </div>  
    <div class="one-block-2">
      <a-space>
        <a-button @click="relaunchApp()">重启应用</a-button>
      </a-space>
    </div>
  </div>
</template>
<script>
import { ipcApiRoute, specialIpcRoute } from '@/utils/ipcMainApi';
import { ipc } from '@/utils/ipcRenderer';
export default {
  data() {
    return {
      status: 0, // -1:异常，1：有可用更新，2：没有可用更新，3：下载中, 4：下载完成
      progress: '',
      percentNumber: 0.1,
      progressInterval:null,
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      ipc.removeAllListeners(specialIpcRoute.appUpdater);
      ipc.on(specialIpcRoute.appUpdater, (event, result) => {
        result = JSON.parse(result);
        this.status = result.status;
        if (result.status == 3) {
          this.progress = result.desc;
          this.percentNumber = result.percentNumber;
        } else {
          this.$message.info(result.desc);
        }
      })
    },
    checkForUpdater () {
      ipc.invoke(ipcApiRoute.checkForUpdater).then(r => {
        console.log(r);
      })
    },
    download () {
       const INTERVAL_DELAY = 1000 // ms
      let count = 0.1
      this.progressInterval = setInterval(() => {
        if(count){
          ipc.invoke(ipcApiRoute.downProgress,count).then(r => {
            count =r
            this.percentNumber=r
            console.log("下载进度：",count);
            if(count>=1){
              ipc.invoke(ipcApiRoute.downProgress,-1)
              clearInterval( this.progressInterval)
            }
          })
        }
      }, INTERVAL_DELAY)
      if (this.status !== 1) {
        this.$message.info('没有可用版本');
        return
      }
      ipc.invoke(ipcApiRoute.downloadApp).then(r => {
        console.log(r);
      })
    },
    //重启应用
    relaunchApp(){
      ipc.invoke(ipcApiRoute.relaunchApp).then(r => {
        console.log(r);
        this.$message.info('重启应用了');
      })
    }
  },
  beforeRouteLeave(){
    clearInterval( this.progressInterval)
  }
};
</script>
<style lang="less" scoped>
#app-demo-window {
  padding: 0px 10px;
  text-align: left;
  width: 100%;
  .one-block-1 {
    font-size: 16px;
    padding-top: 10px;
  }
  .one-block-2 {
    padding-top: 10px;
  }
}
</style>
