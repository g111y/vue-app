<template>
<div>
    <el-row id="refreshButton">
        <el-button type="success" class="addButton" icon="el-icon-refresh" @click="refresh" circle></el-button>
    </el-row>
    <el-table :data="tableData" border style="width: 100%">
        <!-- <el-table-column type="index" width="50"></el-table-column> -->
        <el-table-column prop="seqno" sortable label="单号" width="80"> </el-table-column>
        <el-table-column prop="labType" sortable label="标签类型" width="120"> </el-table-column>
        <el-table-column prop="floorName" sortable label="楼层" width="100"> </el-table-column>
        <el-table-column prop="shop" label="专柜" width="100"> </el-table-column>
        <el-table-column prop="userName" label="申请人" width="100"> </el-table-column>
        <el-table-column prop="labCount" label="数量" width="50"> </el-table-column>
        <el-table-column prop="subTime" sortable label="申请时间" width="150"></el-table-column>
        <el-table-column prop="checkName" label="审批人" width="100"> </el-table-column>
        <el-table-column prop="checkTime" label="审批时间" width="150"> </el-table-column>
        <el-table-column label="操作" width="150">
            <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleDetail(scope.$index, scope.row)">明细</el-button>
            </template>
        </el-table-column>
    </el-table>

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
            <el-button type="primary" @click="changeSheetStat">打印完成</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
export default {
    name: "labCheckSheet",
    data() {
        return {
            tableData: [],
            detailData: [],
            dialogFormVisible: false,
            sheetType: "lab"
        }
    },
    mounted() {
        this.refresh();
    },
    methods: {
        /**
         * 单据状态改为已打印
         */
        async changeSheetStat() {
            if (this.detailData.length < 1) {
                return;
            }
            let seqno = this.detailData[0].seqno;
            let user = JSON.parse(sessionStorage.getItem('user'));
            let url = `${this.$store.state.wxAppHost}wxSheet/changeSheetStat`;
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            try {
                let res = await this.$http.post(url, {
                    sheetType: this.sheetType,
                    seqno: seqno,
                    makeName: user.userid,
                    stat: "2"
                });
                loading.close();
                if (res.body.err) {
                    this.$message({
                        type: 'error',
                        message: res.body.errText
                    });
                } else {
                    this.$message({
                        type: 'success',
                        message: '提交成功!'
                    });
                    this.dialogFormVisible = false;
                    this.refresh();
                }
            } catch (error) {
                loading.close();
                throw error;
            }
        },
        async handleDetail(index, row) {
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
        refresh() {
            let url = `${this.$store.state.wxAppHost}wxSheet/getCheckSheet/${this.sheetType}`;
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            this.$http.get(url).then(res => {
                loading.close();
                console.log(res)
                if (res.body.err == true) {
                    this.$message({
                        type: 'error',
                        message: res.body.errText
                    });
                } else {
                    this.tableData = res.body.data;
                }
            }, err => {
                loading.close();
                throw err;
            });
        }
    }
}
</script>

<style scoped>
#refreshButton {
    margin-bottom: 10px;
}
</style>
