<template>
  <div class="comment-list">
      <van-cell title="全部评论"></van-cell>
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        >
        <!-- <van-cell v-for="(comment, index) in list" :key="index" :title="comment" /> -->

        <comment-item
            v-for="(comment, index) in list"
            :key="index"
            :comment="comment"
            @on-click-Reply="$emit('on-click-Reply', $event)"
        ></comment-item>
    </van-list>
  </div>
</template>

<script>

import { getComments } from '@/api/comment'
import CommentItem from './comment-item'

export default {
    name: 'CommentList',
    props: {
        source: {
            type: [String, Number, Object],
            required: true
        },
        // 文章评论传 a
        // 评论回复传 c
        type: {
            type: String,
            default: 'a'
        },
        list: {
            type: Array,
            // 数组和对象的 值 必须是 函数表达式
            default: function() {
                return []
            }
        }
    },
    components: {
        CommentItem
    },
    data() {
        return {
            loading: false,
            finished: false,
            offset: null,
            limit: 10
        }
    },
    methods: {
        async onLoad() {
            // 1. 请求获取评论数据
            const { data } = await getComments({
                type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
                source: this.source.toString(), // 源id，文章id或评论id
                offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
                limit: this.limit// 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
            })

            console.log(data)

            // 将评论总数量 发给父组件
            this.$emit('updata-total-count', data.data.total_count)

            // 2. 把数据添加到列表中
            const { results } = data.data
            this.list.push(...results)

            // 3. 将本次的loading关闭
            this.loading = false

            // 4. 判断是否还有数据
            if (results.length) {
                // 如果有，更新获取下一页数据的页码
                this.offset = data.data.last_id
            } else {
                // 如果没有，关闭加载更多
                this.finished = true
            }
        }
    }
}
</script>

<style>

</style>