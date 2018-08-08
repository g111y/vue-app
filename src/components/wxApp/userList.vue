<template>
<div>
    <el-table :data="tableData" border style="width: 100%" max-height="550">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="floorName" :filters="floorFilter" :filter-method="floorFilterHandler" sortable label="楼层" width="100"> </el-table-column>
        <el-table-column prop="shop" sortable label="专柜" width="150" :filters="shopFilter" :filter-method="shopFilterHandler"> </el-table-column>
        <!-- <el-table-column prop="openId" label="openId"> </el-table-column> -->
        <el-table-column prop="userName" sortable label="姓名" width="150"></el-table-column>
        <el-table-column prop="phone" label="phone" width="150"> </el-table-column>
        <el-table-column prop="stat" label="状态" width="50"> </el-table-column>
        <el-table-column prop="subTime" sortable label="提交时间" width="180"> </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 弹出层 -->
    <el-dialog title="用户修改" :visible.sync="dialogFormVisible" width='30%'>
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
            <el-form-item label="状态">
                <el-radio-group v-model="form.stat">
                    <el-radio label="0">待审核</el-radio>
                    <el-radio label="1">已审核</el-radio>
                    <el-radio label="2">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="注册时间">
                <el-input :disabled="true" v-model="form.subTime" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="subUserInfo">提 交</el-button>
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
            dialogFormVisible: false,
            form: {},
            floorOption: optionInfo.floor,//楼层选择框数据
            floorFilter:[],//..表格楼层筛选数据
            shopFilter:[]//..表格专柜筛选数据
        }
    },
    methods: {
        floorFilterHandler(value, row, column){
            return row.floorName==value;
        },
        shopFilterHandler(value, row, column){
            return row.shop==value;
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
        subUserInfo() {
            // 提交修改的用户资料
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let url = `${this.$store.state.wxAppHost}updateUserInfo`;
            this.$http.post(url, {
                openId: this.form.openId,
                userName: this.form.userName,
                phone: this.form.phone,
                shop: this.form.shop,
                floorName: this.form.floorName,
                stat: this.form.stat
            }).then(res => {
                loading.close();
                this.refreshData();
            }, err => {
                loading.close();
                throw err;
            })
            this.dialogFormVisible = false
        },
        refreshData() {
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let url = `${this.$store.state.wxAppHost}userList`;
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
        for(let item of this.floorOption){
            this.floorFilter.push({
                text:item.label,
                value:item.value
            })
        }

        //取专柜filter数据
        let url=`${this.$store.state.wxAppHost}shopList`;
        this.$http.get(url).then(res=>{
            let data=res.body;
            for(let item of data.result){
                this.shopFilter.push({
                    text:item.shop,
                    value:item.shop
                })
            }
        },err=>{

        })
    },
}
</script>
