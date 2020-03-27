import {getMenuByRouter, getRouterByOrder} from "../../libs/common";
import createPersistedState from "vuex-persistedstate";
import { asyncRouterMap, constantRouterMap } from '../../router/modules/route';
import store from '@/store'
import {Base64} from "js-base64";

function hasPermission(roles, route) {
    if (route.meta && route.meta.role) {
        return route.meta.role.indexOf() >= 0
    } else {
        return true
    }
}
export default {
    state:{
        routeInfo:[],
        messageList:[],
        jurisdiction:"",
        http:"http://js2.300c.cn/lhyd/"
    },
    mutations: {
        setRouteInfo: function (state, routeInfo) {
            state.routeInfo = routeInfo;
        },
        getMessage:function (state, data) {
            state.messageList.push(data);
        },
        setJurisdiction:function(state, data)
        {
            state.jurisdiction = Number(Base64.decode(data));
        }
    },
    getters:{
        menuList: (state) => getMenuByRouter(state.routeInfo, state.jurisdiction),
        routerList: (state) => getRouterByOrder(state.routeInfo, state.jurisdiction),
        addRouters: (state)=> state.routeInfo,
    },
    actions:{
    }

}
