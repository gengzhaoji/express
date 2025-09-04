const mysql = require("mysql2");
const fs = require("node:fs");
const path = require("node:path");
const jsyaml = require("js-yaml");

// 加载数据库配置
const config = jsyaml.load(
  fs.readFileSync(path.resolve(__dirname, "../db.config.yaml"), "utf-8")
);

// 创建连接池
const pool = mysql.createPool(config.db);

/**
 * 数据库连接公用方法
 * connect() 连接数据库
 * query() 执行sql的方法
 * selectSql() 查询语句的拼装和执行函数
 * insertSql() 新增语句的拼装和执行函数
 * updateSql() 修改语句的拼装和执行函数
 * deleteSql() 删除语句的拼装和执行函数
 * executeTransaction() 执行事务
 */

/**
 * 建立数据库连接的函数
 * @returns {Promise} 返回一个Promise对象，用于处理连接成功或失败的情况
 */
function connect() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("数据库链接失败错误:" + err.stack);
        reject(err);
      } else {
        console.log(
          "数据库链接成功***********connected as id " + connection.threadId
        );
        resolve(connection);
      }
    });
  });
}

/**
 * 执行sql的方法
 * @param {string} sql - SQL语句
 * @param {array} params - 参数数组
 * @param {object} connection - 可选的事务连接
 * @returns {Promise}
 */
function executeSql(sql, params = [], connection = null) {
  return _operation(sql, params, connection);
}

/**
 * 查询语句的拼装和执行函数
 * @param {array} array - 查询字段数组
 * @param {string} table - 表名
 * @param {object} where - 查询条件 {key: value}
 * @param {string} link - 连接条件 'AND' or 'OR'，默认为 'AND'
 * @param {object} connection - 可选的事务连接
 * @returns {Promise}
 */
function selectSql(
  array,
  table,
  where = null,
  link = "AND",
  connection = null
) {
  let sql = "SELECT ";
  sql += array.join(", ");
  sql += " FROM " + table;

  if (where) {
    const whereClause = _handleWhereString(where, link);
    sql += whereClause.sql;
    return _operation(sql, whereClause.values, connection);
  }

  return _operation(sql, [], connection);
}

/**
 * 新增语句的拼装和执行函数
 * @param {object} info - 插入数据 {key: value}
 * @param {string} table - 表名
 * @param {object} connection - 可选的事务连接
 * @returns {Promise}
 */
function insertSql(info, table, connection = null) {
  const keys = Object.keys(info);
  const values = Object.values(info);
  const placeholders = values.map(() => "?").join(",");

  const sql = `INSERT INTO ${table} (${keys.join(
    ","
  )}) VALUES (${placeholders})`;
  return _operation(sql, values, connection);
}

/**
 * 修改语句的拼装和执行函数
 * @param {object} info - 更新数据 {key: value}
 * @param {string} table - 表名
 * @param {object} where - 查询条件 {key: value}
 * @param {string} link - 连接条件 'AND' or 'OR'，默认为 'AND'
 * @param {object} connection - 可选的事务连接
 * @returns {Promise}
 */
function updateSql(info, table, where = null, link = "AND", connection = null) {
  const setClause = Object.keys(info)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = Object.values(info);
  let sql = `UPDATE ${table} SET ${setClause}`;

  if (where) {
    const whereClause = _handleWhereString(where, link);
    sql += whereClause.sql;
    values.push(...whereClause.values);
  }

  return _operation(sql, values, connection);
}

/**
 * 删除语句的拼装和执行函数
 * @param {string} table - 表名
 * @param {object} where - 查询条件 {key: value}
 * @param {string} link - 连接条件 'AND' or 'OR'，默认为 'AND'
 * @param {object} connection - 可选的事务连接
 * @returns {Promise}
 */
function deleteSql(table, where = null, link = "AND", connection = null) {
  let sql = `DELETE FROM ${table}`;
  const values = [];

  if (where) {
    const whereClause = _handleWhereString(where, link);
    sql += whereClause.sql;
    values.push(...whereClause.values);
  }

  return _operation(sql, values, connection);
}

/**
 * 执行事务
 * @param {function} transactionFn - 包含事务操作的函数
 * @returns {Promise}
 */
async function executeTransaction(transactionFn) {
  const connection = await connect();

  try {
    await connection.beginTransaction();
    console.log("事务开始");

    // 执行事务操作
    const result = await transactionFn(connection);

    await connection.commit();
    console.log("事务提交成功");

    return result;
  } catch (error) {
    await connection.rollback();
    console.error("事务回滚:", error.message);
    throw error;
  } finally {
    connection.release();
    console.log("连接已释放");
  }
}

/**
 * sql语句执行函数（内部使用）
 * @param {string} sql - SQL语句
 * @param {array} params - 参数数组
 * @param {object} connection - 可选的事务连接
 * @returns {Promise}
 */
function _operation(sql, params = [], connection = null) {
  return new Promise((resolve, reject) => {
    const executeQuery = (conn) => {
      conn.execute(sql, params, (error, result, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }

        // 如果不是事务连接，使用后释放
        if (!connection) {
          conn.release();
          console.log("连接池已释放");
        }
      });
    };

    if (connection) {
      // 使用现有连接（事务中）
      executeQuery(connection);
    } else {
      // 创建新连接
      connect().then(executeQuery).catch(reject);
    }
  });
}

/**
 * where条件拼接函数（内部使用）
 * @param {object} where - 查询条件 {key: value}
 * @param {string} link - 连接条件 'AND' or 'OR'
 * @returns {object} 包含sql和values的对象
 */
function _handleWhereString(where, link = "AND") {
  const conditions = Object.keys(where)
    .map((key) => `${key} = ?`)
    .join(` ${link} `);

  const values = Object.values(where);

  return {
    sql: conditions ? ` WHERE ${conditions}` : "",
    values: values,
  };
}

module.exports = {
  connect,
  executeSql,
  selectSql,
  insertSql,
  updateSql,
  deleteSql,
  executeTransaction,
};
