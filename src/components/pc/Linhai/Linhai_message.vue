<template>
    <div style="padding: 20px;background: #fff">
        <div class="block">
            <el-timeline>
                <el-timeline-item v-for="(item,index) in tableData" :key="index" :timestamp="item.content.faceTime?item.content.faceTime:item.content.timeStr" placement="top">
                    <el-card>
                        <img v-if="item.content.re_path" style="float: left;width: 50px;height: 50px;margin-right: 10px;border-radius: 8px" :src="item.content.re_path[0]" />
                        <img v-else-if="item.content.enclosure" style="float: left;width: 50px;height: 50px;margin-right: 10px;border-radius: 8px" :src="item.content.enclosure[0]" />
                        <img v-else-if="item.content.faceUrl" style="float: left;width: 50px;height: 50px;margin-right: 10px;border-radius: 8px" :src="item.content.faceUrl" />
                        <div style="float: left">
                            <h4 style="font-weight: 400;color: #1f2f3d;">{{item.describe}}</h4>
                            <p v-if="item.type=='emphasis'" style="font-size: 14px;color: #5e6d82;margin-top: 8px">{{item.content.faceInfoName}} {{item.content.faceGroupName}}</p>
                            <p v-if="item.type=='stranger'" style="font-size: 14px;color: #5e6d82;margin-top: 8px">{{item.content.ageGroup}} {{item.content.cn}}</p>
                            <p v-if="item.type=='school_violation'" style="font-size: 14px;color: #5e6d82;margin-top: 8px">{{item.content.user_login}} {{item.content.title}}</p>
                            <p v-if="item.type=='wgy_upload'" style="font-size: 14px;color: #5e6d82;margin-top: 8px">{{item.content.name}}</p>
                            <p v-if="item.type=='examine_stranger'" style="font-size: 14px;color: #5e6d82;margin-top: 8px">{{item.content.user_login}}</p>
                        </div>
                        <el-button style="float: right;padding: 0" @click="gotocont(item.type)" type="text">查看详情</el-button>
                        <div style="clear: both"></div>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>

<script>
    import {Timeline,TimelineItem,Card,Button} from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    export default {
        components:{
            [Timeline.name]:Timeline,
            [TimelineItem.name]:TimelineItem,
            [Card.name]:Card,
            [Button.name]:Button,
        },
        data() {
            return {
                tableData: [],
            }
        },
        mounted() {
            this.tableData = this.$store.state.route.messageList;
        },
        methods:{
            gotocont(type){
                var that = this;
                switch (type) {
                    case 'emphasis':
                        if(that.$store.state.user.jurisdiction=='MQ=='){
                            that.$router.push('/Intelligence/Key_personnel');
                        }else if(that.$store.state.user.jurisdiction=="Mg=="){
                            that.$router.push('/Alert_monitor');
                        }else if(that.$store.state.user.jurisdiction=="Mw=="){
                            that.$router.push('/Alert_monitor');
                        }
                        break;
                    case 'stranger':
                        if(that.$store.state.user.jurisdiction=='MQ=='){
                            that.$router.push('/Intelligence/Strange_people');
                        }else if(that.$store.state.user.jurisdiction=="Mg=="){
                            that.$router.push('/Alert_monitor');
                        }else if(that.$store.state.user.jurisdiction=="Mw=="){
                            that.$router.push('/Alert_monitor');
                        }
                        break;
                    case 'wgy_violation':
                        if(that.$store.state.user.jurisdiction=='MQ=='){
                            that.$router.push('/Intelligence/School_show');
                        }else if(that.$store.state.user.jurisdiction=="Mg=="){
                            that.$router.push('/Report_msg');
                        }
                        break;
                    case 'school_upload':
                        if(that.$store.state.user.jurisdiction=='MQ=='){
                            that.$router.push('/Intelligence/School_show');
                        }else if(that.$store.state.user.jurisdiction=="Mw=="){
                            that.$router.push('/school/School_list');
                        }
                        break;
                    case 'examine_stranger':
                        if(that.$store.state.user.jurisdiction=='MQ=='){
                            that.$router.push('/Intelligence/Strange_people');
                        }
                        break;
                }
            }
        }
    }
</script>
