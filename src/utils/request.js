/* 请求模块 */

import axios from 'axios'
import JSONbig from 'json-bigint'
import { Toast } from 'vant'
import router from '@/router'

// 在非组件模块中 获取store 必须通过这种方式
// 这里单独加载 store 和在组件中 this.$store 是一样的
import store from '../store/index'

// 创建一个 refresh_token 的单独请求
const refreshTokenReq = axios.create({
    baseURL: 'http://ttapi.research.itcast.cn/'
})

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
request.interceptors.response.use(function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
}, async function(error) {
    // 请求响应失败会进入这里
    // 超过 2XX 的响应码 会在这里处理

    const status = error.response.status

    // 常见的错误状态码
    if (status === 400) {
        // 客户端请求参数错误
        Toast.fail('客户端请求参数异常！')
    } else if (status === 401) {
        // token 无效
        // 1. 如果没有 user 和 user.token ,直接去登录
        const { user } = store.state

        if (!user || !user.token) {
            // 直接跳转到登录页
            return redirectLogin()
        }

        // 2. 如果有 user.refresh_token，则获取 新的token
        try {
            const { data } = await refreshTokenReq({
                url: '/app/v1_0/authorizations',
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${user.refresh_token}`
                }
            })

            // 3. 拿到新的 token 把他更新到容器里
            user.token = data.data.token
            store.commit('setUser', user)

            // 4. 把失败的请求重新发送出去
            // error.config: 是本次请求的相关配置对象
            return request(error.config)
        } catch (err) {
            // 跳转到登录页
            redirectLogin()
        }
    } else if (status === 403) {
        // 没有权限操作
        Toast.fail('您没有权限操作！')
    } else if (status >= 500) {
        // 服务端异常
        Toast.fail('服务端异常，请稍后重试！')
    }
    // 抛出异常
    return Promise.reject(error)
})

// 跳转到登录页的方法
function redirectLogin() {
    router.replace({
        name: 'login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    })
}

// 导出
export default request