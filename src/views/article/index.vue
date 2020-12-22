<template>
  <div class="article-container">
      <!-- 导航栏 -->
      <van-nav-bar
       class="app-nav-bar"
        title="文章详情"
        left-arrow
        @click-left="$router.back()"
      />

      <div class="article-content">
        <!-- 标题 -->
        <h1 class="title">{{ article.title }}</h1>

        <!-- 作者 -->
        <van-cell center class="user-info">
          <!-- 头像 -->
          <van-image slot="icon" class="avator" fit="cover" round :src="article.aut_photo" />
          <div slot="title" class="name">{{article.aut_name}}</div>
          <div slot="label" class="pubdate">{{article.pubdate | relativeTime}}</div>
          <!-- 关注 -->
          <van-button
            :type="article.is_followed ? 'default' : 'info'"
            round
            size="small"
            :icon="article.is_followed ? '' : 'plus'"
            class="follow-btn"
            @click="onFollow"
          >
          {{article.is_followed ? '已关注' : '关注'}}
          </van-button>
        </van-cell>

        <!-- 文章内容 -->
        <div
          class="markdown-body"
          v-html="article.content"
          ref="article-content"
          >
        </div>

        <!-- 评论列表 -->
        <comment-list
          :source = "articleId"
          :list = 'commentList'
          @updata-total-count = "totalCommentCount = $event"
          @on-click-Reply="onClickReply"
        ></comment-list>
      </div>

      <!-- 文章底部 -->
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

        <van-icon
          name="comment-o"
          color="#777"
          :info="totalCommentCount"
        ></van-icon>
        <!-- 收藏 -->
        <van-icon
          :name="article.is_collected ? 'star' : 'star-o'"
          :color="article.is_collected ? 'orange' : '#777'"
          @click="onCollect"
        >
        </van-icon>
        <!-- 点赞 -->
        <van-icon
          :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
          :color="article.attitude === 1 ? 'orange' : '#777'"
          @click="onLike"
        >
        </van-icon>
        <!-- 分享 -->
        <van-icon
          name="share"
          color="#777"
        >
        </van-icon>
      </div>

      <!-- 发布评论弹窗 -->
      <van-popup
        v-model="isPostShow"
        position="bottom"
        round
      >
        <post-comment
          :target="articleId"
          @post-success="onPostSuccess"
        ></post-comment>
      </van-popup>

      <!-- 评论回复弹出层 -->
      <van-popup
        v-model="isReplyShow"
        position="bottom"
        :style="{ height: '75%' }"
        round
      >
        <reply-comment
          v-if="isReplyShow"
          :comment="replyComment"
          :article-id="articleId"
          @cloceReply="isReplyShow = false"
        ></reply-comment>
      </van-popup>
  </div>
</template>

<script>

import './github-markdown.css'
import { getArticleById, addCollect, DeleteCollect, DeleteLike, addLike } from '@/api/article'
import { ImagePreview } from 'vant'
import { fllowUser, DeleteUser } from '@/api/user'
import CommentList from './components/comment-list'
import PostComment from './components/post-comment'
import ReplyComment from './components/reply-comment'

export default {
    name: 'Article',
    components: {
      CommentList,
      PostComment,
      ReplyComment
    },
    props: {
      // 文章ID
      articleId: {
        type: [String, Number, Object],
        required: true
      }
    },
    data() {
      return {
        // 文章数据对象
        article: {},
        // 控制 关注按钮 状态
        // isFollowLoading: false
        // 控制发布评论弹出层的状态
        isPostShow: false,
        // 文章评论 列表
        commentList: [],
        // 评论总数量
        totalCommentCount: '',
        // 控制评论回复弹出层的状态
        isReplyShow: false,
        // 评论回复 数据
        replyComment: {}
      }
    },
    created() {
      this.loadArticle()
    },
    methods: {
      async loadArticle() {
        const { data } = await getArticleById(this.articleId)
        console.log(data)
        this.article = data.data

        // 1. 获取文章 DOM 容器
        // 2. 得到所有的 img 标签
        /* 注意：数据改变影响 视图 更新不是 立即的
                如果要操作 被该数据影响的视图DOM,
                要将该代码放在 $nextTick() 中 */
        // this.$nextTick()是 vue 提供的一个方法
        this.$nextTick(() => {
          this.handlePerviewImage()
        })
        // 3. 循环 img 列表， 给img 添加点击事件
        // 4. 在事件处理函数中 调用 ImagePerview() 预览
      },

      // 预览图片
      handlePerviewImage() {
        const articleContent = this.$refs['article-content']

        const imgs = articleContent.querySelectorAll('img')

        // img 循环注册 预览事件
        const imgPaths = []
        imgs.forEach((img, index) => {
          // 将图片路径添加到数组中
          imgPaths.push(img.src)
          img.onclick = function() {
            ImagePreview({
              images: imgPaths, // 预览图片列表
              startPosition: index // 起始位置
            })
          }
        })
      },

      // 关注用户
      async onFollow() {
        // this.isFollowLoading = true
        // 已关注，点击取消关注
        if (this.article.is_followed) {
          await DeleteUser(this.article.aut_id)
        } else {
          // 未关注，点击关注
          await fllowUser(this.article.aut_id)
        }

        // 修改 关注试图
        this.article.is_followed = !this.article.is_followed
        // this.isFollowLoading = false
      },

      // 收藏文章
      async onCollect() {
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true
        })
        // 已收藏，点击取消收藏
        if (this.article.is_collected) {
          await DeleteCollect(this.articleId)
          // this.article.is_collected = false
        } else {
          // 未收藏，点击收藏
          await addCollect(this.articleId)
          // this.article.is_collected = true
        }

        // 修改 关注试图
        this.article.is_collected = !this.article.is_collected
        // 弹出提示框
        this.$toast.success(this.article.is_collected ? '收藏成功' : '取消收藏')
      },

      // 点赞文章
      async onLike() {
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true
        })
        // 已点赞，点击取消点赞
        if (this.article.attitude === 1) {
          await DeleteLike(this.articleId)
          this.article.attitude = -1
        } else {
          // 未点赞，点击点赞
          await addLike(this.articleId)
          this.article.attitude = 1
        }

        // 弹出提示框
        this.$toast.success(this.article.attitude === 1 ? '点赞成功' : '取消点赞')
      },

      // 处理发布评论成功后的结果
      onPostSuccess(comment) {
        // console.log(comment)

        this.totalCommentCount++
        this.commentList.unshift(comment)
        this.isPostShow = false
      },

      onClickReply(comment) {
        console.log(comment)

        // 将点击的某个评论数据 存储起来
        this.replyComment = comment
        this.isReplyShow = true
      }
    }
}
</script>

<style lang="less" scoped>
  .title {
    font-size: 20px;
    padding: 14px;
    color: #3a3a3a;
    background-color: #fff;
    margin: 0 ;
  }

  .user-info {
    .avator {
      width: 35px;
      height: 35px;
      margin-right: 8px;
    }
    .title {
      font-size: 11px;
      color: #333333;
    }
    .pubdate {
      font-size: 11px;
      color: #b4b4b4;
    }
    .follow-btn {
      width: 85px;
      height: 29px;

      .van-icon-plus {
        font-size: 11px;
      }
    }
  }

  ul {
    list-style: unset;
  }

  .markdown-body {
    padding: 14px;
    background-color: #fff;
  }

  .article-container {
    position: relative;

    .article-content {
      position: fixed;
      margin-top: 46px;
      margin-bottom: 40px;
      overflow-y: auto;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
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
        height: 25px;
      }
    }
  }
</style>