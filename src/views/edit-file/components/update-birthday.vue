<!-- 修改生日组件 -->
<template>
  <div class="update-birthday">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="$emit('close')"
        @confirm='confirm'
      />
  </div>
</template>

<script>

import { EditUserProfile } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'UpdateBirthday',
  data () {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },

  props: {
      value: {
        type: String,
        required: true
      }
  },

  components: {},

  methods: {
    // 点击确定，修改生日
    async confirm() {
        const date = dayjs(this.currentDate).format('YYYY-MM-DD')
        console.log(date)

        try {
            // 请求接口
            await EditUserProfile({
                birthday: date
            })
             // 修改父组件的值
            this.$emit('input', date)
            // 关闭弹出层
            this.$emit('close')
            // 提醒
            this.$toast.success('修改成功')
        } catch (err) {
            console.log(err)
        }
    }
  }
}

</script>
<style lang='less' scoped>
</style>