<template>
  <el-dialog title="设置" :visible="dialogFormVisibleLocal" :close-on-click-modal="false"
             :close-on-press-escape="false" :show-close="false">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="部门设置" name="first">
        <el-tag type="danger">选择部门参加本档活动</el-tag>
        <br>
        <el-transfer  v-model="selectDeptLocal" :data="deptData"></el-transfer>
      </el-tab-pane>
      <el-tab-pane label="不参加次分类设置" name="second">
        <el-tag  type="danger">列表中的次分类不参加本档活动</el-tag>
        <br>
        <el-row>
          <el-input @keyup.enter.native="keyEnter" v-model="inputSubclsNo" placeholder="请输入次分类号" style="width:150px;"></el-input>
        </el-row>
        <el-table border :data="selectSubclsLocal" stripe style="width: 100%" height="300" highlight-current-row>
          <el-table-column  prop="deptNo" label="次分类号" > </el-table-column>
          <el-table-column  prop="subclsNo" label="次分类号" > </el-table-column>
          <el-table-column  prop="subclsName" label="次分类名称" > </el-table-column>
          <el-table-column  label="操作">
            <template scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, selectSubcls)"
                         type="text"
                         size="small">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <!--<el-button @click="closeWithoutOK">取 消</el-button>-->
      <el-button type="primary" @click="closeOK">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    name:"activeDept",
    props:{
      selectDept:Array,
      selectSubcls:Array,
      dialogFormVisible:Boolean
    },
    data(){
      return {
        activeName:"first",
        deptData: [],
        selectDeptLocal: this.selectDept,
        selectSubclsLocal:this.selectSubcls,
        dialogFormVisibleLocal:this.dialogFormVisible,
        otherApp:{},
        inputSubclsNo:""
      }
    },
    mounted() {
      let loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let url=`${this.$store.state.host}api/cuxiao/getDept`;
      this.$http.get(url).then((res)=> {
        loading.close();
        let dept = res.data.data;
        for (let i = 0; i < dept.length; i++) {
          let deptNo=dept[i].DEPTNO;
          let deptName=dept[i].DEPTNAME;
          this.deptData.push({
            key: `${deptNo} ${deptName}`,
            label: `${deptNo} ${deptName}`,
            disabled: false
          });
        }
      });
    },
    watch:{
      selectDept(val){
        this.selectDeptLocal=val;
      },
      selectSubcls(val){
        this.selectSubclsLocal=val;
      },
      dialogFormVisible(val){
        this.dialogFormVisibleLocal=val;
      },
      selectDeptLocal(val){
        this.$emit("update:selectDept",val);
      },
      selectSubclsLocal(val){
        this.$emit("update:selectSubcls",val)
      },
      dialogFormVisibleLocal(val){
        this.$emit("update:dialogFormVisible",val)
      }
    },
    methods:{
      closeWithoutOK(){
        let dept=[];
        console.log(this.oldSelectDept)
        for(let i=0;i<this.oldSelectDept.length;i++){
          let temp=this.oldSelectDept[i].split(" ");
          dept.push({
            "deptNo":temp[0],
            "deptName":temp[1]
          });
        }
        this.selectDeptLocal=dept;
        console.log(this.selectDeptLocal)
        this.dialogFormVisibleLocal = false;
      },
      closeOK(){
        let dept=[];
        for(let i=0;i<this.selectDeptLocal.length;i++){
          let temp=this.selectDeptLocal[i].split(" ");
          dept.push({
            "deptNo":temp[0],
            "deptName":temp[1]
          });
        }
        this.selectDeptLocal=dept;
        this.dialogFormVisibleLocal=false;
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      keyEnter(){
        let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let url=`${this.$store.state.host}api/cuxiao/subcls/${this.inputSubclsNo}`;
        this.$http.get(url).then((res)=>{
          let result=res.data;
          loading.close();
          if (result.err){
            alert(result.errText);
            return;
          }
          if(result.data.length<1){
            this.$message.error(`错了哦，${this.inputSubclsNo} 不存在！` );
            return;
          }
          result.data.forEach((index,key,data)=>{
            let item={
              "deptNo":data[key].DEPTNO,
              "subclsNo":data[key].SUBCLSNO,
              "subclsName":data[key].SUBCLSNAME
            };
            for(let i=0;i<this.selectSubclsLocal.length;i++){
              if(this.selectSubclsLocal[i].SUBCLSNO===item.SUBCLSNO){
                alert(`${item.SUBCLSNO}次分类已存在`);
                return;
              }
            }
            this.selectSubclsLocal.push(item);
          })

        });
      }
    }
  }
</script>
