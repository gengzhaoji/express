var express = require('express');
var router = express.Router();

/**
 * 获取后台文件
 */
const { queryService } = require('../controllers/vehicle/indexCtrl');

/**
 * 车辆信息
 */
router.get('/query', function (req, res, next) {
    queryService(req, res, next);
});

module.exports = router;
