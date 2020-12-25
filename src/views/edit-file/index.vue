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

      <!-- 选择图片 -->
      <input type="file" hidden ref="file" accept="image/*" @change="onFileChange">
      <!-- 资料单元格 -->
      <van-cell title="头像" is-link center @click="$refs.file.click()">
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
            v-if="isEditNameShow"
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
            v-if="isEditGenderShow"
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
            v-if="isEditBirthdayShow"
            @close="isEditBirthdayShow = false"
            v-model="user.birthday"
          ></update-birthday>
      </van-popup>

      <!-- 修改头像弹出框 -->
      <van-popup
        v-model="isEditPhotoShow"
        position="bottom"
        :style="{ height: '100%' }"
        >
          <update-photo
            v-if="isEditPhotoShow"
            :file="proviewImage"
            @close="isEditPhotoShow = false"
            @update-photo="user.photo = $event"
          ></update-photo>
      </van-popup>

  </div>
</template>

<script>

import EditName from './components/edit-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
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
        isEditBirthdayShow: false,
        // 控制修改头像的弹出层
        isEditPhotoShow: false,
        // 预览图片地址
        proviewImage: null
    }
  },

  components: {
      EditName,
      UpdateGender,
      UpdateBirthday,
      UpdatePhoto
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
    },

    // 选择文件 触发的事件
    onFileChange() {
      // 找到文件 对象
      const file = this.$refs.file.files[0]
      this.proviewImage = file

      // 显示弹出框
      this.isEditPhotoShow = true

      // 处理选择相同文件不会触发 change 的问题
      this.$refs.file.value = ''
    }
  }
}

</script>
<style lang='less' scoped>

.van-popup {
    background-color: #000;
}
</style>