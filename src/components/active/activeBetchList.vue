<template>
  <div>
    <el-row>
      <el-col :span="3">
        <el-button id="search" type="success" icon="el-icon-refresh" @click="query" circle></el-button>
      </el-col>
      <el-col :span="3">
        <el-popover ref="popover4" placement="right" width="350" trigger="click" >
          <div >
            <el-button type="success" style="width: 300px;margin: 0 auto;"  @click="addActive('01')">满送活动</el-button>
            <br><br>
            <el-button type="warning"  style="width: 300px;margin: 0 auto;" @click="addActive('02')">分级赠礼</el-button>
            <br><br>
            <el-button type="primary"  style="width: 300px;margin: 0 auto;" @click="addActive('03')">抽奖活动</el-button>
          </div>
        </el-popover>
        <el-button v-popover:popover4  icon="el-icon-plus">新建活动</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border height="600"
      style="width: 100%">
      <el-table-column prop="activeNo" label="批次号" width="80" ></el-table-column>
      <el-table-column prop="activeName" label="活动名称"  ></el-table-column>
      <el-table-column prop="activeTypeNo" label="活动类型" width="100"></el-table-column>
      <el-table-column prop="startDate" label="开始日期" width="100"></el-table-column>
      <el-table-column prop="endDate" label="结束日期" width="100"></el-table-column>
      <el-table-column prop="stat" label="活动状态" width="80"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="modifiy(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="showDetail(scope.$index, scope.row)">明细</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    name: "activeBetchList",
    data() {
      return {
        tableData: []
      }
    },
    mounted(){
      this.query();
    },
    methods: {
      modifiy(index,row){
        this.$router.push(`addActiveBetch${row.activeTypeNo}/${row.activeNo}`);
      },
      showDetail(index,row){

      },
      query() {
        let url = `${this.$store.state.host}api/cuxiao/active/activeList`;
        this.$http.get(url).then((res) => {
          this.tableData = res.data.data;
        }, (err) => {
          alert(err);
        })
      },
      addActive(activeType) {
        //this.$router.push(`addActiveBetch${activeType}`);
        this.$router.push({path: `addActiveBetch${activeType}/0`})
      }
    }
  }
</script>
<style scoped>
  #search {
    text-align: left;
    margin-bottom: 10px;
    float: left;
  }
</style>
