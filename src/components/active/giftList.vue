<template>
<div>
    <el-row>
        <el-checkbox v-model="queryAll">查看包含过期数据</el-checkbox>
        <el-button type="success" class="addButton" icon="el-icon-refresh" @click="refreshData" circle></el-button>
        <el-button type="primary" class="addButton" icon="el-icon-plus" @click="addClick" circle></el-button>
        <a href="http://ggyy.applinzi.com/giftList" target="_blank">打开电子券列表</a>
    </el-row>
    <br>
    <el-table :data="tableData" size="mini" border style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="floorName" sortable label="楼层" width="80"> </el-table-column>
        <el-table-column prop="title" sortable label="活动标题" width="300"> </el-table-column>
        <el-table-column prop="desc" sortable label="活动描述" width="200"> </el-table-column>
        <el-table-column prop="price" sortable label="面值" width="80"> </el-table-column>
        <el-table-column prop="pic" sortable label="样式" width="80"> </el-table-column>
        <el-table-column prop="sdate" sortable label="开始时间" width="100"> </el-table-column>
        <el-table-column prop="edate" sortable label="结束时间" width="100"> </el-table-column>
        <el-table-column label="操作" width="100">
            <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 弹出层 -->
    <br>
    <el-dialog title="处理" :visible.sync="dialogFormVisible" width='30%'>
        <el-form :model="formAdd" label-position="left" label-width="80px" size="small">
            <el-form-item label="楼层">
                <el-select v-model="formAdd.floorName" placeholder="请选择楼层">
                    <el-option label="一楼" value="一楼"></el-option>
                    <el-option label="二楼" value="二楼"></el-option>
                    <el-option label="三楼" value="三楼"></el-option>
                    <el-option label="四楼" value="四楼"></el-option>
                    <el-option label="负一楼" value="负一楼"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动标题">
                <el-input v-model="formAdd.title" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="活动描述">
                <el-input v-model="formAdd.desc" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="券面值">
                <el-input v-model="formAdd.price" type="number" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="券样式">
                <el-radio-group v-model="formAdd.pic">
                    <el-radio label="stamp01">样式一</el-radio>
                    <el-radio label="stamp02">样式二</el-radio>
                    <el-radio label="stamp03">样式三</el-radio>
                    <el-radio label="stamp04">样式四</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="活动日期">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="formAdd.sdate" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="formAdd.edate" style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="URL">
                <el-input v-model="formAdd.url" type="textarea" rows=3 auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleAdd">确 定</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</div>
</template>

<script>
const moment = require('moment');
export default {
    data() {
        return {
            queryAll: false,
            dialogFormVisible: false,
            tableData: [],
            formAdd: {},
            isAdd: false //是新增还是修改
        }
    },
    mounted() {
        this.refreshData();
    },
    methods: {
        async refreshData() {
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let url = `${this.$store.state.wxAppHost}quncrm/giftList/${this.queryAll?'all':"ones"}`;
            try {
                let res = await this.$http.get(url);
                loading.close();
                if (res.body.err == true) {
                    this.$message({
                        type: 'error',
                        message: res.body.errText
                    });
                } else {
                    this.tableData = res.body.data;
                }
            } catch (err) {
                loading.close();
                this.$message.error(JSON.stringify(err));
                throw err;
            }
        },
        async handleDelete(index, row) {
            try {
                await this.$confirm('此操作将删除数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                let loading = this.$loading({
                    lock: true,
                    text: "Loading",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)"
                });
                let url = `${this.$store.state.wxAppHost}quncrm/deleteGift`;
                try {
                    let res = await this.$http.post(url, {
                        id: row.id
                    });
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
                } catch (err) {
                    loading.close();
                    this.$message.error(JSON.stringify(err));
                    throw err;
                }
            } catch (err) {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            }
        },
        handleEdit(index, row) {
            this.isAdd=false;
            this.formAdd = row;
            this.dialogFormVisible = true;
        },
        addClick() {
            this.formAdd={};
            this.dialogFormVisible = true;
            this.isAdd = true;
        },
        async insertGift(item) {
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let url = `${this.$store.state.wxAppHost}quncrm/insertGift`;
            try {
                let res = await this.$http.post(url, {
                    floorName: item.floorName,
                    title: item.title,
                    desc: item.desc,
                    price: item.price,
                    pic: item.pic,
                    sdate: moment(item.sdate).format('YYYY-MM-DD'),
                    edate: moment(item.edate).format('YYYY-MM-DD'),
                    url: item.url
                });
                loading.close();
                if (res.body.err == true) {
                    this.$message({
                        type: 'error',
                        message: res.body.errText
                    });
                } else {
                    this.$message({
                        type: 'success',
                        message: '新增成功!'
                    });
                    this.dialogFormVisible = false;
                    this.refreshData();
                }
            } catch (err) {
                loading.close();
                this.$message.error(JSON.stringify(err));
                throw err;
            }
        },
        async updateGift(item) {
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            let url = `${this.$store.state.wxAppHost}quncrm/updateGift`;
            try {
                let res = await this.$http.post(url, {
                    id: item.id,
                    floorName: item.floorName,
                    title: item.title,
                    desc: item.desc,
                    price: item.price,
                    pic: item.pic,
                    sdate: moment(item.sdate).format('YYYY-MM-DD'),
                    edate: moment(item.edate).format('YYYY-MM-DD'),
                    url: item.url
                });
                loading.close();
                if (res.body.err == true) {
                    this.$message({
                        type: 'error',
                        message: res.body.errText
                    });
                } else {
                    this.$message({
                        type: 'success',
                        message: '更新成功!'
                    });
                    this.dialogFormVisible = false;
                    this.refreshData();
                }
            } catch (err) {
                loading.close();
                this.$message.error(JSON.stringify(err));
                throw err;
            }
        },
        handleAdd() {
            //isAdd为true表示新增，false表示修改
            if (this.isAdd) {
                this.insertGift(this.formAdd);
            } else {
                this.updateGift(this.formAdd);
            }
        }
    }
}
</script>
