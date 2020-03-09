import Vue from 'vue'
import Vuex from 'vuex'
import route from './module/route'
import app from './module/app'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    route,
    app
  },
  plugins: [createPersistedState({
    reducer(val){
      return{
        route:val.route
      }
    }
  })]
})
