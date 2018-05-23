<template>
    <el-container style="height: 500px;">
        <el-header height="180px">
            <el-row>
                <el-col :span="6"><div style="float: left;">Service: 23699638</div></el-col>
                <el-col :span="6" :offset="12">
                    <el-popover
                      placement="bottom"
                      width="200"
                      style="float: right;">
                      <p>FBO ID：{{fbo_id}}</p>
                      <p>Current Token: {{current_token}}</p>
                      <p>Next Token: {{next_token}}</p>
                      <div style="text-align: right; margin: 0">
                        <el-button type="primary" size="mini" @click="logout">退出</el-button>
                      </div>
                      <el-button slot="reference" size="medium" round>{{name}}</el-button>
                    </el-popover>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6"><div class="">LOGO</div></el-col>
                <el-col :span="6"><div style="float: left;">Booking Online</div></el-col>
            </el-row>
        </el-header>
        <el-container>
            <el-aside>
                <el-menu :router="isRoute">
                    <el-menu-item index="/book">
                      <template slot="title">Room Booking</template></el-menu-item>
                    <el-menu-item index="/manage">
                      <template slot="title">Manage Booking</template></el-menu-item>
                    <el-menu-item index="/history">
                      <template slot="title">View Booking</template></el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
              <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
// import api from '@/utils/api'
import { getUserDetail } from '../../utils/api'
import {mapState, mapActions} from 'vuex'
export default {
  data () {
    return {
      isRoute: true,
      name: '',
      fbo_id: ''
    }
  },
  computed: {
    ...mapState('user', ['current_token', 'next_token', 'level'])
  },
  methods: {
    ...mapActions('user', ['changeUserInfo']),
    getuserInfo () {
      getUserDetail().then(res => {
        this.name = res.data.name
        this.fbo_id = res.data.fbo_id
        this.changeUserInfo({
          current_token: res.data.token_current,
          next_token: res.data.token_next,
          level: res.data.level
        })
      })
    },
    logout () {
      localStorage.clear()
      this.$router.push({name: 'login'})
    }
  },
  mounted () {
    this.getuserInfo()
  }
}
</script>

<style>
.el-row{
  margin-bottom: 20px;
}

.bg-purple {
    background: #d3dce6;
}

.el-header, .el-footer {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    color: #333;
    text-align: center;
  }

  body > .el-container {
    margin-bottom: 40px;
  }
</style>
