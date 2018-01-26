<template>
  <div>
     <el-alert class="title" style="font-size:20px;" :title="titleText" type="success"  :closable="false">
     </el-alert>
     <br>
      <el-row>
          <el-col span="9">
              <el-input v-model="inputSelseq" class="inputSelseq" placeholder="请输入中心号"></el-input>
              <el-button type="primary" @click="querySelseq()">查询</el-button>
              <el-button style="margin-left: 20px;" type="success" @click="returnMny()">兑换</el-button>
          </el-col>
          <el-col span="15">
            <el-table class="totalTable" size="mini" :data="activeClassTotal" style="width: 90%">
                  <el-table-column prop="activeClassName" label="活动标准"></el-table-column>
                  <el-table-column prop="ACTIVEMNY" label="参加金额"></el-table-column>
                  <el-table-column prop="returnMny" label="返券金额"></el-table-column>
                </el-table>
          </el-col>    
      </el-row>
      <br>
      <el-row :gutter="20">
          <el-col span="10">
           <el-card class="box-card" style="height:500px">
            <div slot="header" class="clearfix">
              <span>中心号记录</span>
            </div>
            <div  class="text item">
              <el-table height="400" size="mini" :data="selseqData" style="width: 90%">
                  <el-table-column prop="SELSEQ" label="中心号"></el-table-column>
                  <el-table-column prop="SLMNY" label="金额"></el-table-column>
                  <el-table-column prop="ACTIVEMNY" label="活动金额"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button size="mini"  icon="el-icon-close"
                        @click="handleDelete(scope.$index, scope.row)"></el-button>
                    </template>
                </el-table-column>
                </el-table>
            </div>
          </el-card>
          </el-col>
          <el-col span="14">
            <el-card class="box-card" style="height:500px">
            <div slot="header" class="clearfix">
              <span>中心号明细</span>
            </div>
            <div  class="text item">
              <el-table height="400" size="mini" :data="sldetData" style="width: 90%">
                  <el-table-column prop="SELSEQ" label="中心号"></el-table-column>
                  <el-table-column prop="GDNO" label="货号"></el-table-column>
                  <el-table-column prop="GDNAME" label="名称"></el-table-column>
                  <el-table-column prop="SLMNY" label="消费金额"></el-table-column>
                  <el-table-column prop="ACTIVEMNY" label="参加金额"></el-table-column>
                  <el-table-column prop="activeClassName" label="活动标准"></el-table-column>
                </el-table>
            </div>
          </el-card>
          </el-col>
      </el-row>
      
  </div>
</template>

<script>
export default {
  name: "startActive01",
  data() {
    return {
      activeNo: this.$route.params.activeNo,
      inputSelseq: "",
      titleText: "",
      activeBetch: {},
      selseqData: [],
      sldetData: [],
      activeClassTotal: []
    };
  },
  mounted() {
    this.queryActive();
  },
  methods: {
    vaild() {
      if (this.selseqData.length <= 0) {
        this.$message({
          type: "error",
          message: `${this.inputSelseq} 没有需要计算的数据!`
        });
        return;
      }

      let loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let url = `${this.$store.state.host}api/cuxiao/active/vaildData01`;
      this.$http
        .post(url, {
          activeBetch: this.activeBetch,
          slmny: this.selseqData,
          sldet: this.sldetData
        })
        .then(
          res => {
            if (res.body.data.slmny.length > 0) {
              this.selseqData = res.body.data.slmny;
            }
            if (res.body.data.sldet.length > 0) {
              this.sldetData = res.body.data.sldet;
            }
            if (res.body.data.activeClassTotal.length > 0) {
              this.activeClassTotal = res.body.data.activeClassTotal;
            }
            loading.close();
          },
          err => {
            loading.close();
            throw err;
          }
        );
    },
    handleDelete(index, row) {
      var tempArr = this.sldetData.filter(item => {
        if (item.SELSEQ == row.SELSEQ) {
          return false;
        } else {
          return true;
        }
      });
      this.selseqData.splice(index, 1);
      this.sldetData = tempArr;
      this.vaild();
    },
    queryActive(activeNo) {
      let loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let url = `${this.$store.state.host}api/cuxiao/active/getActiveInfo/${
        this.activeNo
      }`;
      this.$http.get(url).then(
        res => {
          loading.close();
          let data = res.data.data;
          this.activeBetch = data.activeBetch[0];
          this.titleText = "活动名称:" + this.activeBetch.activeName;
        },
        err => {
          loading.close();
        }
      );
    },
    async querySelseq() {
      for (let i = 0; i < this.selseqData.length; i++) {
        if (this.inputSelseq == this.selseqData[i].SELSEQ) {
          this.$message({
            type: "error",
            message: `${this.inputSelseq} 中心号已存在于下面列表中!`
          });
          return;
        }
      }
      let loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let url = `${this.$store.state.host}api/cuxiao/getSlmny/`;
      this.$http
        .post(url, {
          selseq: this.inputSelseq,
          activeBetch: this.activeBetch
        })
        .then(
          res => {
            loading.close();
            let data = res.data.data;
            if (data.error) {
              this.$message({
                type: "error",
                message: `${data.errText}`
              });
              return;
            }
            this.selseqData.push(...data.slmny);
            this.sldetData.push(...data.sldetdscnt);
            this.inputSelseq = "";
            this.vaild();
            console.log(data);
          },
          err => {
            loading.close();
            throw err;
          }
        );
    },
    returnMny() {
      if (this.activeClassTotal.length < 1) {
        this.$message({
          type: "error",
          message: "没有满足兑换的数据!"
        });
        return;
      }

      this.$confirm("兑换后无法修改, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          let url = `${this.$store.state.host}api/cuxiao/active/submit01`;
          this.$http
            .post(url, {
              activeClassTotal: this.activeClassTotal,
              sldetData: this.sldetData
            })
            .then(
              res => {
                loading.close();
                let resData = res.body.data;
                console.log(resData);
                if (!resData.error) {
                  alert(resData.errText);
                  this.$message({
                    type: "success",
                    message: "兑换成功!"
                  });
                  this.initData();
                  return;
                } else {
                  alert(resData.errText);
                  this.$message({
                    type: "error",
                    message: "兑换失败!"
                  });
                }
              },
              err => {
                loading.close();
                throw err;
              }
            );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消兑换"
          });
        });
    },
    initData() {
      this.inputSelseq = "";
      this.inputSelseq = "";
      this.selseqData = [];
      this.sldetData = [];
      this.activeClassTotal = [];
    }
  }
};
</script>

<style scoped>
.inputSelseq {
  width: 200px;
}
.totalTable {
  color: red;
}
</style>


