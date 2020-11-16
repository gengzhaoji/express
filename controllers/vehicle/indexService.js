const { oneSql } = require('../connectDB')

module.exports = {
    /**
    * 人员查询逻辑
    * **/
    queryService: function (query) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM vehicle`;
            if (!!query.name) {
                sql = `SELECT * FROM vehicle WHERE name LIKE "%${query.name}%" OR license_plate LIKE "%${query.name}%"`;
            }
            oneSql(sql).then(result => {
                resolve(result);
            }).catch(err => {
                console.error("LoginService>>>>>>>queryService>>>>>>>" + err.message);
                reject();
            })
        })
    }
};