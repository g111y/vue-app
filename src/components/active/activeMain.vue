<template>
<div class="layout">
  <headbar></headbar>
  <!--<Menu mode="horizontal" active-name="1">-->
    <!--<div class="layout-assistant">-->
      <!--<MenuItem name="1">Option 1</MenuItem>-->
      <!--<MenuItem name="2">Option 2</MenuItem>-->
      <!--<MenuItem name="3">Option 3</MenuItem>-->
    <!--</div>-->
  <!--</Menu>-->
  <div class="layout-content">
    <el-row>
      <el-col :span="4">
        <sidebar></sidebar>
      </el-col>
      <el-col :span="19">
      <div class="layout-content-main">
        <router-view/>
      </div>
      </el-col>
    </el-row>
  </div>
  <div class="layout-copy">
    2011-2016 &copy; TalkingData
  </div>
</div>
</template>

<script>
  import Sidebar from '@/components/active/activeSidebar.vue'
  import Headbar from "@/components/Headbar.vue"
  export default {
    name:"HelloWorld",
    components: {
      'sidebar': Sidebar,
      'headbar': Headbar
    },
  }
</script>
<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
  }

  .layout-assistant{
    width: 300px;
    margin: 0 auto;
    height: inherit;
  }
  .layout-breadcrumb{
    padding: 10px 15px 0;
  }
  .layout-content{
    min-height: 600px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }
  .layout-content-main{
    padding: 10px;
  }
  .layout-copy{
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
</style>
