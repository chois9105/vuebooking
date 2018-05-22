import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/views/Login'
import Home from '@/components/views/Home'
import Book from '@/components/views/Book'
import Manage from '@/components/views/Manage'
import history from '@/components/views/History'

Vue.use(Router)

export default new Router({
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
    }
  ],
  mode: 'history'
}).beforeEach((to, from, next) => {
  // 会在任意路由跳转前执行，next一定要记着执行，不然路由不能跳转了
  console.log('beforeEach')
  console.log(to, from)
  // if (localStorage.token === null) {
  //   this.$router.push({name: 'login'})
  // }
  next()
})
