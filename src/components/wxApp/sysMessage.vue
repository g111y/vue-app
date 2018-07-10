<template>
<div>
    <el-row>
        <el-button type="success" class="addButton" icon="el-icon-plus" @click="addDialogShow=true" circle></el-button>
    </el-row>
    <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="title" sortable label="标题" width="100"> </el-table-column>
        <el-table-column prop="content" label="内容"> </el-table-column>
        <!-- <el-table-column prop="openId" label="openId"> </el-table-column> -->
        <el-table-column prop="sdate" sortable label="开始日期" width="120"></el-table-column>
        <el-table-column prop="edate" label="结束日期" width="100"> </el-table-column>
        <el-table-column prop="stat" label="状态" width="50"> </el-table-column>
        <el-table-column prop="level" sortable label="等级" width="80"> </el-table-column>
        <el-table-column label="操作" width="150">
            <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 修改弹出层 -->
    <el-dialog title="公告修改" :visible.sync="dialogFormVisible" width='30%'>
        <el-form :model="form" label-position="left" label-width="80px" size="small">
            <el-form-item label="标题">
                <el-input v-model="form.title" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="内容">
                <el-input type="textarea" :rows='5' v-model="form.content" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="选择时间">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.sdate" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.edate" style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="状态">
                <el-switch v-model="form.stat" active-text="启用" inactive-text="禁用" active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="等级">
                <el-radio-group v-model="form.level">
                    <el-radio label='1'>滚动消息</el-radio>
                    <el-radio label='2'>弹窗消息</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="subSysMessage">提 交</el-button>
        </div>
    </el-dialog>

    <!-- 新建弹出层 -->
    <el-dialog title="新增公告" :visible.sync="addDialogShow" width='30%'>
        <el-form :model="formAdd" label-position="left" label-width="80px" size="small">
            <el-form-item label="标题">
                <el-input v-model="formAdd.title" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="内容">
                <el-input type="textarea" :rows='5' v-model="formAdd.content" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="选择时间">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="formAdd.sdate" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="formAdd.edate" style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="状态">
                <el-switch v-model="formAdd.stat" active-text="启用" inactive-text="禁用" active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="等级">
                <el-radio-group v-model="formAdd.level">
                    <el-radio label='1'>滚动消息</el-radio>
                    <el-radio label='2'>弹窗消息</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addDialogShow = false">取 消</el-button>
            <el-button type="primary" @click="handleAddMessage">增 加</el-button>
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
            addDialogShow:false,
            form: {},
            formAdd:{}
        }
    },
    methods: {
        handleEdit(index, row) {
            this.form = row;
            this.dialogFormVisible = true;
        },
        handleAddMessage(){
            // 提交sr建的系统公告
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let url = `${this.$store.state.wxAppHost}insertSysMessage`;
            this.$http.post(url, {
                title:this.formAdd.title,
                content:this.formAdd.content,
                sdate:this.formAdd.sdate,
                edate:this.formAdd.edate,
                stat:this.formAdd.stat,
                level:this.formAdd.level
            }).then(res => {
                loading.close();
                this.refreshData();
            }, err => {
                loading.close();
                throw err;
            })
            this.addDialogShow = false
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
                let url = `${this.$store.state.wxAppHost}delSysMessage`;
                this.$http.post(url, {
                    id: row.id
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
        subSysMessage() {
            // 提交修改的系统公告
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let url = `${this.$store.state.wxAppHost}sysMessages`;
            this.$http.post(url, {
                id:this.form.id,
                title:this.form.title,
                content:this.form.content,
                sdate:this.form.sdate,
                edate:this.form.edate,
                stat:this.form.stat,
                level:this.form.level
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
            let url = `${this.$store.state.wxAppHost}sysMessages`;
            this.$http.get(url).then(res => {
                loading.close();
                let data = res.body;
                for (let item of data.data) {
                    item.sdate = moment(item.subTime).format("YYYY-MM-DD");
                    item.edate = moment(item.subTime).format("YYYY-MM-DD");
                }
                this.tableData = data.data;
                console.log(data);
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

<style scoped>
    .addButton{
        margin-bottom: 20px;
    }
</style>
