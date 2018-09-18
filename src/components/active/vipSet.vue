<template>
<el-row>
    <el-col :span="15">
        <el-form :ref="vipSetData" label-width="200px" :model="vipSetData">
            <el-form-item label="活动必须达到的消费金额">
                <el-input :disabled="true" v-model="vipSetData.vipMoney"></el-input>
            </el-form-item>
            <el-form-item label="每卡每天最大参加次数">
                <el-input v-model="vipSetData.vipCount"></el-input>
            </el-form-item>
            <el-form-item label="活动赠送金额">
                <el-input :disabled="true" v-model="vipSetData.giftMoney"></el-input>
            </el-form-item>
            <el-form-item label="活动每天最大赠送限额">
                <el-input :disabled="true" v-model="vipSetData.maxMoney"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button @click="refreshData()">刷新</el-button>
            </el-form-item>
        </el-form>
    </el-col>
</el-row>
</template>

<script>
export default {
    name: "vipSet",
    data() {
        return {
            vipSetData: {
                vipMoney: 0, //活动必须达到的消费金额
                vipCount: 0, //每卡每天最大参加次数
                giftMoney: 0, //活动赠送金额
                maxMoney: 0 //活动每天最大赠送限额
            }
        }
    },
    mounted() {
        this.refreshData();
    },
    methods: {
        async refreshData() {
            let url = `${this.$store.state.host}api/vip/vipSet`;
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            try {
                let res = await this.$http.get(url);
                loading.close();
                let result = res.body.data;
                if (result.err == true) {
                    this.$message({
                        type: 'error',
                        message: result.errText
                    });
                } else {
                    console.log(result.data);
                    this.vipSetData = result.data;
                    // this.detailData = res.body.data;
                    // this.dialogFormVisible = true;
                }
            } catch (e) {
                loading.close();
                throw e;
            }
        },
        async onSubmit() {
            let url = `${this.$store.state.host}api/vip/vipSet`;
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            try {
                let res = await this.$http.post(url,{
                    vipSetData:this.vipSetData
                });
                loading.close();
                let result = res.body.data;
                if (result.err == true) {
                    this.$message({
                        type: 'error',
                        message: result.errText
                    });
                } else {
                    console.log(result.data);
                    this.$message({
                        type: 'success',
                        message: result.errText
                    });
                }
            } catch (e) {
                loading.close();
                throw e;
            }
        }
    }
}
</script>
