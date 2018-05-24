import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/views/Login'
import Home from '@/components/views/Home'
import Book from '@/components/views/Book'
import Manage from '@/components/views/Manage'
import history from '@/components/views/History'
import CheckIn from '@/components/views/CheckIn'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/book',
          name: 'book',
          component: Book
        },
        {
          path: '/manage',
          name: 'manage',
          component: Manage
        },
        {
          path: '/history',
          name: 'history',
          component: history
        }
      ]
    },
    {
      path: '/checkIn',
      name: 'checkIn',
      component: CheckIn
    }
  ],
  mode: 'history',
  base: '/dist/'
})
// 路由检测，如果没有登录记录则调回登录页面
router.beforeEach((to, from, next) => {
  if (!localStorage.token && to.name !== 'login') {
    router.push({name: 'login'})
  }
  next()
})

export default router
