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
            <el-form-item label="日期控制类型">
                <el-radio-group v-model="vipSetData.type">
                    <el-radio label="0">当天控制</el-radio>
                    <el-radio label="1">日期段控制</el-radio>
                </el-radio-group>
            </el-form-item>
            <template v-if="vipSetData.type!='0'">
                <el-form-item label="活动时间">
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="开始日期" v-model="vipSetData.sdate" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="结束日期" v-model="vipSetData.edate" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
            </template>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button @click="refreshData()">刷新</el-button>
            </el-form-item>
        </el-form>
    </el-col>
</el-row>
</template>

<script>
import moment from "moment";
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
        };
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
                        type: "error",
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
                this.vipSetData.sdate=moment(this.vipSetData.sdate).format("YYYY-MM-DD");
                this.vipSetData.edate=moment(this.vipSetData.edate).format("YYYY-MM-DD");
                let res = await this.$http.post(url, {
                    vipSetData: this.vipSetData
                });
                loading.close();
                let result = res.body.data;
                if (result.err == true) {
                    this.$message({
                        type: "error",
                        message: result.errText
                    });
                } else {
                    console.log(result.data);
                    this.$message({
                        type: "success",
                        message: result.errText
                    });
                }
            } catch (e) {
                loading.close();
                throw e;
            }
        }
    }
};
</script>
