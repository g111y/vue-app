<template>
<div>
    <el-row>
        <el-button type="success" icon="el-icon-refresh" @click="query" circle></el-button>
    </el-row>
    <el-row>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="activeNo" label="批次号"></el-table-column>
            <el-table-column prop="activeName" label="活动名称"></el-table-column>
            <el-table-column prop="activeTypeNo" label="活动类型"></el-table-column>
            <el-table-column prop="startDate" label="开始日期"></el-table-column>
            <el-table-column prop="endDate" label="结束日期"></el-table-column>
            <el-table-column prop="attendStat" label="下挂明细参加活动"></el-table-column>
            <el-table-column prop="stat" label="活动状态"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="start(scope.$index, scope.row)">开始发奖</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-row>
</div>
</template>

<script>
export default {
    name: "vaildActiveBetchList.vue",
    data() {
        return {
            tableData: []
        };
    },
    mounted() {
        this.query();
    },
    methods: {
        query() {
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let url = `${this.$store.state.host}api/cuxiao/active/vaildActiveBetchList`;
            this.$http.get(url).then(
                res => {
                    loading.close();
                    this.tableData = res.data.data;
                },
                err => {
                    loading.close();
                    alert(err);
                }
            );
        },
        start(index, row) {
            /**
             * 如果是抽奖活动，则打开抽奖页面
             */
            if (row.activeTypeNo == "03") {
                let user = this.$store.state.user;
                let url = `${this.$store.state.host}cuxiao/cj?activeNo=${row.activeNo}&userid=${user.userid}`
                window.open(url);
            } else {
                this.$router.push(`startActive${row.activeTypeNo}/${row.activeNo}`);
            }
        }
    }
};
</script>

<style>

</style>
