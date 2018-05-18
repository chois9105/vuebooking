<template>
    <el-container>
        <el-header height="150px">
            <el-row>
                <el-col :span="6"><div style="float: left;">Service: 23699638</div></el-col>
                <el-col :span="6" :offset="12">
                    <el-popover
                        placement="bottom"
                        width="200"
                        style="float: right;">
                        <p>FBO ID：852000838349</p>
                        <p>Current Token: 18</p>
                        <p>Next Token: 18</p>
                        <div style="text-align: right; margin: 0">
                        <el-button type="primary" size="mini">退出</el-button>
                        </div>
                        <el-button slot="reference" size="medium" round>Vincent</el-button>
                    </el-popover>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6"><div class="">LOGO</div></el-col>
                <el-col :span="6"><div style="float: left;">Booking Online</div></el-col>
            </el-row>
        </el-header>
    </el-container>
</template>

<script>

</script>

<style>
.el-row{
  margin-bottom: 20px;
}

.bg-purple {
    background: #d3dce6;
}

.el-header, .el-footer {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 60px;
}
</style>
