/* 用户相关请求模块 */

import request from '@/utils/request'

/* 登录 / 注册 */

export const login = data => {
    return request({
        method: 'POST',
        url: '/app/v1_0/authorizations',
        data
    })
}

/* 发送验证码 */

export const sendSms = mobile => {
    return request({
        method: 'GET',
        url: `/app/v1_0/sms/codes/${mobile}`
    })
}

/* 获取当前登录用户信息 */

export const getCurrentUser = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user'
            /* 在请求拦截器中添加请求头 */
            // headers: {
            //     Authorization: `Bearer ${store.state.user.token}`
            // }
    })
}

/* 获取用户频道列表 */

export const getUserChannels = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user/channels'
    })
}