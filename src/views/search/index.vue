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
        @search="onSearch"
        @cancel="$router.back()"/>
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result
        v-if="isResultShow"></search-result>
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
        v-else-if="searchText"
        :searchText="searchText"></search-suggestion>
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <search-history
        v-else></search-history>
    <!-- /历史记录 -->

  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
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
            isResultShow: false
        }
    },
    methods: {
        onSearch() {
            console.log('onSearch')
            // 展示搜索历史
            this.isResultShow = true
        }
    }
}
</script>

<style>

</style>