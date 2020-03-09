import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import httpUrl from '../../http'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appid:'123456',
    appsecret:'000000',
    on_off:false,//加密解密开关  true为打开,false为关闭
    router_list:{},//路由表
    jsapi_ticket:'',//票据
    uid:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjMwLCJleHAiOjE1ODc2MjUyNzgsImp0aSI6IklqRXlNelExTmlJLklqQXdNREF3TUNJLlgtWHpSbXpha1doSE5DMVlCOUNwUW1mc1VHVnh0dDNVa0RrME4wOGJPR0UifQ.xM7gJFv6ZKSfxAGMVVeYGbmaMvW4nAWzlJUsYHw-TY8',//用户id
    expires_in:'1587625278',//过期时间
    url: httpUrl.baseUrl,//域名  //http://192.168.1.88:10003/public
    sid:'',//聊天对象id
    fromid:'',//聊天id
    from_head:'',//我的头像
    to_head:'',//店铺头像
    to_name:'',//店铺名称
    online:'',//店铺是否在线
  },
  mutations: {
    getRouter(state,data){//获取路由表
      state.router_list = data;
    },
    getJsapi(state,data){//获取票据
      state.jsapi_ticket = data;
    },
    getUid(state,data){//获取用户id
      state.uid = data;
    },
    getExpires(state,data){//获取过期时间
      state.expires_in = data;
    },
    getSid(state,data){//聊天对象id
      state.sid = data;
    },
    getFromid(state,data){//聊天id
      state.fromid = data;
    },
  },
  actions: {
    //
  },
  modules: {
    //
  },
  plugins: [createPersistedState()]
})
