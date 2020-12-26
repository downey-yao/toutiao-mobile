<!-- 小智同学 -->
<template>
  <div class="user-chat">
      <!-- 头部 -->
      <van-nav-bar
        class="app-nav-bar"
        title="小智同学"
        left-arrow
        @click-left="$router.back()"
      />

      <!-- 聊天列表 -->
      <van-cell-group class="message-list">
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
        <van-cell value="内容" />
      </van-cell-group>

      <!-- 输入框 -->
      <van-cell-group class="send-message-wrap">
        <van-field v-model="message" placeholder="请输入信息" :border="false" />
        <van-button size="small" type="primary" @click="onSend">发送</van-button>
      </van-cell-group>
  </div>
</template>

<script>

import io from 'socket.io-client'

export default {
name: '',
  data () {
    return {
        message: '',
        socket: null
    }
  },

  components: {},

  created() {
    // 建立连接
    const socket = io('http://ttapi.research.itcast.cn')

    this.socket = socket

    socket.on('connect', function () {
        console.log('建立连接成功了')
    })

    // socket.on('event', function (data) {})

    socket.on('disconnect', function () {
        console.log('断开连接了')
    })

    // 监听 message 事件，接收服务端消息
    socket.on('message', function(data) {
        console.log(data)
    })
  },

  methods: {
    // 发送消息
    onSend() {
        this.socket.emit('message', {
            msg: this.message,
            timestamp: Date.now()
        })
    }
  }
}

</script>
<style lang='less' scoped>

.message-list {
    position: fixed;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 44px;
    overflow-y: auto;
}

.send-message-wrap {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    padding: 0 14px;
    align-items: center;

    .van-button {
        width: 60px;
        height: 30px;
    }
}

</style>