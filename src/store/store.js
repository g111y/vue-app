import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  token: sessionStorage.getItem("token"),
  host: "http://200.53.1.200:3000/",
  system: sessionStorage.getItem("system"),
  user:sessionStorage.getItem("user")
}


const mutations = {
  setToken(state, payload) {
    sessionStorage.setItem("token", payload.token);
    sessionStorage.setItem("system", payload.system);
    sessionStorage.setItem("user", payload.user);
    state.token = payload.token;
    state.system = payload.system;
    state.user = payload.user;
  },
  removeToken(state) {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("system");
    sessionStorage.removeItem("admin");
    state.token = undefined;
    state.system = undefined;
    state.user = undefined;
  }
};

export default new Vuex.Store({
  state,
  mutations
});
