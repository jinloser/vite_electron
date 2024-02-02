<template>
  <div id="app-base-screen">
    <div class="one-block-1">
      <span> 1. 系统主题模式 </span>
    </div>
    <div class="one-block-2">
      <a-space>
        <a-button @click="getTheme()">获取模式</a-button>
      </a-space>
      <span> 结果：{{ states.currentThemeMode }} </span>
    </div>
    <div class="one-block-1">2. 设置主题模式（请自行实现前端UI效果）</div>
    <div class="one-block-2">
      <a-radio-group v-model="states.currentThemeMode" @change="setTheme">
        <a-radio :value="states.themeList[0]">
          {{ states.themeList[0] }}
        </a-radio>
        <a-radio :value="states.themeList[1]">
          {{ states.themeList[1] }}
        </a-radio>
        <a-radio :value="states.themeList[2]">
          {{ states.themeList[2] }}
        </a-radio>
      </a-radio-group>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ipcApiRoute } from '@/utils/ipcMainApi';
import { ipc } from '@/utils/ipcRenderer';
import { reactive } from 'vue';

const states = reactive({
  currentThemeMode: '',
  themeList: ['system', 'light', 'dark'],
});

const setTheme = (value) => {
  states.currentThemeMode = value;
  console.log('setTheme currentThemeMode:', states.currentThemeMode);

  ipc.invoke(ipcApiRoute.setTheme, states.currentThemeMode).then((result) => {
    console.log('result:', result);
    if (result == 'dark') {
      // 设置为暗黑主题
      document.body.setAttribute('arco-theme', 'dark');
    } else {
      // 恢复亮色主题
      document.body.removeAttribute('arco-theme');
    }
    states.currentThemeMode = result;
  });
};

const getTheme = () => {
  ipc.invoke(ipcApiRoute.getTheme).then((result) => {
    console.log('获取主题:', result);
    states.currentThemeMode = result;
  });
};

getTheme();
</script>
<style lang="less" scoped>
#app-base-screen {
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
