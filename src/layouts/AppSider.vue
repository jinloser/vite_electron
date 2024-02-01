<template>
  <a-layout id="app-layout-sider">
    <a-layout-sider
      v-model="collapsed"
      theme="light"
      class="layout-sider"
      width="100"
    >
      <div class="logo">
        <img class="pic-logo" src="~@/assets/logo.png">
      </div>
      <a-menu 
        class="menu-item" 
        theme="light" 
        mode="inline"
        :selectedKeys ="[current]"
        @menu-item-click="menuHandle"
      >
        <a-menu-item v-for="(menuInfo, index) in menu" :key="index">
          <icon-font :type="menuInfo.icon" />
          {{ menuInfo.title }} 
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content class="layout-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>

export default {
  name: 'AppSider',
  data() {
    return {
      collapsed: true,
      current: 'menu_1',
      menu: {
        'menu_1' : {
          icon: 'icon-kuangjia',
          title: '框架',
          pageName: 'Framework',
          params: {
            // test: 'hello'
          },
        },
        'menu_2' : {
          icon: 'icon-xitongguanli',
          title: '系统',
          pageName: 'Os',
          params: {},
        },
        'menu_3' : {
          icon: 'icon-woshiyingjianchangjia',
          title: '硬件',
          pageName: 'Hardware',
          params: {},
        },
        'menu_4' : {
          icon: 'icon-UI-xuanzhong',
          title: '前端',
          pageName: 'vueui',
          params: {},
        },            
      }
    };
  },
  created () {
  },
  mounted () {
    this.menuHandle()
  },
  methods: {
    menuHandle (key) {
      console.log('sider menu key:', key);
      this.current = key ? key: this.current;

      const linkInfo = this.menu[this.current]
      this.$router.push({ name: linkInfo.pageName, params: linkInfo.params})
    },
    changeMenu(e) {
      console.log('sider menu e:', e);
      //this.current = e.key;
    }
  },
};
</script>
<style lang="less" scoped>
// 嵌套
#app-layout-sider {
  height: 100%;
  .logo {
    border-bottom: 1px solid var(--color-neutral-3);
  }
  .pic-logo {
    height: 32px;
    //background: rgba(139, 137, 137, 0.2);
    margin: 10px;
  }
  .layout-sider {
    border-top: 1px solid var(--color-neutral-3);
    border-right: 1px solid var(--color-neutral-3);
  }
  .menu-item {
    .arco-menu-item  {
      // background-color: var(--color-bg-white);
      margin-top: 5px;
      margin-bottom: 5px;
      padding: 0 8px !important;
      display: flex;
      align-items: center;
    }
  }
  .layout-content {
    //background-color: #fff;
    background: var(--color-menu-light-bg);
  }
}
:deep(.arco-menu .arco-menu-item .arco-icon){
  margin-right: 8px;
  display: inline-block;
}

</style>
