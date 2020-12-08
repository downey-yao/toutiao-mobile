/* 请求模块 */

import axios from 'axios'

// axios 实例
const request = axios.create({
    // 基础路径
    baseURL: 'http://ttapi.research.itcast.cn/'
})

// 请求拦截器
// 响应拦截器

// 导出
export default request