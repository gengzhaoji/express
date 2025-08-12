const { queryService } = require("./indexService");

module.exports = {
  queryService: function (req, res, next) {
    queryService(req.query)
      .then((retrunObj) => {
        res.send(retrunObj);
      })
      .catch((err) => {
        res.send(err);
      });
  },
};
