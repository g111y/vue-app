<template>
  <div>
    <el-row>
      <span>选择日期:</span>
      <el-date-picker v-model="selectDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      <el-button @click="query()">查询</el-button>
    </el-row>
    <br>
    <el-tabs value="first">
      <el-tab-pane label="明细查询" name="first">
        <el-row>
          <el-table :data="itemData" width="100%" size="mini" border max-height="500">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="update_at" label="日期"></el-table-column>
            <el-table-column prop="tsmap" label="单号" width="100"> </el-table-column>
            <el-table-column prop="activeNo" label="活动批次" width="80"></el-table-column>
            <el-table-column prop="activeName" label="活动名称" width="80"></el-table-column>
            <el-table-column prop="activeClassNo" label="活动标准" width="80"></el-table-column>
            <el-table-column prop="activeClassName" label="礼品名称"></el-table-column>
            <el-table-column prop="tlmny" label="参加金额" width="70"></el-table-column>
            <el-table-column prop="retMny" label="兑换金额" width="70"></el-table-column>
            <el-table-column prop="subCnt" label="明细条数" width="70"></el-table-column>
            <el-table-column prop="delcd" label="删除" width="50"></el-table-column>
            <el-table-column prop="userid" label="发奖人员" width="80"></el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button size="mini" type="input" @click="showDetail(scope.$index, scope.row)">明细</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-tab-pane>
      <el-tab-pane name="second" label="汇总查询">
        <el-row>
        <el-table :data="itemTotal" size="mini" border height="500">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="workdate" label="日期"></el-table-column>
          <el-table-column prop="activeName" label="活动名称"></el-table-column>
          <el-table-column prop="activeClassNo" label="活动标准" width="100"></el-table-column>
          <el-table-column prop="activeClassName" label="礼品名称"></el-table-column>
          <el-table-column prop="userid" label="发放人"></el-table-column>
          <el-table-column prop="qty" label="发放数量"></el-table-column>
        </el-table>
      </el-row>
      </el-tab-pane>
    </el-tabs>
    

    <!-- 明细数据弹出层 -->
    <el-dialog title="明细数据" :visible.sync="dialogVisible">
      <el-table :data="itemDetailData">
        <el-table-column prop="SELSEQ" label="中心号" width="150"></el-table-column>
        <el-table-column prop="GDNO" label="货号" width="200"></el-table-column>
        <el-table-column prop="GDNAME" label="名称"></el-table-column>
        <el-table-column prop="SLMNY" label="销售金额"></el-table-column>
        <el-table-column prop="CALMNY" label="活动金额"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "activeQueryByDate",
  data() {
    return {
      selectDate: [new Date(), new Date()],
      itemData: [],
      itemTotal:[],
      itemDetailData: [],
      dialogVisible: false
    };
  },
  methods: {
    delItem() {},
    query() {
      let loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let url = ["activeQueryByDate", "activeQueryTotalByDate"];
      let postUrl="";
      url.forEach((item, index) => {
        postUrl = `${this.$store.state.host}api/cuxiao/active/${item}`;
        this.$http
          .post(postUrl, {
            selectDate: this.selectDate
          })
          .then(
            res => {
              loading.close();
              switch (item) {
                case "activeQueryByDate":
                  this.itemData = res.body.data.result;
                  break;
                case "activeQueryTotalByDate":
                  this.itemTotal = res.body.data.result;
                  break;
              }
            },
            err => {
              loading.close();
              throw err;
            }
          );
      });
    },
    showDetail(index, item) {
      let loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let url = `${
        this.$store.state.host
      }api/cuxiao/active/activeQueryItemDetail`;
      this.$http
        .post(url, {
          tsmap: item.tsmap
        })
        .then(
          res => {
            loading.close();
            this.itemDetailData = res.body.data.result;
            this.dialogVisible = true;
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


</stye>
