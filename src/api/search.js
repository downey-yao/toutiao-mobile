/* 搜索相关请求模块 */

import request from '@/utils/request'

/* 获取搜索补全 信息 */

export const getSearchSuggestions = q => {
    return request({
        method: 'GET',
        url: '/app/v1_0/suggestion',
        params: {
            q
        }
    })
}