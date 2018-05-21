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
export default {
  data () {
    return {
      tableData: [],
      c_disabled: false
    }
  },
  methods: {
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
        // 这里还需要加一段逻辑，用于判定预订的时间段
        // 判断该预订日期是否当前月
        if (hourNow < 26) {
          if (parseInt(row.date.split('-')[1]) === new Date().getMonth() + 1) {
            var params = {
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
              message: '取消失败'
            })
          })
        } else {
          this.$message({
            type: 'error',
            message: '现在不可取消'
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
        res.data.forEach(element => {
          let date = element.booking_day
          let room = element.booking_room.name + element.booking_room.label
          let roomId = element.booking_room.id
          let referenceId = element.reference_id
          let timeLabel = element.booking_time
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
          this.tableData.push({
            date,
            time,
            room,
            roomId,
            referenceId,
            timeLabel
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
