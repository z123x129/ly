import store from '../../store'

import Linhai_index from '@/components/pc/Linhai/Linhai_index.vue'
import Linhai_index2 from '@/components/pc/Linhai/Linhai_index2.vue'
import Linhai_index3 from '@/components/pc/Linhai/Linhai_index3.vue'
import Linhai_index5 from '@/components/pc/Linhai/Linhai_index5.vue'

//公共路由
import Linhai_login from '@/components/pc/Linhai/Linhai_login.vue'
import Linhai_message from '@/components/pc/Linhai/Linhai_message.vue'
import notfount from '@/components/error-page/404.vue'

//管理员路由
import Key_personnel from '@/components/pc/Linhai/Admin/Key_personnel.vue'
import Strange_people from '@/components/pc/Linhai/Admin/Strange_people.vue'
import Contrast from '@/components/pc/Linhai/Admin/Contrast.vue'
import Contrast_month from '@/components/pc/Linhai/Admin/Contrast_month.vue'
import School_show from '@/components/pc/Linhai/Admin/School_show.vue'
import showVideo from '@/components/pc/Linhai/Admin/showVideo.vue'
import reVideo from '@/components/pc/Linhai/Admin/reVideo.vue'
import Map_conmand from '@/components/pc/Linhai/Admin/Map_conmand.vue'
import School_message from '@/components/pc/Linhai/Admin/School_message.vue'

//学校路由
import Maintain_list from '@/components/pc/Linhai/School2/Maintain_list.vue'
import Message_edit from '@/components/pc/Linhai/School2/Message_edit.vue'
import Report_msg from '@/components/pc/Linhai/School2/Report_msg.vue'

//网格员路由
import Wgy_home from '@/components/pc/Linhai/School/Wgy_home.vue'
import School_list from '@/components/pc/Linhai/School/School_list.vue'
import Violation_list from '@/components/pc/Linhai/School/Violation_list.vue'
import Alert_monitor from '@/components/pc/Linhai/School/Alert_monitor.vue'
import Maintain_wgy from '@/components/pc/Linhai/School/Maintain_wgy.vue'

import Main from '@/components/main'

import Setting from '@/components/pc/Linhai/Setting.vue'//设置



//所有权限通用路由表sho
export const constantRouterMap = [
    {
        path:'/login',
        name:'login',
        meta: {
            //icon: 'logo-buffer',
            hideInMenu: true,
            title: '登录页'
        },
        component: Linhai_login
    },
];


//异步挂载的路由
//动态需要根据权限加载的路由表
export const asyncRouterMap = [

    //管理员路由
    {
        path: '/',
        name: '_home',
        component: Main,
        meta: {
            icon: 'ios-home',
            title: '首页',
            role: [1],//页面需要的权限
            notCache: true
        },
        children:[
            {
                path: '/home',
                name: 'home',
                meta: {
                    icon: 'ios-home',
                    title: '首页',
                    role: [1],
                    notCache: true
                },
                component: Linhai_index
            },
        ]
    },
    {
        path: '/Setting',
        name: 'Setting',
        component: Main,
        meta: {
            icon: 'logo-buffer',
            title: '设置',
            role: [1,2,3],
            hideInMenu: true,
        },
        children:[
            {
                path: '/Setting',
                name: 'Setting',
                meta: {
                    icon: 'logo-buffer',
                    title: '设置',
                    role: [1,2,3],
                    hideInMenu: true,
                },
                component: Setting
            },
        ]
    },

    {
        path: '/command',
        name: 'command',
        component: Main,
        meta: {
            icon: 'md-map',
            title: '指挥中心',
            role: [1],
        },
        children:[
            {
                path: 'Map_conmand',
                name: 'Map_conmand',
                meta: {
                    icon: 'md-map',
                    title: '指挥中心',
                    role: [1],
                },
                component: Map_conmand
            },
        ]
    },
    {
        path: '/monitor',
        name: 'monitor',
        component: Main,
        meta: {
            icon: 'ios-videocam',
            title: '查看监控',
            role: [1],
        },
        children:[
            {
                path: 'showVideo',
                name: 'showVideo',
                meta: {
                    icon: 'logo-youtube',
                    title: '视频监控',
                    role: [1],
                },
                component: showVideo
            },
            {
                path: 'reVideo',
                name: 'reVideo',
                meta: {
                    icon: 'logo-vimeo',
                    title: '录像检索',
                    role: [1],
                },
                component: reVideo
            },
        ]
    },
    {
        path: '/Intelligence',
        name: 'Intelligence',
        component: Main,
        meta: {
            icon: 'logo-buffer',
            title: '智能分析',
            role: [1],
        },
        children:[
            {
                path: 'Key_personnel',
                name: 'Key_personnel',
                meta: {
                    icon: 'ios-people',
                    title: '重点人员监控',
                    role: [1],
                },
                component: Key_personnel
            },
            {
                path: 'Strange_people',
                name: 'Strange_people',
                meta: {
                    icon: 'ios-contact',
                    title: '后厨违规监控',
                    role: [1],
                },
                component: Strange_people
            },
            {
                path: 'Contrast',
                name: 'Contrast',
                meta: {
                    icon: 'md-stats',
                    title: '月数据对比',
                    role: [1],
                },
                component: Contrast
            },
            {
                path: 'Contrast_month',
                name: 'Contrast_month',
                meta: {
                    icon: 'md-trending-up',
                    title: '年数据对比',
                    role: [1],
                },
                component: Contrast_month
            },
            {
                path: 'School_show',
                name: 'School_show',
                meta: {
                    icon: 'md-school',
                    title: '学校列表清单',
                    role: [1],
                },
                component: School_show
            },
            {
                path: 'School_message',
                name: 'School_message',
                meta: {
                    icon: 'md-filing',
                    title: '学校信息',
                    role: [1],
                },
                component: School_message
            },
        ]
    },
    //学校后台路由
    {
        path: '/', //网格员通用
        name: 'wgy',
        component: Main,
        meta: {
            icon: 'ios-home',
            title: '首页',
            role: [2,3]
        },
        children:[
            {
                path: '/home',
                name: 'home',
                meta: {
                    icon: 'ios-home',
                    title: '首页',
                    role: [2,3]
                },
                component: Wgy_home
            }
        ]
    },
    {
        path: '/maintain',
        name: 'maintain',
        component: Main,
        meta: {
            icon: 'ios-contact',
            title: '人员信息维护',
            role: [2]
        },
        children:[
            {
                path: '/Maintain_list',
                name: 'Maintain_list',
                meta: {
                    icon: 'ios-contact',
                    title: '人员信息维护',
                    role: [2]
                },
                component: Maintain_list
            },
        ]
    },
    {
        path: '/message',
        name: 'message',
        component: Main,
        meta: {
            icon: 'md-school',
            title: '学校信息维护',
            role: [2]
        },
        children:[
            {
                path: '/Message_edit',
                name: 'Message_edit',
                meta: {
                    icon: 'md-school',
                    title: '学校信息维护',
                    role: [2]
                },
                component: Message_edit
            },
        ]
    },
    {
        path: '/report',
        name: 'report',
        component: Main,
        meta: {
            icon: 'logo-buffer',
            title: '网格员上报信息',
            role: [2]
        },
        children:[
            {
                path: '/Report_msg',
                name: 'Report_msg',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
                    title: '网格员上报信息',
                    role: [2]
                },
                component: Report_msg
            },
        ]
    },
    //网格员路由
    {
        path: '/school',
        name: 'school',
        component: Main,
        meta: {
            icon: 'md-school',
            title: '学校列表',
            role: [3]
        },
        children:[
            {
                path: 'School_list',
                name: 'School_list',
                meta: {
                    icon: 'ios-clipboard-outline',
                    title: '学校列表',
                    role: [3]
                },
                component: School_list
            },
            {
                path: 'Violation_list',
                name: 'Violation_list',
                meta: {
                    icon: 'ios-flash-outline',
                    title: '违规列表',
                    hideInMenu: true,
                    role: [3],

                },
                component: Violation_list
            },
        ]
    },
    {
        path: '/school',
        name: 'school',
        component: Main,
        meta: {
            icon: 'md-school',
            title: '学校健康证维护',
            role: [3]
        },
        children:[
            {
                path: 'Maintain_wgy',
                name: 'Maintain_wgy',
                meta: {
                    icon: 'md-school',
                    title: '学校健康证维护',
                    role: [3]
                },
                component: Maintain_wgy
            }
        ]
    },
    {
        path: '/alert',
        name: 'alert',
        component: Main,
        meta: {
            icon: 'md-information-circle',
            title: '陌生人脸抓拍清单',
            role: [2,3]
        },
        children:[
            {
                path: '/Alert_monitor',
                name: 'Alert_monitor',
                meta: {
                    icon: 'md-information-circle',
                    title: '陌生人脸抓拍清单',
                    role: [2,3]
                },
                component: Alert_monitor
            },
        ]
    }, //学校后台通用

    //通用路由
    {
        path: '/message',
        name: 'message',
        component: Main,
        meta: {
            icon: 'logo-buffer',
            title: '消息中心',
            role: [1,2,3],
            hideInMenu: true,
        },
        children:[
            {
                path: '/Linhai_message',
                name: 'Linhai_message',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
                    title: '消息中心',
                    role: [1,2,3],
                    hideInMenu: true,
                },
                component: Linhai_message
            },
        ]
    },
    // 404页面
    {
        path: "*", // 此处需特别注意置于最底部
        name:"error_401",
        meta: {
            hideInMenu: true,
            role: [1,2,3],
        },
        component: notfount
    }
];
