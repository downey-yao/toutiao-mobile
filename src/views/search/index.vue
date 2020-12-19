<template>
  <div class="search">
    <!-- 搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/">
    <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        shape="round"
        background="#4fc08d"
        show-action
        @focus="isResultShow = false"
        @search="onSearch(searchText)"
        @cancel="$router.back()"/>
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result
        v-if="isResultShow"
        :searchText="searchText"
    ></search-result>
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
        v-else-if="searchText"
        :searchText="searchText"
        @search="onSearch"
        ></search-suggestion>
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <search-history
        v-else
        :searchHistories="searchHistories"
        @search="onSearch"
        @daleteAllHistories="searchHistories = $event"
        ></search-history>
    <!-- /历史记录 -->

  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
// import { getSearchHistories } from '@/api/search'
import { mapState } from 'vuex'

export default {
    name: 'SearchIndex',
    components: {
        SearchSuggestion,
        SearchHistory,
        SearchResult
    },
    props: {},
    data() {
        return {
            // 搜索框的内容
            searchText: '',
            // 控制搜索历史的显示和隐藏
            isResultShow: false,
            // 搜索历史记录
            searchHistories: []
        }
    },
    watch: {
        searchHistories() {
            // 可以在监视中 对历史记录进行 持久化存储
            setItem('search-history', this.searchHistories)
        }
    },
    computed: {
        ...mapState(['user'])
    },
    created() {
        this.loadSearchHistory()
    },
    methods: {
        onSearch(searchText) {
            // 让输入框设置为你要搜索的文本
            this.searchText = searchText

            // 删除重复的搜索记录
            // indexOf()方法返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1。
            const index = this.searchHistories.indexOf(searchText)

            if (index !== -1) {
                // 删除重复项（以前搜索的记录），把最新的保存在数组中
                this.searchHistories.splice(index, 1)
            }

            // 记录历史记录
            this.searchHistories.unshift(searchText)

            /* 1. 已登录，调用接口存储到线上 */
            /* 2. 未登录，存储到浏览器 */
            setItem('search-history', this.searchHistories)
            // 展示搜索历史
            this.isResultShow = true
        },
        // 整合线上记录和本地记录，因为线上接口只能存储4条
        async loadSearchHistory() {
            // 本地记录
            const searchHistories = getItem('search-history') || []

            // // 已登录
            // if (this.user) {
            //     const { data } = await getSearchHistories()
            //     // console.log(data.data.keywords)

            //     // 合并 本地存储和线上存储 并去重
            //     searchHistories = [...new Set([
            //         ...searchHistories,
            //         ...data.data.keywords
            //     ])]
            // }

            this.searchHistories = searchHistories
        }
    }
}
</script>

<style>

</style>