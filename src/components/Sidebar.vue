<template>
  <el-col >
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @select="handleSelect">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>发奖</span>
        </template>
        <el-menu-item index="1-1">活动选择</el-menu-item>
        <el-menu-item index="1-2">发奖查询</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>查询</span>
        </template>
        <el-menu-item index="2-1">数据查询</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>设置</span>
        </template>
        <el-menu-item index="activeBetchList">活动列表</el-menu-item>
      </el-submenu>
    </el-menu>
  </el-col>
</template>
<script>
  export default {
    name: "Sidebar",
    data() {
      return {}
    },
    methods: {
      handleSelect(key,path) {
        //console.log(key);
        this.$router.push(`/cuxiao/${key}`);
        //console.log(this.$route.fullPath)
        //console.log(this.$route.fullPath)
      }
    }
  }
</script>
