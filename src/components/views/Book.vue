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
                    @change="handleDateChange"
                  ></el-date-picker>
              </div>
              <el-row :gutter="20">
                <el-col :span="4" v-for="(timeInfo, index) in timeInfos" :key="index">
                  <el-tooltip class="item" effect="light" placement="bottom">
                    <div slot="content" v-html="timeInfo.content"></div>
                    <div><el-button :type="timeInfo.type" :disabled="timeInfo.a_disabled" @click="handleTimeChange(timeInfo.time, timeInfo.value)">
                      {{timeInfo.time}}</el-button></div>
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
import {mapState} from 'vuex'
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
          time: '10:30 - 13:00',
          type: 'primary',
          content: '可預訂',
          a_disabled: false
        },
        {
          value: 'B',
          time: '13:00 - 15:00',
          type: 'primary',
          content: '可預訂',
          a_disabled: false
        },
        {
          value: 'C',
          time: '15:00 - 17:00',
          type: 'primary',
          content: '可預訂',
          a_disabled: false
        },
        {
          value: 'D',
          time: '17:00 - 19:00',
          type: 'primary',
          content: '可預訂',
          a_disabled: false
        },
        {
          value: 'E',
          time: '19:00 - 21:00',
          type: 'primary',
          content: '可預訂',
          a_disabled: false
        }
      ],
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 24 * 3600 * 1000
        }
      },
      date: new Date(),
      roomId: '1',
      selected_time: '',
      selected_time_value: ''
    }
  },
  computed: {
    ...mapState('user', ['current_token', 'next_token', 'level']),
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
    },
    g_disabled () {
      if (this.roomId === '7') {
        if (this.level === '5') {
          return false
        } else {
          return true
        }
      }
      return false
    }
  },
  methods: {
    handleRoomChange (tab) {
      this.getTimeInfo()
    },
    handleDateChange (time) {
      this.getTimeInfo()
    },
    handleTimeChange (time, value) {
      this.selected_time = time
      this.selected_time_value = value
    },
    confirm () {
      var date = this.date.getFullYear() +
                '-' +
                String(this.date.getMonth() + 1).padStart(2, '00') +
                '-' +
                this.date.getDate()
      const h = this.$createElement
      this.$msgbox({
        title: '確認預定信息',
        message: h('p', null, [
          h('span', null, ' ' + date + '  '),
          h('span', null, ' ' + this.selected_time + '  '),
          h('i', { style: 'color: teal' }, '  ' + this.rooms.find(v => v.id === this.roomId).info)
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
              }, 200)
            }, 1000)
          } else {
            done()
          }
        }
      }).then(action => {
        var bookingId = this.date.getFullYear() +
                        String(this.date.getMonth() + 1).padStart(2, '00') +
                        this.date.getDate() +
                        this.roomId +
                        this.selected_time_value
        if (parseInt(date.split('-')[1]) === new Date().getMonth() + 1) {
          if (this.current_token > 0) {
            let params = {
              booking_room: this.roomId,
              booking_day: date,
              booking_time: this.selected_time_value,
              reference_id: bookingId,
              is_current_month: true
            }
            this.$http.post(api.user_booking, params).then(res => {
              console.log(res)
              this.$message({
                type: 'success',
                message: '预订成功！'
              })
            }).catch(err => {
              console.log(err)
              this.$message({
                type: 'error',
                message: '预订失败,目前该房已被预订'
              })
            })
          } else {
            this.$message({
              type: 'waring',
              message: '预订失败,当前月代币不足'
            })
          }
        } else {
          if (this.next_token > 0) {
            let params = {
              booking_room: this.roomId,
              booking_day: date,
              booking_time: this.selected_time_value,
              reference_id: bookingId,
              is_current_month: false
            }
            this.$http.post(api.user_booking, params).then(res => {
              console.log(res)
              this.$message({
                type: 'success',
                message: '预订成功！'
              })
            }).catch(err => {
              console.log(err)
              this.$message({
                type: 'error',
                message: '预订失败,目前该房已被预订'
              })
            })
          } else {
            this.$message({
              type: 'waring',
              message: '预订失败,下月代币不足'
            })
          }
        }
      })
    },
    getTimeInfo () {
      var date = this.date
      // 初始化时间按钮
      this.timeInfos.forEach(v => {
        v.type = 'primary'
        v.content = '可預訂'
        v.a_disabled = false
        if (v.value === 'A') {
          v.time = '10:30 - 13:00'
        } else if (v.value === 'B') {
          v.time = '13:00 - 15:00'
        } else if (v.value === 'C') {
          v.time = '15:00 - 17:00'
        }
      })
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
        // 初始化每个按钮的可选状态
        // this.timeInfos.forEach(time => {
        // })
        // 处理booking的返回数据
        res.data.forEach(element => {
          // 把预定时间段的type设置为info,content设置为“已預訂”并显示预定人的名字
          let timeInfo = this.timeInfos.find(
            v => v.value === element.booking_time
          )
          if (element.status === 'reserved') {
            timeInfo.type = 'info'
            timeInfo.a_disabled = true
            timeInfo.content = '已預訂<br>預訂人：' + element.booking_user.name
          } else if (element.status === 'show') {
            timeInfo.type = 'info'
            timeInfo.a_disabled = true
            timeInfo.content = '已使用<br>預訂人：' + element.booking_user.name
          } else if (element.status === 'no_show') {
            timeInfo.type = 'danger'
            timeInfo.a_disabled = true
            timeInfo.content = '缺席<br>預訂人：' + element.booking_user.name
          }
        })
        // 如果是周六，A段显示时间改变,E段时间不可选
        if (date.getDay() === 6) {
          this.timeInfos.forEach(timeInfo => {
            if (timeInfo.value === 'A') {
              timeInfo.time = '11:00 - 13:00'
            } else if (timeInfo.value === 'E') {
              timeInfo.a_disabled = true
              timeInfo.content = '该时段星期六不可选'
            }
          })
        } else if (date.getDay() === 0) {
          // 如果是周日，每个时间段显示改变,切DE不可选
          this.timeInfos.forEach(timeInfo => {
            if (timeInfo.value === 'A') {
              timeInfo.time = '12:00 - 14:00'
            } else if (timeInfo.value === 'B') {
              timeInfo.time = '14:00 - 16:00'
            } else if (timeInfo.value === 'C') {
              timeInfo.time = '16:00 - 18:00'
            } else if (timeInfo.value === 'D') {
              timeInfo.a_disabled = true
              timeInfo.content = '该时段星期天不可选'
            } else if (timeInfo.value === 'E') {
              timeInfo.a_disabled = true
              timeInfo.content = '该时段星期天不可选'
            }
          })
        }
        // 如果是G房，小于5的用户全部不可选，工作日AB段时间不可选
        if (this.roomId === '7') {
          if (date.getDay() >= 1 && date.getDay() <= 5) {
            this.timeInfos.forEach(time => {
              if (time.value === 'A') {
                time.a_disabled = true
                time.content = '工作日该时段不可选'
              } else if (time.value === 'B') {
                time.a_disabled = true
                time.content = '工作日该时段不可选'
              }
            })
          }
          if (this.level !== '5') {
            this.timeInfos.forEach(time => {
              time.a_disabled = true
              time.content = '不可选'
            })
          }
        }
        // 当前已过时间不可选
      })
    }
  },
  mounted () {
    this.getTimeInfo()
  }
}
</script>

<style>

</style>
