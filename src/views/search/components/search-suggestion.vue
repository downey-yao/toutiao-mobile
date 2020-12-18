<template>
  <div class="search-suggestion">
      <van-cell
        icon="search"
        v-for="(item, index) in suggestOptions"
        :key="index"
        :title="item">
      </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// lodash 防抖
import { debounce } from 'lodash'
export default {
    name: 'SearchSuggestion',
    props: {
        searchText: {
            type: String,
            required: true
        }
    },
    watch: {
        // 属性名： 要监视的数据名（不能自定义）
        // 第一次不会监视，第二次才会监视
        // searchText() {
        //     console.log('hello')
        // }

        /* 监视的完整写法 */
        searchText: {
            // 当数据发生变化时，会立即执行 handler 函数
            /* 防抖，防止用户在短时间内 请求多次 */
            handler: debounce(async function() {
                const { data } = await getSearchSuggestions(this.searchText)
                this.suggestOptions = data.data.options
            }, 200),
            // async handler() {
            //     const { data } = await getSearchSuggestions(this.searchText)
            //     // console.log(data)
            //     this.suggestOptions = data.data.options
            // },
            // 该回调将会在 侦听之后立即调用
            immediate: true
        }
    },
    data() {
        return {
            // 搜索联想词组
            suggestOptions: []
        }
    },
    methods: {}
}
</script>

<style>

</style>