const connectDB = require('../connectDB')

module.exports = {
    /**
    * 人员采集逻辑
    * **/
    insertService: function (options) {
        return new Promise((resolve, reject) => {
            /**
            * 人员采集新增数据
            */
            connectDB.oneSql(connectDB.insertSql(options, 'personnel')).then(result => {
                resolve(result);
            }).catch(err => {
                console.error("personnel>>>>>>>insertService>>>>>>>" + err.message);
                reject();
            })
        })
    },
    /**
   * 人员信息
   * **/
    queryService: function (query) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM personnel`;
            if (!!query.name) {
                sql = `SELECT * FROM personnel WHERE name LIKE "%${query.name}%" OR id LIKE "%${query.name}%" OR phone LIKE "%${query.name}%"`;
            }
            /**
            * 人员采集新增数据
            */
            connectDB.oneSql(sql).then(result => {
                resolve(result);
            }).catch(err => {
                console.error("personnel>>>>>>>queryService>>>>>>>" + err.message);
                reject();
            })
        })
    },
};