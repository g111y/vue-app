<template>
  <el-menu
    :default-active="activeIndex2"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    <el-menu-item index="topMenu">系统主页</el-menu-item>
    <el-submenu index="2">
      <template slot="title">我的工作台</template>
      <el-menu-item index="loginOut">注销</el-menu-item>
    </el-submenu>
    <!-- <el-menu-item index="3"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item> -->
  </el-menu>
</template>
<script>
export default {
  name: "Headbar",
  data() {
    return {
      activeIndex2: "1"
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      if (key == "loginOut") {
        this.$confirm("确定要注销吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$store.commit("removeToken");
            this.$router.push("/login");
            this.$message({
              type: "success",
              message: "注销成功!"
            });
          })
          .catch(() => {
          });
      } else {
        this.$router.push(`/${key}`);
      }
    }
  }
};
</script>
