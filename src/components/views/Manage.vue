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
        <el-button type="success" size="medium" @click="dialogVisible = true" style="float: left">已預訂</el-button>
        <el-dialog
          title="簽到二維碼"
          :visible.sync="dialogVisible"
          width="30%">
          <img :src="scope.row.imageUrl">
          <span slot="footer" class="dialog-footer">
          </span>
        </el-dialog>
      </template>
    </el-table-column>
    <el-table-column width="200px" label="选择取消">
      <template slot-scope="scope">
        <el-button size="medium" type="danger" style="float:left;" @click="confirmCancel(scope.row)">取消预订</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
// import api from '@/utils/api'
import { updateBooking, getUserBooking } from '../../utils/api'
import {mapState, mapActions} from 'vuex'
export default {
  data () {
    return {
      tableData: [],
      dialogVisible: false
    }
  },
  computed: {
    ...mapState('user', ['current_token', 'next_token', 'level'])
  },
  methods: {
    ...mapActions('user', ['addCurrentToken', 'addNextToken']),
    // 提交取消請求
    confirmCancel (row) {
      const h = this.$createElement
      this.$msgbox({
        title: '確認取消該預定？',
        message: h('p', null, [
          h('span', null, ' ' + row.date + '  '),
          h('span', null, ' ' + row.time + '  '),
          h('i', { style: 'color: teal' }, '  ' + row.room)
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
              }, 150)
            }, 1000)
          } else {
            done()
          }
        }
      }).then(action => {
        // 用於判斷當前時間是否小於想要取消預訂的時間前2小時
        let hourNow = new Date().getHours() + 2
        let minuteNow = new Date().getMinutes
        let choseDay = row.date
        let today = new Date().getFullYear() +
                    '-' +
                    String(new Date().getMonth() + 1).padStart(2, '00') +
                    '-' +
                    new Date().getDate()
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
        if (choseDay === today) {
          // 取消的預訂日期為當日，則需判斷是否大於預訂時間前兩小時
          if (hourNow < bookTime || (hourNow === 10 && minuteNow < 30)) {
            // 判断该预订日期是否当前月
            if (parseInt(row.date.split('-')[1]) === new Date().getMonth() + 1) {
              // 準備更新請求參數，若為當月則is_current_month為true
              var params = {
                status: 'cancelled',
                reference_id: row.referenceId,
                is_current_month: true
              }
              // 即時補回當月代幣
              this.addCurrentToken(1)
            } else {
              // 若為下月則is_current_month為false
              params = {
                status: 'cancelled',
                reference_id: row.referenceId,
                is_current_month: false
              }
              // 即時補回下月代幣
              this.addNextToken(1)
            }
            // 提交取消請求
            updateBooking(row.referenceId, params).then(res => {
              // 重新獲取用戶預訂記錄以刷新列表
              this.getUserBooking()
              this.$message({
                type: 'success',
                message: '取消成功'
              })
            }).catch(err => {
              console.log(err)
              this.$message({
                type: 'error',
                message: '取消失敗'
              })
            })
          } else {
            this.$message({
              type: 'error',
              message: '現在不可取消'
            })
          }
        } else {
          // 如果不是当天就不需要判断大于两小时
          // 判断该预订日期是否当前月，如上
          if (parseInt(row.date.split('-')[1]) === new Date().getMonth() + 1) {
            params = {
              status: 'cancelled',
              reference_id: row.referenceId,
              is_current_month: true
            }
            // 即時補回當月代幣
            this.addCurrentToken(1)
          } else {
            params = {
              status: 'cancelled',
              reference_id: row.referenceId,
              is_current_month: false
            }
            // 即時補回下月代幣
            this.addNextToken(1)
          }
          updateBooking(row.referenceId, params).then(res => {
            this.getUserBooking()
            this.$message({
              type: 'success',
              message: '取消成功'
            })
            //
          }).catch(err => {
            console.log(err)
            this.$message({
              type: 'error',
              message: '取消失敗'
            })
          })
        }
      })
    },
    // 獲取用戶預訂記錄
    getUserBooking () {
      let params = {
        status_reserved: 'reserved'
      }
      getUserBooking(params).then(res => {
        // 初始化數據列表
        this.tableData = []
        res.data.forEach(el => {
          let date = el.booking_day
          let room = el.booking_room.name + el.booking_room.label
          let roomId = el.booking_room.id
          let referenceId = el.reference_id
          let timeLabel = el.booking_time
          let weekDay = el.booking_weekday
          let imageUrl = el.qr_code
          // 根據周幾賦予不同時間段
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
          // 根据预订的时间段显示
          if (weekDay === 6) {
            if (el.booking_time === 'A') {
              var time = timeSatValue[el.booking_time]
            } else {
              time = timeCommonValue[el.booking_time]
            }
          } else if (weekDay === 0) {
            time = timeSunValue[el.booking_time]
          } else {
            time = timeCommonValue[el.booking_time]
          }
          this.tableData.push({
            date,
            time,
            room,
            roomId,
            referenceId,
            timeLabel,
            weekDay,
            imageUrl
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
