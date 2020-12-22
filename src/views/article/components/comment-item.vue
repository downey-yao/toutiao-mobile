<template>
  <van-cell class="comment-item">
      <!-- 头像 -->
      <van-image
        slot="icon"
        class="avator"
        round
        :src="comment.aut_photo"
        fit="cover"
      ></van-image>

      <!-- 名字，内容，时间， 按钮 -->
      <div slot="title">
          <div class="title-wrap">
            <div class="name">{{comment.aut_name}}</div>

              <!-- 点赞 -->
            <div class="like-wrap" @click="onCommentLike">
                <van-icon
                    class="like-icon"
                    :color="comment.is_liking ? 'orange' : '#777'"
                    :name="comment.is_liking ? 'good-job' : 'good-job-o'">
                </van-icon>
                <span class="like-count">{{comment.like_count}}</span>
            </div>
          </div>
          <div class="content">{{comment.content}}</div>
          <div>
              <span class="pubdate">
                  {{comment.pubdate | dateTime}}
                </span>
              <van-button
                round
                size="mini"
                class="reply-btn"
                @click="$emit('on-click-Reply', comment)"
              >{{comment.reply_count}} 回复</van-button>
          </div>
      </div>

  </van-cell>
</template>

<script>

import { addCommentLike, deleteCommentLike } from '@/api/comment'

export default {
    name: 'CommentItem',
    props: {
        comment: {
            type: Object,
            required: true
        }
    },
    data() {
        return {}
    },
    methods: {
        // 对评论点赞
        async onCommentLike() {
            const commentId = this.comment.com_id.toString()
            if (this.comment.is_liking) {
                // 已点赞，取消点赞
                await deleteCommentLike(commentId)
                // this.comment.is_liking = false
                this.comment.like_count--
            } else {
                // 未点赞，点赞
                await addCommentLike(commentId)
                this.comment.like_count++
                // this.comment.is_liking = true
            }
            // 更新视图
            this.comment.is_liking = !this.comment.is_liking
        }
    }
}
</script>

<style lang="less" scoped>
.comment-item {

    .avator {
        width: 36px;
        height: 36px;
        margin-right: 13px;
    }
    .name {
        color: #406599;
        font-size: 14px;
    }

    .content {
        font-size: 16px;
        color: #222;
    }

    .pubdate {
        font-size: 10px;
        margin-right: 10px;
    }

    .title-wrap {
        display: flex;
        justify-content: space-between;
    }
    .like-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>