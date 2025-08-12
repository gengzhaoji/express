const { insertService, queryService } = require("./indexService");

module.exports = {
  /**
   * 新增逻辑
   * **/
  insertService: function (req, res, next) {
    insertService(req.body)
      .then((retrunObj) => {
        res.send(retrunObj);
      })
      .catch((err) => {
        res.send(err);
      });
  },
  /**
   * 查询逻辑
   * **/
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
