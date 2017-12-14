<template>
  <div>
      <el-row>
          <el-col :span="24">
              <el-input v-model="inputCardNo" placeholder="请输入卡号或手机号" style="width:300px;font-size:22px" ></el-input>
              <el-button type="primary" @click="queryCard">查询</el-button>
          </el-col>
      </el-row>
      <el-row>
        <el-alert title="会员卡信息查询结果" type="success" :closable="false"></el-alert>
          <span id="cardInfo" v-html="cardInfo"></span>
        </el-alert>
      </el-row>
      <el-row>
        <el-alert title="会员卡参加活动查询结果" type="warning" :closable="false">
            <br>
            <el-button v-if="cardCanUse" type="primary" @click="logCardNo">登记卡号</el-button>
            <el-alert v-else title="ERROR" type="error" show-icon :closable="false">
                <br>
                {{cardNo + '  此卡今天已参加过活动'}}
            </el-alert>
        </el-alert>
        </el-alert>
      </el-row>
  </div>
</template>
<script>
export default {
  name: "vipCard",
  data() {
    return {
      inputCardNo: "",
      cardInfo: "",
      cardInfo2: {
        cardNo: "",
        update_at: new Date()
      },
      cardNo: "",
      cardCanUse: false
    };
  },
  methods: {
    refresh() {
      this.inputCardNo = "";
      this.cardInfo = "";
      this.cardInfo2 = {
        cardNo: "",
        update_at: new Date()
      };
      this.cardNo = "";
      this.cardCanUse = false;
    },
    logCardNo() {
      this.$confirm("是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        let url = `${this.$store.state.host}api/vip/logCardNo`;
        this.$http
          .post(url, {
            cardNo: this.cardNo,
            userid:this.$store.state.user.userid
          })
          .then(
            res => {
              loading.close();
              alert("提示，保存成功！")
              this.refresh();
            },
            err => {
              loading.close();
              throw err;
            }
          );
      });
    },
    errInfo() {
      return `${this.cardNo}此卡今天已参加过活动`;
    },
    queryCard() {
      let loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      let url = `${this.$store.state.host}api/vip/vipInfo/${this.inputCardNo}`;
      this.$http.get(url).then(
        res => {
          loading.close();
          this.cardInfo = res.body.data.result;
          this.cardNo = /02338\d{11}/.exec(this.cardInfo)[0];
          //隐藏顾客手机号码
          this.cardInfo=this.cardInfo.replace(/1\d{10}/g,"***********");
          
          let url2 = `${this.$store.state.host}api/vip/cardCanUse/${this
            .cardNo}`;
          this.$http.get(url2).then(res => {
            let data = res.body.data.result;
            if (data.length > 0) {
              this.cardInfo2 = data[0];
              this.cardCanUse = false;
            } else {
              this.cardCanUse = true;
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
<style type="text/css">
#cardInfo {
  font-family: verdana, arial, sans-serif;
  font-size: 11px;
  color: #333333;
  border-width: 1px;
  border-color: #666666;
  border-collapse: collapse;
  width: auto;
}
#cardInfo th {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #666666;
  background-color: #dedede;
}
#cardInfo td {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #666666;
  background-color: #ffffff;
}
#cardInfo tr td {
  white-space: nowrap;
}
</style>