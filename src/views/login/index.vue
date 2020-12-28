<template>
   <div class="login-container">
       <!-- 头部 -->
       <van-nav-bar
       class="app-nav-bar"
        title="登录 / 注册"
        left-arrow
        @click-left="$router.back()"
        />
       <!-- /头部 -->

       <!-- 登录表单 -->
       <van-form
       :show-error="false"
       :show-error-message="false"
       validate-first
       ref="formRulseRef"
       @submit="onLogin"
       @failed="onFailed">
        <van-field
            v-model="user.mobile"
            icon-prefix="toutiao"
            left-icon="shouji"
            center
            placeholder="请输入手机号"
            name="mobile"
            :rules="formRuls.mobile"
        />
        <van-field
            v-model="user.code"
            clearable
            icon-prefix="toutiao"
            left-icon="yanzhengma"
            center
            placeholder="请输入验证码"
            name="code"
            :rules="formRuls.code"
        >
            <!-- 发送验证码 -->
            <template #button>
                <!-- 倒计时 -->
                <van-count-down
                :time="1000 * 3"
                format="ss s"
                v-if="isCountDownShow"
                @finish="isCountDownShow = false"
                />
                <van-button v-else class="send-btn" size="small" round :loading="isSendSmsLoading" @click.prevent="onSendSms">获取验证码</van-button>
            </template>
        </van-field>
            <!-- 提交按钮 -->
            <div class="login-btn-warp">
                <van-button class="login-btn" type="info" block>登录</van-button>
            </div>
        </van-form>
       <!-- /登录表单 -->
   </div>
</template>

<script>

import { login, sendSms } from '@/api/user'
import { Toast } from 'vant'

export default {
    name: 'loginIndex',
    data() {
        return {
            user: {
                //手机号
                mobile: '17090086870',
                // 验证码
                code: '246810'
            },
            // 表单验证规则
            formRuls: {
                mobile: [
                    { required: true, message: '请输入手机号码' },
                    { pattern: /^1[3|4|5|6|7|8|9]\d{9}$/, message: '手机号码格式不正确' }
                ],
                code: [
                    { required: true, message: '请输入验证码' },
                    { pattern: /^\d{6}$/, message: '验证码格式不正确' }
                ]
            },
            // 控制倒计时的显示与隐藏
            isCountDownShow: false,
            // 发送验证码 按钮的加载状态
            isSendSmsLoading: false
        }
    },
    methods: {
        async onLogin() {
            /* 加载中提示 */
            Toast.loading({
                message: '加载中...', // 文本
                forbidClick: true, // 禁止背景点击
                duration: 0
            })
            // 1. 找到数据接口
            // 2. 封装请求方法
            // 3. 请求调用登录
            try {
                const { data } = await login(this.user)
                // console.log(res)
                Toast.success('登陆成功')

                // 将后端返回的用户登录状态（token等数据）放在vuex容器中
                this.$store.commit('setUser', data.data)

                // 删除之前用户的缓存, 让他重新渲染
                this.$store.commit('removeCachePages', 'LayoutIndex')

                // 登录成功，跳转回上一页
                // TODO:此方法暂时使用
                // this.$router.back()
                this.$router.push(this.$route.query.redirect || '/')
            } catch (error) {
                // console.log('错误信息', error)
                Toast.fail('手机号码或者验证码错误，请重试！')
            }
            // 4. 处理响应结果
        },

        // 表单验证失败
        onFailed(error) {
            console.log(error)
            if (error.errors[0]) {
                Toast({
                    message: error.errors[0].message,
                    position: top
                })
            }
        },

        // 发送验证码
        async onSendSms() {
            // console.log('onSendSms')
            // 手机号校验
            try {
                await this.$refs.formRulseRef.validate('mobile')

                /* 验证成功，请求发送验证码 */
                this.isSendSmsLoading = true
                await sendSms(this.user.mobile)
                // console.log(res)

                // 已发送验证码，显示倒计时
                this.isCountDownShow = true
            } catch (err) {
                // console.log(err)
                /* 验证失败 */
                // 不同的错误显示不同的错误提示文本
                let message = ''
                if (err && err.response && err.response.status === 429) {
                    // 短信错误提示
                    message = '发送太频繁了，请稍后重试！'
                } else if (err.name === 'mobile') {
                    // 校验错误
                    message = err.message
                } else {
                    // 未知错误
                    message = '发送失败，请重试！'
                }

                // 提示用户
                Toast({
                    message,
                    position: top
                })
            }

            // 无论成功与失败否，都要停止加载 loading
            this.isSendSmsLoading = false
        }
    }
}
</script>

<style lang="less" scoped>
    .login-container {
        .login-btn-warp {
            padding: 26px 16px;
            .login-btn {
                background-color: #6db4fb;
                border: none;
                .van-button__text {
                    font-size: 15px;
                }
            }
        }

        .send-btn {
            width: 78px;
            height: 23px;
            background-color: #ededed;
            .van-button__text {
                font-size: 11px;
                color: #666;
            }
        }
    }
</style>