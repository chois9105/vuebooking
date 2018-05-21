<template>
    <el-tabs type="border-card" v-model="roomId" tab-position="top" @tab-click="handleRoomChange">
      <el-tab-pane v-for="(room, index) in rooms" :label="room.label" :key="index" :name="room.id">
          <el-card class="box-card">
              <div slot="header">
                  <div>{{roomNow}}</div>
                  <p v-show="a_requirement">該房只限15人以上之活動租用</p>
                  <p v-show="g_requirement">該房只限2.5K環球年會得主租用</p>
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
                  <el-button type="success" @click="confirmBook">點擊預定</el-button>
                </el-col>
              </el-row>
          </el-card>
      </el-tab-pane>
    </el-tabs>
</template>

<script>
import api from '@/utils/api'
import {mapState, mapActions} from 'vuex'
export default {
  data () {
    return {
      rooms: [
        {
          id: '1',
          label: 'A房',
          info: '會議室A'
        },
        {
          id: '2',
          label: 'B房',
          info: '會議室B'
        },
        {
          id: '3',
          label: 'C房',
          info: '會議室C'
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
          info: '會議室G'
        },
        {
          id: '8',
          label: 'H房',
          info: '會客室H'
        },
        {
          id: '9',
          label: 'I房',
          info: '會客室I'
        },
        {
          id: '10',
          label: 'J房',
          info: '會客室J'
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
    // 控制A房提醒信息
    a_requirement () {
      if (this.roomId === '1') {
        return true
      }
      return false
    },
    // 控制G房提醒信息
    g_requirement () {
      if (this.roomId === '7') {
        return true
      }
      return false
    }
  },
  methods: {
    ...mapActions('user', ['minusCurrentToken', 'minusNextToken']),
    // 選擇房間
    handleRoomChange (tab) {
      this.getTimeInfo()
    },
    // 選擇日期
    handleDateChange (time) {
      this.getTimeInfo()
    },
    // 選擇時間
    handleTimeChange (time, value) {
      this.selected_time = time
      this.selected_time_value = value
    },
    // 提交預訂
    confirmBook () {
      // 選中的日期，如：2018-05-20
      var date = this.date.getFullYear() +
                '-' +
                String(this.date.getMonth() + 1).padStart(2, '00') +
                '-' +
                this.date.getDate()
      const h = this.$createElement
      // 確認提交的數據
      this.$msgbox({
        title: '確認預定信息:',
        message: h('p', null, [
          h('span', null, ' ' + date + '  '),
          h('span', null, ' ' + this.selected_time + '  '),
          h('i', { style: 'color: teal' }, '  ' + this.rooms.find(v => v.id === this.roomId).info)
        ]),
        showCancelButton: true,
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '請稍等...'
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
        // 點擊確認后，想後台發送預訂數據
        // 生成二維碼，如：201805209D
        let bookingId = this.date.getFullYear() +
                        String(this.date.getMonth() + 1).padStart(2, '00') +
                        this.date.getDate() +
                        this.roomId +
                        this.selected_time_value
        // 判斷是否預訂的日期是否為當月
        if (parseInt(date.split('-')[1]) === new Date().getMonth() + 1) {
          // 如果是當月，則is_current_month為true，並且判斷當月代幣是否足夠
          if (this.current_token > 0) {
            let params = {
              booking_room: this.roomId,
              booking_day: date,
              booking_time: this.selected_time_value,
              booking_weekday: this.date.getDay(),
              reference_id: bookingId,
              is_current_month: true
            }
            this.$http.post(api.user_booking, params).then(res => {
              // 預訂成功則及時扣除當月代幣
              this.minusCurrentToken(1)
              this.$message({
                type: 'success',
                message: '预订成功！'
              })
            }).catch(err => {
              // 預訂失敗則是因為reference_id不唯一，即可能已經被人預訂
              console.log(err)
              this.$message({
                type: 'error',
                message: '预订失败,目前该房已被预订'
              })
            })
          } else {
            // 如果當月代幣不足，則顯示提醒消息
            this.$message({
              type: 'waring',
              message: '预订失败,当前月代币不足'
            })
          }
        } else {
          // 如果是下月，則is_current_month為false，並且判斷下月代幣是否足夠
          if (this.next_token > 0) {
            let params = {
              booking_room: this.roomId,
              booking_day: date,
              booking_time: this.selected_time_value,
              reference_id: bookingId,
              is_current_month: false
            }
            this.$http.post(api.user_booking, params).then(res => {
              // 預訂成功則及時扣除下月代幣
              this.minusNextToken(1)
              this.$message({
                type: 'success',
                message: '预订成功！'
              })
            }).catch(err => {
              console.log(err)
              // 預訂失敗則是因為reference_id不唯一，即可能已經被人預訂
              this.$message({
                type: 'error',
                message: '预订失败,目前该房已被预订'
              })
            })
          } else {
            // 如果下月代幣不足，則顯示提醒消息
            this.$message({
              type: 'waring',
              message: '预订失败,下月代币不足'
            })
          }
        }
      })
    },
    // 獲取預訂
    getTimeInfo () {
      // 調用時間選項初始化函數
      this.initTimeInfo()
      // 準備get預訂記錄篩選條件
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
      // 請求滿足篩選條件的所有預訂記錄
      this.$http.get(api.booking, { params }).then(res => {
        res.data.forEach(el => {
          // 將獲取到的預訂記錄賦值給對應時間段
          let timeInfo = this.timeInfos.find(
            v => v.value === el.booking_time
          )
          if (el.status === 'reserved') {
            // 如果該記錄是已被預訂，則顯示灰色，且禁選按鈕，消息提示預訂人
            timeInfo.type = 'info'
            timeInfo.a_disabled = true
            timeInfo.content = '已預留<br>預訂人：' + el.booking_user.name
          } else if (el.status === 'show') {
            // 如果該記錄是已使用，則顯示灰色，且禁選按鈕，消息提示預訂人
            timeInfo.type = 'info'
            timeInfo.a_disabled = true
            timeInfo.content = '已使用<br>預訂人：' + el.booking_user.name
          } else if (el.status === 'no_show') {
            // 如果該記錄是缺席，則顯示紅色，且禁選按鈕，消息提示預訂人
            timeInfo.type = 'danger'
            timeInfo.a_disabled = true
            timeInfo.content = '缺席<br>預訂人：' + el.booking_user.name
          }
        })
      })
    },
    // 初始化時間選項
    initTimeInfo () {
      // 將當前選定時間賦值給全局變量date(Date類)
      var date = this.date
      // 根据业务需求，分工作日、周六、周日初始化时间選項
      let timeCommonValue = {
        A: '10:30 - 13:00',
        B: '13:00 - 15:00',
        C: '15:00 - 17:00',
        D: '17:00 - 19:00',
        E: '19:00 - 21:00'
      }
      let timeSatValue = {
        A: '11:00 - 13:00'
      }
      let timeSunValue = {
        A: '12:00 - 14:00',
        B: '14:00 - 16:00',
        C: '16:00 - 18:00'
      }
      this.timeInfos.forEach(timeInfo => {
        if (date.getDay() === 6) {
          if (timeInfo.value === 'A') {
            timeInfo.type = 'primary'
            timeInfo.content = '可預訂'
            timeInfo.a_disabled = false
            timeInfo.time = timeSatValue.A
          } else if (timeInfo.value === 'E') {
            timeInfo.type = 'info'
            timeInfo.content = '該時段週六不可預訂'
            timeInfo.a_disabled = true
            timeInfo.time = timeCommonValue.E
          } else {
            timeInfo.type = 'primary'
            timeInfo.content = '可預訂'
            timeInfo.a_disabled = false
            timeInfo.time = timeCommonValue[timeInfo.value]
          }
        } else if (date.getDay() === 0) {
          if (timeInfo.value === 'D' || timeInfo.value === 'E') {
            timeInfo.type = 'info'
            timeInfo.content = '該時段週日不可預訂'
            timeInfo.a_disabled = true
            timeInfo.time = timeCommonValue[timeInfo.value]
          } else {
            timeInfo.type = 'primary'
            timeInfo.content = '可預訂'
            timeInfo.a_disabled = false
            timeInfo.time = timeSunValue[timeInfo.value]
          }
        } else {
          timeInfo.type = 'primary'
          timeInfo.content = '可預訂'
          timeInfo.a_disabled = false
          timeInfo.time = timeCommonValue[timeInfo.value]
        }
      })
      // 根据G房业务需求，小于5的用户全部不可选，工作日AB段时间不可选
      if (this.roomId === '7') {
        if (date.getDay() >= 1 && date.getDay() <= 5) {
          this.timeInfos.forEach(time => {
            if (time.value === 'A') {
              time.a_disabled = true
              time.type = 'info'
              time.content = '工作日該時段不可预订'
            } else if (time.value === 'B') {
              time.a_disabled = true
              time.type = 'info'
              time.content = '工作日該時段不可预订'
            }
          })
        }
        if (this.level !== '5') {
          this.timeInfos.forEach(time => {
            time.a_disabled = true
            time.type = 'info'
            time.content = '不可预订'
          })
        }
      }
      // 如果選擇為當天日期，則需判斷当前时间，已過不可选
      var choseDay = date.getFullYear() +
                    String(date.getMonth() + 1).padStart(2, '00') +
                    date.getDate()
      var today = new Date().getFullYear() +
                  String(new Date().getMonth() + 1).padStart(2, '00') +
                  new Date().getDate()
      if (choseDay === today) {
        this.timeInfos.forEach(time => {
          if (time.value === 'A') {
            if (new Date().getDay() === 6) {
              if (new Date().getHours() >= 11) {
                time.a_disabled = true
                time.content = '时间段已过'
              }
            } else if (new Date().getDay() === 0) {
              if (new Date().getHours() >= 12) {
                time.a_disabled = true
                time.content = '时间段已过'
              }
            } else {
              if (new Date().getHours() > 10 || (new Date().getHours() === 10 && new Date().getMinutes >= 30)) {
                time.a_disabled = true
                time.content = '时间段已过'
              }
            }
          } else if (time.value === 'B') {
            if (new Date().getDay() === 0) {
              if (new Date().getHours() >= 14) {
                time.a_disabled = true
                time.content = '时间段已过'
              }
            } else {
              if (new Date().getHours() >= 13) {
                time.a_disabled = true
                time.content = '时间段已过'
              }
            }
          } else if (time.value === 'C') {
            if (new Date().getDay() === 0) {
              if (new Date().getHours() >= 16) {
                time.a_disabled = true
                time.content = '时间段已过'
              }
            } else {
              if (new Date().getHours() >= 15) {
                time.a_disabled = true
                time.content = '时间段已过'
              }
            }
          } else if (time.value === 'D') {
            if (new Date().getHours() >= 17) {
              time.a_disabled = true
              time.content = '时间段已过'
            }
          } else if (time.value === 'E') {
            if (new Date().getHours() >= 19) {
              time.a_disabled = true
              time.content = '时间段已过'
            }
          }
        })
      }
    }
  },
  mounted () {
    this.getTimeInfo()
  }
}
</script>

<style>

</style>
