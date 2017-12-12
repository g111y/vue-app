<template>
<div>
    <el-button type="primary" @click="addUser">增加用户</el-button>
   <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id"  label="ID"  > </el-table-column>
      <el-table-column prop="userid"  label="登陆名"  > </el-table-column>
      <el-table-column prop="username"  label="姓名"  ></el-table-column>
      <el-table-column prop="update_at"  label="更新时间">
          <template slot-scope="scope">
              <span>{{formatDate(scope.row.update_at)}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="pswChangeDate"  label="密码修改时间"> 
          <template slot-scope="scope">
              <span>{{formatDate(scope.row.pswChangeDate)}}</span>
          </template>
      </el-table-column>
      <el-table-column prop="admin"  label="是否管理员"> </el-table-column>
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
const moment = require("moment");
export default {
  name: "userList",
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    refresh() {
      let loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let url = `${this.$store.state.host}api/users/userList`;
      this.$http.get(url).then(
        res => {
          loading.close();
          this.tableData = res.data.data;
        },
        err => {
          loading.close();
          throw err;
        }
      );
    },
    addUser() {
      this.$router.push(`userEdit/0`);
    },
    formatDate(dd) {
      console.log(dd);
      return moment(dd).format("YYYY-MM-DD HH:mm");
    },
    handleEdit(index, row) {
      this.$router.push(`userEdit/${row.id}`);
    },
    handleDelete(index, row) {
      this.$confirm(`此操作将永久删除用户 ${row.username} 信息, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = `${this.$store.state.host}api/users/delUserInfo`;
          this.$http.post(url, { id: row.id }).then(
            res => {
              this.refresh();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            },
            err => {
              throw err;
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  mounted() {
    this.refresh();
  }
};
</script>