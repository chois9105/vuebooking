<template>
    <el-tabs type="border-card" v-model="roomId" tab-position="top" @tab-click="handleRoomChange">
      <el-tab-pane v-for="(room, index) in rooms" :label="room.label" :key="index" :name="room.id">
          <el-card class="box-card">
              <div slot="header">
                  <div>{{roomNow}}</div>
                  <p v-show="a_requirement">该房只限15人以上活动预订</p>
                  <p v-show="g_requirement">该房只限2.5K环球年会得主租用</p>
                  <el-date-picker
                    v-model="date"
                    type="date"
                    :picker-options="pickerOptions"
                    @change="handleTimeChange"
                  ></el-date-picker>
              </div>
              <el-row :gutter="20">
                <el-col :span="4" v-for="(timeInfo, index) in timeInfos" :key="index">
                  <el-tooltip class="item" effect="light" placement="bottom">
                    <div slot="content" v-html="timeInfo.content"></div>
                    <el-button :type="timeInfo.type">{{timeInfo.time}}</el-button>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8" :offset="8">
                  <el-button type="success" @click="confirm">點擊預定</el-button>
                </el-col>
              </el-row>
          </el-card>
      </el-tab-pane>
    </el-tabs>
</template>

<script>
import api from '@/utils/api'
export default {
  data () {
    return {
      rooms: [
        {
          id: '1',
          label: 'A房',
          info: '大型會議室A'
        },
        {
          id: '2',
          label: 'B房',
          info: '大型會議室B'
        },
        {
          id: '3',
          label: 'C房',
          info: '大型會議室C'
        },
        {
          id: '4',
          label: 'D房',
          info: '美容房D'
        },
        {
          id: '5',
          label: 'E房',
          info: '美容房E'
        },
        {
          id: '6',
          label: 'F房',
          info: '美容房F'
        },
        {
          id: '7',
          label: 'G房',
          info: '特別會議室G'
        },
        {
          id: '8',
          label: 'H房',
          info: '公眾會議室H'
        },
        {
          id: '9',
          label: 'I房',
          info: '公眾會議室I'
        },
        {
          id: '10',
          label: 'J房',
          info: '公眾會議室J'
        }
      ],
      timeInfos: [
        {
          value: 'A',
          time: '10:00 - 12:00',
          type: 'success',
          content: '可預訂'
        },
        {
          value: 'B',
          time: '12:00 - 14:00',
          type: 'success',
          content: '可預訂'
        },
        {
          value: 'C',
          time: '14:00 - 16:00',
          type: 'success',
          content: '可預訂'
        },
        {
          value: 'D',
          time: '16:00 - 18:00',
          type: 'success',
          content: '可預訂'
        },
        {
          value: 'E',
          time: '18:00 - 20:00',
          type: 'success',
          content: '可預訂'
        },
        {
          value: 'F',
          time: '20:00 - 22:00',
          type: 'success',
          content: '可預訂'
        }
      ],
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 24 * 3600 * 1000
        }
      },
      // 时间
      date: new Date(),
      // 房间id
      roomId: '1'
      // 用户名
    }
  },
  computed: {
    roomNow () {
      return this.rooms.find(v => v.id === this.roomId).info
    },
    a_requirement () {
      if (this.roomId === '1') {
        return true
      }
      return false
    },
    g_requirement () {
      if (this.roomId === '7') {
        return true
      }
      return false
    }
  },
  methods: {
    handleRoomChange (tab) {
      this.getTimeInfo()
    },
    handleTimeChange (time) {
      this.getTimeInfo()
    },
    confirm () {
      const h = this.$createElement
      this.$msgbox({
        title: '確認預定信息',
        message: h('p', null, [
          h('span', null, ' 2018-5-11  '),
          h('span', null, ' 10:00 - 12:00  '),
          h('i', { style: 'color: teal' }, '  大型會議室A')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            setTimeout(() => {
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 300)
            }, 3000)
          } else {
            done()
          }
        }
      }).then(action => {
        this.$message({
          type: 'info',
          message: 'action: ' + action
        })
      })
    },
    getTimeInfo () {
      // 初始化时间信息
      this.timeInfos.forEach(v => {
        v.type = 'success'
        v.content = '可預訂'
      })
      let date = this.date
      let params = {
        booked_room: this.roomId,
        booked_day:
          date.getFullYear() +
          '-' +
          String(date.getMonth() + 1).padStart(2, '00') +
          '-' +
          date.getDate()
      }
      this.$http.get(api.booking, { params }).then(res => {
        // 处理booking的返回数据
        console.log(res.data)
        res.data.forEach(element => {
          // 把预定时间段的type设置为info,content设置为“已預訂”并显示预定人的名字
          let timeInfo = this.timeInfos.find(
            v => v.value === element.booking_time
          )
          if (element.status === 'reserved') {
            timeInfo.type = 'info'
            timeInfo.content = '已預訂<br>預訂人：' + element.booking_user.name
          } else if (element.status === 'cancelled') {
            timeInfo.type = 'warning'
            timeInfo.content = '已取消<br>預訂人：' + element.booking_user.name
          } else if (element.status === 'show') {
            timeInfo.type = 'info'
            timeInfo.content = '已使用<br>預訂人：' + element.booking_user.name
          } else if (element.status === 'no_show') {
            timeInfo.type = 'danger'
            timeInfo.content = '缺席<br>預訂人：' + element.booking_user.name
          }
        })
      })
    }
  },
  mounted () {
    this.getTimeInfo()
  }
}
</script>
