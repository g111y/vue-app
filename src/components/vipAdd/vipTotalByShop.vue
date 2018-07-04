<template>
<div>
    <el-row>
        <span>选择日期:</span>
        <el-date-picker v-model="selectDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
        <el-button @click="query()">查询</el-button>
        <el-button @click="dao()" type="info">导出</el-button>
    </el-row>
    <br>
    <el-row>
        <el-table ref="table" :data="tableData" size="small" border height="500">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="floorName" sortable label="楼层" width="100"> </el-table-column>
            <el-table-column prop="shop" sortable label="专柜" width="150"> </el-table-column>
            <el-table-column prop="qty" label="办卡数量" width="100"></el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="mini" type="info" plain @click="showDetail(scope.$index, scope.row)">明细</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-row>
</div>
</template>

<script>
const moment = require('moment');
const CsvExport = require("../../lib/CsvExport");

export default {
    data() {
        return {
            selectDate: [new Date(), new Date()],
            tableData:[]
        }
    },
    methods: {
        dao() {
            let columns = this.$refs.table.$children.filter(t => t.prop != null);
            let sdate = moment(this.selectDate[0]).format('YYYY-MM-DD');
            let edate = moment(this.selectDate[1]).format('YYYY-MM-DD');
            const fields = columns.map(t => t.prop);
            const fieldNames = columns.map(t => t.label);
            CsvExport(this.tableData, fields, fieldNames, `${sdate}至${edate}按人员汇总`);
        },
        query() {
            let sdate = moment(this.selectDate[0]).format('YYYY-MM-DD 00:00:00');
            let edate = moment(this.selectDate[1]).format('YYYY-MM-DD 23:59:59');
            let queryType = 'per';
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let url = `${this.$store.state.wxAppHost}queryTotal`;
            this.$http.post(url, {
                queryType: queryType,
                sdate:sdate,
                edate:edate               
            }).then(res => {
                loading.close();
                let resData = res.body;
                if (resData.err == true) {
                    this.$message({
                        type: 'error',
                        message: resData.errText
                    });
                } else {
                    this.tableData =resData.data;
                }

            }, err => {
                loading.close();
                throw err;
            })
        }
    }
}
</script>
