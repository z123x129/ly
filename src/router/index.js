import Vue from 'vue'
import store from '@/store'
import VueRouter from 'vue-router'
import {getRouterByOrder} from '@/libs/common'
import { asyncRouterMap, constantRouterMap } from './modules/route'
Vue.use(VueRouter);

// async function getRouteList(){//获取路由表 https://gl.300c.cn
//     var routeList = "";
//     await axios.get('https://gl.300c.cn/plugin/module_config/api_template/getRouteList').then((res) => {
//         routeList = res.data.data;
//     })
//     return routeList;
// }
// let routes = asyncRouterMap.concat(constantRouterMap);
let routes = constantRouterMap;
if(store.state.route.jurisdiction)
{

    let dc = getRouterByOrder(asyncRouterMap, store.state.route.jurisdiction);

    routes = routes.concat(dc);
}
debugger;
let routerd =  new VueRouter({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes
});

routerd.beforeEach((to, from, next) => {
    let toPath = ['/login'];//无需登录判断的页面
    window.console.log(store.state.route.uid)
    if (store.state.route.uid) { // 判断是否有uid
        if (to.path === '/login') {
            next({ name:"index" });
        } else {
            // if (!store.state.route.jurisdiction || !store.state.route.dbc) { // 判断当前用户是否已拉取完user_info信息
            //     const roles = store.state.route.jurisdiction;
            //     store.dispatch('GenerateRoutes',  roles).then(() => { // 生成可访问的路由表
            //         let dc = store.getters.addRouters
            //         store.commit("getdbc", "3333")
            //         routerd.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            //         next({ name:"home" }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            //     })
            //     next({ name:"home" })
            // } else {
            next() //当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
            // }
        }
    } else if(to.name === "login") {
        next(); // 否则全部重定向到登录页
    }else
    {
        next({ name:"login" })
    }
});


store.commit("setRouteInfo", routes);
export async function router(){
    // var routeList = await getRouteList();
    // store.commit('getRouter', routeList);
    const router = new VueRouter({
        scrollBehavior: () => ({ y: 0 }),
        routes: routes
    });
    // router.beforeEach((to, from, next) => {
    //
    // })
    return router
}
export  default  routerd;
