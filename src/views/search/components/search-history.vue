<template>
  <div class="search-history">
      <!-- 标题 -->
      <van-cell
        title="搜索历史">

        <!-- 右侧 -->
        <div>
            <span>全部删除</span>
            &nbsp;&nbsp;
            <span>完成</span>
        </div>

        <!-- 删除 -->
        <!-- <van-icon name="delete" /> -->
      </van-cell>

    <!-- 历史 -->
    <van-cell title="hello">
        <van-icon name="close" />
    </van-cell>
    <van-cell title="world">
        <van-icon name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
    name: 'SearchHistory',
    props: {},
    data() {
        return {}
    },
    methods: {}
}
</script>

<style>

</style>