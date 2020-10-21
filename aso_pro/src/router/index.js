import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import control from '@/views/aso_control'
import login from '@/views/login'
import register from '@/views/register'
import forget from '@/views/forget'
import success from '@/views/success'
import main from '@/views/main'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/control',
      name: 'control',
      component: control
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/forget',
      name: 'forget',
      component: forget
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/success/:last',
      name: 'success',
      component: success
    },
    // 主页
    {
      path: '/',
      name: 'main',
      component: main
    },
  ]
})
