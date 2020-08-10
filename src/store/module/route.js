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
        CoordinateList:'',
        msgNum: 0,
        jurisdiction:"",
        http:"http://js2.300c.cn/lhyd/public"
        // http:"http://10.22.116.249:10000"
    },
    mutations: {
        setRouteInfo: function (state, routeInfo) {
            state.routeInfo = routeInfo;
        },
        getMessage:function (state, data) {
            state.messageList.unshift(data);
            state.msgNum = state.messageList.length;
        },
        getCoordinate:function(state, data){
            state.CoordinateList = data.content;
        },
        msgStart:function (state) {
            state.msgNum = 0
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
