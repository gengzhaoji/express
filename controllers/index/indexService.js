var indexService = {}
var connectDB = require('../connectDB')

/**
 * 查询营运中心
 * **/
indexService.queryService = function () {
    return new Promise((resolve, reject) => {
        /**
         * 单个sql请求方法
         */
        connectDB.oneSql('SELECT * from user').then(result => {
            resolve(result);
        }).catch(err => {
            console.error("LoginService>>>>>>>queryService>>>>>>>" + err.message);
            reject();
        })
        /**
         * 多个sql请求方法
         */
        // connectDB.connect()
        //     .then(() => connectDB.query('SELECT * from user'))
        //     .then(result => {
        //         connectDB.close();
        //         resolve(result);
        //     }).catch(err => {
        //         connectDB.close();
        //         console.error("LoginService>>>>>>>queryService>>>>>>>" + err.message);
        //         reject();
        //     })
    })
};

module.exports = indexService;