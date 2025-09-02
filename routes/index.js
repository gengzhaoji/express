var express = require("express");
var router = express.Router();
/**
 * 获取后台文件
 */
const {
  queryService,
  loginService,
} = require("../controllers/index/indexCtrl");
/**
 * 测试路径
 */
router.get("/", (req, res, next) => {
  queryService(req, res, next);
});
router.get("/login", (req, res, next) => {
  loginService(req, res, next);
});

module.exports = router;
