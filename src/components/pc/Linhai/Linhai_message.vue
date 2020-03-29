<template>
    <div style="padding: 20px;background: #fff">
        <div class="block">
            <el-timeline>
                <el-timeline-item v-for="(item,index) in tableData" :key="index" :timestamp="item.content.faceTime?item.content.faceTime:item.content.timeStr" placement="top">
                    <el-card>
                        <img style="float: left;width: 50px;height: 50px;margin-right: 10px;border-radius: 8px" :src="item.content.enclosure?item.content.enclosure[0]:item.content.faceUrl" />
                        <div style="float: left">
                            <h4 style="font-weight: 400;color: #1f2f3d;">{{item.describe}}</h4>
                            <p v-if="item.type=='emphasis'" style="font-size: 14px;color: #5e6d82;margin-top: 8px">{{item.content.faceInfoName}} {{item.content.faceGroupName}}</p>
                            <p v-if="item.type=='stranger'" style="font-size: 14px;color: #5e6d82;margin-top: 8px">{{item.content.ageGroup}} {{item.content.cn}}</p>
                            <p v-if="item.type=='school_violation'" style="font-size: 14px;color: #5e6d82;margin-top: 8px">{{item.content.user_login}} {{item.content.title}}</p>
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
                switch (type) {
                    case 'emphasis':
                        this.$router.push('/Intelligence/Key_personnel');
                        break;
                    case 'stranger':
                        this.$router.push('/Intelligence/Strange_people')
                        break;
                    case 'school_violation':
                        this.$router.push('/Intelligence/School_show');
                        break;
                }
            }
        }
    }
</script>
