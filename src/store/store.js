import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  token: sessionStorage.getItem("token"),
  host:"http://200.53.1.200:3000/",
  system:sessionStorage.getItem("system"),
  admin:sessionStorage.getItem("admin")
}


const mutations = {
  setToken(state, payload) {
    sessionStorage.setItem("token", payload.token);
    sessionStorage.setItem("system",payload.system);
    sessionStorage.setItem("admin",payload.admin);
    state.token = payload.token;
    state.system=payload.system;
    state.admin=payload.admin;
  },
  removeToken(state){
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("system");
    sessionStorage.removeItem("admin");
    state.token=undefined;
    state.system=undefined;
    state.admin=undefined;
  }
};

export default new Vuex.Store({
  state,
  mutations
});
