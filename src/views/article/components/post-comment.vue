<template>
  <div class="post-comment">
    <!-- 评论框 -->
    <van-field
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="写评论..."
      show-word-limit
    />

    <!-- 按钮 -->
    <van-button
      type="warning"
      size="small"
      @click="onPost"
      :disabled = '!message'
    >评论</van-button>
  </div>
</template>

<script>

import { addPostComment } from '@/api/comment'

export default {
    name: 'PostComment',
    props: {
      target: {
        type: [Number, String, Object],
        required: true
      },
      articleId: {
        type: [Number, String, Object],
        default: null
      }
    },
    data() {
        return {
          message: ''
        }
    },
    methods: {
      // 发布评论
      async onPost() {
        // 慢速网络缓冲
        this.$toast.loading({
          message: '发布中...',
          forbidClick: true
        })

        const { data } = await addPostComment({
          target: this.target.toString(), // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: this.message, // 评论内容
          art_id: this.articleId ? this.articleId.toString() : null // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })

        console.log(data.data.new_obj)
        // 传入父组件，处理发布成功的事件
        this.$emit('post-success', data.data.new_obj)
        // 发布成功
        this.$toast.success('发布成功')

        // 清空输入框
        this.message = ''
      }
    }
}
</script>

<style lang="less" scoped>
.post-comment {
  display: flex;
  align-items: center;
  padding: 14px;
  font-size: 10px;
  .van-field {
    background-color: #efe;
  }
  .van-button {
    width: 50px;
    height: 30px;
    margin-left: 14px;
  }
  .van-button__text {
    text-align: center;
  }
}
</style>