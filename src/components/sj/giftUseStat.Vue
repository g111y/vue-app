<template>
  <div>
    <el-row>
      <span>请选择日期:</span>
      <el-date-picker
        v-model="selectDate"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button type="primary" @click="query()">
        查询
      </el-button>
    </el-row>
    <br>
    <el-row>
      <el-table :data="giftData"  border  style="width: 100%" height="500">
        <el-table-column prop="ACTIVENO" label="活动批次号" ></el-table-column>
        <el-table-column prop="ACTIVESTART" label="开始日期" ></el-table-column>
        <el-table-column prop="ACTIVEEND" label="结束日期"></el-table-column>
        <el-table-column prop="TOPIC" label="活动主题" ></el-table-column>
        <el-table-column prop="SALELANG" label="促销语" ></el-table-column>
        <el-table-column prop="MAKECOUNT" label="制券数量" ></el-table-column>
        <el-table-column prop="USECOUNT" label="使用数量" ></el-table-column>
        <el-table-column prop="bb" label="使用比例" ></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
  const moment=require("moment");
  export default {
    name: "giftUseStat",
    data() {
      return {
        selectDate: [new Date(), new Date()],
        giftData: []
      }
    },
    methods: {
      query() {
        let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let url = `${this.$store.state.host}api/sj/giftUseStat`;
        let res=this.$http.post(url,{
          sdate:this.selectDate[0],
          edate:this.selectDate[1]
        }).then((res)=>{
          //console.log(res.data.data);
          loading.close();
          this.giftData=res.data.data;
          for(let i=0;i<this.giftData.length;i++){
            this.giftData[i].ACTIVESTART=moment(this.giftData[i].ACTIVESTART).format("YYYY-MM-DD");
            this.giftData[i].ACTIVEEND=moment(this.giftData[i].ACTIVEEND).format("YYYY-MM-DD");
            this.giftData[i].bb=this.giftData[i].USECOUNT / this.giftData[i].MAKECOUNT * 100;
            this.giftData[i].bb=this.giftData[i].bb.toFixed(2)+"%";
          }
        },(err)=>{
          loading.close();
          throw err;
        })
      }
    }
  }
</script>
<style>
  .el-table{
    font-size: 11px;
  }
</style>
