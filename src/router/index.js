import Vue from 'vue'
import Router from 'vue-router'
import cuxiaoMain from '@/components/active/activeMain'
import store from "../store/store";
import cuxiao from "./cuxiao";
import sj from "./sj";
import vipAdd from "./vipAdd";
import user from "./user";
import wxApp from "./wxApp";
import wxSheet from "./wxSheet";

const isAdmin = function (to, from, next) { //验证用户是否是管理员
  let admin = store.state.user.admin;
  console.log(admin);
  if (admin == "N") {
    alert("你不是管理员，不能使用！");
  } else {
    next();
  }
};

Vue.use(Router);

//管理员才能进入
cuxiao[0].beforeEnter = isAdmin;
cuxiao[1].beforeEnter = isAdmin;


export default new Router({
  routes: [{
      path: "/",
      name: "topMenu",
      component: resolve => require(['@/components/topMenu.vue'], resolve),
    },
    {
      path: "/topMenu",
      name: "topMenu1",
      component: resolve => require(['@/components/topMenu.vue'], resolve),
    },
    {
      path: '/cuxiao',
      name: 'cuxiao',
      component: cuxiaoMain,
      children: cuxiao
    },
    {
      path: "/login",
      name: "login",
      component: resolve => require(['@/components/login.vue'], resolve),
    },
    {
      path: "/sj",
      name: "sj",
      component: resolve => require(['@/components/sj/sjMain.vue'], resolve),
      children: sj
    },
    {
      path: "/user",
      name: "user",
      component: resolve => require(['@/components/user/userMain.vue'], resolve),
      children: user
    },
    {
      path: "/vipAdd",
      name: "vipAdd",
      component: resolve => require(['@/components/vipAdd/main.vue'], resolve),
      children: vipAdd
    }, {
      path: "/wxApp",
      name: "wxApp",
      component: resolve => require(['@/components/wxApp/main.vue'], resolve),
      children: wxApp
    }, {
      path: "/wxSheet",
      name: "wxSheet",
      component: resolve => require(['@/components/wxSheet/main.vue'], resolve),
      children: wxSheet
    }
  ]
});
