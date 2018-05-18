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
      name: 'Login',
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
})
