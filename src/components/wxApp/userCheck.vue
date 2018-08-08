<template>
<div>
    <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <!-- <el-table-column prop="openId"  label="openId"  > </el-table-column> -->
        <el-table-column prop="userName" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="phone"> </el-table-column>
        <el-table-column prop="shop" label="专柜"> </el-table-column>
        <el-table-column prop="stat" label="状态"> </el-table-column>
        <el-table-column prop="subTime" label="提交时间"> </el-table-column>
        <el-table-column>
            <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleCheck(scope.$index, scope.row)">审核</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">拒绝</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 弹出层 -->
    <el-dialog title="用户审核" :visible.sync="dialogFormVisible" width='30%'>
        <el-form :model="form" label-position="left" label-width="80px" size="small">
            <el-form-item label="用户姓名">
                <el-input v-model="form.userName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机">
                <el-input v-model="form.phone" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="专柜">
                <el-input v-model="form.shop" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="楼层">
                <el-select v-model="form.floorName" placeholder="楼层">
                    <el-option v-for="item in floorOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="checkUser">通 过</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
const moment = require('moment');
const optionInfo = require('../../lib/floorInfo.js');
export default {
    data() {
        return {
            tableData: [],
            dialogFormVisible: false, //弹出层显示控制
            form: {},
            floorOption:optionInfo.floor
        }
    },
    methods: {
        //打开审核对话框
        handleCheck(index, row) {
            this.form = row;
            this.dialogFormVisible = true;
        },
        checkUser() {
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let url = `${this.$store.state.wxAppHost}userCheck`;
            this.$http.post(url, {
                openId: this.form.openId,
                userName: this.form.userName,
                phone: this.form.phone,
                shop: this.form.shop,
                floorName: this.form.floorName,
                stat: '1',
                subTime: this.form.subTime
            }).then(res => {
                loading.close();
                this.refreshData();
            }, err => {
                loading.close();
                throw err;
            })
            this.dialogFormVisible = false

        },
        //拒绝
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
                let url = `${this.$store.state.wxAppHost}delUser`;
                this.$http.post(url, {
                    openId: row.openId
                }).then(res => {
                    loading.close();
                    if (res.body.err == true) {
                        this.$message({
                            type: 'error',
                            message: res.body.errText
                        });
                    } else {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.refreshData();
                    }
                }, err => {
                    loading.close();
                    throw err;
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        refreshData() {
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let url = `${this.$store.state.wxAppHost}userCheck`;
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
        }
    },
    mounted() {
        this.refreshData();
    },
}
</script>
