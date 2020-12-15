<template>
  <div class="home-container">
    <!-- 头部搜索框 -->
    <van-nav-bar
      class="app-nav-bar"
      >
      <van-button class="search-btn" type="primary" icon="search" slot="title" round >搜索</van-button>
    </van-nav-bar>

    <!-- 文章分类频道标签页 -->
    <van-tabs v-model="active" class="channel-tabs">
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <!-- 文章列表组件 -->
        <article-list :channel="channel"/>
      </van-tab>

      <!-- 占位符：为了让频道显示全 -->
      <div slot="nav-right" class="wrap-placeholder"></div>

      <!-- 频道汉堡按钮 -->
      <div slot="nav-right" class="channel-edit-wrap" @click="isChannelShow = true">
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>

    <!-- 频道弹出层组件 -->
    <van-popup
      v-model="isChannelShow"
      get-container="body"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 频道编辑组件 -->
      <channel-edit :user-channels="channels"></channel-edit>
    </van-popup>
  </div>
</template>

<script>

import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'

export default {
    name: 'Home-Index',
    data() {
      return {
        active: 2,
        channels: [],
        // 控制频道弹出层的显示和隐藏
        isChannelShow: true
      }
    },
    components: {
      ArticleList,
      ChannelEdit
    },
    created() {
      this.loadChannels()
    },
    mounted() {},
    methods: {
      /* 请求获取频道数据 */
      async loadChannels() {
        const { data } = await getUserChannels()
        // console.log(data)
        this.channels = data.data.channels
      }
    }
}
</script>

<style lang="less" scoped>
  .app-nav-bar {
    /deep/ .van-nav-bar__title {
      max-width: none;
    }
    .search-btn {
      width: 277px;
      height: 32px;
      background-color: #5babfb;
      border: none;
      .van-icon-search {
        font-size: 16px;
      }
      .van-button__text {
        font-size: 14px;
      }
    }
  }

  // 频道列表样式
  .channel-tabs {
    /deep/ .van-tab {
      width: 82px;
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
      text-align: center;
    }
    /deep/ .van-tabs__line {
      bottom: 20px;
      width: 15px;
      height: 3px;
      background: #3296fa;
    }
  }

  .wrap-placeholder {
    width: 33px;
    flex-shrink: 0;
  }

  .channel-edit-wrap {
    position: fixed;
    right: 0;
    width: 33px;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    opacity: 0.9;
    .van-icon {
      font-size: 22px;
    }
  }
</style>