const connectDB = require('../connectDB')

module.exports = {
    /**
    * 人员采集逻辑
    * **/
    queryService: function (query) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM vehicle`;
            if (!!query.name) {
                sql = `SELECT * FROM vehicle WHERE name LIKE "%${query.name}%" OR license_plate LIKE "%${query.name}%"`;
            }
            /**
            * 人员采集新增数据
            */
            connectDB.oneSql(sql).then(result => {
                resolve(result);
            }).catch(err => {
                console.error("LoginService>>>>>>>queryService>>>>>>>" + err.message);
                reject();
            })
        })
    }
};