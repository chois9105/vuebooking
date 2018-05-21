<template>
    <el-table :data="tableData" style="width: 100%">
    <el-table-column width="200px" prop="booking_day" label="预订日期">
      <template slot-scope="scope">
        <span class="info_span"><i class="el-icon-date"></i>{{ scope.row.date }}</span>
      </template>
    </el-table-column>
    <el-table-column width="200px" prop="booking_time" label="预订时间">
      <template slot-scope="scope">
        <span class="info_span"><i class="el-icon-time"></i>{{ scope.row.time }}</span>
      </template>
    </el-table-column>
    <el-table-column width="200px" prop="booking_room" label="预订房间">
      <template slot-scope="scope">
        <span class="info_span"><i class="el-icon-location"></i>{{ scope.row.room }}</span>
      </template>
    </el-table-column>
    <el-table-column width="200px" label="预订状态">
      <template slot-scope="scope">
        <el-button size="mini" type="success" style="float:left;">已预订</el-button>
      </template>
    </el-table-column>
    <el-table-column width="200px" label="选择取消">
      <template slot-scope="scope">
        <el-button size="mini" type="danger" style="float:left;" :disabled="c_disabled" @click="cancel(scope.row)">取消预订</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import api from '@/utils/api'
import {mapState, mapActions} from 'vuex'
export default {
  data () {
    return {
      tableData: [],
      c_disabled: false
    }
  },
  computed: {
    ...mapState('user', ['current_token', 'next_token', 'level'])
  },
  methods: {
    ...mapActions('user', ['addCurrentToken', 'addNextToken']),
    cancel (row) {
      const h = this.$createElement
      this.$msgbox({
        title: '確認取消該預定？',
        message: h('p', null, [
          h('span', null, ' ' + row.date + '  '),
          h('span', null, ' ' + row.time + '  '),
          h('i', { style: 'color: teal' }, '  ' + row.room)
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
              }, 150)
            }, 1000)
          } else {
            done()
          }
        }
      }).then(action => {
        let hourNow = new Date().getHours() + 2
        let minuteNow = new Date().getMinutes
        // 这里还需要加一段逻辑，用于判定预订的时间段
        if (row.timeLabel === 'A') {
          if (row.weekDay === 6) {
            var bookTime = 11
          } else if (row.weekDay === 0) {
            bookTime = 12
          } else {
            bookTime = 10
          }
        } else if (row.timeLabel === 'B') {
          if (row.weekDay === 0) {
            bookTime = 14
          } else {
            bookTime = 13
          }
        } else if (row.timeLabel === 'C') {
          if (row.weekDay === 0) {
            bookTime = 16
          } else {
            bookTime = 15
          }
        } else if (row.timeLabel === 'D') {
          bookTime = 17
        } else if (row.timeLabel === 'E') {
          bookTime = 19
        }
        // 如果是当天的取消操作，则需要判定取消的预订是否大于2小时
        var choseDay = row.date
        var today = new Date().getFullYear() +
                    '-' +
                    String(new Date().getMonth() + 1).padStart(2, '00') +
                    '-' +
                    new Date().getDate()
        if (choseDay === today) {
          if (hourNow < bookTime || (hourNow === 10 && minuteNow < 30)) {
            // 判断该预订日期是否当前月
            if (parseInt(row.date.split('-')[1]) === new Date().getMonth() + 1) {
              var params = {
                status: 'cancelled',
                reference_id: row.referenceId,
                is_current_month: true
              }
              this.addCurrentToken(1)
            } else {
              params = {
                status: 'cancelled',
                reference_id: row.referenceId,
                is_current_month: false
              }
              this.addNextToken(1)
            }
            this.$http.put(api.user_booking + row.referenceId + '/', params).then(res => {
              console.log('我打印了1' + this.tableData)
              this.getUserBooking()
              console.log('我打印了2' + this.tableData)
              this.$message({
                type: 'success',
                message: '取消成功'
              })
            }).catch(err => {
              console.log(err)
              this.$message({
                type: 'error',
                message: '取消失败'
              })
            })
          } else {
            this.$message({
              type: 'error',
              message: '现在不可取消'
            })
          }
        } else {
          // 如果不是当天就不需要判断大于两小时
          if (parseInt(row.date.split('-')[1]) === new Date().getMonth() + 1) {
            params = {
              status: 'cancelled',
              reference_id: row.referenceId,
              is_current_month: true
            }
          } else {
            params = {
              status: 'cancelled',
              reference_id: row.referenceId,
              is_current_month: false
            }
          }
          this.$http.put(api.user_booking + row.referenceId + '/', params).then(res => {
            console.log('我打印了1' + this.tableData)
            this.getUserBooking()
            console.log('我打印了2' + this.tableData)
            this.$message({
              type: 'success',
              message: '取消成功'
            })
            //
          }).catch(err => {
            console.log(err)
            this.$message({
              type: 'error',
              message: '取消失败'
            })
          })
        }
      })
    },
    getUserBooking () {
      console.log('我被调用啦')
      let params = {
        status_reserved: 'reserved'
      }
      this.$http.get(api.user_booking, {params}).then(res => {
        this.tableData = []
        res.data.forEach(element => {
          let date = element.booking_day
          let room = element.booking_room.name + element.booking_room.label
          let roomId = element.booking_room.id
          let referenceId = element.reference_id
          let timeLabel = element.booking_time
          let weekDay = element.booking_weekday
          // 根据预订的时间段显示
          if (element.booking_time === 'A') {
            var time = '10:00 - 12:00'
          } else if (element.booking_time === 'B') {
            time = '12:00 - 14:00'
          } else if (element.booking_time === 'C') {
            time = '14:00 - 16:00'
          } else if (element.booking_time === 'D') {
            time = '16:00 - 18:00'
          } else if (element.booking_time === 'E') {
            time = '18:00 - 20:00'
          } else if (element.booking_time === 'F') {
            time = '20:00 - 22:00'
          }
          // this.tableData = []
          this.tableData.push({
            date,
            time,
            room,
            roomId,
            referenceId,
            timeLabel,
            weekDay
          })
        })
      })
    }
  },
  mounted () {
    this.getUserBooking()
  }
}
</script>

<style>
.info_span {
  float: left;
}
</style>
