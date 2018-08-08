/**
 * 小程序单据处理路由
 */
const wxSheet = [{
  //待处理标价签申请
  path: "labCheckSheet",
  name: "labCheckSheet",
  component: resolve => require(['@/components/wxSheet/labCheckSheet.vue'], resolve),
}, {
  //标价签申请列表 依日期查询
  path: "queryLabSheet",
  name: "queryLabSheet",
  component: resolve => require(['@/components/wxSheet/queryLabSheet.vue'], resolve),
}]

exports = module.exports = wxSheet;
