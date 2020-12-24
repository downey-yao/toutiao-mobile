<!-- 实现编辑资料功能 -->
<template>
  <div class="edit-file">
      <!-- 导航栏 -->
      <van-nav-bar
       class="app-nav-bar"
        title="个人信息"
        left-arrow
        @click-left="$router.back()"
      />

      <!-- 资料单元格 -->
      <van-cell title="头像" is-link center>
        <van-image
            slot="default"
            width="30"
            height="30"
            fit
            round
            :src="user.photo"
        />
      </van-cell>
      <van-cell
        title="昵称"
        is-link
        :value="user.name"
        @click="isEditNameShow = true">
      </van-cell>
      <van-cell title="性别"
        is-link
        :value="user.gender === 0 ? '男' : '女'"
        @click="isEditGenderShow = true"
      ></van-cell>
      <van-cell
        title="生日"
        is-link
        :value="user.birthday"
        @click="isEditBirthdayShow = true"
      ></van-cell>

      <!-- 修改昵称弹出框 -->
      <van-popup
        v-model="isEditNameShow"
        position="bottom"
        round
        :style="{ height: '70%' }"
        >
          <edit-name
            @close="isEditNameShow = false"
            @update-name="user.name = $event"
            :name="user.name"
          ></edit-name>
      </van-popup>

      <!-- 修改性别弹出框 -->
      <van-popup
        v-model="isEditGenderShow"
        position="bottom"
        round
        >
          <update-gender
            @close="isEditGenderShow = false"
            @update-gender="user.gender = $event"
          ></update-gender>
      </van-popup>

      <!-- 修改生日弹出框 -->
      <van-popup
        v-model="isEditBirthdayShow"
        position="bottom"
        round
        >
          <update-birthday
            @close="isEditBirthdayShow = false"
            v-model="user.birthday"
          ></update-birthday>
      </van-popup>

  </div>
</template>

<script>

import EditName from './components/edit-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import { getUserProfile } from '@/api/user'

export default {
  name: 'EditFile',
  data () {
    return {
        // 用户的资料数据
        user: {},
        // 控制修改昵称的弹出层
        isEditNameShow: false,
        // 控制修改昵称的弹出层
        isEditGenderShow: false,
        // 控制修改生日的弹出层
        isEditBirthdayShow: false
    }
  },

  components: {
      EditName,
      UpdateGender,
      UpdateBirthday
  },

  created() {
      this.loadUserProfile()
  },

  computed: {},

  methods: {
    // 获取用户个人资料
    async loadUserProfile() {
        const { data } = await getUserProfile()
        // console.log(data)
        this.user = data.data
    }
  }
}

</script>
<style lang='less' scoped>

.van-popup {
    background-color: #F7F8FA;
}
</style>