const cuxiao = [{
    //活动列表
    path: 'activeBetchList',
    beforeEnter:"",
    component: resolve => require(['@/components/active/activeBetchList.vue'], resolve),
  },
  {
    path:"vipSet",
    beforeEnter:"",
    component: resolve => require(['@/components/active/vipSet.vue'], resolve),
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

exports=module.exports=cuxiao;