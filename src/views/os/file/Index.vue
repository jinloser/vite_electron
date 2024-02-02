<template>
  <div id="app-base-file">
    <div class="one-block-1">
      <span> 1. 系统原生对话框 </span>
    </div>
    <div class="one-block-2">
      <a-space>
        <a-button @click="messageShow()">消息提示(ipc)</a-button>
        <a-button @click="messageShowConfirm()">消息提示与确认(ipc)</a-button>
      </a-space>
    </div>
    <div class="one-block-1">
      <span> 2. 选择保存目录 </span>
    </div>
    <div class="one-block-2">
      <a-row>
        <a-col :span="12">
          <a-input
            v-model="states.dir_path"
            :value="states.dir_path"
            addon-before="保存目录"
          />
        </a-col>
        <a-col :span="12">
          <a-button @click="selectDir"> 修改目录 </a-button>
        </a-col>
      </a-row>
    </div>
    <div class="one-block-1">
      <span> 3. 打开文件夹 </span>
    </div>
    <div class="one-block-2">
      <a-list :grid="{ gutter: 16, column: 4 }" :data-source="states.file_list">
        <template #renderItem="{ item }">
          <a-list-item @click="openDirectry(item.id)">
            <a-card :title="item.content">
              <a-button type="primary"> 打开 </a-button>
            </a-card>
          </a-list-item>
        </template>
        <!-- <a-list-item slot="renderItem" slot-scope="item" @click="openDirectry(item.id)">
          <a-card :title="item.content">
            <a-button type="link">
              打开
            </a-button>
          </a-card>
        </a-list-item> -->
      </a-list>
    </div>
    <div class="one-block-1">
      <span> 4. 上传文件到图床 </span>
    </div>
    <div class="one-block-2">
      <a-upload-dragger
        name="file"
        :multiple="true"
        :action="states.action_url"
        @change="handleFileChange"
      >
        <p class="ant-upload-drag-icon"></p>
        <p class="ant-upload-text">点击 或 拖拽文件到这里</p>
        <p class="ant-upload-hint">注意：请使用您自己的图床token</p>
      </a-upload-dragger>
    </div>
    <div class="footer"></div>
  </div>
</template>
<script lang="ts" setup>
import { CommonArrayType, CommonObjectType } from '@/definations';
import { ipcApiRoute } from '@/utils/ipcMainApi';
import { ipc } from '@/utils/ipcRenderer';
import { Message } from '@arco-design/web-vue';
import storage from 'store2';
import { reactive } from 'vue';

const fileList = [
  {
    content: '【下载】目录',
    id: 'downloads',
  },
  {
    content: '【图片】目录',
    id: 'pictures',
  },
  {
    content: '【文档】目录',
    id: 'documents',
  },
  {
    content: '【音乐】目录',
    id: 'music',
  },
];

const states = reactive({
  file_list: fileList,
  action_url: '',
  image_info: [] as CommonArrayType,
  num: 0,
  servicAddress: '',
  dir_path: 'D:\\www\\ee',
});

const getHost = () => {
  ipc.invoke(ipcApiRoute.checkHttpServer, {}).then((r) => {
    if (r.enable) {
      states.servicAddress = r.server;
      storage.set('httpServiceConfig', r);

      // url转换
      const host = r.server || 'http://localhost:7071';
      let uri = ipcApiRoute.uploadFile;
      let url = uri.split('.').join('/');
      states.action_url = host + '/' + url;
    }
  });
};
getHost();
const openDirectry = (id: string) => {
  ipc.invoke(ipcApiRoute.openDirectory, { id: id }).then((res) => {
    console.log('res:', res);
  });
};
const selectDir = () => {
  ipc.invoke(ipcApiRoute.selectFolder, '').then((r) => {
    states.dir_path = r;
    Message.info(r);
  });
};
const messageShow = () => {
  ipc.invoke(ipcApiRoute.messageShow, '').then((r) => {
    Message.info(r);
  });
};
const messageShowConfirm = () => {
  ipc.invoke(ipcApiRoute.messageShowConfirm, '').then((r) => {
    Message.info(r);
  });
};
const handleFileChange = (info: CommonObjectType) => {
  console.log('handleFileChange-----');
  if (states.action_url == '') {
    Message.error('http服务未开启');
    return;
  }
  const status = info.file.status;
  if (status !== 'uploading') {
    console.log(info.file);
  }
  if (status === 'done') {
    const uploadRes = info.file.response;
    console.log('uploadRes:', uploadRes);
    if (uploadRes.code !== 'success') {
      Message.error(`file upload failed ${uploadRes.code} .`);
      return false;
    }
    states.num++;
    const picInfo: CommonObjectType = uploadRes.data;
    picInfo.id = states.num;
    picInfo.imageUrlText = 'image url';
    states.image_info.push(picInfo);
    Message.success(`${info.file.name} file uploaded successfully.`);
  } else if (status === 'error') {
    Message.error(`${info.file.name} file upload failed.`);
  }
  return true;
};
</script>
<style lang="less" scoped>
#app-base-file {
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
  .footer {
    padding-top: 10px;
  }
}
</style>
