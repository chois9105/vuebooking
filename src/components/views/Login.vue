<template>
    <el-container>
        <el-header height="150px">
            <el-row>
                <el-col :span="12" :offset="6">
                    <div>LOGO</div>
                </el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-row>
                <el-col :span="12" :offset="6">
                    <h1>永恒生活产品 - 房间预订系统</h1>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" :offset="6">
                    <el-form :model="loginForm" :rules="rules" label-width="80px">
                        <el-form-item label="FBO ID" prop="username">
                            <el-input v-model="loginForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
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
import api from '@/utils/api'
export default {
  data () {
    return {
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
          {min: 6, max: 16, message: '请输入长度在6-8位的密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      const params = {
        username: this.loginForm.username,
        password: this.loginForm.password
      }
      if (params.username && params.password) {
        this.$http.post(api.login, params).then(res => {
        // 登录成功
          console.log(res.data)
          if (res.data.token) {
            localStorage.token = res.data.token
            console.log('token is storaged')
          }
          this.$router.push({name: 'home'})
        }).catch(function (error) {
          if ('non_field_errors' in error) {
            this.loginForm.userError = error.non_field_errors[0]
          }
        })
      }
    }
  }
}
</script>
