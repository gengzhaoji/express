var express = require("express");
var router = express.Router();
/**
 * 获取后台文件
 */
const {
  queryService,
  loginService,
} = require("../controllers/index/indexCtrl");


router.get("/", (req, res) => {
  queryService(req, res);
});
router.get("/login", (req, res) => {
  loginService(req, res);
});

// 单工通讯，服务端实时主动推送，适合大屏的项目，实时性要求高
router.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  setInterval(() => {
    res.write(`data: ${new Date().toLocaleTimeString()}\n\n`);
  }, 1000);
});

module.exports = router;
