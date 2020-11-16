const { oneSql, connect, query, close } = require('../connectDB')

module.exports = {
    queryService: function () {
        return new Promise((resolve, reject) => {
            /**
             * 单个sql请求方法
             */
            oneSql('SELECT * from user').then(result => {
                resolve(result);
            }).catch(err => {
                console.error("LoginService>>>>>>>queryService>>>>>>>" + err.message);
                reject();
            })
            /**
             * 多个sql请求方法
             */
            // connect()
            //     .then(() => query('SELECT * from user'))
            //     .then(result => {
            //         close();
            //         resolve(result);
            //     }).catch(err => {
            //         close();
            //         console.error("LoginService>>>>>>>queryService>>>>>>>" + err.message);
            //         reject();
            //     })
        })
    },
};