<template>
  <el-row id="top">
    <el-col :span="8" :offset="8">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>卡片名称</span>
        </div>
        <div class="text item">
          <el-button type="primary" @click="nav('/cuxiao')">促销系统</el-button>
        </div>
        <div>
          <el-button type="success" @click="nav('/sj')">审计系统</el-button>
        </div>
        <br>
        <div>
          <el-button type="warning" @click="nav('/user')">用户管理</el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>

</template>

<script>
  export default {
    name:"topMenu",
    methods:{
      nav(url){
        this.$router.push(url);
      }
    }
  }
</script>
<style scoped>
  #top{
    margin-top: 80px
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  

  .box-card {
    width: 480px;
  }
</style>
