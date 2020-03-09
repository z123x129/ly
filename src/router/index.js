import Vue from 'vue'
import store from '@/store'
import VueRouter from 'vue-router'
// import store from '../store'
// import axios from 'axios'
//import RouterConfig from './modules' // 引入业务逻辑模块
import routes from './modules/route'
Vue.use(VueRouter);

// async function getRouteList(){//获取路由表 https://gl.300c.cn
//     var routeList = "";
//     await axios.get('https://gl.300c.cn/plugin/module_config/api_template/getRouteList').then((res) => {
//         routeList = res.data.data;
//     })
//     return routeList;
// }
let routerd =  new VueRouter({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes
});
// window.console.log(routerd)
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
