<template>
  <div id="app-base-db">
    <div class="one-block-1">
      <span> 1. sqlite本地数据库 </span>
    </div>
    <div class="one-block-2">
      <a-row>
        <a-col :span="8"> • 大数据量: 0-1024GB(单库) </a-col>
        <a-col :span="8"> • 高性能 </a-col>
        <a-col :span="8"> • 类mysql语法 </a-col>
      </a-row>
    </div>
    <div class="one-block-1">
      <span> 2. 数据目录 </span>
    </div>
    <div class="one-block-2">
      <a-row>
        <a-col :span="12">
          <a-input
            v-model="states.data_dir"
            :value="states.data_dir"
            addon-before="数据目录"
          />
        </a-col>
        <a-col :span="2"> </a-col>
        <a-col :span="5">
          <a-button @click="selectDir"> 修改目录 </a-button>
        </a-col>
        <a-col :span="5">
          <a-button @click="openDir"> 打开目录 </a-button>
        </a-col>
      </a-row>
    </div>
    <div class="one-block-1">
      <span> 3. 测试数据 </span>
    </div>
    <div class="one-block-2">
      <a-row>
        <a-col :span="24">
          {{ states.all_list }}
        </a-col>
      </a-row>
    </div>
    <div class="one-block-1">
      <span> 4. 添加数据 </span>
    </div>
    <div class="one-block-2">
      <a-row>
        <a-col :span="6">
          <a-input
            v-model="states.name"
            :value="states.name"
            addon-before="姓名"
          />
        </a-col>
        <a-col :span="3"> </a-col>
        <a-col :span="6">
          <a-input
            v-model="states.age"
            :value="states.age"
            addon-before="年龄"
          />
        </a-col>
        <a-col :span="3"> </a-col>
        <a-col :span="6">
          <a-button @click="sqlitedbOperation('add')"> 添加 </a-button>
        </a-col>
      </a-row>
    </div>
    <div class="one-block-1">
      <span> 4. 获取数据 </span>
    </div>
    <div class="one-block-2">
      <a-row>
        <a-col :span="6">
          <a-input
            v-model="states.search_age"
            :value="states.search_age"
            addon-before="年龄"
          />
        </a-col>
        <a-col :span="3"> </a-col>
        <a-col :span="6"> </a-col>
        <a-col :span="3"> </a-col>
        <a-col :span="6">
          <a-button @click="sqlitedbOperation('get')"> 查找 </a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          {{ states.userList }}
        </a-col>
      </a-row>
    </div>
    <div class="one-block-1">
      <span> 5. 修改数据 </span>
    </div>
    <div class="one-block-2">
      <a-row>
        <a-col :span="6">
          <a-input
            v-model="states.update_name"
            :value="states.update_name"
            addon-before="姓名(条件)"
          />
        </a-col>
        <a-col :span="3"> </a-col>
        <a-col :span="6">
          <a-input
            v-model="states.update_age"
            :value="states.update_age"
            addon-before="年龄"
          />
        </a-col>
        <a-col :span="3"> </a-col>
        <a-col :span="6">
          <a-button @click="sqlitedbOperation('update')"> 更新 </a-button>
        </a-col>
      </a-row>
    </div>
    <div class="one-block-1">
      <span> 6. 删除数据 </span>
    </div>
    <div class="one-block-2">
      <a-row>
        <a-col :span="6">
          <a-input
            v-model="states.delete_name"
            :value="states.delete_name"
            addon-before="姓名"
          />
        </a-col>
        <a-col :span="3"> </a-col>
        <a-col :span="6"> </a-col>
        <a-col :span="3"> </a-col>
        <a-col :span="6">
          <a-button @click="sqlitedbOperation('del')"> 删除 </a-button>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { CommonObjectType } from '@/definations';
import { ipcApiRoute } from '@/utils/ipcMainApi';
import { ipc } from '@/utils/ipcRenderer';
import { Message } from '@arco-design/web-vue';
import { reactive } from 'vue';

const states = reactive({
  name: '李四',
  age: '20',
  userList: ['空'],
  search_age: '20',
  update_name: '李四',
  update_age: '31',
  delete_name: '李四',
  all_list: ['空'],
  data_dir: '',
});

const init = () => {
  const params = {
    action: 'getDataDir',
  };
  ipc.invoke(ipcApiRoute.sqlitedbOperation, params).then((res) => {
    if (res.code == -1) {
      Message.error('请检查sqlite是否正确安装');
      return;
    }

    states.data_dir = res.result;
    getAllTestData();
  });
};
init();
const getAllTestData = () => {
  const params = {
    action: 'all',
  };
  ipc
    .invoke(ipcApiRoute.sqlitedbOperation, params)
    .then((res: CommonObjectType) => {
      if (res.all_list.length == 0) {
        return false;
      }
      states.all_list = res.all_list;
      return true;
    });
};
const selectDir = () => {
  ipc.invoke(ipcApiRoute.selectFolder, '').then((r) => {
    states.data_dir = r;
    // 修改数据目录
    modifyDataDir(r);
  });
};
const openDir = () => {
  console.log('dd:', states.data_dir);
  ipc.invoke(ipcApiRoute.openDirectory, { id: states.data_dir }).then((_) => {
    //
  });
};
const modifyDataDir = (dir) => {
  const params = {
    action: 'setDataDir',
    data_dir: dir,
  };
  ipc.invoke(ipcApiRoute.sqlitedbOperation, params).then((res) => {
    states.all_list = res.all_list;
  });
};
const sqlitedbOperation = (ac: string) => {
  const params = {
    action: ac,
    info: {
      name: states.name,
      age: parseInt(states.age),
    },
    search_age: parseInt(states.search_age),
    update_name: states.update_name,
    update_age: parseInt(states.update_age),
    delete_name: states.delete_name,
  };
  if (ac == 'add' && states.name.length == 0) {
    Message.error(`请填写数据`);
  }
  ipc.invoke(ipcApiRoute.sqlitedbOperation, params).then((res) => {
    console.log('res:', res);
    if (ac == 'get') {
      if (res.result.length == 0) {
        Message.error(`没有数据`);
        return;
      }
      states.userList = res.result;
    }
    if (res.all_list.length == 0) {
      states.all_list = ['空'];
      return;
    }
    states.all_list = res.all_list;
    Message.success(`success`);
  });
};
</script>
<style lang="less" scoped>
#app-base-db {
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
