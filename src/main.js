import Vue from 'vue'
import App from './App.vue'
import {router} from './router'
import store from './store'
import secret_key from '../public/js/secret_key'
import https from "../public/js/api.request"

import dataV from '@jiaminghi/data-view'
Vue.use(dataV)

Vue.prototype.$secret_key = secret_key;
Vue.prototype.$https = https;
Vue.config.productionTip = false;

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll);

import { Dialog } from 'vant';

router().then(function(router){
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')

  //页面跳转的登录判断
// router.beforeEach((to,from,next)=>{
//   let toPath = ['/Member_login','/Member_pclogin','/Member_pcpersonal','/','/Member_xieyi','/Member_retrieve','/Member_amend'];//无需登录判断的页面
//   if(toPath.indexOf(to.path)>=0){
//     if(to.path == '/Member_login'&&store.state.uid!=''&&parseInt(new Date().getTime()/1000)<store.state.expires_in){
//       next('/Member_personal');
//     }else if(to.path == '/Member_pclogin'&&store.state.uid!=''&&parseInt(new Date().getTime()/1000)<store.state.expires_in){
//       next('/Member_pcpersonal');
//     }else if(to.path == '/Member_pcpersonal'){
//       if(store.state.uid==''){
//         Dialog.alert({
//           message: '您还没有登录，请先登录'
//         }).then(() => {
//           next('/Member_pclogin');
//         });
//
//       }else if(parseInt(new Date().getTime()/1000)>=store.state.expires_in){
//         Dialog.alert({
//           message: '身份过期，请重新登录'
//         }).then(() => {
//           next('/Member_pclogin');
//         });
//       }
//     }
//     next();
//   }else if(store.state.uid==''){
//     Dialog.alert({
//       message: '您还没有登录，请先登录'
//     }).then(() => {
//       next('/Member_login');
//     });
//   }else if(parseInt(new Date().getTime()/1000)>=store.state.expires_in){
//     Dialog.alert({
//       message: '身份过期，请重新登录'
//     }).then(() => {
//       next('/Member_login');
//     });
//   }else{
//     next();
//   }
// });
});


