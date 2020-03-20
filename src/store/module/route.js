import {getMenuByRouter, getRouterByOrder} from "../../libs/common";
import createPersistedState from "vuex-persistedstate";
import { asyncRouterMap, constantRouterMap } from '../../router/modules/route';
import store from '@/store'

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
    },
    mutations: {
        setRouteInfo: function (state, routeInfo) {
            state.routeInfo = routeInfo;
        },
        getMessage:function (state, data) {
            state.messageList.push(data);
        }
    },
    getters:{
        menuList: (state) => getMenuByRouter(state.routeInfo, store.state.user.jurisdiction),
        routerList: (state) => getRouterByOrder(state.routeInfo, store.state.user.jurisdiction),
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
