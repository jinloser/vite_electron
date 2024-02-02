<template>
  <div id="app-hw-bluetooth">
    <div class="one-block-1">
      <span> 1. 打印机设备 </span>
    </div>
    <div class="one-block-2">
      <a-button @click="getPrinter()"> 获取打印机列表 </a-button>
    </div>
    <div class="one-block-2">
      <a-list size="small" bordered :data="states.printerList">
        <template #item="{ item }">
          <a-list-item>
            {{ item.displayName }} {{ defaultDevice(item) }}
          </a-list-item>
        </template>
        <template #header>
          <div>设备列表</div>
        </template>
      </a-list>
    </div>
    <div class="one-block-1">
      <span> 2. 打印内容 </span>
    </div>
    <div class="one-block-2">
      <a-button @click="doPrint(0)"> 打印一个页面 </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { CommonObjectType } from '@/definations';
import { ipcApiRoute } from '@/utils/ipcMainApi';
import { ipc } from '@/utils/ipcRenderer';
import { Message } from '@arco-design/web-vue';
import { reactive, toRaw } from 'vue';

const states = reactive({
  defaultDeviceName: '',
  printerList: [],
  views: [
    {
      type: 'html',
      content: '/public/html/view_example.html',
    },
  ],
});

const init = () => {
  // 避免重复监听，或者将 on 功能写到一个统一的地方，只加载一次
  ipc.removeAllListeners(ipcApiRoute.printStatus);
  ipc.on(ipcApiRoute.printStatus, (_, result) => {
    console.log('result', result);
    Message.info('打印中...');
  });
};
init();
const getPrinter = () => {
  ipc.invoke(ipcApiRoute.getPrinterList, {}).then((res) => {
    console.log('打印机：', res);
    states.printerList = res;
  });
};
const doPrint = (index: number) => {
  console.log('defaultDeviceName:', states.defaultDeviceName);
  const params = {
    view: toRaw(states.views[index]),
    deviceName: states.defaultDeviceName,
  };
  ipc.send(ipcApiRoute.print, params);
};
const defaultDevice = (item: CommonObjectType) => {
  let desc = '';
  if (item.isDefault) {
    desc = '- 默认';
    states.defaultDeviceName = item.name;
  }

  return desc;
};
</script>
<style lang="less" scoped>
#app-hw-bluetooth {
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
