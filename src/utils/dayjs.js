/* 初始化 dayjs 时间相关配置 */
import Vue from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用时间处理 相对时间
dayjs.extend(relativeTime)

// 配置使用中文 语言包
dayjs.locale('zh-cn') // 全局使用简体中文

/* 配置全局过滤器，就可以在任何组件中使用了 */
Vue.filter('relativeTime', value => {
    // 将时间转化为 相对时间
    // 例：一天前
    return dayjs(value).from(dayjs())
})