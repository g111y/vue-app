<template>
    <div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="openId"  label="openId"  > </el-table-column>
      <el-table-column prop="userName"  label="姓名"  ></el-table-column>
      <el-table-column prop="phone"  label="phone"> </el-table-column>
      <el-table-column prop="shop"  label="专柜"> </el-table-column>
      <el-table-column prop="stat"  label="状态"> </el-table-column>
      <el-table-column prop="subTime"  label="提交时间"> </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
</template>
<script>
const moment=require('moment');
export default {
    data(){
        return {
            tableData:[]
        }
    },
    methods:{

    },
    mounted() {
        let loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
        });
        let url=`${this.$store.state.wxAppHost}userList`;
        this.$http.get(url).then(res=>{
            loading.close();
            let data=res.body;
            for(let item of data.data){
                item.subTime=moment(item.subTime).format("YYYY-MM-DD HH:mm:ss");
            }
            this.tableData=data.data;
        },err=>{
            loading.close();
            throw err;
        })
    },
}
</script>

