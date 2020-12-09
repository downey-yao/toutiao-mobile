/* 请求模块 */

import axios from 'axios'

// 在非组件模块中 获取store 必须通过这种方式
// 这里单独加载 store 和在组件中 this.$store 是一样的
import store from '../store/index'

// axios 实例
const request = axios.create({
    // 基础路径
    baseURL: 'http://ttapi.research.itcast.cn/'
})

// 请求拦截器
request.interceptors.request.use(function(config) {
    // Do something before request is sent
    const { user } = store.state

    // 如果用户已登录，统一给接口设置 token
    if (user) {
        config.headers.Authorization = `Bearer ${user.token}`
    }

    // 处理完之后，一定要返回config，否则就会停在这里
    return config
}, function(error) {
    // Do something with request error
    return Promise.reject(error)
})

// 响应拦截器

// 导出
export default request