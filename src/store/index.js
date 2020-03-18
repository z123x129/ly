import Vue from 'vue'
import Vuex from 'vuex'
import route from './module/route'
import app from './module/app'
import user from './module/user'
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
    app,
    user
  },
  plugins: [createPersistedState({
    reducer(val){
      return{
        user:val.user
      }
    }
  })]
})
