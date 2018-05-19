<template>
    <el-table :data="tableData" style="width: 100%">
    <el-table-column width="400px" label="预订信息">
      <template slot-scope="scope">
        <span class="info_span"><i class="el-icon-date"></i>{{ scope.row.date }}</span>
        <span class="info_span"><i class="el-icon-time"></i>{{ scope.row.time }}</span>
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
        <el-button size="mini" type="danger" style="float:left;" @click="confirm">取消预订</el-button>
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
    confirm () {
      const h = this.$createElement
      this.$msgbox({
        title: '確認取消該預定？',
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
    getUserBooking () {
      let params = {
        status_reserved: 'reserved'
      }
      this.$http.get(api.user_booking, {params}).then(res => {
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
          this.tableData.push({
            date,
            time,
            room
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
  display: block;
}
</style>
