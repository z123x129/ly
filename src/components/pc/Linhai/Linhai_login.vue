<template>
    <div class="bg_login">
        <div class="header">
            <p><img width="40px" height="40px" :src="logo" />卓远商城后台管理</p>
        </div>
        <div class="container">
            <Row style="width: 360px;margin-right: 150px">
                <Col style="width: 100%" span="11">
                    <Card style="border: 1px solid #cfe4ea;">
                        <p style="color: #666" slot="title">用户登录</p>
                        <Form ref="formInline" :model="formInline" inline>
                            <FormItem prop="user">
                                <Input type="text" v-model="formInline.user" placeholder="用户名">
                                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem prop="password">
                                <Input type="password" v-model="formInline.password" placeholder="密码">
                                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
                            </FormItem>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    </div>
</template>
<script>
    import {Row,Col,Card,Form,FormItem,Icon,Button,Input} from 'iview'
    import 'iview/dist/styles/iview.css'
    import { Message } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    export default {
        components:{
            Row,Col,Card,Form,FormItem,Icon,Button,Input,Message
        },
        data(){
            return{
                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        { required: true, message: '请填写用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码.', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                    ]
                },
                logo:''
            }
        },
        mounted(){
            this.$https.fetchPost('/plugin/site_configuration/apiIndex/getInfo').then((res) => {
                this.logo = res.SEO.img_url;
            })
        },
        methods:{
            handleSubmit() {
                if(this.$store.state.on_off==true){
                    this.Access_token();
                }else{
                    this.jinru();
                }
            },
            Access_token(){
                //获取access_token凭证
                this.$https.fetchGet('/api/api_common/accessToken?appid='+this.$store.state.appid+'&appsecret='+this.$store.state.appsecret).then((res) => {
                    this.access_token = res.access_token;
                    //临时token票据
                    this.$https.fetchGet('/api/api_common/getToken?jti='+this.access_token).then((res) => {
                        this.$store.commit('getJsapi',res.jsapi_ticket);
                        this.jinru();
                    })
                })
            },
            jinru(){
                //登录
                let params ={'account':this.formInline.user,'password':this.formInline.password};
                params = this.$secret_key.func(this.$store.state.on_off, params,"important");
                this.$https.fetchPost('/plugin/member/api_index/accountLogin',params).then((res) => {
                    var res_data =this.$secret_key.func(this.$store.state.on_off, res ,"plain");
                    // localStorage.setItem("uid",res_data.uid);
                    // localStorage.setItem("expires_in",res_data.expires_in);
                    this.$store.commit('getUid',res_data.uid);
                    this.$store.commit('getExpires',res_data.expires_in);
                    Message.success('登录成功');
                    this.$router.push('/Member_pcstore')
                })
            },
        }
    }
</script>
<style scoped lang="less">
    .bg_login{
        width: 100%;
        height: 100%;
        background: #fff url('https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=676055513,116497977&fm=11&gp=0.jpg') no-repeat;
        background-position: 200px center;
    }
    .header {
        height: 10vh;
        border-bottom: 1px solid #cfe4ea;
        background: #e7f8fa;
    }
    .header p{
        color: #6d9494;
        font-size: 16px;
        line-height: 10vh;
        margin-left: 80px;
    }
    .container{
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .ivu-card /deep/ .ivu-card-body{
        padding: 30px;
        padding-bottom: 0;
    }
    .ivu-form-inline .ivu-form-item{
        width: 100%;
    }
    button{
        display: block;
        margin: 0 auto;
    }
    .ivu-card /deep/ .ivu-card-head{
        background-color: #f9fbfe;
    }
</style>
