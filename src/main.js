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

var bus = new Vue()
export default bus

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll);

Vue.use(iView);
Vue.prototype.$config = config

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')




