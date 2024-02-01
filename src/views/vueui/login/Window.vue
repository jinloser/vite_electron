<template>
  <div id="vueui-login-window">
    <div class="block-1">
      <a v-if="!loading" >
        <a-form
          ref="loginForm"
          :model="userInfo"
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
            <a-input
              v-model="userInfo.username"
              placeholder="账号"
            >
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
              v-model="userInfo.password"
              placeholder="密码"
              allow-clear
            >
              <template #prefix>
                <icon-font type="icon-lock" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-button type="primary" html-type="submit" >
            登录
          </a-button>
        </a-form>
      </a>
      <span v-else>{{ loginText }}</span>
    </div>  
  </div>
</template>
<script>
import { ipcApiRoute } from '@/utils/ipcMainApi';
import { ipc } from '@/utils/ipcRenderer';
import { readConfig } from "@/utils/getConfig";
export default {
  data() {
    return {
      loading: false, 
      loginText: '正在登陆......',
      userInfo:{
        username: "",
         password:"",
      }
    };
  },
  methods: {
    handleSubmit({values, errors}) {
     if(!errors){
      this.loading = true;
      setTimeout(async() => {
        this.$router.push({ name: 'Framework', params: {}});
        var { MainWinWidth,MainWinHeight ,MainwindowTitle}=await readConfig();
        ipc.invoke(ipcApiRoute.restoreWindow, {width: MainWinWidth, height: MainWinHeight,windowTitle:MainwindowTitle}).then(r => {      
        })
      }, 1000);
     }
    }
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
  