<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="QRcode">
      <el-input v-model="form.qrcode" clearable></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="checkInBooking">立即簽到</el-button>
    </el-form-item>
</el-form>
</template>

<script>
import { checkInBooking } from '../../utils/api'
export default {
  data () {
    return {
      form: {
        qrcode: ''
      }
    }
  },
  methods: {
    checkInBooking () {
      let fboId = this.form.qrcode.split('-')[0]
      let referenceId = this.form.qrcode.split('-')[1]
      let params = {
        status: 'show',
        fbo_id: fboId,
        reference_id: referenceId
      }
      checkInBooking(referenceId, params).then(res => {
        console.log(res)
        this.$message({
          type: 'success',
          message: '簽到成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message({
          type: 'error',
          message: '簽到失敗'
        })
      })
    }
  }
}
</script>
