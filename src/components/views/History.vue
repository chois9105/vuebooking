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
        <el-button size="mini" type="warning">已取消</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        time: '10:00 - 12:00',
        room: '大型会议室A'
      }, {
        date: '2016-05-02',
        time: '10:00 - 12:00',
        room: '大型会议室A'
      }, {
        date: '2016-05-02',
        time: '10:00 - 12:00',
        room: '大型会议室A'
      }, {
        date: '2016-05-02',
        time: '10:00 - 12:00',
        room: '大型会议室A'
      }]
    }
  },
  methods: {
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    }
  }
}
</script>
