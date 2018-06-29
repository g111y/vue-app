<template>
<div class="layout">
  <headbar></headbar>
  <div class="layout-content">
    <el-row>
      <el-col :span="4">
        <sidebar></sidebar>
      </el-col>
      <el-col :span="19">
      <div class="layout-content-main">
        <router-view/>
      </div>
      </el-col>
    </el-row>
  </div>
  <div class="layout-copy">
    2011-2019 &copy; PARKSON GGYY
  </div>
</div>
</template>

<script>
  import Sidebar from '@/components/vipAdd/sideBar.vue'
  import Headbar from "@/components/Headbar.vue"
  export default {
    name:"userMain",
    components: {
      'sidebar': Sidebar,
      'headbar': Headbar
    },
    mounted() {
        let loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
        });
        let url=`${this.$store.state.wxAppHost}login`;
        this.$http.post(url,{
            name:"gaoyu",
            password:"123456"
        }).then(res=>{
            loading.close();
            let data=res.body;
            if(data.error){
                this.$message.error(data.errText)
            }else{
                this.$message.success(data.errText)
                sessionStorage.setItem('wxAppToken',data.token);
            }   
        },err=>{
            loading.close();
            throw err;
        });
        /**
         * 在此处换取sae服务器的Token
         */
    },
  }
</script>
<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
  }

  .layout-assistant{
    width: 300px;
    margin: 0 auto;
    height: inherit;
  }
  .layout-breadcrumb{
    padding: 10px 15px 0;
  }
  .layout-content{
    min-height: 600px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }
  .layout-content-main{
    padding: 10px;
  }
  .layout-copy{
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
</style>
