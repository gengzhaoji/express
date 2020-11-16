var index = {};
var indexService = require('./indexService');
/**
 * 查询接口
 * **/
index.queryService = function (req, res, next) {
    indexService.queryService(req.query).then(function (retrunObj) {
        res.send(retrunObj);
    });
};

module.exports = index;//抛出模块

