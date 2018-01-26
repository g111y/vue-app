<template>
  <el-row>
    <el-col :span="6" :offset="8">
    <div style="background:#eee;padding: 20px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>欢迎---请登陆</span>
        </div>
        <el-form ref="formInline" :model="formInline" :rules="ruleInline">
          <el-form-item prop="user">
            <el-input type="text" v-model="formInline.user" prefix-icon="el-icon-service" placeholder="Username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="formInline.password" prefix-icon="el-icon-edit" placeholder="Password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit('formInline')">登陆</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      formInline: {
        user: "",
        password: ""
      },
      ruleInline: {
        user: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码.", trigger: "blur" },
          { type: "string", min: 6, message: "密码必须6位以上", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let token = this.$store.state.token;
          let url = `${this.$store.state.host}api/users/login`;
          this.$http
            .post(url, {
              name: this.formInline.user,
              password: this.formInline.password
            })
            .then(res => {
              let resData = res.body.data;
              if (resData.error == false) {
                this.$message({
                  message: "恭喜你，登陆成功！",
                  type: "success"
                });
                this.$store.commit("setToken", {
                  token: resData.token,
                  system: resData.system,
                  user: {
                    admin:resData.admin,
                    userid:resData.userid
                  }
                });
                this.$router.push("/topMenu");
              }else{
                this.$message({
                  message: "用户名或密码错误！",
                  type: "error"
                });
              }
            },err=>{
              console.log(err);
              alert("请求错误！");
              throw err;
            });
        } else {
          this.$message.error("请按要求填写信息");
        }
      });
    }
  }
};
</script>
