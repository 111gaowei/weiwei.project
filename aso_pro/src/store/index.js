import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin:sessionStorage.getItem("isLogin")||false
  },
  mutations: {
    login(state){
      state.isLogin=true;
    }
  },
  actions: {
  },
  modules: {
  }
})
