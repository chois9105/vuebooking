<template>
    <el-tabs type="border-card" :value="roomId" tab-position="left" @tab-click="handleRoomChange">
      <el-tab-pane v-for="(room, index) in rooms" :label="room.label" :key="index" :name="room.name">
          <el-card class="box-card">
              <div slot="header">
                  <div>{{roomId}}</div>
                  <el-date-picker
                    v-model="dateTime"
                    type="date"
                  ></el-date-picker>
              </div>
              <el-card v-for="(timeInfo, index) in timeInfos" :key="index" class="timeinfo">
                  <el-tooltip class="item" effect="dark" :content="timeInfo.content" placement="right">
                      <el-tag :type="timeInfo.type">{{timeInfo.time}}</el-tag>
                  </el-tooltip>
              </el-card>
          </el-card>
      </el-tab-pane>
    </el-tabs>
</template>
<script>

export default {
  data() {
      return {
          rooms:[
              {
                  label: "401",
                  name: "401"
              },
              {
                  label: "402",
                  name: "402"
              }
          ],
          timeInfos:[
              {
                  time: '10:00',
                  type: 'success',
                  content: '提示信息'
              },
              {
                  time: '11:00',
                  type: 'success',
                  content: '提示信息'
              },
              {
                  time: '12:00',
                  type: 'success',
                  content: '提示信息'
              },
              {
                  time: '13:00',
                  type: 'success',
                  content: '提示信息'
              },
              {
                  time: '14:00',
                  type: 'success',
                  content: '提示信息'
              },
              {
                  time: '15:00',
                  type: 'success',
                  content: '提示信息'
              },
              {
                  time: '16:00',
                  type: 'success',
                  content: '提示信息'
              },
              {
                  time: '17:00',
                  type: 'success',
                  content: '提示信息'
              },
              {
                  time: '18:00',
                  type: 'success',
                  content: '提示信息'
              },
              {
                  time: '19:00',
                  type: 'success',
                  content: '提示信息'
              }
          ],
          roomId: "401",
          dateTime: new Date()
      }
  },
  methods: {
      handleRoomChange(tab){
          this.roomId = tab.name
      }
  }
}
</script>
<style>
.timeinfo{
    float: left;
}
</style>
