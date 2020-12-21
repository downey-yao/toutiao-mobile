<template>
    <!-- <div class="article-item">文章列表项</div> -->
    <van-cell
        class="article-item"
        :to="{
            name: 'article',
            params: {
                articleId: article.art_id
            }
        }"
        >
        <div slot="title" class="title van-multi-ellipsis--l3">{{ article.title }}</div>
        <div slot="label">
            <!-- 三张封面 -->
            <div class="cover-wrap" v-if="article.cover.type === 3">
                <!-- 图片 -->
                <div class="cover-wrap-item"
                    :key="index"
                    v-for="(img, index) in article.cover.images">

                    <van-image
                        class="cover-item"
                        fit="cover"
                        :src="img">
                    </van-image>
                </div>
            </div>

            <!-- 标签 -->
            <div class="label-wrap">
                <span>{{  article.aut_name }}</span>
                <span>{{  article.comm_count }}评论</span>
                <span>{{  article.pubdate | relativeTime }}</span>
            </div>
        </div>

        <!-- 单张封面 -->
        <van-image
        slot="default"
            v-if="article.cover.type === 1"
            fit="cover" class="right-cover" :src="article.cover.images[0]">
        </van-image>
    </van-cell>
</template>

<script>
export default {
    name: 'ArticleItem',
    data() {
        return {}
    },
    props: {
        article: {
            type: Object,
            required: true
        }
    }
}
</script>

<style lang="less" scoped>
    .article-item {
        .title {
            font-size: 16px;
            color: #3a3a3a;
        }
        .van-cell__value {
            flex: unset;
            width: 116px;
            height: 73px;
            margin-left: 12px;
        }
        .right-cover {
            width: 116px;
            height: 73px;
        }
        // 三张封面
        .cover-wrap {
            display: flex;
            padding: 15px 0;
            .cover-wrap-item {
                flex: 1;
                height: 73px;
                &:not(:last-child) {
                    padding-right: 4px;
                }
                .cover-item {
                    width: 100%;
                    height: 73px;
                }
            }
        }

        // 底部标签
        .label-wrap {
            font-size: 12px;
            color: #b4b4b4;
            span {
                margin-right: 12px;
            }
        }
    }
</style>