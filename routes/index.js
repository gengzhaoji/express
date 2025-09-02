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
/**
 * 前端通过EventSource对象来接收服务器推送的数据，
 * const sse = new EventSource("http://loaclhost:3000/sse");
 * sse.onmessage = (e) => { console.log(e.data)}
 */
router.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  setInterval(() => {
    res.write(`event: message\n`) // 事件名称，默认为message
    res.write(`data: ${new Date().toLocaleTimeString()}\n\n`);
  }, 1000);
});

module.exports = router;
