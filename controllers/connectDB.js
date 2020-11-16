const mysql = require('mysql')
const config = require('./config.json')

/**
 * 数据库连接公用方法
 * connect()连接数据库
 * close()关闭数据库
 * oneSql()只有一句执行sql时可以使用，自动连接和断开数据库
 * query()执行sql的方法
 * selectSql()查询语句的拼装和执行函数
 * insertSql()新增语句的拼装和执行函数
 * updateSql()修改语句的拼装和执行函数
 * deleteSql()删除语句的拼装和执行函数
 */
class Connect {
    constructor({
        //本地mysql数据库
        host = config.host,
        user = config.user,
        password = config.password,
        database = config.database, //数据库名
        port = config.port,
        useConnectionPooling = true
    } = {}) {
        this.config = {
            host,
            user,
            password,
            database,
            port,
            useConnectionPooling
        };
        this.connection = null;
    }
    //1.建立连接
    connect() {
        //创建服务器连接，将连接对象，赋值给conn
        this.connection = mysql.createConnection(this.config);
        return new Promise((resolve, reject) => {
            //建立连接
            this.connection.connect(err => {
                if (err) {
                    console.error('数据库链接失败错误:' + err.stack);
                    reject(err);
                } else {
                    console.log('数据库链接成功***********connected as id ' + this.connection.threadId);
                    resolve();
                }
            });
        });
    };
    //3.关闭连接
    close() {
        return new Promise((resolve, reject) => {
            //建立连接
            this.connection.end(err => {
                if (err) {
                    console.error('数据库断开错误:' + err.stack);
                    reject(err);
                } else {
                    console.log('数据库链接断开***********connected as id ' + this.connection.threadId);
                    resolve();
                }
            });
        });
    };
    /**
     * 
     * @param 只有一条sql语句的执行时  自动连接数据库和断开数据库
     */
    oneSql(sql) {
        return new Promise((resolve, reject) => {
            this.connect().then(() => this._operation(sql)).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err)
            }).finally(() => this.close())
        })
    }
    /**
     * 
     * @param String sql 
     */
    query(sql) {
        return this._operation(sql);
    }
    /**
     * array = Array
     * table = String
     * where = { key: value }
     * link = 'AND' or 'OR' default 'AND'
     */
    selectSql(array, table, where, link) {
        let sql = "SELECT ";
        array.forEach(((value, index) => {
            if (index === 0) {
                sql += value;
            } else {
                sql += ',' + value
            }
        }));
        sql += ' FROM ' + table;
        if (where) {
            sql += this._handleWhereString(where, link);
        }
        return sql;
    }
    /**
     * @param { key: value } info 
     * @param String  table 
     */
    insertSql(info, table) {
        let keyArray = [];
        let valueArray = [];
        Object.keys(info).forEach((key) => {
            keyArray.push(key);
            valueArray.push("'" + info[key] + "'");
        });
        let keyStr = keyArray.join(',');
        let valueStr = valueArray.join(',');
        let sql = `INSERT INTO ${table} (${keyStr}) VALUES (${valueStr})`
        return sql
    }
    /**
     * 
     * @param { key: value } info 
     * @param String table 
     * @param { key: value } where 
     * @param 'AND' or 'OR' default 'AND' link 
     */
    updateSql(info, table, where, link) {
        let sql = "UPDATE " + table + " SET ";
        let sqlArray = [];
        Object.keys(info).forEach((key) => {
            sqlArray.push(key + "='" + info[key] + "'");
        });
        sql += sqlArray.join(',');
        if (where) {
            sql += this._handleWhereString(where, link);
        }
        return this._operation(sql);
    }
    /**
      * 
      * @param { key: value } info 
      * @param String table 
      * @param { key: value } where 
      * @param 'AND' or 'OR' default 'AND' link 
      */
    deleteSql(info, table, where, link) {
        let sql = "DELETE FROM " + table;
        if (where) {
            sql += this._handleWhereString(where, link);
        }
        return this._operation(sql);
    }
    _operation(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (error, result, fields) => {
                if (error) {
                    reject(error.message);
                } else {
                    resolve(result);
                }
            });
        })
    }

    _handleWhereString(where, link) {
        let str = "";
        let whereArray = [];
        Object.keys(where).forEach((key) => {
            whereArray.push(String(key + "='" + where[key] + "'"));
        });
        if (link) {
            let whereStr = whereArray.join(" " + link + " ");
            str += " WHERE " + whereStr;
        } else {
            let whereStr = whereArray.join(" AND ");
            str += " WHERE " + whereStr;
        }
        return str;
    }
}

module.exports = new Connect();