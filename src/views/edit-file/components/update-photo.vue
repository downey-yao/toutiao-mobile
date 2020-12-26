<!-- 修改头像 -->
<template>
  <div class="update-photo">
      <img class="image" :src="image" alt="" ref="image">

      <van-nav-bar
        class="toolbar"
        left-text="取消"
        right-text="确定"
        left-arrow
        @click-left="$emit('close')"
        @click-right="onConfirm"
      ></van-nav-bar>
  </div>
</template>

<script>

import { editUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  name: 'UpdatePhoto',
  data () {
    return {
        image: window.URL.createObjectURL(this.file),
        // 裁切器 对象
        cropper: null
    }
  },

  props: {
    file: {
        // type: String,
        required: true
    }
  },

  components: {},

  mounted() {
    //获取需要 裁切的 图片DOM
    const image = this.$refs.image

    this.cropper = new Cropper(image, {
        viewMode: 1,
        dragMode: 'move',
        aspectRatio: 1,
        cropBoxMovable: false,
        cropBoxResizable: false,
        background: false,
        movable: true
    })
  },

  methods: {
    // 上传 将 getCroppedCanvas() 方法 包装成promise方法
    getCroppedCanvas() {
      return new Promise((resolve) => {
          this.cropper.getCroppedCanvas().toBlob((file) => {
              resolve(file)
          })
      })
    },
    // 点击确定
    async onConfirm() {
        this.$toast.loading({
            message: '正在保存',
            // 禁止背景点击
            forbidClick: true,
            // 持续时间：0 表示 持续展示
            duration: 0

        })

        /* 处理裁切后 的图像(bolb类型) 去上传 */
        const file = await this.getCroppedCanvas()
        // console.log(file)
        // Blob {size: 1141669,type:"image/png"}
        const fd = new FormData()
        fd.append('photo', file)

        /* 如果Content-Type 是 multipart/form-data,
            一定要提交 fromdata 数据对象，专门用于上传文件，不能提交{} 没用 */
        // const fd = new FormData()
        // fd.append('photo', this.file)
        // 发送请求
        await editUserPhoto(fd)

        // 更新父组件的头像
        this.$emit('update-photo', window.URL.createObjectURL(file))
        // console.log(window.URL.createObjectURL(file))  blob:http://localhost:8080/41cc58f9-0e78-4aff-898c-04a9317fcfc9
        // 关闭弹出层
        this.$emit('close')
        this.$toast.success('保存成功')
    }
  }
}

</script>
<style lang='less' scoped>
.toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #000;
}

/* 确保图片沾满 整个盒子 */
.image {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>