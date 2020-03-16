<template>
    <div class="cont">
        <div class="header">
            <p>
                <img width="40px" height="40px" :src="logo" />
                卓远商城后台管理</p>
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
    import { Message } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    import router from '@/router'
    import {constantRouterMap} from '@/router/modules/route'
    export default {
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
        components:{
            orderList () {
                return this.$store.getters.orderList
            },
        },
        mounted(){
            // this.$https.fetchPost('/plugin/site_configuration/apiIndex/getInfo').then((res) => {
            //     this.logo = res.SEO.img_url;
            // })
        },
        methods:{
            handleSubmit() {
                //登录
                let params ={'user_login':this.formInline.user,'user_pass':this.formInline.password};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/school/api_index/user_login',params).then((res) => {
                    var res_data =this.$secret_key.func(this.$store.state.on_off, res ,"key");
                    this.$store.commit('getUid',res_data.id);
                    this.$store.commit('getJurisdiction',res_data.user_type);
                    Message.success('登录成功');
                    router.addRoutes(constantRouterMap)
                    window.console.log(router);
                    this.$router.push('/')
                })
            },
        }
    }
</script>
<style scoped lang="less">
    .cont{
        max-width: 1366px;
        min-width: 1100px;
        margin: 0 auto;
    }
    .header {
        height: 10vh;
    }
    .header p{
        color: #6d9494;
        font-size: 16px;
        line-height: 10vh;
        margin-left: 80px;
    }
    .container{
        width: 100%;
        height: 90vh;
        background: #fff url('https://rescdn.qqmail.com/zh_CN/htmledition/images/tg-chang1ea8a2.png') no-repeat;
        background-position: 200px center;
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
