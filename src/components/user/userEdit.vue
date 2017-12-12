<template>
  <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-width="80px">
    <el-form-item label="ID" prop="id">
        <el-input readonly v-model="ruleForm.id"></el-input>
    </el-form-item>
    <el-form-item label="登陆名" prop="userid">
        <el-input v-model="ruleForm.userid"></el-input>
    </el-form-item>
    <el-form-item label="姓名" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
    </el-form-item>
    <el-form-item label="密码"  prop="password">
        <el-input type="password" v-model="ruleForm.password"></el-input>
    </el-form-item>
    <el-form-item label="管理员" prop="delivery">
        <el-switch active-value="Y" inactive-value="N" v-model="ruleForm.admin"></el-switch>
    </el-form-item>
    <el-form-item label="可用系统">
        <el-transfer :titles="['可选择', '已选择']" v-model="system" :data="systemName"></el-transfer>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="cancel">取消</el-button>
  </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: "userEdit",
  data() {
    return {
      ruleForm: {
        id: this.$route.params.id,
        userid: "",
        username: "",
        password: "",
        admin: "N"
      },
      system: [],
      systemName: [],
      rules: {}
    };
  },
  watch: {
    system(val) {
      this.ruleForm.system = val.toString();
    }
  },
  mounted() {
    let loading = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    this.ruleForm.id = this.$route.params.userid;

    let url = `${this.$store.state.host}api/users/systemName`;
    this.$http.get(url).then(
      res => {
        loading.close();
        let data = res.body.data;
        data.forEach((item, index) => {
          this.systemName.push({
            key: item.systemName,
            label: item.name
          });
        });
      },
      err => {
        loading.close();
        throw err;
      }
    );
    //根据ID取用户信息
    url = `${this.$store.state.host}api/users/userInfo/${this.ruleForm.id}`;
    this.$http.get(url).then(
      res => {
        loading.close();
        if (res.body.data.length > 0) {
          let data = res.body.data[0];
          this.ruleForm.userid = data.userid;
          this.ruleForm.username = data.username;
          this.ruleForm.password = data.password;
          this.ruleForm.system = data.system;
          this.ruleForm.admin = data.admin;
          this.system = this.ruleForm.system.split(",");
        }
      },
      err => {
        throw err;
      }
    );
  },
  methods: {
    cancel() {
      this.$router.go(-1);
    },
    onSubmit() {
      let loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let url = `${this.$store.state.host}api/users/userUpdate`;
      this.$http.post(url, { userInfo: this.ruleForm }).then(
        res => {
          loading.close();
          this.$alert("数据更新成功!", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.$router.go(-1);
            }
          });
        },
        err => {
          loading.close();
          throw err;
        }
      );
    }
  }
};
</script>

