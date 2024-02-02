<template>
  <div id="vueui-login-window">
    <div class="block-1">
      <a v-if="!states.loading">
        <a-form
          ref="loginForm"
          :model="states.userInfo"
          class="login-form"
          layout="vertical"
          @submit="handleSubmit"
        >
          <a-form-item
            field="username"
            :rules="[{ required: true, message: '请输入账号' }]"
            :validate-trigger="['change', 'blur']"
            hide-label
          >
            <a-input v-model="states.userInfo.username" placeholder="账号">
              <template #prefix>
                <icon-font type="icon-zhanghao" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item
            field="password"
            :rules="[{ required: true, message: '请输入密码' }]"
            :validate-trigger="['change', 'blur']"
            hide-label
          >
            <a-input-password
              v-model="states.userInfo.password"
              placeholder="密码"
              allow-clear
            >
              <template #prefix>
                <icon-font type="icon-lock" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-button type="primary" html-type="submit"> 登录 </a-button>
        </a-form>
      </a>
      <span v-else>{{ states.loginText }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ipcApiRoute } from '@/utils/ipcMainApi';
import { ipc } from '@/utils/ipcRenderer';
import { readConfig } from '@/utils/getConfig';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const states = reactive({
  loading: false,
  loginText: '正在登陆......',
  userInfo: {
    username: '',
    password: '',
  },
});

const handleSubmit = ({ errors }) => {
  if (!errors) {
    states.loading = true;
    setTimeout(async () => {
      router.push({ name: 'Framework', params: {} });
      var { MainWinWidth, MainWinHeight, MainwindowTitle } = await readConfig();
      ipc
        .invoke(ipcApiRoute.restoreWindow, {
          width: MainWinWidth,
          height: MainWinHeight,
          windowTitle: MainwindowTitle,
        })
        .then((r) => {
          console.log(r);
        });
    }, 1000);
  }
};
</script>
<style lang="less" scoped>
#vueui-login-window {
  width: 100%;
  min-height: 100%;
  background: var(--color-menu-light-bg);
  display: flex;
  .block-1 {
    font-size: 16px;
    align-items: center;
    margin: auto;
    display: inline-block;
  }
}
</style>
