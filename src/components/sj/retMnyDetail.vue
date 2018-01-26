<template>
<div>
    <el-row>
        <span>请选择日期:</span>
      <el-date-picker
        v-model="selectDate"
        type="daterange"
        range-separator="至"
        :picker-options="pickerOptions"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button type="primary" @click="query()">
        查询
      </el-button>
      <el-button  @click="exportExcel()">
        导出
      </el-button>
    </el-row>
    <br/>
    <el-row>
        <el-table ref="table" border stripe size="mini" :data="retGoodMnyDetail"  
            highlight-current-row  style="width: 100%" height="500">
             <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="POSTYPE" label="POS类型" ></el-table-column>
            <el-table-column prop="WORKDATE" label="交易日期" ></el-table-column>
            <el-table-column prop="SELSEQ" label="中心号"></el-table-column>
            <el-table-column prop="POSNO" label="POS机号" ></el-table-column>
            <el-table-column prop="SLTIME" label="时间" ></el-table-column>
            <el-table-column prop="SELNO" label="序号" ></el-table-column>
            <el-table-column prop="GDNO" label="商品编号" ></el-table-column>
            <el-table-column prop="GDNAME" label="商品名称" ></el-table-column>
            <el-table-column prop="SLETYPE" label="交易类型" ></el-table-column>
            <el-table-column prop="SLPRC" label="售价" ></el-table-column>
            <el-table-column prop="SLQTY" label="数量" ></el-table-column>
            <el-table-column prop="DSCNT" label="折扣合计" ></el-table-column>
            <el-table-column prop="SLMNY" label="净销售" ></el-table-column>
            <el-table-column prop="NORDISC" label="普通折扣" ></el-table-column>
            <el-table-column prop="GIFTDISC1" label="VIP折扣" ></el-table-column>
            <el-table-column prop="GIFTDISC2" label="活动折扣" ></el-table-column>
            <el-table-column prop="VIPDISC2" label="商务卡" ></el-table-column>
      </el-table>
    </el-row>
</div>  
</template>

<script>
const moment = require("moment");
const CsvExport = require("../../lib/CsvExport");
export default {
  name: "retMnyDetail",
  data() {
    return {
      retGoodMnyDetail: [],
      selectDate: [new Date(), new Date()],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  methods: {
    exportExcel() {
      let columns = this.$refs.table.$children.filter(t => t.prop != null);
      const fields = columns.map(t => t.prop);
      const fieldNames = columns.map(t => t.label);
      CsvExport(this.retGoodMnyDetail, fields, fieldNames, "列表");
    },
    query() {
      let loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let url = `${this.$store.state.host}api/sj/retGoodMnyDetail`;
      let sdate = moment(this.selectDate[0]).format("YYYYMMDD");
      let edate = moment(this.selectDate[1]).format("YYYYMMDD");
      this.$http
        .post(url, {
          sdate: sdate,
          edate: edate
        })
        .then(
          res => {
            loading.close();
            this.retGoodMnyDetail = res.body.data;
            this.retGoodMnyDetail.forEach((item, index, arr) => {
              arr[index].SLTIME = moment(arr[index].SLTIME).format("HH:MM");
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
<style>

</style>


