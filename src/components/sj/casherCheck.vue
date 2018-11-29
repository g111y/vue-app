<template>
<div>
    <el-row>
        <el-date-picker v-model="sdate" type="date" placeholder="选择日期"></el-date-picker>
        <el-button icon="el-icon-search" @click="query">查询</el-button>
        <el-button class="addButton" type="primary" plain icon="el-icon-plus" @click="addCasher">增加</el-button>
        <el-button class="addButton" type="warning" plain icon="el-icon-warning" @click="clearData">置重数据</el-button>
        <el-button class="addButton" type="info" plain icon="el-icon-info" @click="printTable">打印</el-button>
    </el-row>
    <br>
    <el-table :data="tableData" size="mini" border style="width: 100%" show-summary="true">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="CASHERNO" sortable label="员工号" width="150"> </el-table-column>
        <el-table-column prop="CASHERNAME" sortable label="姓名" width="150"> </el-table-column>
        <el-table-column prop="LONGCASH" sortable label="长款" width="150"> </el-table-column>
        <el-table-column prop="SHORTCASH" sortable label="短款" width="150"> </el-table-column>
        <el-table-column prop="CHECKSTAT" sortable label="说明"> </el-table-column>
        <el-table-column label="操作" width="100">
            <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 弹出层 -->
    <el-dialog title="处理" :visible.sync="dialogFormVisible" width='30%'>
        <el-form :model="form" label-position="left" label-width="80px" size="small">
            <el-form-item label="员工号">
                <el-input v-model="form.CASHERNO" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="form.CASHERNAME" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="长款">
                <el-input v-model="form.LONGCASH" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="短款">
                <el-input v-model="form.SHORTCASH" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="说明">
                <el-input v-model="form.CHECKSTAT" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false;isAdd=false">取 消</el-button>
            <el-button type="primary" @click="subEdit">提 交</el-button>
        </div>
    </el-dialog>

    <!-- 打印区域 -->
    <vue-easy-print  ref="easyPrint" >
        <template slot-scope="func">
            <div class='printHead'>
                <h3>贵州神奇百盛商业发展有限公司</h3>
                <p>收银审计表</p>
            <span>{{sdateFmt}}</span>
            </div>
            <br>
            <el-table style="font-size:6px;"  border :data="tableData" size="mini"  show-summary="true">
                <el-table-column prop="CASHERNO"  label="员工号" width="150px"> </el-table-column>
                <el-table-column prop="CASHERNAME"  label="姓名" width="150px"> </el-table-column>
                <el-table-column prop="LONGCASH"  label="长款" width="150px"> </el-table-column>
                <el-table-column prop="SHORTCASH"  label="短款" width="150px"> </el-table-column>
                <el-table-column prop="CHECKSTAT"  label="说明" width="400px"> </el-table-column>
            </el-table>
        </template>
    </vue-easy-print>
</div>
</template>
<style scoped>
.printHead{
    text-align: center;
}
.printHead p{
    font-size: 24px;
}

</style>

<script>
const moment = require('moment');
import vueEasyPrint from "vue-easy-print";
export default {
    components: {
        vueEasyPrint
    },
    name: "casherCheck",
    data() {
        return {
            sdate: moment(),
            sdateFmt: moment().format('YYYY-MM-DD'),
            tableData: [],
            form: [],
            dialogFormVisible: false,
            isAdd: false
        }
    },
    methods: {
        query() {
            this.sdateFmt=moment().format('YYYY-MM-DD');
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let url = `${this.$store.state.host}api/sj/casherCheck/${moment(this.sdate).format('YYYY-MM-DD')}`;
            this.$http.get(url).then(res => {
                loading.close();
                let data = res.body.data;
                if (data.err) {
                    this.$message({
                        type: 'error',
                        message: data.errText
                    });
                } else {
                    for (let item of data.result) {
                        item.DATE = moment(item.DATE).format("YYYY-MM-DD");
                    }
                    this.tableData = data.result;
                }
            }, err => {
                loading.close();
                throw err;
            })
        },
        subEdit() {

            if (this.isAdd) {
                this.subAddCasher();
                return
            }

            // 提交修改
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let url = `${this.$store.state.host}api/sj/casherCheck`;
            let user = JSON.parse(sessionStorage.getItem('user'));
            this.form.USERID = user.userid;
            this.form.CHECKSTAT == '-' ? this.form.CHECKSTAT = '' : this.form.CHECKSTAT;
            this.$http.put(url, this.form).then(res => {
                loading.close();
                let data = res.body.data;
                console.log(res);
                if (data.err) {
                    this.$message({
                        type: 'error',
                        message: data.errText
                    });
                } else {
                    this.$message({
                        type: 'success',
                        message: '更新成功'
                    });
                    this.query();
                    this.dialogFormVisible = false;
                }
            }, err => {
                loading.close();
                this.$message({
                    type: 'error',
                    message: err
                });
                throw err;
            })
        },
        addCasher() {
            this.form = {};
            this.dialogFormVisible = true;
            this.isAdd = true;
        },
        subAddCasher() {
            // 提交增加
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let url = `${this.$store.state.host}api/sj/addCasher`;
            let user = JSON.parse(sessionStorage.getItem('user'));
            this.form.USERID = user.userid;
            this.form.DATE = moment(this.sdate).format("YYYY-MM-DD");
            this.$http.post(url, this.form).then(res => {
                loading.close();
                let data = res.body.data;
                console.log(res);
                if (data.err) {
                    this.$message({
                        type: 'error',
                        message: data.errText
                    });
                } else {
                    this.$message({
                        type: 'success',
                        message: '增加成功'
                    });
                    this.query();
                    this.dialogFormVisible = false;
                    this.isAdd = false;
                }
            }, err => {
                loading.close();
                this.$message({
                    type: 'error',
                    message: err
                });
                throw err;
            })
        },
        handleEdit(index, row) {
            this.form = row;
            this.dialogFormVisible = true;
        },
        handleDelete(index, row) {
            this.$confirm('此操作将删除数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let loading = this.$loading({
                    lock: true,
                    text: "Loading",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)"
                });
                let url = `${this.$store.state.host}api/sj/deleteCheck`;
                this.$http.post(url, row).then(res => {
                    loading.close();
                    let data = res.body.data
                    if (data.err) {
                        this.$message({
                            type: 'error',
                            message: res.body.errText
                        });
                    } else {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.query();
                    }
                }, err => {
                    loading.close();
                    this.$message({
                        type: 'error',
                        message: err
                    });
                    throw err;
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        clearData() {
            for (let item of this.tableData) {
                if (item.CHECKSTAT != "-") {
                    this.$notify.error({
                        title: '错误',
                        message: '数据不是初始状态，不能清除'
                    });
                    return;
                }
            }

            this.$confirm('此操作将重置指定日期数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let loading = this.$loading({
                    lock: true,
                    text: "Loading",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)"
                });
                let url = `${this.$store.state.host}api/sj/clearData/${moment(this.sdate).format('YYYY-MM-DD')}`;
                this.$http.get(url).then(res => {
                    loading.close();
                    let data = res.body.data
                    if (data.err) {
                        this.$message({
                            type: 'error',
                            message: res.body.errText
                        });
                    } else {
                        this.$message({
                            type: 'success',
                            message: '重置成功!'
                        });
                        this.query();
                    }
                }, err => {
                    loading.close();
                    this.$message({
                        type: 'error',
                        message: err
                    });
                    throw err;
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        printTable() {
            this.$refs.easyPrint.print()
        }
    }
}
</script>
