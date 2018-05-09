import Vue from 'vue'
import Router from 'vue-router'
import Booking from '@/components/views/Booking'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Booking',
      component: Booking
    }
  ]
})
