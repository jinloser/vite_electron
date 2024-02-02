<template>
  <div id="app-base-httpserver">
    <div class="one-block-1">
      <span> 1. 使用http与主进程通信 </span>
    </div>
    <div class="one-block-2">
      <p>* 状态：{{ states.currentStatus }}</p>
      <p>* 地址：{{ states.servicAddress }}</p>
      <p>
        * 发送请求：
        <a-button @click="sendRequest('pictures')"> 打开【我的图片】 </a-button>
      </p>
    </div>
    <div class="one-block-1">
      <span> 2. 使用http与服务端通信 </span>
    </div>
    <div class="one-block-2">
      <p>
        <a-button @click="backendRequest()"> 发送请求 </a-button>
        （请自行创建服务）
      </p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { CommonObjectType } from '@/definations';
import { ipcApiRoute } from '@/utils/ipcMainApi';
import { ipc } from '@/utils/ipcRenderer';
import { Message } from '@arco-design/web-vue';
import axios from 'axios';
import storage from 'store2';
import { reactive } from 'vue';

const states = reactive({
  currentStatus: '关闭',
  servicAddress: '无',
});

const init = () => {
  ipc.invoke(ipcApiRoute.checkHttpServer, {}).then((r) => {
    if (r.enable) {
      states.currentStatus = '开启';
      states.servicAddress = r.server;
      storage.set('httpServiceConfig', r);
    }
  });
};

init();
const sendRequest = (id) => {
  if (states.currentStatus == '关闭') {
    Message.error('http服务未开启');
    return;
  }

  requestHttp(ipcApiRoute.doHttpRequest, { id }).then(
    (res: CommonObjectType) => {
      console.log('res:', res);
    }
  );
};

/**
 * Accessing built-in HTTP services
 */
const requestHttp = (uri: string, parameter: CommonObjectType) => {
  // URL conversion
  const config = storage.get('httpServiceConfig');
  const host = config.server || 'http://localhost:7071';
  let url = uri.split('.').join('/');
  url = host + '/' + url;
  console.log('url:', url);
  return axios({
    url: url,
    method: 'post',
    data: parameter,
    timeout: 60000,
  });
};

/**
 * Send back-end requests
 */
const backendRequest = () => {
  console.log('GO_URL:', import.meta.env.VITE_GO_URL);
  const cfg = {
    baseURL: import.meta.env.VITE_GO_URL,
    method: 'get',
    url: '/hello',
    timeout: 60000,
  };
  axios(cfg).then((res) => {
    console.log('res:', res);
    const data = res.data || null;
    Message.info(`go服务返回: ${data}`);
  });
};
</script>
<style lang="less" scoped>
#app-base-httpserver {
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
