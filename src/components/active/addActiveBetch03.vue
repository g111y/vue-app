<style scoped>
  .quantity input{
    color:#e64e4e;
  }
</style>
<template>
  <el-row>
    <el-col :span="18">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="activeName" required>
          <el-input v-model="ruleForm.activeName"></el-input>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="startDate">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.startDate" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="endDate">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.endDate" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-switch active-value="0" inactive-value="1" active-color="#13ce66" inactive-color="#ff4949" active-text="有效" inactive-text="无效"
            v-model="ruleForm.stat"></el-switch>
        </el-form-item>
        <el-form-item label="活动类型设置">
          <template>
            <el-table :data="activeClass" border >
              <el-table-column label="奖品编码" width="80">
                <template scope="scope">
                  <el-input size="small" v-model="scope.row.activeClassNo"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="奖品名称">
                <template scope="scope">
                  <el-input size="small" v-model="scope.row.activeClassName"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="当前数量" width="100">
                <template scope="scope">
                  <el-input class="quantity" size="mini" v-model="scope.row.quantity"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="初始数量" width="100">
                <template scope="scope">
                  <el-input size="mini" v-model="scope.row.setQuantity"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="中奖机率" width="100">
                <template scope="scope">
                  <el-input size="small" v-model="scope.row.winRate"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template scope="scope">
                  <el-button @click.native.prevent="deleteActiveClassRow(scope.$index, activeClass)" type="text" size="small">
                    移除
                  </el-button>
                  <el-button @click.native.prevent="addActiveClassRow(scope.$index, activeClass)" type="text" size="small">
                    增加
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>


<script>
  
  const moment = require("moment");
  export default {
    name: "addActiveBetch02",
    data() {
      return {
        ruleForm: {
          activeNo: this.$route.params.activeNo,
          activeName: '',
          activeTypeNo: "03",
          attendStat: "",
          startDate: '',
          endDate: '',
          stat: "1",
        },
        activeClass: [{
          activeClassNo: "",
          activeClassName: "",
          quantity: 0,
          setQuantity:0,
          winRate: 0
        }],
        rules: {
          activeName: [{
              required: true,
              message: '请输入活动名称',
              trigger: 'blur'
            },
            {
              min: 3,
              message: '长度至少 3  个字符',
              trigger: 'blur'
            }
          ],
          startDate: [{
            type: 'date',
            required: true,
            message: '请选择开始日期',
            trigger: 'change'
          }],
          endDate: [{
            type: 'date',
            required: true,
            message: '请选择结束日期',
            trigger: 'change'
          }],
          type: [{
            type: 'array',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change'
          }],

        }
      }
    },
    mounted() {
      if (this.$route.params.activeNo != 0) {
        let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        console.log("aa");
        let url = `${this.$store.state.host}api/cuxiao/active/getActiveInfo03/${this.ruleForm.activeNo}`;
        this.$http.get(url).then((res) => {
          loading.close();
          this.ruleForm = res.data.data.activeBetch[0];
          this.ruleForm.startDate = new Date(moment(this.ruleForm.startDate, "YYYYMMDD"));
          this.ruleForm.endDate = new Date(moment(this.ruleForm.endDate, "YYYYMMDD"));
          this.activeClass = res.data.data.activeClass;
        }, (err) => {
          loading.close()
          throw err;
        });
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });

            let url = "";
            switch (this.ruleForm.activeNo) {
              case "0":
                url = `${this.$store.state.host}api/cuxiao/active/createActiveBetch03`;
                break;
              default:
                url = `${this.$store.state.host}api/cuxiao/active/updateActiveBetch03`
            }

            this.$http.post(url, {
              "activeData": this.ruleForm,
              "activeClassData": this.activeClass
            }).then((res) => {
              loading.close();
              res = res.body.data;
              if (!res.error) {
                this.$message.success('保存成功!');
              } else {
                this.$message.error(res.errText);
              }

              console.log(res.data);
            }, (err) => {
              loading.close();
              throw err;
            })
          } else {
            console.log('error submit!!');
            this.$message.error("请检查数据!");
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.activeClass = [{
          activeClassNo: "",
          activeClassName: "",
          quantity: 0,
          winRate: 0
        }];
      },
      deleteActiveClassRow(index, rows) {
        if (this.activeClass.length <= 1) {
          this.$message({
            type: "error",
            message: '错了哦，不能移除最后一条数据!'
          });
          return;
        }
        this.activeClass.splice(index, 1);
      },
      addActiveClassRow(index, rows) {
        let item = {
          activeClassNo: "",
          activeClassName: "",
          quantity: 0,
          winRate: 0
        };
        this.activeClass.push(item);
      },
    }
  }

</script>
