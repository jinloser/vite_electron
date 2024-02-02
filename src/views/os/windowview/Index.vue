<template>
  <div id="app-base-window-view">
    <div class="one-block-1">
      <span> 1. 嵌入web内容 </span>
    </div>
    <div class="one-block-2">
      <a-space>
        <a-button @click="loadViewContent(0)">加载百度页面</a-button>
        <a-button @click="removeViewContent(0)">移除百度页面</a-button>
      </a-space>
    </div>
    <div class="one-block-1">
      <span> 2. 嵌入html内容 </span>
    </div>
    <div class="one-block-2">
      <a-space>
        <a-button @click="loadViewContent(1)">加载html页面</a-button>
        <a-button @click="removeViewContent(1)">移除html页面</a-button>
      </a-space>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ipcApiRoute } from '@/utils/ipcMainApi';
import { ipc } from '@/utils/ipcRenderer';
import { reactive, toRaw } from 'vue';

const states = reactive({
  views: [
    {
      type: 'web',
      content: 'https://www.baidu.com/',
    },
    {
      type: 'html',
      content: '/public/html/view_example.html',
    },
  ],
});

const loadViewContent = (index: number) => {
  ipc
    .invoke(ipcApiRoute.loadViewContent, toRaw(states.views[index]))
    .then((r) => {
      console.log(r);
    });
};
const removeViewContent = (index: number) => {
  ipc
    .invoke(ipcApiRoute.removeViewContent, toRaw(states.views[index]))
    .then((r) => {
      console.log(r);
    });
};
</script>
<style lang="less" scoped>
#app-base-window-view {
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
