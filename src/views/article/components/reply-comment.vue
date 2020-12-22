<template>
  <div class="reply-comment">
      <!-- 头部信息 -->
      <van-nav-bar :title="`${comment.reply_count}条回复`">
          <van-icon @click="$emit('cloceReply')" slot="left" name="cross"></van-icon>
      </van-nav-bar>

      <comment-item
        :comment="comment"
      ></comment-item>

        <!-- 所有评论回复 -->
      <van-cell title="所有回复">
      </van-cell>
      <comment-list
            :source="comment.com_id"
            type="c"
            :list="commentList"
        ></comment-list>

        <!-- 发布评论回复 -->
        <div class="article-bottom">
            <!-- 写评论 -->
            <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
            >
            写评论
            </van-button>
        </div>
        <!-- /发布评论回复 -->

        <!-- 评论回复弹出框 -->
        <!-- 发布评论弹窗 -->
      <van-popup
        v-model="isPostShow"
        position="bottom"
        round
      >
        <post-comment
            :target="comment.com_id"
            :article-id="articleId"
            @post-success="onPostSuccess"
        ></post-comment>
      </van-popup>
  </div>
</template>

<script>

import CommentItem from './comment-item'
import CommentList from './comment-list'
import PostComment from './post-comment'

export default {
    name: 'ReplyComment',
    components: {
        CommentItem,
        CommentList,
        PostComment
    },
    props: {
        comment: {
            type: Object,
            required: true
        },
        articleId: {
            type: [Number, Object, String],
            required: true
        }
    },
    data() {
        return {
            // 发布评论弹出框的显示和隐藏
            isPostShow: false,
            // 回复评论列表
            commentList: []
        }
    },
    methods: {
        // 发布评论 回复成功 后的事件
        onPostSuccess(comment) {
            // 将数据放在 列表头部
            this.commentList.unshift(comment)
            // 更新评论的回复数量
            this.comment.reply_count++
            // 关闭弹出框
            this.isPostShow = false
        }
    }
}
</script>

<style lang="less" scoped>
/deep/ .article-bottom {
    position: fixed;
    bottom: 0;
    background-color: #fff;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 19px;

    /deep/ .comment-btn {
    width: 150px;
    height: 40px;
    }
}
</style>