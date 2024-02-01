import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import Router from './router/index';
import components from './components/icons';

//引入
const app = createApp(App);
// components
for (const i in components) {
    app.component(i, components[i])
  }
app.use(ArcoVue).use(Router).mount('#app');