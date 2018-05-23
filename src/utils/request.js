import axios from 'axios'
// import router from '../router/index'
// var axios = axios.create({
//   // baseURL: 'http://flpbooking.applinzi.com/',
//   timeout: 30000
// })

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  let token = localStorage.token
  config.headers = {
    Authorization: `JWT ${token}`
  }
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
axios.interceptors.response.use(
  undefined,
  error => {
    let res = error.response
    switch (res.status) {
      case 401:
        // 返回 401 清除token信息并跳转到登录页面
        // router.push({name: 'login'})
        console.log('401错误啦')
        break
      case 403:
        console.log('您没有该操作权限')
        break
      case 500:
        console.log('服务器错误')
        break
    }
    return Promise.reject(error.response.data)// 返回接口返回的错误信息
  })
export default axios
