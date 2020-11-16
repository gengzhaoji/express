const { queryService } = require('./indexService');

module.exports = {
    queryService: function (req, res, next) {
        queryService(req.query).then(function (retrunObj) {
            res.send(retrunObj);
        });
    },
};

