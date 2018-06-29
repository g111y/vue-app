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
            <span>用户管理</span>
          </template>
          <el-menu-item index="userCheck">用户审核</el-menu-item>
          <el-menu-item index="userList">用户列表</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script>
  export default {
    name: "userSidebar",
    data() {
      return {}
    },
    methods: {
      handleSelect(key, path) {
        //console.log(key);
        this.$router.push(`/vipAdd/${key}`);
        //console.log(this.$route.fullPath)
        //console.log(this.$route.fullPath)
      }
    }
  }
</script>
