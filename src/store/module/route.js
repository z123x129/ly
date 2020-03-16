import {getMenuByRouter, getRouterByOrder} from "../../libs/common";
import createPersistedState from "vuex-persistedstate";
import { asyncRouterMap, constantRouterMap } from '../../router/modules/route';

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
        uid:'',
        jurisdiction:'',
        dbc:""
    },
    mutations: {
        setRouteInfo: function (state, routeInfo) {
            state.routeInfo = routeInfo;
        },
        getUid: function (state, data) {//获取用户id
            state.uid = data;
        },
        getJurisdiction: function (state, data) {//获取用户权限
            state.jurisdiction = data;
        },
        getdbc: function (state, data) {//获取用户权限
            state.jurisdiction = data;
        }
    },
    getters:{
        menuList: (state) => getMenuByRouter(state.routeInfo, state.jurisdiction),
        routerList: (state) => getRouterByOrder(state.routeInfo, state.jurisdiction),
        addRouters: (state)=> state.routeInfo,
    },
    actions:{
        GenerateRoutes( data) {

            return new Promise(resolve => {
                const { roles } = data;
                const accessedRouters = asyncRouterMap.filter(v => {
                    // if (roles.indexOf('admin') >= 0) return true;
                    if (hasPermission(roles, v)) {
                        if (v.children && v.children.length > 0) {
                            v.children = v.children.filter(child => {
                                if (hasPermission(roles, child)) {
                                    return child
                                }
                                return false;
                            });
                            return v
                        } else {
                            return v
                        }
                    }
                    return false;
                });
                resolve();
            })
        }
    }

}
