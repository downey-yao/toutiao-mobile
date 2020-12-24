<!-- 修改昵称 -->
<template>
  <div class="edit-name">
    <van-nav-bar
        title="修改昵称"
        left-text="返回"
        right-text="确定"
        left-arrow
        @click-left="$emit('close')"
        @click-right="onConfirm"
    />

    <!-- 输入框 -->
    <van-field
        v-model="localName"
        rows="1"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
    />
  </div>
</template>

<script>

import { EditUserProfile } from '@/api/user'

export default {
  name: 'EditName',
  data () {
    return {
        // 昵称数据
        localName: this.name
    }
  },

  props: {
    name: {
        type: String,
        required: true
    }
  },

  components: {},

  computed: {},

  methods: {
    // 点击确定，修改昵称
    async onConfirm() {
        this.$toast.loading({
            message: '正在保存',
            forbidClick: true
        })
        try {
            await EditUserProfile({
                name: this.localName
            })
            // 在父组件中修改值
            this.$emit('update-name', this.localName)
            this.$toast.success('修改成功')

            this.$emit('close')
        } catch (err) {
            // 请求更新昵称
            if (err && err.response && err.response.status === 409) {
                this.$toast.fail('昵称已存在')
            }
        }
    }
  }
}

</script>
<style lang='less' scoped>

.van-field {
    // margin: 10px;
}
</style>