<template>
    <el-container style="height: 800px;">
        <el-header height="150px">
            <el-row>
                <el-col :span="12" :offset="6">
                    <img src='../../assets/2018_New_Logo.png'
                      height="250px"
                      width="250px">
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-row>
                <el-col :span="18" :offset="3">
                    <h1 class="title-color">永恆生活產品(香港) - 會議室預訂系統</h1>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" :offset="6">
                    <el-form :model="loginForm" :rules="rules" label-width="80px">
                        <el-form-item label="FBO ID" prop="username" size="medium">
                            <el-input v-model="loginForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password" size="medium">
                            <el-input type="password" v-model="loginForm.password"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-alert
                                :title="loginForm.userError"
                                type="error"
                                v-show="loginForm.userError">
                            </el-alert>
                            <el-button type="primary" @click="onSubmit">登录</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
// import api from '@/utils/api'
import { login } from '../../utils/api'
export default {
  data () {
    return {
      logo: 'url(' + require('../../assets/2018_New_Logo.png') + ')',
      loginForm: {
        username: '',
        password: '',
        userError: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入FBO ID', trigger: 'blur' },
          { min: 12, max: 12, message: '请输入长度为12位的FBO ID', trigger: 'blur' },
          { pattern: /^852\d{9}$/, message: '请输入正确的FBO ID', trigger: 'blur' }
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 16, message: '请输入长度6位的密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      var that = this
      const params = {
        username: this.loginForm.username,
        password: this.loginForm.password
      }
      if (params.username === '852000000000') {
        this.$router.push({name: 'checkIn'})
      } else if (params.username && params.password) {
        login(params).then(res => {
          if (res.data.token) {
            localStorage.token = res.data.token
          }
          this.$router.push({name: 'home'})
        }).catch(function (error) {
          console.log(error)
          if ('non_field_errors' in error) {
            that.loginForm.userError = 'FBO ID 或 密碼錯誤'
          }
        })
      }
    }
  }
}
</script>

<style>
body {
  background-image: url('../../assets/bg2.jpg')
}

.title-color {
  color: #6ebd51;
  font-size: 40px
}

.form-name {
  font-size: 50px
}
</style>
