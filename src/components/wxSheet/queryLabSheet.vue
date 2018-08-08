<template>
<div>
    <el-row>
        <span>选择日期:</span>
        <el-date-picker v-model="selectDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
        <el-button @click="refresh()" type="primary" size="small">查询</el-button>
        <el-button @click="dao()" size="small" type="info">导出</el-button>
    </el-row>
    <br>
    <el-row>
        <el-table show-summary ref="table" :data="tableData" size="mini" border height="500">
            <el-table-column prop="seqno" sortable label="单号" width="50"> </el-table-column>
            <el-table-column prop="labType" sortable label="标签类型" width="80"> </el-table-column>
            <el-table-column prop="floorName" sortable label="楼层" width="80"> </el-table-column>
            <el-table-column prop="shop" label="专柜" width="80"> </el-table-column>
            <el-table-column prop="userName" label="申请人" width="80"> </el-table-column>
            <el-table-column prop="labCount" label="数量" width="50"> </el-table-column>
            <el-table-column prop="stat" label="状态" width="70"> </el-table-column>
            <el-table-column prop="subTime" sortable label="申请时间" width="130"></el-table-column>
            <el-table-column prop="checkName" label="审批人" width="80"> </el-table-column>
            <el-table-column prop="checkTime" label="审批时间" width="130"> </el-table-column>
            <el-table-column prop="makeName" label="制作人" width="80"> </el-table-column>
            <el-table-column prop="makeTime" label="制作时间" width="130"> </el-table-column>
            <el-table-column prop="memo" label="审批说明"> </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="mini" type="info" plain @click="showDetail(scope.$index, scope.row)">明细</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-row>

     <!-- 弹出层 -->
    <el-dialog title="单据明细" :visible.sync="dialogFormVisible" width='60%'>
        <el-table :data="detailData" size="mini" border style="width: 100%" height="400">
            <!-- <el-table-column type="index" width="50"></el-table-column> -->
            <el-table-column prop="idx" label="序号" width="50"> </el-table-column>
            <el-table-column prop="goodNo" label="货号" width="100"> </el-table-column>
            <el-table-column prop="goodName" sortable label="商品名称" width="100"> </el-table-column>
            <el-table-column prop="goodPrice" label="商品单价" width="100"> </el-table-column>
            <el-table-column prop="goodCount" label="标签数量" width="50"> </el-table-column>
            <el-table-column prop="goodStyle" label="商品规格" width="100"> </el-table-column>
            <el-table-column prop="goodUtno" label="商品单位" width="150"></el-table-column>
            <el-table-column prop="madeIn" label="产地" width="100"> </el-table-column>
            <el-table-column prop="level" label="等级" width="150"> </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">关 闭</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
const moment = require("moment");
const CsvExport = require("../../lib/CsvExport");
export default {
    name: "queryLabSheet",
    data() {
        return {
            selectDate: [new Date(), new Date()],
            tableData: [],
            dialogFormVisible:false,
            detailData:[],
            sheetType: "lab",
            statText: {
                "0": "待审批",
                "1": "待制作",
                "2": "已完成",
                "4": "驳回"
            }
        }
    },
    methods: {
        async showDetail(index,row){
            let url = `${this.$store.state.wxAppHost}wxSheet/getSheetDetail`;
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            try {
                let res = await this.$http.post(url, {
                    sheetType: this.sheetType,
                    seqno: row.seqno
                });
                loading.close();
                if (res.body.err == true) {
                    this.$message({
                        type: 'error',
                        message: res.body.errText
                    });
                } else {
                    this.detailData = res.body.data;
                    this.dialogFormVisible = true;
                }
            } catch (e) {
                loading.close();
                throw e;
            }
        },
        async refresh() {
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let url = `${this.$store.state.wxAppHost}wxSheet/getSheetByDate`;
            try {
                let res = await this.$http.post(url, {
                    sheetType: this.sheetType,
                    sdate: this.selectDate[0],
                    edate: this.selectDate[1]
                })
                loading.close();
                if (res.err == true) {
                    this.$message({
                        type: 'error',
                        message: res.errText
                    });
                } else {
                    for (let item of res.body.data) {
                        item.stat=this.statText[item.stat];
                    }
                    this.tableData = res.body.data;
                }
            } catch (error) {
                loading.close();
                throw error;
            }
        },
        dao() {
            let columns = this.$refs.table.$children.filter(t => t.prop != null);
            let sdate = moment(this.selectDate[0]).format('YYYY-MM-DD');
            let edate = moment(this.selectDate[1]).format('YYYY-MM-DD');
            const fields = columns.map(t => t.prop);
            const fieldNames = columns.map(t => t.label);
            CsvExport(this.tableData, fields, fieldNames, `${sdate}至${edate}标签申请单`);
        },
    }
}
</script>
