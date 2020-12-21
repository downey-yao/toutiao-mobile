/* 频道相关请求模块 */

import request from '@/utils/request'

/* 获取所有频道 */

export const getAllChannel = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/channels'
    })
}

/* 添加频道 */

export const addUserChannel = (data) => {
    return request({
        method: 'PATCH',
        url: '/app/v1_0/user/channels',
        data
    })
}

/* 删除频道 */

export const deleteUserChannel = (channelID) => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/user/channels/${channelID}`
    })
}