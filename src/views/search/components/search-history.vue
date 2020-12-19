<template>
  <div class="search-history">
      <!-- 标题 -->
      <van-cell
        title="搜索历史">

        <!-- 右侧 -->
        <!-- 注意：props中的数据可以进行修改，但是不能进行 赋值操作
                  可以传递给父组件让父组件 重新赋值
         -->
        <div v-if="isDeleteShow">
            <span @click="$emit('daleteAllHistories', [])">全部删除</span>
            &nbsp;&nbsp;
            <span @click="isDeleteShow = false">完成</span>
        </div>

        <!-- 删除 -->
        <van-icon
        name="delete"
        v-else
        @click="isDeleteShow = true"
        />
      </van-cell>

    <!-- 历史 -->
    <van-cell @click="onDelete(history, index)" :title="history" v-for="(history, index) in searchHistories" :key="index">
        <van-icon
        name="close"
        v-show="isDeleteShow"
        />
    </van-cell>
  </div>
</template>

<script>
import { setItem } from '@/utils/storage'

export default {
    name: 'SearchHistory',
    props: {
      searchHistories: {
        type: Array,
        required: true
      }
    },
    data() {
        return {
          // 控制删除的显示状态
          isDeleteShow: false
        }
    },
    methods: {
      // 点击历史记录
      onDelete(history, index) {
        // 删除状态下
        if (this.isDeleteShow) {
          // 删除
          this.searchHistories.splice(index, 1)

          // 持久化处理，线上删除 接口有问题，只设置本地存储
          return setItem('search-history', this.searchHistories)
        }

        // 非删除状态
        this.$emit('search', history)
      }
    }
}
</script>

<style>

</style>