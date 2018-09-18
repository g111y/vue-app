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
                    {{cardNo + '  '+errText}}
                </el-alert>
                <el-button type="primary" @click="logCardNo">登记卡号</el-button>
            </template>
            <el-alert v-else title="ERROR" type="error" show-icon :closable="false">
                <br>
                {{cardNo + '  '+errText}}
            </el-alert>
        </el-alert>
    </el-row>
    <el-row>

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
            errText: ""
        };
    },
    methods: {
        refresh() {
            this.inputCardNo = "";
            this.cardInfo = "";
            this.cardNo = "";
            this.cardCanUse = false;
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
                            alert("提示，保存成功！")
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
            try{
              this.cardNo = /02338\d{11}/.exec(this.cardInfo)[0];
            }catch(e){
              loading.close();
              this.cardCanUse=false;
              this.errText=`${this.inputCardNo} 卡号不存在!`;
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
