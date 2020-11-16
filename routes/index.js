var express = require('express');
var router = express.Router();
/**
 * 获取后台文件
 */
var index = require('../controllers/index/indexCtrl');
/**
 * 测试路径
 */
router.get('/', function (req, res, next) {
  index.queryService(req, res, next);
});

module.exports = router
