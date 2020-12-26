<template>
  <div id="app">
    <!-- 组件缓存：只希望LayoutIndex组件缓存 -->
    <keep-alive :include="cachePages">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'app',
  computed: {
    ...mapState(['cachePages'])
  }
}
</script>

<style lang="less">

</style>
