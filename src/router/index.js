import Vue from 'vue'
import store from '@/store'

import VueRouter from 'vue-router'
Vue.use(VueRouter);

import {getRouterByOrder} from '@/libs/common'
import { asyncRouterMap, constantRouterMap } from './modules/route'


import { Message } from 'element-ui';

// async function getRouteList(){//获取路由表 https://gl.300c.cn
//     var routeList = "";
//     await axios.get('https://gl.300c.cn/plugin/module_config/api_template/getRouteList').then((res) => {
//         routeList = res.data.data;
//     })
//     return routeList;
// }
// let routes = asyncRouterMap.concat(constantRouterMap);
let routes = constantRouterMap;
if(store.state.user.jurisdiction)
{

    let dc = getRouterByOrder(asyncRouterMap, store.state.user.jurisdiction);

    routes = routes.concat(dc);
}
let routerd =  new VueRouter({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes
});

//页面跳转的登录判断
routerd.beforeEach((to,from,next)=>{
  let toPath = ['/login'];//无需登录判断的页面
  if(toPath.indexOf(to.path)>=0){
    if(to.path == '/login'&&store.state.user.uid!=''){
      next('/');
    }
    next();
  }else if(store.state.user.uid==''){
    Message.error('您还没有登录，请先登录')
      next('/login');
  }else{
    next();
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
