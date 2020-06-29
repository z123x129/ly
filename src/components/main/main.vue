<style scoped>
    .layout{
        /*border: 1px solid #d7dde4;*/
        background: #f5f7f9;
        position: relative;
        /*border-radius: 4px;*/
        overflow: hidden;
    }
    .logo-con{
        height: 64px;
        padding: 10px;
    }
    .logo-con img{
        height: 44px;
        width: auto;
        display: block;
        margin: 0 auto;
    }
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
        display: flex;
        justify-content: space-between;
        padding: 0 50px 0 0px;
    }
    .main-content-con{
        height: calc(100vh - 160px);
        overflow: hidden;
        overflow-y: scroll;
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .menu-icon{
        transition: all .3s;
    }
    .rotate-icon{
        transform: rotate(-90deg);
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }
    .collapsed-menu span{
        width: 0px;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }
</style>
<template>
    <div class="layout" >
        <Layout class="main">
            <Sider  ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed" style="height: 100vh">
                <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" :menu-list="menuList" @on-select="turnToPage">
                    <div class="logo-con">
                        <img :src="minLogo"/>
                    </div>
                </side-menu>
            </Sider>
            <Layout>
                <Header class="layout-header-bar">
                    <div>
<!--                        <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '20px'}" type="md-menu" size="24"></Icon>-->
                        <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb>
                    </div>


                    <div class="user-logo">
                        <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
                        <user :message-unread-count="this.$store.state.route.msgNum" :user-avatar="img"/>

                    </div>
                </Header>
                <Content class="main-content-con">
                    <Layout class="main-layout-con">
                        <div class="tag-nav-wrapper">
                            <tags-nav :value="$route" @input="handleClick" :list="tagsNav" @on-close="closeClick"/>
                        </div>
                        <Content class="content-wrapper" >
                            <div id='i2' :style="(router_name == 'home'|| router_name =='Map_conmand' || router_name == 'showVideo'|| router_name == 'reVideo')?'padding:0 !important': 'padding: 15px 0 15px 15px; overflow-x: hidden;  overflow-y: auto;'">
                           <keep-alive :include="cacheList">
                                    <router-view></router-view>
                           </keep-alive>
                             </div>
<!--                            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>-->
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    import minLogo from '@/assets/logo.png'
    import headImg from '@/assets/11.jpeg'
    import user from './component/user'
    import SideMenu from './component/side-menu'
    import TagsNav from './component/tags-nav'
    import fullscreen from './component/fullscreen'
    import { mapMutations} from 'vuex'
    import {  routeEqual } from '@/libs/common'
    import {asyncRouterMap} from '@/router/modules/route'
    import customBreadCrumb from './component/custom-bread-crumb'
    import './main.less'
    import { Notification } from 'element-ui';
    import bus from '../../main'
    export default {
        inject:["app"],
        data () {
            return {
                isCollapsed: false,
                minLogo,
                collapsed:false,
                img:headImg,
                isFullscreen:false,
                ws:new WebSocket("ws://"+"10.22.116.249"+":7272"),
                router_name : this.$route.name,
                // ws:new WebSocket("ws://"+"192.168.0.2"+":7272")
                // ws:new WebSocket("ws://"+"js2.300c.cn"+":7272")
            }
        },
        created(){
            if(this.$store.state.user.img){
                this.img = this.$store.state.user.img;
            }
        },
        components:{
            user,
            SideMenu,
            TagsNav,
            fullscreen,
            customBreadCrumb
        },
        computed: {
            breadCrumbList () {
                return this.$store.state.app.breadCrumbList
            },
            rotateIcon () {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            menuitemClasses () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            },
            tagNavList () {
                return this.$store.state.app.tagNavList
            },
            menuList () {
                return this.$store.getters.menuList
            },
            tagsNav () {
                return this.$store.state.app.tagNavList
            },
            cacheList () {
                const list = ["home", ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
                // const x1 = (this.tagNavList.length);
                return list
            },
        },
        methods: {
            ...mapMutations([
                'addTag',
                'closeTag',
                'setTagNavList',
                'setBreadCrumb',
                'setHomeRoute'
            ]),
            collapsedSider () {
                this.collapsed = !this.collapsed;
                this.$refs.side1.toggleCollapse();
            },
            turnToPage:function(route){
                let { name, params, query } = {}
                if (typeof route === 'string') name = route
                else {
                    name = route.name
                    params = route.params
                    query = route.query
                }
                if (name.indexOf('isTurnByHref_') > -1) {
                    window.open(name.split('_')[1])
                    return
                }
                if(this.$route.name == name)
                    return;
                this.$router.push({
                    name,
                    params,
                    query
                })
            },
            handleClick (item) {
                if(routeEqual(item, this.$route))
                    return ;
                this.turnToPage(item.name)
            },
            closeClick:function(res, type, route){
                if (type !== 'others') {
                    if (type === 'all') {
                    this.turnToPage(this.$config.homeName)
                    } else {
                    if (routeEqual(this.$route, route)) {
                        this.closeTag(route)
                    }
                    }
                }
                this.setTagNavList(res)
            },
            open(msg,content,type) {
                var that = this;
                Notification({
                    title: msg,
                    message: content,
                    type: 'warning',
                    onClick:function () {
                        switch(type){
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
                    },
                });
            },
        },
        mounted() {
            this.setTagNavList();
            this.setHomeRoute(asyncRouterMap)
            this.setBreadCrumb(this.$route)
            const { name, params, query, meta } = this.$route;
            this.addTag({
                route: { name, params, query, meta }
            });
            var that = this;
            this.ws.onmessage = function(e){
                let data = eval("("+e.data+")");
                let type = data.type || '';
                switch(type){
                    case 'init':
                        var params_1 ={'uid':that.$store.state.user.uid,'client_id':data.client_id};
                        that.$https.fetchPost('/plugin/statistics/api_index/bindUser',params_1).then((res) => {
                            window.console.log('连接成功');
                        });
                        break;
                    case 'emphasis':
                        // that.open(data.describe,data.content.faceInfoName,type);
                        that.open(data.describe,'发现重点人员',type);
                        that.$store.commit("getMessage", data);
                        bus.$emit("outmes",data);
                        break;
                    case 'stranger':
                        // that.open(data.describe,data.content.gender+','+data.content.ageGroup,type);
                        that.open(data.describe,'发现后厨陌生人员',type);
                        that.$store.commit("getMessage", data);
                        bus.$emit("outmes",data);
                        break;
                    case "wgy_violation":
                        that.open(data.describe,data.content.name,type);
                        that.$store.commit("getMessage", data);
                        bus.$emit("school",data);
                        break;
                    case "school_upload":
                        that.open(data.describe,data.content.name,type);
                        that.$store.commit("getMessage", data);
                        break;
                    case "examine_stranger":
                        that.open(data.describe,data.content.user_login,type);
                        that.$store.commit("getMessage", data);
                        break;
                    case "newCoordinate":
                        that.$store.commit("getCoordinate", data);
                        break;
                }
            };
            setInterval(()=>{
                that.ws.send('')
            }, 40000)


        },
        watch:{
            "$route"(newRoute){
                if(this.app.oWebControl != "")
                {
                    if(newRoute.name != "showVideo")
                        this.app.oWebControl.JS_HideWnd();
                    else
                        this.app.oWebControl.JS_ShowWnd();

                }
                if(this.app.aWebControl != "")
                {
                    if(newRoute.name != "Map_conmand")
                        this.app.aWebControl.JS_HideWnd();
                }
                if(this.app.bWebControl != "")
                {
                    if(newRoute.name != "reVideo")
                        this.app.bWebControl.JS_HideWnd();
                    else
                        this.app.bWebControl.JS_ShowWnd();
                }

                let route = newRoute;
                this.router_name = newRoute.name;
                this.setBreadCrumb(newRoute)
                this.addTag({route});
            }
        }
    }
</script>
<style lang="less">
    .user-logo{
        display: flex;
    }
    #i1{
        background-color:#f0f0f0;
    }
    #i2{
        background-color: #f0f0f0;
        height: 100%;
        padding: 15px 0 15px 15px;

    }
    .main .main-layout-con{background: #f0f0f0;}

    .main .content-wrapper{
        padding: 0;
        margin: 0;
        // margin: 15px 0 15px 15px;
        // background: #fff;
        // min-Height: 260px
    }
</style>
