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
            <van-grid-item @click="onUserChannelClick(index)" :icon="(isEdit && index !== 0) ? 'clear' : ''" class="grid-item" v-for="(item, index) in userChannels" :key="index" :text="item.name" />
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
import { getAllChannel } from '@/api/channel'
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
        }
    },
    props: {
        userChannels: {
            type: Array,
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
        onAdd(channel) {
            this.userChannels.push(channel)
            // TODO：持久化存储
        },
        // 我的频道列表点击事件
        onUserChannelClick(index) {
            if (this.isEdit && index !== 0) {
                // 编辑状态，删除频道
                this.deleteChannel(index)
            } else {
                // 非编辑状态，切换频道
                this.switchChannel(index)
            }
        },
        deleteChannel(index) {
            this.userChannels.splice(index, 1)

            // TODO: 数据持久化
        },
        switchChannel(index) {
            console.log('切换频道')
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
}
</style>