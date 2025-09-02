var express = require("express");
var router = express.Router();
/**
 * 获取后台文件
 */
const {
  insertService,
  queryService,
} = require("../controllers/personnel/indexCtrl");
/**
 * 人员采集接口
 */
router.post("/insert", (req, res, next) => {
  insertService(req, res, next);
});
/**
 * 人员信息
 */
router.get("/query", (req, res, next) => {
  queryService(req, res, next);
});

module.exports = router;
