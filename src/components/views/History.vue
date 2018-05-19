<template>
    <el-table :data="tableData" style="width: 100%">
    <el-table-column width="400px">
      <template slot-scope="scope">
        <span style="margin-left: 10px"><i class="el-icon-date"></i>{{ scope.row.date }}<br/>
        <i class="el-icon-time"></i>{{ scope.row.time }}<br/>
        <i class="el-icon-location"></i>{{ scope.row.room }}</span>
      </template>
    </el-table-column>
    <el-table-column width="200px">
      <template slot-scope="scope">
        <el-button size="mini" :type="scope.row.type">{{scope.row.status}}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import api from '@/utils/api'
export default {
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    getUserBooking () {
      this.$http.get(api.user_booking).then(res => {
        console.log(res.data)
        res.data.forEach(element => {
          let date = element.booking_day
          let room = element.booking_room.name + element.booking_room.label
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
          // 根据预订记录的状态显示
          if (element.status === 'reserved') {
            var type = 'info'
            var status = '已预订'
          } else if (element.status === 'cancelled') {
            type = 'warning'
            status = '已取消'
          } else if (element.status === 'show') {
            type = 'success'
            status = '出席'
          } else if (element.status === 'no_show') {
            type = 'danger'
            status = '缺席'
          }
          this.tableData.push({
            date,
            time,
            room,
            type,
            status
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
