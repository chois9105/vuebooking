import axios from 'axios'

// 生产环境
// let host = 'http://flpbooking.applinzi.com'

// 开发环境
let host = 'http://127.0.0.1:8000'

// 登录
export const login = params => {
  return axios.post(`${host}/login/`, params)
}

// 获取用户信息
export const getUserDetail = () => {
  return axios.get(`${host}/user_detail/1/`)
}

// 获取预订信息
export const getBookingList = params => {
  return axios.get(`${host}/booking/`, {params})
}

// 提交预订
export const submitBooking = params => {
  return axios.post(`${host}/user_booking/`, params)
}

// 更新预订(取消)
export const updateBooking = (referenceId, params) => {
  return axios.put(`${host}/user_booking/` + referenceId + '/', params)
}

// 更新预订(出席)
export const checkInBooking = (referenceId, params) => {
  return axios.put(`${host}/user_checking/` + referenceId + '/', params)
}

// 获取用户预订
export const getUserBooking = params => {
  return axios.get(`${host}/user_booking/`, {params})
}
// export default {
//   login: 'api/login/',
//   booking: 'api/booking/',
//   user_detail: 'api/user_detail/1/',
//   user_booking: 'api/user_booking/',
//   user_booking_update: 'api/user_booking/'
// }
