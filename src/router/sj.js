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

  exports=module.exports=sj;