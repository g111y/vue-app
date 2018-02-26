<template>
  <div>
    <el-row>
      <el-col span=3>
          <el-input  v-model="activeNo" placeholder="请输入批次号"></el-input>
      </el-col>
      <el-col span=3>
          <el-button type="primary" @click="query()">查询</el-button>
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-table :data="giftData"  border  style="width: 100%" height="500">
        <el-table-column prop="ACTIVENO" label="活动批次号" ></el-table-column>
        <el-table-column prop="USEDATE" label="使用日期" ></el-table-column>
        <el-table-column prop="STAT" label="状态"></el-table-column>
        <el-table-column prop="CNT" label="数量" ></el-table-column>
        <el-table-column prop="TOLMNY" label="金额" ></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "giftUseCount",
  data() {
    return {
      activeNo: 0,
      giftData: []
    };
  },
  methods: {
    query() {
      if (isNaN(this.activeNo)) {
        this.$message({
          type: "error",
          message: "请输入正确的批次号!"
        });
      }
      let loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let url = `${this.$store.state.host}api/sj/giftUseCount`;
      let res = this.$http
        .post(url, {
          activeNo:this.activeNo
        })
        .then(
          res => {
            //console.log(res.data.data);
            loading.close();
            this.giftData = res.data.data;
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
<style scoped>

</style>

