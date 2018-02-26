import Vue from 'vue'
import Router from 'vue-router'
import cuxiaoMain from '@/components/active/activeMain'
import store from "../store/store";


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
const cuxiao = [{
    //活动列表
    path: 'activeBetchList',
    beforeEnter: isAdmin,
    component: resolve => require(['@/components/active/activeBetchList.vue'], resolve),
  },
  {
    //新增活动--满送活动
    path: 'addActiveBetch01/:activeNo',
    component: resolve => require(['@/components/active/addActiveBetch01.vue'], resolve),
  },
  {
    //新增活动--分级赠礼
    path: 'addActiveBetch02/:activeNo',
    component: resolve => require(['@/components/active/addActiveBetch02.vue'], resolve),
  },
  {
    //新增活动--抽奖活动
    path: 'addActiveBetch03/:activeNo',
    component: resolve => require(['@/components/active/addActiveBetch03.vue'], resolve),
  },
  {
    //会员卡验证抽奖
    path: "vipCard",
    component: resolve => require(['@/components/active/vipCard.vue'], resolve),
  },
  {
    //当前生效活动选择
    path: "vaildActiveBetchList",
    component: resolve => require(['@/components/active/vaildActiveBetchList.vue'], resolve),
  },
  {
    //开始发奖01
    path: 'startActive01/:activeNo',
    component: resolve => require(['@/components/active/startActive01.vue'], resolve),
  },
  {
    //开始发奖02
    path: 'startActive02/:activeNo',
    component: resolve => require(['@/components/active/startActive02.vue'], resolve),
  },
  {
    //发奖数据查询by userid
    path: 'activeQueryByUserid',
    component: resolve => require(['@/components/active/activeQueryByUserid.vue'], resolve),
  },
  {
    //发奖数据查询by date
    path: 'activeQueryByDate',
    component: resolve => require(['@/components/active/activeQueryByDate.vue'], resolve),
  }
];

const sj = [{
  //礼券使用情况查询
  path: 'giftUseStat',
  component: resolve => require(['@/components/sj/giftUseStat.vue'], resolve),
}, {
  //礼券使用情况统计/依日期/按批次查询
  path: 'giftUseCount',
  component: resolve => require(['@/components/sj/giftUseCount.vue'], resolve),
}, {
  //退货列表
  path: "retMnyDetail",
  component: resolve => require(['@/components/sj/retMnyDetail.vue'], resolve),
}];

const user = [{
    //用户管理
    path: "userList",
    component: resolve => require(['@/components/user/userList.vue'], resolve),
  },
  {
    //用户编辑
    path: "userEdit/:userid",
    component: resolve => require(['@/components/user/userEdit.vue'], resolve),
  }
];
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
    }
  ]
});
