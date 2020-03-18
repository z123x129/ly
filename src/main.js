import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import secret_key from '../public/js/secret_key'
import https from "../public/js/api.request"
import iView from 'iview'
import 'iview/dist/styles/iview.css';
import dataV from '@jiaminghi/data-view'
import config from '@/config'
Vue.use(dataV)

Vue.prototype.$secret_key = secret_key;
Vue.prototype.$https = https;
Vue.config.productionTip = false;

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll);

Vue.use(iView);
Vue.prototype.$config = config
import { MessageBox } from 'element-ui';
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


  //页面跳转的登录判断
// router.beforeEach((to,from,next)=>{
//   let toPath = ['/login','/'];//无需登录判断的页面
//   if(toPath.indexOf(to.path)>=0){
//     if(to.path == '/login'&&store.state.route.uid!=''){
//       next('/home');
//     }
//     next();
//   }else if(store.state.route.uid==''){
//     // Dialog.alert({
//     //   message: '您还没有登录，请先登录'
//     // }).then(() => {
//     //   next('/login');
//     // });
//     MessageBox.alert('您还没有登录，请先登录', '提示', {
//       confirmButtonText: '确定',
//       callback: action => {
//         next('/login');
//       }
//     });
//   }else{
//     next();
//   }
// });


