const { queryService } = require('./indexService');

module.exports = {
    queryService: function (req, res) {
        queryService().then(function (retrunObj) {
            res.send(retrunObj);
        });
    }
};

