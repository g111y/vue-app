<template>
  <div>
    <el-row>
      <span>选择日期:</span>
      <el-date-picker v-model="selectDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      <el-button @click="query()">查询</el-button>
    </el-row>
    <br>
    <el-tabs value="first" >
      <el-tab-pane label="明细查询" name="first">
      <el-row>
        <el-table :data="itemData" size="mini" border height="500">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="update_at" label="日期"></el-table-column>
          <el-table-column prop="activeName" label="活动名称"></el-table-column>
          <el-table-column prop="tsmap" label="单号" width="100"> </el-table-column>
          <el-table-column prop="activeClassNo" label="活动标准" width="100"></el-table-column>
          <el-table-column prop="activeClassName" label="礼品名称"></el-table-column>
          <el-table-column prop="tlmny" label="参加金额" width="100"></el-table-column>
          <el-table-column prop="retMny" label="兑换金额" width="100"></el-table-column>
          <el-table-column prop="subCnt" label="明细条数" width="100"></el-table-column>
          <el-table-column prop="delcd" label="删除" width="100"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" @click="showDetail(scope.$index, scope.row)">明细</el-button>
              <el-button size="mini" type="danger" @click="delItem(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

        <!-- 明细数据弹出层 -->
        <el-dialog title="明细数据" :visible.sync="dialogVisible">
          <el-table :data="itemDetailData">
            <el-table-column property="SELSEQ" label="中心号" width="150"></el-table-column>
            <el-table-column property="GDNO" label="货号" width="200"></el-table-column>
            <el-table-column property="GDNAME" label="名称"></el-table-column>
            <el-table-column property="SLMNY" label="销售金额"></el-table-column>
            <el-table-column property="CALMNY" label="活动金额"></el-table-column>
          </el-table>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="汇总查询" name="second">
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
    
  </div>
</template>
<script>
export default {
  name: "activeQueryByUserid",
  data() {
    return {
      selectDate: [new Date(), new Date()],
      itemData: [],
      itemDetailData: [],
      itemTotal: [],
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
      let url=["activeQueryByUserid","activeQueryTotalByUserid"];
      let postUrl="";
      url.forEach((item,index)=>{
        postUrl = `${this.$store.state.host}api/cuxiao/active/${item}`;
        this.$http
        .post(postUrl, {
          selectDate: this.selectDate
        })
        .then(
          res => {
            loading.close();
            switch (item) {
              case "activeQueryByUserid":
                this.itemData = res.body.data.result;
                break;
              case "activeQueryTotalByUserid":
                this.itemTotal = res.body.data.result;
                break;
            }
          },
          err => {
            loading.close();
            throw err;
          }
        );
      })
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

</style>
