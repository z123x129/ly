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
                        <img  :src="minLogo"  />
                    </div>
                </side-menu>
            </Sider>
            <Layout>
                <Header class="layout-header-bar">
                    <div>
                        <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '20px'}" type="md-menu" size="24"></Icon>
                    </div>


                    <div class="user-logo">
                        <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
                        <user  :message-unread-count="0" :user-avatar="img"/>

                    </div>
                </Header>
                <Content class="main-content-con">
                    <Layout class="main-layout-con">
                        <div class="tag-nav-wrapper">
                            <tags-nav :value="$route" @input="handleClick" :list="tagsNav" @on-close="closeClick"/>
                        </div>
                        <Content class="content-wrapper" >
                           <keep-alive :include="cacheList">

                               <div style="background-color:#fff" id='i2'>
                                    <router-view></router-view>
                               </div>
                                
                           </keep-alive>
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
    import route from '@/router/modules/route';
    import user from './component/user'
    import SideMenu from './component/side-menu'
    import TagsNav from './component/tags-nav'
    import fullscreen from './component/fullscreen'
    import { mapMutations} from 'vuex'
    import {  routeEqual } from '@/libs/common'
    import './main.less'
    //import 'swiper/dist/css/swiper.css'
    export default {
        data () {
            return {
                isCollapsed: false,
                minLogo,
                route,
                collapsed:false,
                img:headImg,
                dataf:[
                    {
                        "icon":"ios-book",
                        "name":"doc",
                        "meta":{
                            "title":"文档",
                            "href":"https://lison16.github.io/iview-admin-doc/#/",
                            "icon":"ios-book"
                        },
                        "href":"https://lison16.github.io/iview-admin-doc/#/"
                    },
                    {
                        "icon":"",
                        "name":"join",
                        "meta":{
                            "hideInBread":true
                        },
                        "children":[
                            {
                                "icon":"_qq",
                                "name":"join_page",
                                "meta":{
                                    "icon":"_qq",
                                    "title":"QQ群"
                                }
                            }
                        ]
                    },
                    {
                        "icon":"logo-buffer",
                        "name":"components",
                        "meta":{
                            "icon":"logo-buffer",
                            "title":"组件"
                        },
                        "children":[
                            {
                                "icon":"md-arrow-dropdown-circle",
                                "name":"tree_select_page",
                                "meta":{
                                    "icon":"md-arrow-dropdown-circle",
                                    "title":"树状下拉选择器"
                                }
                            },
                            {
                                "icon":"md-trending-up",
                                "name":"count_to_page",
                                "meta":{
                                    "icon":"md-trending-up",
                                    "title":"数字渐变"
                                }
                            },
                            {
                                "icon":"ios-infinite",
                                "name":"drag_list_page",
                                "meta":{
                                    "icon":"ios-infinite",
                                    "title":"拖拽列表"
                                }
                            },
                            {
                                "icon":"md-list",
                                "name":"drag_drawer_page",
                                "meta":{
                                    "icon":"md-list",
                                    "title":"可拖拽抽屉"
                                }
                            },
                            {
                                "icon":"ios-people",
                                "name":"org_tree_page",
                                "meta":{
                                    "icon":"ios-people",
                                    "title":"组织结构树"
                                }
                            },
                            {
                                "icon":"md-git-branch",
                                "name":"tree_table_page",
                                "meta":{
                                    "icon":"md-git-branch",
                                    "title":"树状表格"
                                }
                            },
                            {
                                "icon":"md-crop",
                                "name":"cropper_page",
                                "meta":{
                                    "icon":"md-crop",
                                    "title":"图片裁剪"
                                }
                            },
                            {
                                "icon":"md-grid",
                                "name":"tables_page",
                                "meta":{
                                    "icon":"md-grid",
                                    "title":"多功能表格"
                                }
                            },
                            {
                                "icon":"md-pause",
                                "name":"split_pane_page",
                                "meta":{
                                    "icon":"md-pause",
                                    "title":"分割窗口"
                                }
                            },
                            {
                                "icon":"logo-markdown",
                                "name":"markdown_page",
                                "meta":{
                                    "icon":"logo-markdown",
                                    "title":"Markdown编辑器"
                                }
                            },
                            {
                                "icon":"ios-create",
                                "name":"editor_page",
                                "meta":{
                                    "icon":"ios-create",
                                    "title":"富文本编辑器"
                                }
                            },
                            {
                                "icon":"_bear",
                                "name":"icons_page",
                                "meta":{
                                    "icon":"_bear",
                                    "title":"自定义图标"
                                }
                            }
                        ]
                    },
                    {
                        "icon":"md-cloud-upload",
                        "name":"update",
                        "meta":{
                            "icon":"md-cloud-upload",
                            "title":"数据上传"
                        },
                        "children":[
                            {
                                "icon":"ios-document",
                                "name":"update_table_page",
                                "meta":{
                                    "icon":"ios-document",
                                    "title":"上传Csv"
                                }
                            },
                            {
                                "icon":"md-clipboard",
                                "name":"update_paste_page",
                                "meta":{
                                    "icon":"md-clipboard",
                                    "title":"粘贴表格数据"
                                }
                            }
                        ]
                    },
                    {
                        "icon":"ios-stats",
                        "name":"excel",
                        "meta":{
                            "icon":"ios-stats",
                            "title":"EXCEL导入导出"
                        },
                        "children":[
                            {
                                "icon":"md-add",
                                "name":"upload-excel",
                                "meta":{
                                    "icon":"md-add",
                                    "title":"导入EXCEL"
                                }
                            },
                            {
                                "icon":"md-download",
                                "name":"export-excel",
                                "meta":{
                                    "icon":"md-download",
                                    "title":"导出EXCEL"
                                }
                            }
                        ]
                    },
                    {
                        "icon":"",
                        "name":"tools_methods",
                        "meta":{
                            "hideInBread":true
                        },
                        "children":[
                            {
                                "icon":"ios-hammer",
                                "name":"tools_methods_page",
                                "meta":{
                                    "icon":"ios-hammer",
                                    "title":"工具方法",
                                    "beforeCloseName":"before_close_normal"
                                }
                            }
                        ]
                    },
                    {
                        "icon":"",
                        "name":"i18n",
                        "meta":{
                            "hideInBread":true
                        },
                        "children":[
                            {
                                "icon":"md-planet",
                                "name":"i18n_page",
                                "meta":{
                                    "icon":"md-planet",
                                    "title":"i18n - {{ i18n_page }}"
                                }
                            }
                        ]
                    },
                    {
                        "icon":"",
                        "name":"error_store",
                        "meta":{
                            "hideInBread":true
                        },
                        "children":[
                            {
                                "icon":"ios-bug",
                                "name":"error_store_page",
                                "meta":{
                                    "icon":"ios-bug",
                                    "title":"错误收集"
                                }
                            }
                        ]
                    },
                    {
                        "icon":"",
                        "name":"directive",
                        "meta":{
                            "hideInBread":true
                        },
                        "children":[
                            {
                                "icon":"ios-navigate",
                                "name":"directive_page",
                                "meta":{
                                    "icon":"ios-navigate",
                                    "title":"指令"
                                }
                            }
                        ]
                    },
                    {
                        "icon":"md-menu",
                        "name":"multilevel",
                        "meta":{
                            "icon":"md-menu",
                            "title":"多级菜单"
                        },
                        "children":[
                            {
                                "icon":"md-funnel",
                                "name":"level_2_1",
                                "meta":{
                                    "icon":"md-funnel",
                                    "title":"二级-1"
                                }
                            },
                            {
                                "icon":"md-funnel",
                                "name":"level_2_2",
                                "meta":{
                                    "access":[
                                        "super_admin"
                                    ],
                                    "icon":"md-funnel",
                                    "showAlways":true,
                                    "title":"二级-2"
                                },

                            },
                            {
                                "icon":"md-funnel",
                                "name":"level_2_3",
                                "meta":{
                                    "icon":"md-funnel",
                                    "title":"二级-3"
                                }
                            }
                        ]
                    }
                ],
                dds:[
                    {
                        "name": "home",
                        "params": {

                        },
                        "query": {

                        },
                        "meta": {
                            "hideInMenu": true,
                            "title": "首页",
                            "notCache": true,
                            "icon": "md-home"
                        }
                    },
                    {
                        "name": "update_table_page",
                        "query": {

                        },
                        "params": {

                        },
                        "meta": {
                            "icon": "ios-document",
                            "title": "上传Csv"
                        }
                    },
                    {
                        "name": "export-excel",
                        "query": {

                        },
                        "params": {

                        },
                        "meta": {
                            "icon": "md-download",
                            "title": "导出EXCEL"
                        }
                    },
                    {
                        "name": "i18n_page",
                        "query": {

                        },
                        "params": {

                        },
                        "meta": {
                            "icon": "md-planet",
                            "title": "i18n - {{ i18n_page }}"
                        }
                    },
                    {
                        "name": "tree_select_page",
                        "query": {

                        },
                        "params": {

                        },
                        "meta": {
                            "icon": "md-arrow-dropdown-circle",
                            "title": "树状下拉选择器"
                        }
                    },
                    {
                        "name": "drag_list_page",
                        "query": {

                        },
                        "params": {

                        },
                        "meta": {
                            "icon": "ios-infinite",
                            "title": "拖拽列表"
                        }
                    },
                    {
                        "name": "drag_drawer_page",
                        "query": {

                        },
                        "params": {

                        },
                        "meta": {
                            "icon": "md-list",
                            "title": "可拖拽抽屉"
                        }
                    },
                    {
                        "name": "org_tree_page",
                        "query": {

                        },
                        "params": {

                        },
                        "meta": {
                            "icon": "ios-people",
                            "title": "组织结构树"
                        }
                    },
                    {
                        "name": "tree_table_page",
                        "query": {

                        },
                        "params": {

                        },
                        "meta": {
                            "icon": "md-git-branch",
                            "title": "树状表格"
                        }
                    },
                    {
                        "name": "cropper_page",
                        "query": {

                        },
                        "params": {

                        },
                        "meta": {
                            "icon": "md-crop",
                            "title": "图片裁剪"
                        }
                    },
                    {
                        "name": "tables_page",
                        "query": {

                        },
                        "params": {

                        },
                        "meta": {
                            "icon": "md-grid",
                            "title": "多功能表格"
                        }
                    },
                    {
                        "name": "split_pane_page",
                        "query": {

                        },
                        "params": {

                        },
                        "meta": {
                            "icon": "md-pause",
                            "title": "分割窗口"
                        }
                    },
                    {
                        "name": "markdown_page",
                        "query": {

                        },
                        "params": {

                        },
                        "meta": {
                            "icon": "logo-markdown",
                            "title": "Markdown编辑器"
                        }
                    },
                    {
                        "name": "editor_page",
                        "query": {

                        },
                        "params": {

                        },
                        "meta": {
                            "icon": "ios-create",
                            "title": "富文本编辑器"
                        }
                    }, {
                        "name": "count_to_page",
                        "query": {

                        },
                        "params": {

                        },
                        "meta": {
                            "icon": "md-trending-up",
                            "title": "数字渐变"
                        }
                    }
                ]
            }
        },
        components:{
            user,
            SideMenu,
            TagsNav,
            fullscreen
        },
        computed: {
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
                const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
                // const x1 = (this.tagNavList.length);
                window.console.log(list, 111);
                return list
            },
        },
        methods: {
            ...mapMutations([
                'addTag',
                'closeTag',
                'setTagNavList'
            ]),
            collapsedSider () {
                this.collapsed = !this.collapsed;
                this.$refs.side1.toggleCollapse();
            },
            turnToPage:function(route){
                // window.console.log(route);
                let { name, params, query } = {}
                if (typeof route === 'string') name = route
                else {
                    name = route.name
                    params = route.params
                    query = route.query
                }
                if (name.indexOf('isTurnByHref_') > -1) {
                    // window.console.log(name)
                    window.open(name.split('_')[1])
                    return
                }

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
                // window.console.log(res, type, route);
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
            }
        },
        mounted() {
            this.setTagNavList();
            const { name, params, query, meta } = this.$route;
            this.addTag({
                route: { name, params, query, meta }
            });
            // window.console.log(this.menuList, 233);

        },
        watch:{
            "$route"(newRoute){

                // window.console.log(newRoute);
                // window.console.log(2);
                let route = newRoute;
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
    .main .main-layout-con{background: #f0f0f0;}
    .main .content-wrapper{
        padding: 0;
        margin: 15px 0 15px 15px;
        background: '#fff';
        min-Height: '260px'
    }
</style>
