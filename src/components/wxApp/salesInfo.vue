<template>
<div>
    <el-row>
        <el-button type="success" class="addButton" icon="el-icon-plus" @click="addClick" circle></el-button>
    </el-row>
    <el-table :data="tableData" height="400" size="mini" border style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="title" sortable label="活动标题" width="300"> </el-table-column>
        <el-table-column prop="sdate" sortable label="开始时间" width="150"> </el-table-column>
        <el-table-column prop="edate" sortable label="结束时间" width="150"> </el-table-column>
        <el-table-column label="操作" width="100">
            <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 新建弹出层 -->
    <br>
    <div style="width:800px;" id="addDialog" :hidden="addDialogShow">
        <el-form :model="formAdd" label-position="left" label-width="80px" size="small">
            <el-form-item label="标题">
                <el-input v-model="formAdd.title" auto-complete="off"></el-input>
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
            <el-form-item label="内容">
                <div id="editorElem" style="text-align:left"></div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleAdd">确 定</el-button>
                <el-button @click="addDialogShow = true">取 消</el-button>
            </el-form-item>
        </el-form>
    </div>

    <!-- <div id="editorElem" style="text-align:left"></div> -->
    <button @click="showValue">show</button>
</div>
</template>

<script>
import E from 'wangeditor'
const moment = require('moment');
export default {
    data() {
        return {
            value: "",
            editor: "",
            addDialogShow: true,
            formAdd: {},
            tableData: [],
            isAdd: false //是新增还是修改
        };
    },
    mounted() {
        this.editor = new E('#editorElem')
        this.editor.customConfig.onchange = (html) => {
            this.value = html
        }
        this.editor.create()
        this.refreshData();
    },
    methods: {
        refreshData() {
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let url = `${this.$store.state.wxAppHost}salesInfo`;
            this.$http.get(url).then(res => {
                loading.close();
                let data = res.body;
                for (let item of data.data) {
                    item.sdate = moment(item.sdate).format("YYYY-MM-DD");
                    item.edate = moment(item.edate).format("YYYY-MM-DD");
                }
                this.tableData = data.data;
                console.log(data);
            }, err => {
                loading.close();
                throw err;
            })
        },
        handleAdd() {
            // 提交sr建的系统公告
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            this.formAdd.sdate = moment(this.formAdd.sdate).format("YYYY-MM-DD");
            this.formAdd.edate = moment(this.formAdd.edate).format("YYYY-MM-DD");
            if (this.isAdd == true) {
                let url = `${this.$store.state.wxAppHost}insertSalesInfo`;
                this.$http.post(url, {
                    title: this.formAdd.title,
                    content: this.editor.txt.html(),
                    sdate: this.formAdd.sdate,
                    edate: this.formAdd.edate
                }).then(res => {
                    loading.close();
                    this.refreshData();
                    this.addDialogShow = true;
                }, err => {
                    loading.close();
                    throw err;
                })
            } else {
                let url = `${this.$store.state.wxAppHost}updateSalesInfo`;
                this.$http.post(url, {
                    id: this.formAdd.id,
                    title: this.formAdd.title,
                    content: this.editor.txt.html(),
                    sdate: this.formAdd.sdate,
                    edate: this.formAdd.edate
                }).then(res => {
                    loading.close();
                    this.refreshData();
                    this.addDialogShow = true;
                }, err => {
                    loading.close();
                    throw err;
                })
            }
        },
        handleEdit(index, row) {
            this.addDialogShow = false;
            this.formAdd = row;
            this.editor.txt.html(row.content);
            this.isAdd = false;
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
                let url = `${this.$store.state.wxAppHost}deleteSalesInfo`;
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
        addClick() {
            this.addDialogShow = false;
            this.isAdd = true;
        },
        showValue() {
            console.log(this.editor)
            this.editor.txt.html("<h1>Some initial content</h1>")
            //console.log(this.value)
        }
    }
}
</script>
