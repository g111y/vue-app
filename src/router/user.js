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

exports=module.exports=user;