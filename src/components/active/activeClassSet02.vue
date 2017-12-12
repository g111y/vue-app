<template>
  <el-form-item label="活动类型设置">
    <el-table :data="activeClassLocal" border style="width: 100%">
      <el-table-column label="赠品编码">
        <template scope="scope">
          <el-input size="small" v-model="scope.row.activeClassNo"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="赠品名称">
        <template scope="scope">
          <el-input size="small" v-model="scope.row.activeClassName"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="上限金额">
        <template scope="scope">
          <el-input-number size="small" v-model="scope.row.consume"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="下限金额">
        <template scope="scope">
          <el-input-number size="small" v-model="scope.row.present"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="赠品价格">
        <template scope="scope">
          <el-input-number size="small" v-model="scope.row.price"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button @click.native.prevent="deleteActiveClassRow(scope.$index, activeClassLocal)" type="text"
                     size="small">
            移除
          </el-button>
          <el-button @click.native.prevent="addActiveClassRow(scope.$index, activeClassLocal)" type="text"
                     size="small">
            增加
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form-item>

</template>

<script>
  import activeDept from "@/components/active/activeDept.vue";
  export default {
    name:"activeClassSet",
    components:{
      "activeDept":activeDept
    },
    props:{
      activeClass:Array,
    },
    data(){
      return {
        activeClassLocal:this.activeClass,
        selectDept:[],
        selectSubcls:[],
        dialogFormVisible:false,
        currentIndex:0
      }
    },
    watch:{
      activeClassLocal(val){
        this.$emit("update:activeClass",val)
      },
      activeClass(val){
        this.activeClassLocal=val;
      },
    },
    methods:{
      deleteActiveClassRow(index,rows){
        if(rows.length<=1){
          this.$message( '错了哦，不能移除最后一条数据!');
          return;
        }
        rows.splice(index, 1);
      },
      addActiveClassRow(index,rows){
        let item={
          activeClassNo:"",
          activeClassName:"",
          consume:0,
          present:0,
          activeDept:[],
          activeSubcls:[]
        };
        rows.push(item);
      },
    }
  }
</script>
