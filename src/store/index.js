import Vue from 'vue'
import Vuex from 'vuex'
// 引入本地存储模块
import { getItem, setItem } from '@/utils/storage.js'

Vue.use(Vuex)

const USER_KEY = 'toutiao-user'

export default new Vuex.Store({
    state: {
        user: getItem(USER_KEY) // 当前用户登录的状态（token等数据）
    },
    mutations: {
        setUser(state, data) {
            state.user = data

            // 防止页面刷新数据丢失，将数据存储到 本地存储中
            // window.localStorage.setItem('user', JSON.stringify(state.user))
            setItem(USER_KEY, state.user)
        }
    },
    actions: {},
    modules: {}
})