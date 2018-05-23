import axios from 'axios'
// var axios = axios.create({
//   // baseURL: 'http://flpbooking.applinzi.com/',
//   timeout: 30000
// })

// 添加请求拦截器
// axios.interceptors.request.use(function (config) {
//   let token = localStorage.token
//   config.headers = {
//     Authorization: `JWT ${token}`
//   }
//   // 在发送请求之前做些什么
//   return config
// }, function (error) {
//   // 对请求错误做些什么
//   return Promise.reject(error)
// })
axios.interceptors.request.use(
  config => {
    if (localStorage.token) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `JWT ${localStorage.token}`
    }
    // 在发送请求之前做些什么
    return config
  }, function (error) {
  // 对请求错误做些什么
    return Promise.reject(error)
  })
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
export default axios
