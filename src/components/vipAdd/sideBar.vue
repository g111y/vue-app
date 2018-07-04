<template>
<el-row>
    <el-col>
        <el-menu default-active="2" class="el-menu-vertical-demo" @select="handleSelect">
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>用户管理</span>
                </template>
                <el-menu-item index="userCheck">用户审核</el-menu-item>
                <el-menu-item index="userList">用户列表</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>信息审核</span>
                </template>
                <el-menu-item index="vipInfoCheck">登记信息审核</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>统计查询</span>
                </template>
                <el-menu-item index="vipTotalByPer">按人员汇总</el-menu-item>
                <el-menu-item index="vipTotalByShop">按专柜汇总</el-menu-item>
                <el-menu-item index="vipTotalByFloor">按楼层汇总</el-menu-item>
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
