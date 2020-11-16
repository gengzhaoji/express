const { insertService, queryService } = require('./indexService');

module.exports = {
    /**
     * 新增逻辑
     * **/
    insertService: function (req, res, next) {
        insertService(req.body).then(function (retrunObj) {
            res.send(retrunObj);
        });
    },
    /**
     * 查询逻辑
     * **/
    queryService: function (req, res, next) {
        queryService(req.query).then(function (retrunObj) {
            res.send(retrunObj);
        });
    },
};

