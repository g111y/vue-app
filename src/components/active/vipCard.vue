<template>
<div>
    <el-row>
        <el-col :span="24">
            <el-input v-model="inputCardNo" placeholder="请输入卡号或手机号" style="width:300px;font-size:22px"></el-input>
            <el-button type="primary" @click="queryCard">查询</el-button>
            <el-tag type="info">今日已发{{vipCount}}个</el-tag>
        </el-col>
    </el-row>
    <el-row>
        <el-alert title="会员卡信息查询结果" type="success" :closable="false"></el-alert>
        <span id="cardInfo" v-html="cardInfo"></span>
    </el-row>
    <el-row>
        <el-alert title="会员卡参加活动查询结果" type="warning" :closable="false">
            <br>
            <template v-if="cardCanUse">
                <el-alert title="提示" type="success" show-icon :closable="false">
                    <br>
                    {{cardNo + ' '+errText}}
                </el-alert>
                <el-button type="primary" @click="logCardNo">登记卡号</el-button>
            </template>
            <el-alert v-else title="ERROR" type="error" show-icon :closable="false">
                <br>
                {{cardNo + ' '+errText}}
            </el-alert>
        </el-alert>
    </el-row>

    <el-row style="margin-top:20px;">
        <el-col :span="12">
            <el-collapse >
                <el-collapse-item >
                    <template slot="title">点此查询活动规则
                        <i class="header-icon el-icon-info"></i>
                    </template>
                    <el-form size="mini" :ref="vipSetData" label-width="200px" :model="vipSetData">
                        <el-form-item label="活动必须达到的消费金额">
                            <el-input readonly v-model="vipSetData.vipMoney"></el-input>
                        </el-form-item>
                        <el-form-item label="每卡每天最大参加次数">
                            <el-input readonly v-model="vipSetData.vipCount"></el-input>
                        </el-form-item>
                        <el-form-item label="活动赠送金额">
                            <el-input readonly v-model="vipSetData.giftMoney"></el-input>
                        </el-form-item>
                        <el-form-item label="活动每天最大赠送限额">
                            <el-input readonly v-model="vipSetData.maxMoney"></el-input>
                        </el-form-item>
                        <el-form-item label="日期控制类型">
                            <el-radio-group disabled v-model="vipSetData.type">
                                <el-radio label="0">当天控制</el-radio>
                                <el-radio label="1">日期段控制</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <template v-if="vipSetData.type!='0'">
                            <el-form-item label="活动时间">
                                <el-col :span="11">
                                    <el-date-picker readonly type="date" placeholder="开始日期" v-model="vipSetData.sdate" style="width: 100%;"></el-date-picker>
                                </el-col>
                                <el-col class="line" :span="2">-</el-col>
                                <el-col :span="11">
                                    <el-date-picker readonly type="date" placeholder="结束日期" v-model="vipSetData.edate" style="width: 100%;"></el-date-picker>
                                </el-col>
                            </el-form-item>
                        </template>
                    </el-form>
                </el-collapse-item>
            </el-collapse>
        </el-col>
    </el-row>
</div>
</template>

<script>
export default {
    name: "vipCard",
    data() {
        return {
            inputCardNo: "",
            cardInfo: "",
            vipCount: 0, //当日发放数量
            cardNo: "",
            cardCanUse: false,
            errText: "",
            vipSetData: {}
        };
    },
    mounted() {
        this.refresh();
    },
    methods: {
        async refresh() {
            this.inputCardNo = "";
            this.cardInfo = "";
            this.cardNo = "";
            this.cardCanUse = false;

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
        logCardNo() {
            this.$confirm("是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let loading = this.$loading({
                    lock: true,
                    text: "Loading",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)"
                });
                let url = `${this.$store.state.host}api/vip/logCardNo`;
                this.$http
                    .post(url, {
                        cardNo: this.cardNo,
                        userid: this.$store.state.user.userid
                    })
                    .then(
                        res => {
                            loading.close();
                            alert("提示，保存成功！");
                            this.refresh();
                        },
                        err => {
                            loading.close();
                            throw err;
                        }
                    );
            });
        },
        async queryCard() {
            let loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });

            let url = `${this.$store.state.host}api/vip/vipInfo/${this.inputCardNo}`;
            let res = await this.$http.get(url);
            this.cardInfo = res.body.data.result;
            try {
                this.cardNo = /02338\d{11}/.exec(this.cardInfo)[0];
            } catch (e) {
                loading.close();
                this.cardCanUse = false;
                this.errText = `${this.inputCardNo} 卡号不存在!`;
                return;
            }

            //隐藏顾客手机号码
            this.cardInfo = this.cardInfo.replace(/1\d{10}/g, "***********");

            let url2 = `${this.$store.state.host}api/vip/cardCanUse/${this.cardNo}`;
            res = await this.$http.get(url2);
            loading.close();
            let data = res.body.data;
            this.vipCount = data.vipCount;
            this.errText = data.errText;
            if (data.err == true) {
                this.cardCanUse = false;
            } else {
                this.cardCanUse = true;
            }
        }
    }
};
</script>

<style>
#cardInfo {
    font-family: verdana, arial, sans-serif;
    font-size: 11px;
    color: #333333;
    border-width: 1px;
    border-color: #666666;
    border-collapse: collapse;
    width: auto;
}

#cardInfo th {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #666666;
    background-color: #dedede;
}

#cardInfo td {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #666666;
    background-color: #ffffff;
}

#cardInfo tr td {
    white-space: nowrap;
}
</style>
