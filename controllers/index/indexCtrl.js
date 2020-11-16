/**
 * 登录，配置路径功能
 */
var index = {};
var indexService = require('./indexService');
/**
 * 查询营运中心
 * **/
index.queryService = function (req, res) {
    indexService.queryService().then(function (retrunObj) {
        res.send(retrunObj);
    });
};

module.exports = index;//抛出模块

