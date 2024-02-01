<template>
  <a-layout id="app-menu">
    <a-layout-sider theme="light" class="layout-sider">
      <a-menu
        theme="light"
        mode="vertical"
        :selectedKeys="[states.current]"
        @menu-item-click="changeMenu"
      >
        <a-menu-item
          v-for="(menuInfo, subIndex) in states.menu"
          :key="subIndex"
        >
          <router-link
            :to="{ name: menuInfo.pageName, params: menuInfo.params }"
          >
            <span>{{ menuInfo.title }}</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { CommonObjectType } from '@/definations';
import { subMenu } from '@/router/subMenu';
import { reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
});

const states = reactive({
  menu: {} as CommonObjectType,
  //selectedKeys: ['menu_100'],
  current: 'menu_100',
  keys: [],
});

watch(
  () => props.id,
  () => {
    console.log('watch id ----- ', props.id);
    states.current = 'menu_100';
    menuHandle();
  }
);

const menuHandle = () => {
  // 该组件优先被加载了，所以没拿到参数
  console.log('params:', route);
  console.log('menu ------ id:', props.id);
  states.menu = subMenu[props.id];
  const linkInfo = states.menu[states.current];
  router.push({ name: linkInfo.pageName, params: linkInfo.params });
};
const changeMenu = (key) => {
  states.current = key;
  menuHandle();
};

menuHandle();
</script>
<style lang="less" scoped>
#app-menu {
  height: 100%;
  text-align: center;
  .layout-sider {
    border-top: 1px solid var(--color-neutral-3);
    border-right: 1px solid var(--color-neutral-3);
    // background-color: #FAFAFA;
    overflow: auto;
  }
}
</style>
