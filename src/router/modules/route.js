import Linhai_doughnut from '@/components/pc/Linhai/Linhai_index6.vue'
import Linhai_index5 from '@/components/pc/Linhai/Linhai_index5.vue'
import Hik_video from '@/components/pc/Linhai/Hik_video.vue'
import Main from '@/components/main'

export default [
    {
        path:'/login',
        name:'login',
        meta: {
            //icon: 'logo-buffer',
            hideInMenu: true,
            title: '登录页'
        },
    },
    {
        path: '/',
        name: 'home',
        component: Main,
        meta: {
            icon: 'logo-buffer',
            title: '首页'
        },
        children:[

            {
                path: '/count_to_page',
                name: 'count_to_page1',
                meta: {
                    icon: 'md-trending-up',
                    title: '数字渐变1'
                },
                component: Linhai_doughnut
            },
            {
                path: '/home',
                name: 'home1',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
                    title: '首页'
                },
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: Hik_video
            },
            {
                path: '/Linhai_index5',
                name: 'Linhai_index5',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
                    title: '首页1'
                },
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: Linhai_index5
            },
        ]
    },

];
