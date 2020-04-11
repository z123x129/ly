<template>
    <div class="body">
        <el-tabs style="padding: 0 10px" v-model="activeName">
            <el-tab-pane label="修改密码" name='passwd'>
                <div class="form passwd">
                    <div class="input">
                        <span>原密码：</span>
                        <el-input size="small" placeholder="请输入原密码" v-model="oldPasswd" show-password>
                        </el-input>
                    </div>
                    <div class="input">
                        <span>新密码：</span>
                        <el-input size="small" placeholder="请输入新密码" v-model="newPasswd" show-password>
                        </el-input>
                    </div>
                    <div class="input">
                        <span>确认新密码：</span>
                        <el-input size="small" placeholder="确认新密码" v-model="rePasswd" show-password>
                        </el-input>
                    </div>
                </div>
                <div class="button">
                    <el-button type="primary" @click="chagePasswd">保存</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="修改保存路径" name='path' v-if="$store.state.user.jurisdiction=='MQ=='">
                <div class="form">
                    <div class="input">
                        <span>实时视频保存位置：</span>
                        <el-input
                            size="small"
                            placeholder="保存路径"
                            v-model="text1">
                        </el-input>
                    </div>
                    <div class="input">
                        <span>实时截图保存位置：</span>
                        <el-input
                            size="small"
                            placeholder="保存路径"
                            v-model="text2">
                        </el-input>
                    </div>
                    <div class="input">
                        <span>录像截图保存位置：</span>
                        <el-input
                            size="small"
                            placeholder="保存路径"
                            v-model="text4">
                        </el-input>
                    </div>
                </div>
                <div class="button">
                    <el-button type="primary" @click="save">保存</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
    import { Input,Button,Message,Tabs,TabPane} from 'element-ui'//,DatePicker
    import 'element-ui/lib/theme-chalk/index.css'
    import Global from './js/Global'
    export default{
        components:{
            [Input.name]:Input,
            [Button.name]:Button,
            [Message.name]:Message,
            [Tabs.name]:Tabs,
            [TabPane.name]:TabPane,
        },
        data(){
            return{
                text1:Global.path1,
                text2:Global.path2,
                text3:Global.path3,
                text4:Global.path4,
                activeName:'passwd',
                oldPasswd:'',
                newPasswd:'',
                rePasswd:'',
                // data1:Global.path1,
            }
        },
        mounted(){
            this.getpath()
        },
        methods: {
            getpath(){
                this.$https.fetchPost('/plugin/statistics/api_index/getVideoUrl ').then((res) => {
                    var res_data = this.$secret_key.func(this.$store.state.on_off, res ,"key");
                    this.text1 = res.video_url
                    this.text2 = res.img_url
                    this.text3 = res.history_img_url
                    this.text4 = res.history_video_url
                    Global.path1 = this.text1
                    Global.path2 = this.text2
                    Global.path3 = this.text3
                    Global.path4 = this.text4
                })
            },
            save(){
                let params ={'uid':this.$store.state.user.uid,'video_url':this.text1,'img_url':this.text2,'history_img_url':this.text3,'history_video_url':this.text4};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/statistics/api_index/upVideoUrl ',params).then((res) => {
                    Global.path1 = this.text1
                    Global.path2 = this.text2
                    Global.path3 = this.text3
                    Global.path4 = this.text4
                    Message.success('修改成功');
                })
            },
            chagePasswd(){
                let params ={'uid':this.$store.state.user.uid,'password':this.oldPasswd,'new_pass':this.newPasswd,'again_pass':this.rePasswd};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/statistics/api_index/upPassword ',params).then((res) => {
                    Message.success('修改成功');
                    this.oldPasswd =''
                    this.newPasswd =''
                    this.rePasswd =''
                })
            }
        }
    }

</script>
<style lang='less' scoped>
    .body{
        padding: 15px;;
        h3.title{
            font-size: 18px;
            padding-bottom: 10px;
            font-weight: 700;
        }
        .form{
            padding-bottom: 20px;
            .input{
                span{
                    display: inline-block;
                    font-size: 14px;
                    line-height: 35px;
                }
                padding-bottom: 10px;
                &:last-of-type{
                    padding-bottom: 0;
                }
            }
            &.passwd{
                span{
                    width: 120px;
                }
                .el-input{
                    width: 20vw;
                }
            }
        }
    }
</style>
