<template>
<el-row>
    <el-col>
        <el-menu default-active="1" class="el-menu-vertical-demo" @select="handleSelect">
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>价签管理</span>
                </template>
                <el-menu-item index="labCheckSheet">待处理单据</el-menu-item>
                <el-menu-item index="queryLabSheet">单据查询</el-menu-item>
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
            console.log(key);
            this.$router.push(`/wxSheet/${key}`);
            //console.log(this.$route.fullPath)
            //console.log(this.$route.fullPath)
        }
    }
}
</script>
