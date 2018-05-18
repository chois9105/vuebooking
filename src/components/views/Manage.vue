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
        <el-button size="mini" type="success">已预订</el-button>
      </template>
    </el-table-column>
    <el-table-column width="200px">
      <template slot-scope="scope">
        <el-button size="mini" type="danger" @click="confirm">取消预订</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
    export default {
    data() {
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
      confirm() {
        const h = this.$createElement;
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
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 3000);
            } else {
              done();
            }
          }
        }).then(action => {
          this.$message({
            type: 'info',
            message: 'action: ' + action
          });
        });
      }
    }
  }
</script>

<style>

</style>