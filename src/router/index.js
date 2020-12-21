import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 路由表
const routes = [{
        path: '/login',
        name: 'login',
        component: () =>
            import ('@/views/login/')
    }, {
        path: '/',
        component: () =>
            import ('@/views/layout/'),
        children: [
            // 默认子路由首页
            {
                path: '',
                name: 'home',
                component: () =>
                    import ('@/views/home/')
            },
            // 问答
            {
                path: '/qa',
                name: 'qa',
                component: () =>
                    import ('@/views/question')
            },
            // 视频
            {
                path: '/video',
                name: 'video',
                component: () =>
                    import ('@/views/video/')
            },
            // 我的
            {
                path: '/my',
                name: 'my',
                component: () =>
                    import ('@/views/my/')
            }
        ]
    },
    {
        path: '/search',
        name: 'search',
        component: () =>
            import ('@/views/search')
    },
    {
        path: '/article/:articleId',
        name: 'article',
        component: () =>
            import ('../views/article'),
        // 将动态路由参数到映射到 组件中
        props: true
    }
]

const router = new VueRouter({
    routes
})

export default router