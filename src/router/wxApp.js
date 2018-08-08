/**
 * 小程序管理模块路由
 */
const wxApp = [{
  //用户列表
  path: 'userList',
  component: resolve => require(['@/components/wxApp/userList.vue'], resolve),
}, {
  //用户审核
  path: 'userCheck',
  component: resolve => require(['@/components/wxApp/userCheck.vue'], resolve),
},{
  //礼券使用情况查询
  path: 'sysMessage',
  component: resolve => require(['@/components/wxApp/sysMessage.vue'], resolve),
}, {
  //用户审核
  path: 'suggest',
  component: resolve => require(['@/components/wxApp/suggest.vue'], resolve),
},{
  //促销活动
  path:"salesInfo",
  name:"salesInfo",
  component: resolve => require(['@/components/wxApp/salesInfo.vue'], resolve),
}]

exports = module.exports = wxApp;
