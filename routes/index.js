var express = require('express');
var router = express.Router();
/**
 * 获取后台文件
 */
const { queryService } = require('../controllers/index/indexCtrl');
/**
 * 测试路径
 */
router.get('/', function (req, res, next) {
  queryService(req, res, next);
});

module.exports = router
