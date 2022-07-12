const { queryService, loginService } = require("./indexService");

module.exports = {
    queryService: function (req, res) {
        queryService(req)
          .then((retrunObj) => {
            res.send(retrunObj);
          })
          .catch((err) => {
            res.send(err);
          });
    },
    loginService: function (req, res) {
        loginService(req)
          .then((retrunObj) => {
            res.send(retrunObj);
          })
          .catch((err) => {
            res.send(err);
          });
    }
};

