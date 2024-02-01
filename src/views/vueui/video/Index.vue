<template>
  <div id="app-effect-video">
    <div class="one-block-1">
      <span>
        1. 视频播放
      </span>
    </div>  
    <div class="one-block-2">
      <a-button @click="selectFile()"> 打开 / 浏览 </a-button>
    </div>
    <div class="one-block-2">
      <div id="video-player"></div>
    </div>    
  </div>
</template>
<script>
import { ipcApiRoute } from '@/utils/ipcMainApi';
import {ipc } from '@/utils/ipcRenderer';
import { toRaw } from 'vue';
import Player from 'xgplayer';
//西瓜视频文档https://v2.h5player.bytedance.com/gettingStarted/#%E5%AE%89%E8%A3%85
import { readConfig } from "@/utils/getConfig";
export default {
  data() {
    return {
      fileUrl: '',
      p: {},
      op: {
        id: 'video-player',
        volume: 0.3,
        url:'//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
        poster: "//lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg",
        playsinline: false,
        danmu: {
          comments: [
            {
              duration: 15000,
              id: '1',
              start: 3000,
              txt: '这是一个弹幕',
              style: {  //弹幕自定义样式
                color: '#ff9500',
                fontSize: '20px',
                // border: 'solid 1px #ff9500',
                borderRadius: '50px',
                padding: '15px 11px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }
          ],
          area: {
            start: 0,
            end: 1
          }
        },
      },
    };
  },
  mounted () {
    this.init();
  },    
  methods: {
    init () {
      this.p = new Player(toRaw(this.op));
    },  
    //选择本地文件  
   async selectFile () {
      var { baseURL }=await readConfig();
      this.$message.success({ content: `ws://${baseURL}/websocket` });
      ipc.invoke(ipcApiRoute.selectFile, {}).then((result) => {
          console.log('res:', result)
          if (result) {
            this.fileUrl = result;
            this.p.start(self.fileUrl);
          } else {
            this.$message.warning('请选择视频');
          }
      })
    },
  }
};
</script>
<style lang="less" scoped>
#app-effect-video {
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
