<template>
  <div class="my-container">
    <van-cell-group v-if="user" class="my-info">
      <!-- 基本资料 -->
      <van-cell
        class="base-info"
        :border="false"
        center>
        <!-- 头像 -->
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="currentUser.photo"/>

        <!-- 昵称 -->
        <div class="name" slot="title">{{currentUser.name}}</div>

        <!-- 按钮 -->
        <van-button to="/user/profile" class="updata-btn" size="small" round>编辑资料</van-button>
      </van-cell>
      <!-- 宫格 -->
      <van-grid :border="false" class="data-info">
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-warp">
            <span class="count">{{currentUser.art_count}}</span>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-warp">
            <span class="count">{{currentUser.follow_count}}</span>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-warp">
            <span class="count">{{currentUser.fans_count}}</span>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-warp">
            <span class="count">{{currentUser.like_count}}</span>
            <div class="text">获赞 </div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <!-- 未登录 -->
    <div v-else class="not-login" >
      <div @click="$router.push('/login')">
        <img class="login-img mb_4" src="./login.jpg" alt="">
      </div>
      <span class="text" @click="$router.push('/login')">登录/注册</span>
    </div>

    <!-- 收藏/历史 -->
    <van-grid column-num="2" class="nav-grid mb_4">
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="shoucang"
        text="收藏"
        />
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="lishi"
        text="历史"
      />
    </van-grid>

    <!-- 消息通知 -->
    <van-cell title="消息通知" is-link to="/" />
    <van-cell class="mb_4" title="小智同学" is-link to="/user/chat" />

    <!-- 退出 -->
    <van-cell v-if="user" class="local-cell" title="退出登录" @click="onLogout"/>

  </div>
</template>

<script>

import { mapState } from 'vuex'
import { getCurrentUser } from '../../api/user'

export default {
    name: 'MyIndex',
    data() {
      return {
        // 当前登录用户的资料
        currentUser: {}
      }
    },
    computed: {
      ...mapState(['user'])
    },
    created() {
      this.loadCurrentUser()
    },
    methods: {
      // 退出登录
      onLogout() {
        // 退出提示
        // 跳转到登录页面
        this.$dialog.confirm({
          title: '退出提示',
          message: '确定要退出当前账号吗？'
        })
          .then(() => { // 确定
            this.$store.commit('setUser', null)
          })
          .catch(() => { // 取消
            // on cancel
          })
      },

      // 加载用户信息
      async loadCurrentUser() {
        const { data } = await getCurrentUser()
        console.log(data)
        this.currentUser = data.data
      }
    }
}
</script>

<style lang="less" scoped>
  .my-info {
    background: url('./banner.png') no-repeat;
    // background-size: cover;

    .base-info {
      background-color: unset;
      height: 115px;
      box-sizing: border-box;
      padding-top: 38px;
      padding-bottom: 11px;

      .avatar {
        height: 66px;
        width: 66px;
        box-sizing: border-box;
        border: 1px solid #fff;
        margin-right: 15px;
      }

      .name {
        font-size: 15px;
        color: #fff;
      }

      .updata-btn {
        height: 18px;
        font-size: 10px;
        color: #666;
      }
    }

    .data-info {
      .data-info-item {
        height: 65px;
        color: #fff;

        .text-warp {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .count {
            font-size: 18px;
          }

          .text {
            font-size: 11px;
          }
        }
      }
    }

    /deep/ .van-grid-item__content {
      background-color: unset;
    }
  }

   // 未登录
    .not-login {
      height: 180px;
      background: url("./banner.png") no-repeat;
      background-size: cover;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .login-img {
        width: 66px;
        height: 66px;
        border-radius: 50%;
      }
      .text {
        color: #fff;
        font-size: 14px;
      }
    }

  // 收藏历史
  /deep/ .nav-grid {
    .nav-grid-item {
      height: 70px;
      .toutiao {
        font-size: 22px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }

      .van-grid-item__text {
        color: #333;
        font-size: 13px;
      }
    }
  }

  .local-cell {
    height: 50px;
    text-align: center;
    color: #d86262;
  }

  .mb_4 {
    margin-bottom: 4px;
  }

</style>