import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { Dialog } from 'vant'
Vue.use(VueRouter)

// 路由表
const routes = [{
        path: '/login',
        name: 'login',
        component: () =>
            import ('@/views/login/'),
        meta: { requiresAuth: false }
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
                    import ('@/views/home/'),
                meta: { requiresAuth: false }
            },
            // 问答
            {
                path: '/qa',
                name: 'qa',
                component: () =>
                    import ('@/views/question'),
                meta: { requiresAuth: false }
            },
            // 视频
            {
                path: '/video',
                name: 'video',
                component: () =>
                    import ('@/views/video/'),
                meta: { requiresAuth: false }
            },
            // 我的
            {
                path: '/my',
                name: 'my',
                component: () =>
                    import ('@/views/my/'),
                meta: { requiresAuth: false }
            }
        ]
    },
    {
        path: '/search',
        name: 'search',
        component: () =>
            import ('@/views/search'),
        meta: { requiresAuth: false }
    },
    {
        path: '/article/:articleId',
        name: 'article',
        component: () =>
            import ('../views/article'),
        // 将动态路由参数到映射到 组件中
        props: true,
        meta: { requiresAuth: false }
    },
    {
        path: '/user/profile',
        name: 'user-profile',
        component: () =>
            import ('../views/edit-file'),
        meta: { requiresAuth: false }
    },
    {
        path: '/user/chat',
        name: 'user-chat',
        component: () =>
            import ('@/views/user-chat'),
        meta: { requiresAuth: true }
    }
]

const router = new VueRouter({
    routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        // 已登录，放行
        if (store.state.user) {
            return next()
        }

        // 未登录
        Dialog.confirm({
                title: '访问提示',
                message: '该功能需要登录，确认登陆吗？'
            })
            .then(() => {
                // 确认
                router.push({
                    name: 'login',
                    query: {
                        redirect: router.currentRoute.fullPath
                    }
                })
            })
            .catch(() => {
                // 取消
                next(false)
            })
    } else {
        // 不需要登录状态的页面，直接放行
        next()
    }
})

export default router