<template>
    <div class="channel-edit">
        <!-- 我的频道 -->
        <van-cell center :border="false">
            <div slot="title" class="channel-title">我的频道</div>
            <van-button
            type="danger"
            plain
            round
            size="mini"
            @click="isEdit = !isEdit"
            >{{ isEdit ? '完成' : '编辑' }}</van-button>
        </van-cell>

        <van-grid :gutter="10" :border="false">
            <van-grid-item
            @click="onUserChannelClick(item, index)"
            :icon="(isEdit && index !== 0) ? 'clear' : ''"
            class="grid-item"
            :class="{active : index === active}"
            v-for="(item, index) in userChannels"
            :key="index"
            :text="item.name" />
        </van-grid>

        <!-- 频道推荐 -->
        <van-cell center :border="false">
            <div slot="title" class="channel-title">频道推荐</div>
        </van-cell>

        <van-grid :gutter="10" :border="false">
            <van-grid-item class="grid-item" v-for="(item, index) in recommendChannels" :key="index" :text="item.name" @click="onAdd(item)"/>
        </van-grid>
    </div>
</template>

<script>
import { getAllChannel, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
    name: 'ChannelEdit',
    data() {
        return {
            // 全部频道列表
            allChannels: [],
            // 控制 X号图标 的的显示和隐藏
            isEdit: false
        }
    },
    computed: {
        // 推荐频道列表
        recommendChannels() {
            // 推荐频道 = 所有的频道 - 我的频道
            return this.allChannels.filter((channel) => {
                // 判断 channel 是否属于用户频道
                return !this.userChannels.find((userChannel) => {
                    // 找到满足的条件
                    return userChannel.id === channel.id
                })
            })
        },
        // 将 user 映射为计算属性
        ...mapState(['user'])
    },
    props: {
        userChannels: {
            type: Array,
            required: true
        },
        active: {
            type: Number,
            required: true
        }
    },
    created() {
        this.getChannel()
    },
    methods: {
        // 获取全部频道列表
        async getChannel() {
            const { data } = await getAllChannel()
            // console.log(res)
            this.allChannels = data.data.channels
        },
        // 添加频道到 推荐频道
        async onAdd(channel) {
            this.userChannels.push(channel)

            // 持久化存储
            if (this.user) {
                // 已登录，存储到服务器
                await addUserChannel({
                    channels: [
                        { id: channel.id, seq: this.userChannels.length }
                    ]
                })
            } else {
                // 未登录。本地存储
                setItem('user-channel', this.userChannels)
            }
        },
        // 我的频道列表点击事件
        onUserChannelClick(channel, index) {
            if (this.isEdit && index !== 0) {
                // 编辑状态，删除频道
                this.deleteChannel(channel, index)
            } else {
                // 非编辑状态，切换频道
                this.switchChannel(index)
            }
        },
        // 删除频道
        async deleteChannel(channel, index) {
            // 如果删除active之前的，更新active
            if (index <= this.active) {
                this.$emit('updataChannel', this.active - 1)
            }
            this.userChannels.splice(index, 1)

            if (this.user) {
                await deleteUserChannel(channel.id)
            } else {
                setItem('user-channel', this.userChannels)
            }
        },
        // 切换频道
        switchChannel(index) {
            // 关闭弹出层
            this.$emit('close')
            // 切换频道
            this.$emit('updataChannel', index)
        }
    }
}
</script>

<style lang="less" scoped>
.channel-edit {
    padding-top: 54px;

    .channel-title {
        font-size: 16px;
        color: #333;
    }

    .grid-item {
        width: 80px;
        height: 43px;
        /deep/ .van-grid-item__content {
            background-color: #f4f5f6;
            border-radius: 8px;
            .van-grid-item__text {
                font-size: 14px;
                color: #222;
                margin-top: 0;
            }
        }
        // 减号
        /deep/ .van-grid-item__icon {
            position: absolute;
            top: 0px;
            right: 0px;
            font-size: 20px;
            color: #ccc;
        }
    }

    .active {
        /deep/ .van-grid-item__content {
            background-color: #0080ff;
        }
        /deep/ .van-grid-item__text{
            color: #fff !important;
        }
    }
}
</style>