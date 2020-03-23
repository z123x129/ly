<template>
    <div class="cont">
        <div class="loginBox">
            <div class="title">
                <h3>用户登录</h3>
            </div>
            <div class="login-form">
                <div class="input">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                    <input type="text" v-model="formInline.user" placeholder="请输入用户名" @keyup.enter="handleSubmit('formInline')">
                </div>
                <div class="input">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    <input type="password" v-model="formInline.password" placeholder="请输入密码" @keyup.enter="handleSubmit('formInline')">
                </div>
            </div>
            <button type="primary" @click="handleSubmit('formInline')">登录</button>
        </div>
    </div>
</template>
<script>
    import { Message } from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    import router from '@/router'
    import VueRouter from 'vue-router'
    import {getRouterByOrder} from '@/libs/common'
    import {constantRouterMap , asyncRouterMap} from '@/router/modules/route'
    import { Base64 } from 'js-base64';
    export default {
        name:'Linhai_login',
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
                if(!this.formInline.user){
                    Message.error('用户名不能为空');
                    return
                }else if(!this.formInline.password){
                    Message.error('密码不能为空');
                    return
                }
                const createRouter = () => new VueRouter({
                    routes: constantRouterMap
                });
                const routers = createRouter();
                // 添加其他项目路由前，重置 matcher
                router.matcher = routers.matcher;

                //登录
                let params ={'user_login':this.formInline.user,'user_pass':this.formInline.password};
                params = this.$secret_key.func(this.$store.state.on_off, params);
                this.$https.fetchPost('/plugin/school/api_index/user_login',params).then((res) => {
                    var res_data =this.$secret_key.func(this.$store.state.on_off, res ,"key");
                    this.$store.commit('getUid',res_data.id);
                    this.$store.commit('getJurisdiction',res_data.user_type);
                    this.$store.commit("setJurisdiction",res_data.user_type);
                    Message.success('登录成功');
                    router.addRoutes(getRouterByOrder(asyncRouterMap, Number(Base64.decode(res_data.user_type))))
                    this.$store.commit("setRouteInfo", asyncRouterMap);
                    this.$router.push('/')
                })
            },
        }
    }
</script>
<style scoped lang="less">
    .cont{
        // max-width: 1366px;
        // min-width: 1100px;
        // margin: 0 auto;
        height: 100vh;
        width: 100vw;
        background-color: #fefefe;
        display: flex;
        align-items: center;
        justify-content: center;
        // background-image: url('https://images.pexels.com/photos/3183171/pexels-photo-3183171.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260');
        background-image: url('https://images.pexels.com/photos/830891/pexels-photo-830891.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260');
        // background-image: url('https://images.pexels.com/photos/943096/pexels-photo-943096.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260');
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    .loginBox{
        background-color: #fff;
        padding: 40px;
        border-radius: 5px;
        width: 23vw;
        min-width: 300px;
        // box-shadow: 0 1px 6px rgba(0,0,0,0.1);
        box-shadow: 0 12px 18px 2px rgba(34,0,51,.04),0 6px 22px 4px rgba(7,48,114,.12),0 6px 10px -4px rgba(14,13,26,.12);
        .title{
            text-align: center;
            padding-bottom: 30px;
            h3{
                font-size: 22px;
                font-weight: 400;
                color: #20123b;
                line-height: 26px;
            }
        }
        .login-form{
            padding-bottom: 40px;
            .input{
                display: flex;
                align-items: center;
                border: 1px solid #eee;
                border-radius: 3px;
                margin-bottom: 20px;
                &:last-of-type{
                    margin-bottom: 0;
                }
                input{
                    flex: 1;
                    line-height: 36px;
                    padding-left: 5px;
                    font-size: 13px;
                }
                .ivu-icon{
                    font-size:20px;
                }
            }
        }
        >button{
            background-color: #40a9ff;
            color: #fff;
            width:100%;
            font-size: 15px;
            font-weight: 700;
            line-height: 40px;
            border-radius: 5px;;
        }

    }
    // .header {
    //     height: 10vh;
    // }
    // .header p{
    //     color: #6d9494;
    //     font-size: 16px;
    //     line-height: 10vh;
    //     margin-left: 80px;
    // }
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
