// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import App from './App'
import store from './store'
import router from './router'
// 引入echarts
import echarts from 'echarts'

//配置基础路径
axios.defaults.baseURL = 'http://localhost:5050'
Vue.prototype.axios = axios;



//一般都要加个$加到vue的原型链上，方便引用
Vue.prototype.$echarts = echarts


Vue.config.productionTip = false
Vue.use(ElementUI);



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
