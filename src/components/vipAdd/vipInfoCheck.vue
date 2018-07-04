<template>
<div>
    <el-table size="mini" :data="tableData" border style="width: 100%">
        <el-table-column width="170">
            <template slot-scope="scope">
                <el-button icon="el-icon-search" @click="handleSearch(scope.$index, scope.row)" circle></el-button>
                <el-button type="success" icon="el-icon-check" @click="handleCheck(scope.$index, scope.row,1)" circle></el-button>
                <el-button type="warning" icon="el-icon-close" @click="handleCheck(scope.$index, scope.row,2)" circle></el-button>
            </template>
        </el-table-column>
        <el-table-column type="index" width="40"></el-table-column>
        <el-table-column prop="shop" label="专柜" width="100"> </el-table-column>
        <el-table-column prop="userName" label="姓名" width="70"></el-table-column>
        <el-table-column prop="vipCardNo" label="登记卡号" width="140"> </el-table-column>
        <el-table-column prop="phone" label="登记手机" width="100"> </el-table-column>
        <el-table-column prop="subTime" label="提交时间" width="150"> </el-table-column>
        <el-table-column prop="realTime" label="系统时间" width="100"> </el-table-column>
        <el-table-column prop="realPhone" label="系统手机号" width="100"> </el-table-column>
        <el-table-column prop="memo" label="备注" width="150"> </el-table-column>
        <el-table-column prop="stat" label="状态" width="30"> </el-table-column>
    </el-table>
</div>
</template>

<script>
const moment = require('moment');
export default {
    data() {
        return {
            tableData: []
        }
    },
    methods: {
        handleSearch(index, row) { //取会员系统数据
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let url = `${this.$store.state.host}api/vip/vipInfoDetail/${row.vipCardNo}`;
            this.$http.get(url).then(res => {
                loading.close();
                console.log(res.data.data);
                let resData = res.data.data;
                if (resData.err == true) {
                    row.memo = resData.errText;
                } else {
                    row.realTime = resData.data.addDate;
                    row.realPhone = resData.data.phone;
                    row.memo = row.phone == row.realPhone ? '匹配' : "手机不匹配"
                    let subMonth=moment(row.subTime).month();
                    let cardMonth=moment(row.realTime).month();
                    if(subMonth!=cardMonth){
                        row.memo='办卡时间不符';
                    }
                };
            }, err => {
                loading.close();
                row.memo = '卡号不存在';
                throw err;
            })
        },
        async handleCheck(index, row, stat) { //审核
            if (!row.memo) {
                this.$alert('请先进行数据查验', '提示');
                return;
            }
            row.checkTime = moment().format('YYYY-MM-DD HH:mm:ss');
            switch (stat) {
                case 1:
                    if (row.memo != '匹配') {
                        let a = await this.$confirm('此条数据查验不匹配，是否继续?', '提示');
                        if (a = 'confirm') {
                            row.stat = 1
                        }
                    } else {
                        row.stat = 1;
                    }
                    break;
                case 2:
                    let a = await this.$confirm('是否确定拒批这条数据?', '提示');
                    if (a == 'confirm') {
                        row.stat = 2;
                    }
                    break;
                default:
            }
            if (row.stat == 0) {
                return;
            }

            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let url = `${this.$store.state.wxAppHost}checkVipInfo`;
            this.$http.post(url, {
                seqNo: row.seqNo,
                stat: row.stat,
                checkTime: row.checkTime,
                realTime: row.realTime,
                realPhone: row.realPhone,
                memo: row.memo
            }).then(res => {
                loading.close();
                let resData = res.body;
                if (resData.err == true) {
                    this.$message({
                        type: 'error',
                        message: resData.errText
                    });
                } else {
                    this.$message({
                        type: 'success',
                        message: '提交成功!'
                    });
                    this.tableData = this.tableData.filter((item, index, arr) => {
                        if (item.seqNo == row.seqNo) {
                            return false;
                        } else {
                            return true;
                        }
                    })
                }

            }, err => {
                loading.close();
                throw err;
            })
        },
    },
    mounted() {
        let loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
        });
        let url = `${this.$store.state.wxAppHost}checkVipInfo`;
        this.$http.get(url).then(res => {
            loading.close();
            let data = res.body;
            for (let item of data.data) {
                item.subTime = moment(item.subTime).format("YYYY-MM-DD HH:mm:ss");
            }
            this.tableData = data.data;
        }, err => {
            loading.close();
            throw err;
        })
    },
}
</script>
