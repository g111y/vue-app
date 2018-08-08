<template>
<el-row id="top">
    <el-col :span="8" :offset="8">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>功能列表</span>
            </div>
            <div class="menuList">
                <div class="text item">
                    <el-button type="primary" @click="nav('/cuxiao')">促销系统</el-button>
                </div>
                <div class="text item">
                    <el-button type="primary" @click="nav('/sj')">审计系统</el-button>
                </div>
                <div class="text item">
                    <el-button type="primary" @click="nav('/user')">用户管理</el-button>
                </div>
                <div class="text item">
                    <el-button type="success" @click="nav('/vipAdd')">会员推广</el-button>
                </div>
                <div class="text item">
                    <el-button type="success" @click="nav('/wxApp')">小程序</el-button>
                </div>
                <div class="text item">
                    <el-button type="success" @click="nav('/wxSheet')">单据处理</el-button>
                </div>
            </div>
        </el-card>
    </el-col>
</el-row>
</template>

<script>
export default {
    name: "topMenu",
    methods: {
        nav(url) {
            this.$router.push(url);
        }
    }
}
</script>

<style scoped>
#top {
    margin-top: 80px
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
    margin-right: 10px;
}

.item button {
    width: 100px;
}

.box-card {
    width: 400px;
}
.menuList{
  display: -webkit-flex;  
  display: flex;
  flex-wrap: wrap;
  justify-content:center;
}
</style>
