import {getMenuByRouter} from "../../libs/common";
import createPersistedState from "vuex-persistedstate";

export default {
    state:{
        routeInfo:[]
    },
    mutations:{
        setRouteInfo:function(state, routeInfo){
            state.routeInfo = routeInfo;
        }
    },
    getters:{
        menuList: (state) => getMenuByRouter(state.routeInfo),

    },

}
