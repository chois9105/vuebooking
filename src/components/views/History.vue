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
        <el-button class="info_span" size="mini" :type="scope.row.type">{{scope.row.status}}</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
// import api from '@/utils/api'
import { getUserBooking } from '../../utils/api'
export default {
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    // 篩選非預訂的用戶記錄
    getUserBooking () {
      let params = {
        status_not_reserved: 'reserved'
      }
      getUserBooking(params).then(res => {
        // 初始化數據列表
        this.tableData = []
        res.data.forEach(el => {
          let date = el.booking_day
          let room = el.booking_room.name + el.booking_room.label
          let weekDay = el.booking_weekday
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
          // 根據預訂狀態確定按鈕信息和顏色
          let bookingStatus = {
            show: '出席',
            no_show: '缺席',
            cancelled: '取消'
          }
          let bookingStatysType = {
            show: 'success',
            no_show: 'danger',
            cancelled: 'warning'
          }
          let status = bookingStatus[el.status]
          let type = bookingStatysType[el.status]
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
            status,
            type
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
