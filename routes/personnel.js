var express = require('express');
var router = express.Router();
/**
 * 获取后台文件
 */
var personnel = require('../controllers/personnel/indexCtrl');

/**
 * 人员采集接口
 */
router.post('/insert', function (req, res, next) {
  personnel.insertService(req, res, next);
});
/**
 * 人员信息
 */
router.get('/query', function (req, res, next) {
  personnel.queryService(req, res, next);
});

module.exports = router;
