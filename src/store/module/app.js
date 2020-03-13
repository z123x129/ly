import {getMenuByRouter, getRouteTitleHandled, routeHasExist, routeEqual, getNextRoute} from "../../libs/common";
import {getBreadCrumbList, getHomeRoute} from "../../libs/tools";
import config from '@/config'
import router from '@/router'
const { homeName } = config
const closePage = (state, route) => {
    const nextRoute = getNextRoute(state.tagNavList, route)
    //window.consoele.log(nextRoute);
    state.tagNavList = state.tagNavList.filter(item => {
      return !routeEqual(item, route)
    })
     router.push(nextRoute)
  }
const home = {'meta':{hideInMenu:true, icon:"md-home", notCache:true, title:"首页"}, name:'home', params:{}, query:{}};
export default {
    state:{
        app1:"",
        tagNavList:[],
        breadCrumbList: [],
        homeRoute:{}
    },
    mutations:{
        setapp:function(state, routeInfo){
            state.app = routeInfo;
        },
        setBreadCrumb (state, route) {
            state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
        },
        setHomeRoute (state, routes) {
            state.homeRoute = getHomeRoute(routes, homeName)
        },
        addTag (state, { route, type = 'unshift' }) {

            let router = getRouteTitleHandled(route)
            if (!routeHasExist(state.tagNavList, router)) {
                if (type === 'push') state.tagNavList.push(router)
                else {
                    if (router.name === homeName) state.tagNavList.unshift(router)
                    else state.tagNavList.splice(1, 0, router)
                }
            }
        },
        closeTag (state, route) {
            let tag = state.tagNavList.filter(item => routeEqual(item, route))
            route = tag[0] ? tag[0] : null

            if (!route) return
            closePage(state, route)
        },
        setTagNavList (state, list) {
            let tagList = []
            if (list) {
              tagList = [...list]
            } else tagList =  [home];
            if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
            let homeTagIndex = tagList.findIndex(item => item.name === homeName)
            if (homeTagIndex > 0) {
              let homeTag = tagList.splice(homeTagIndex, 1)[0]
              tagList.unshift(homeTag)
            }
            state.tagNavList = tagList
            //setTagNavListInLocalstorage([...tagList])
          },
    },
    getters:{
    },
}
