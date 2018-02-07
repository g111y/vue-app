// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//import iView from 'iview';
//import 'iview/dist/styles/iview.css';
import ElementUI from 'element-ui'
//import 'element-ui/lib/theme-chalk/index.css'
// require( '../static/theme-chalk/index.css')
 //require('./css/theme-chalk/index.css');
import vueResource from "vue-resource";
import store from "./store/store";

Vue.config.productionTip = false

//Vue.use(iView);
Vue.use(ElementUI)
Vue.use(vueResource);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})

Vue.http.interceptors.push((request, next) => {
  const jwtToken = store.state.token;
  if (jwtToken) {
    //Vue.http.headers.common.Authorization = `Bearer ${jwtToken}`;
    request.headers.set("Authorization", `Bearer ${jwtToken}`);
  }
  next((response) => {
    if (response.status == 400 || response.status == 401) {
      router.push("/login")
    }
    return response;
  })
});

router.beforeEach((to, from, next) => {
  const jwtToken = store.state.token;
  switch (to.path) {
    case "/login":
      next();
      break;
    default:
      if (!jwtToken) {
        next("/login")
        console.log(to.path)
      } else {
        console.log(store.state.system.indexOf(to.matched[0].path));
        console.log(to.path);
        if(store.state.system.indexOf(to.matched[0].path)<0 && to.path!="/topMenu"){
          alert("你无权使用!")
        }else{
          next()
        }
      }
  }

})
