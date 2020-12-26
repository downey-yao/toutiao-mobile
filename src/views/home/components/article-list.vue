<template>
    <div class="article-list" ref="article-list">
        <!-- 下拉刷新 -->
        <van-pull-refresh
            v-model="isRefreshLoad"
            @refresh="onRefresh"
            :success-text="refreshSuccessText"
            :success-duration="1000"
            >
            <!-- 文章列表 -->
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                >

                <!-- 文章列表项抽取成组件 -->
                <article-item
                    v-for="(article, index) in articles"
                    :key="index"
                    :article="article"
                >
                    {{article.title}}
                </article-item>
                <!-- <van-cell v-for="(article, index) in articles" :key="index" :title="article.title" /> -->
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>

import { getArticles } from '../../../api/article'
import ArticleItem from '@/components/articleItem'
// 防抖
import { debounce } from 'lodash'

export default {
    name: 'ArticleList',
    data() {
        return {
            articles: [], // 数据列表
            loading: false, // 控制加载中的 loading
            finished: false, // 控制加载结束的状态，控制加载结束，不再触发加载更多
            timestamp: null, // 时间戳
            isRefreshLoad: false, // 控制 下拉刷新 状态
            refreshSuccessText: '',
            scrollTop: 0 // 页面滚动的距离
        }
    },
    components: {
        ArticleItem
    },
    props: {
        channel: {
            type: Object,
            required: true
        }
    },
    mounted() {
        // 计算页面滚动的距离
        const articleList = this.$refs['article-list']

        articleList.onscroll = debounce(() => {
            // console.log(articleList.scrollTop)
            this.scrollTop = articleList.scrollTop
        }, 50)
    },
    methods: {
        // 显示文章列表
        async onLoad() {
            // 1. 请求获取数据
            const { data } = await getArticles({
                // 频道ID
                channel_id: this.channel.id,
                // 时间戳
                timestamp: this.timestamp || Date.now(),
                // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
                with_top: 1
            })

            // console.log(data)

            // 2. 把数据放在 list 数组中
            const { results } = data.data
            this.articles.push(...results)

            // 3. 设置本次加载状态结束, 他才可以判断是否加载下一次
            this.loading = false

            // 4. 数据全部加载完成
            if (results.length) {
                // 如果 列表还有数据，就要 加载下一页数据
                this.timestamp = data.data.pre_timestamp
            } else {
                // 没有数据，则加载全部完成
                this.finished = true
            }
        },

        // 下拉刷新
        async onRefresh() {
            // 1. 请求文章数据
            const { data } = await getArticles({
                // 频道ID
                channel_id: this.channel.id,
                // 时间戳
                timestamp: Date.now(),
                // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
                with_top: 1
            })

            // 2. 将数据 追加到 列表顶部
            const { results } = data.data
            this.articles.unshift(...results)
            // 下拉刷新提示
            this.refreshSuccessText = `刷新了${results.length}条数据`

            // 3. 关闭 刷新的 状态
            this.isRefreshLoad = false
        }
    },

    // 从缓存中激活会调用activated钩子函数
    activated() {
        // 把记录到顶部的距离 重新 设置回去
        this.$refs['article-list'].scrollTop = this.scrollTop
    }
}
</script>

<style lang="less" scoped>
    .article-list {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 50px;
        top: 90px;
        overflow-y: auto;
    }
</style>