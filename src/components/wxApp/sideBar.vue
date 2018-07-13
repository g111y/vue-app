<template>
<el-row>
    <el-col>
        <el-menu default-active="2" class="el-menu-vertical-demo" @select="handleSelect">
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>系统管理</span>
                </template>
                <el-menu-item index="sysMessage">系统公告</el-menu-item>
                <el-menu-item index="suggest">投诉建议</el-menu-item>
                <el-menu-item index="salesInfo">促销活动</el-menu-item>
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
            this.$router.push(`/wxApp/${key}`);
            //console.log(this.$route.fullPath)
            //console.log(this.$route.fullPath)
        }
    }
}
</script>
