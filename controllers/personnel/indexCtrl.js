var index = {};
var indexService = require('./indexService');
/**
 * 新增逻辑
 * **/
index.insertService = function (req, res, next) {
    indexService.insertService(req.body).then(function (retrunObj) {
        res.send(retrunObj);
    });
};
/**
 * 查询逻辑
 * **/
index.queryService = function (req, res, next) {
    indexService.queryService(req.query).then(function (retrunObj) {
        res.send(retrunObj);
    });
};

module.exports = index;

