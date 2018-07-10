
/**
 * 会员推广路由
 */
const vipAdd = [{
    //礼券使用情况查询
    path: 'userList',
    component: resolve => require(['@/components/vipAdd/userList.vue'], resolve),
  }, {
    //用户审核
    path: 'userCheck',
    component: resolve => require(['@/components/vipAdd/userCheck.vue'], resolve),
  }, {
    //登记信息审核
    path: 'vipInfoCheck',
    component: resolve => require(['@/components/vipAdd/vipInfoCheck.vue'], resolve),
  }, {
    //按人员汇总查询
    path: 'vipTotalByPer',
    component: resolve => require(['@/components/vipAdd/vipTotalByPer.vue'], resolve),
  },{
    //按专柜汇总查询
    path: 'vipTotalByShop',
    component: resolve => require(['@/components/vipAdd/vipTotalByShop.vue'], resolve),
  },{
    //按楼层汇总查询
    path: 'vipTotalByFloor',
    component: resolve => require(['@/components/vipAdd/vipTotalByFloor.vue'], resolve),
  }]

  exports=module.exports=vipAdd;