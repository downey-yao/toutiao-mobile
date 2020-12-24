<!-- 修改性别组件 -->
<template>
  <div class="update-gender">
    <van-picker
        show-toolbar
        :columns="columns"
        @cancel="$emit('close')"
        @confirm="onConfirm"
    />
  </div>
</template>

<script>

import { EditUserProfile } from '@/api/user'

export default {
  name: 'UpdateGender',
  data () {
    return {
        columns: ['男', '女']
    }
  },

  components: {},

  methods: {
    // 点击确定，修改性别
    async onConfirm() {
        console.log('onConfirm')
        // 请求接口，更新性别
        const newGender = this.columns ? 0 : 1
        const res = await EditUserProfile({
            gender: newGender
        })

        if (res.status !== 201) {
            this.$toast.fail('修改失败')
        }

        this.$emit('update-gender', newGender)

        this.$toast.success('修改成功')

        this.$emit('close')
    }
  }
}

</script>
<style lang='less' scoped>
</style>