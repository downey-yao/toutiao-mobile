/* 请求模块 */

import axios from 'axios'
import JSONbig from 'json-bigint'

// 在非组件模块中 获取store 必须通过这种方式
// 这里单独加载 store 和在组件中 this.$store 是一样的
import store from '../store/index'

// axios 实例
const request = axios.create({
    // 基础路径
    baseURL: 'http://ttapi.research.itcast.cn/',

    // 解决后端返回数据中的 大数据问题
    // 定义后端返回的原始数据的处理
    // 参数 data 就是后端返回的原始数据（未经处理的 JSON 格式字符串）
    transformResponse: [function(data) {
        // Do whatever you want to transform the data
        // console.log(data)

        // 后端返回的数据可能不是 JSON 格式字符串
        // 如果不是的话，那么 JSONbig.parse 调用就会报错
        // 所以我们使用 try-catch 来捕获异常，处理异常的发生
        try {
            // 如果转换成功，则直接把结果返回
            return JSONbig.parse(data)
        } catch (err) {
            console.log('转换失败', err)
                // 如果转换失败了，则进入这里
                // 我们在这里把数据原封不动的直接返回给请求使用
            return data
        }

        // axios 默认在内部使用 JSON.parse 来转换处理原始数据
        // return JSON.parse(data)
    }]
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