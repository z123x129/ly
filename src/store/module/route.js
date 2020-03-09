import {getMenuByRouter} from "../../libs/common";
import createPersistedState from "vuex-persistedstate";

export default {
    state:{
        routeInfo:[],
        uid:'',
        jurisdiction:'',
    },
    mutations:{
        setRouteInfo:function(state, routeInfo){
            state.routeInfo = routeInfo;
        },
        getUid:function(state,data){//获取用户id
            state.uid = data;
        },
        getJurisdiction:function(state,data){//获取用户权限
            state.jurisdiction = data;
        },
    },
    getters:{
        menuList: (state) => getMenuByRouter(state.routeInfo),
    },

}
