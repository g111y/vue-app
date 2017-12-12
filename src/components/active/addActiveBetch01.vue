<template>
  <el-row>
    <el-col :span="19">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="activeName" required>
          <el-input v-model="ruleForm.activeName"></el-input>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="startDate">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.startDate"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="endDate">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.endDate"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item prop="attendStat" label="下挂部门/次分类参加活动" label-width="300">
          <el-radio-group v-model="ruleForm.attendStat">
            <el-radio label="Y">参加活动</el-radio>
            <el-radio label="N">不参加活动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-switch active-value="0" inactive-value="1"
                     active-color="#13ce66" inactive-color="#ff4949"
                     active-text="有效" inactive-text="无效"
                     v-model="ruleForm.stat"></el-switch>
        </el-form-item>
        <active-class-set :activeClass.sync="activeClass"></active-class-set>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  import activeClassSet from "@/components/active/activeClassSet.vue"
  const moment=require("moment");
  export default {
    name: "addActiveBetch01",
    components: {
      "activeClassSet": activeClassSet
    },
    data() {
      return {
        ruleForm: {
          activeNo:this.$route.params.activeNo,
          activeName: '',
          activeTypeNo:"01",
          attendStat: "",
          startDate: '',
          endDate: '',
          stat: "",
        },
        activeClass: [{
          activeClassNo: "",
          activeClassName: "",
          consume: 0,
          present: 0,
          activeDept: [],
          activeSubcls: []
        }],
        rules: {
          activeName: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 3, message: '长度至少 3  个字符', trigger: 'blur'}
          ],
          attendStat: [
            {required: true, message: '请选择下挂部门/次分类类型', trigger: 'change'}
          ],
          startDate: [
            {type: 'date', required: true, message: '请选择开始日期', trigger: 'change'}
          ],
          endDate: [
            {type: 'date', required: true, message: '请选择结束日期', trigger: 'change'}
          ],
          type: [
            {type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change'}
          ],

        }
      };
    },
    mounted(){
      if(this.$route.params.activeNo!=0){
        let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let url=`${this.$store.state.host}api/cuxiao/active/getActiveInfo/${this.ruleForm.activeNo}`;
        this.$http.get(url).then((res)=>{
          loading.close();
          this.ruleForm=res.data.data.activeBetch[0];
          this.ruleForm.startDate=new Date(moment(this.ruleForm.startDate,"YYYYMMDD"));
          this.ruleForm.endDate=new Date(moment(this.ruleForm.endDate,"YYYYMMDD"));
          this.activeClass=res.data.data.activeClass;
        },(err)=>{
          loading.close()
          throw err;
        });
      }
    },
    methods: {
      submitForm(formName) {
        let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url="";
            switch(this.ruleForm.activeNo){
              case "0":
                url=`${this.$store.state.host}api/cuxiao/active/createActiveBetch`;
                break;
              default:
                url=`${this.$store.state.host}api/cuxiao/active/updateActiveBetch`
            }

            this.$http.post(url,{
              "activeData":this.ruleForm,
              "activeClassData":this.activeClass
            }).then((res)=>{
              loading.close();
              this.$message.success('保存成功!');
              console.log(res.data);
            },(err)=>{
              loading.close()
              throw err;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.activeClass=[{
          activeClassNo: "",
          activeClassName: "",
          consume: 0,
          present: 0,
          activeDept: [],
          activeSubcls: []
        }];
      },
    }
  }
</script>
