<template>
  <el-row>
    <el-col>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @select="handleSelect">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>礼券查询</span>
          </template>
          <el-menu-item index="giftUseStat">礼券使用情况</el-menu-item>
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
  </el-row>
</template>
<script>
  export default {
    name: "sjSidebar",
    data() {
      return {}
    },
    methods: {
      handleSelect(key, path) {
        //console.log(key);
        this.$router.push(`/sj/${key}`);
        //console.log(this.$route.fullPath)
        //console.log(this.$route.fullPath)
      }
    }
  }
</script>
