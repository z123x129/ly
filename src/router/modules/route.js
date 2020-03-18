import store from '../../store'

import Linhai_index from '@/components/pc/Linhai/Linhai_index.vue'
import Linhai_index2 from '@/components/pc/Linhai/Linhai_index2.vue'
import Linhai_index3 from '@/components/pc/Linhai/Linhai_index3.vue'
import Linhai_index4 from '@/components/pc/Linhai/Linhai_index4.vue'
import Linhai_index5 from '@/components/pc/Linhai/Linhai_index5.vue'

import Linhai_index8 from '@/components/pc/Linhai/Linhai_index8.vue'
import Linhai_index9 from '@/components/pc/Linhai/Linhai_index9.vue'

//公共路由
import Linhai_login from '@/components/pc/Linhai/Linhai_login.vue'
import notfount from '@/components/error-page/404.vue'

//管理员路由
import Key_personnel from '@/components/pc/Linhai/Admin/Key_personnel.vue'
import Strange_people from '@/components/pc/Linhai/Admin/Strange_people.vue'

//学校路由
import Maintain_list from '@/components/pc/Linhai/School2/Maintain_list.vue'
import Message_edit from '@/components/pc/Linhai/School2/Message_edit.vue'
import Report_msg from '@/components/pc/Linhai/School2/Report_msg.vue'

//网格员路由
import Wgy_home from '@/components/pc/Linhai/School/Wgy_home.vue'
import School_list from '@/components/pc/Linhai/School/School_list.vue'
import Violation_list from '@/components/pc/Linhai/School/Violation_list.vue'
import Alert_monitor from '@/components/pc/Linhai/School/Alert_monitor.vue'

import showVideo from '@/components/pc/Linhai/showVideo.vue'
import Main from '@/components/main'



//所有权限通用路由表
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
            icon: 'logo-buffer',
            title: '首页',
            role: [1],//页面需要的权限
        },
        children:[
            {
                path: '/home',
                name: 'home',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
                    title: '首页',
                    role: [1],
                },
                component: Linhai_index
            },
        ]
    },
    {
        path: '/command',
        name: 'command',
        component: Main,
        meta: {
            icon: 'logo-buffer',
            title: '指挥中心',
            role: [1],
        },
        children:[
            {
                path: 'Linhai_index4',
                name: 'Linhai_index4',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
                    title: '指挥中心',
                    role: [1],
                },
                component: Linhai_index4
            },
        ]
    },
    {
        path: '/monitor',
        name: 'monitor',
        component: Main,
        meta: {
            icon: 'logo-buffer',
            title: '查看监控',
            role: [1],
        },
        children:[
            {
                path: 'Linhai_index3',
                name: 'Linhai_index3',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
                    title: '单兵监控',
                    role: [1],
                },
                component: Linhai_index3
            },
            {
                path: 'Linhai_index5',
                name: 'Linhai_index5',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
                    title: '车载监控',
                    role: [1],
                },
                component: Linhai_index5
            },
            {
                path: 'Linhai_index8',
                name: 'Linhai_index8',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
                    title: '录像检索',
                    role: [1],
                },
                component: Linhai_index8
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
                    icon: 'md-arrow-dropdown-circle',
                    title: '重点人员监控',
                    role: [1],
                },
                component: Key_personnel
            },
            {
                path: 'Strange_people',
                name: 'Strange_people',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
                    title: '陌生人员监控',
                    role: [1],
                },
                component: Strange_people
            },
            {
                path: 'Linhai_index9',
                name: 'Linhai_index9',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
                    title: '数据对比',
                    role: [1],
                },
                component: Linhai_index9
            },
            {
                path: 'Linhai_index10',
                name: 'Linhai_index10',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
                    title: '学校列表展示',
                    role: [1],
                },
                component: Linhai_index9
            },
        ]
    },
    //学校后台路由
    {
        path: '/',
        name: 'wgy',
        component: Main,
        meta: {
            icon: 'logo-buffer',
            title: '首页',
            role: [2,3]
        },
        children:[
            {
                path: '/',
                name: 'Wgy_home',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
                    title: '首页',
                    role: [2,3]
                },
                component: Wgy_home
            }
        ]
    }, //网格员通用
    {
        path: '/maintain',
        name: 'maintain',
        component: Main,
        meta: {
            icon: 'logo-buffer',
            title: '人员信息维护',
            role: [2]
        },
        children:[
            {
                path: '/Maintain_list',
                name: 'Maintain_list',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
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
            icon: 'logo-buffer',
            title: '学校信息维护',
            role: [2]
        },
        children:[
            {
                path: '/Message_edit',
                name: 'Message_edit',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
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
            icon: 'logo-buffer',
            title: '学校列表',
            role: [3]
        },
        children:[
            {
                path: 'School_list',
                name: 'School_list',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
                    title: '学校列表',
                    role: [3]
                },
                component: School_list
            },
            {
                path: 'Violation_list',
                name: 'Violation_list',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
                    title: '违规列表',
                    hideInMenu: true,
                    role: [3]
                },
                component: Violation_list
            },
        ]
    },
    {
        path: '/alert',
        name: 'alert',
        component: Main,
        meta: {
            icon: 'logo-buffer',
            title: '警报监测',
            role: [2,3]
        },
        children:[
            {
                path: '/Alert_monitor',
                name: 'Alert_monitor',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
                    title: '警报监测',
                    role: [2,3]
                },
                component: Alert_monitor
            },
        ]
    }, //学校后台通用
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
