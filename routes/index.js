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
router.get("/", (req, res) => {
  queryService(req, res);
});
router.get("/login", (req, res) => {
  loginService(req, res);
});

module.exports = router;
