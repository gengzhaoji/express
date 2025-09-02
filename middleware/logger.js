
/**
 * 错误日志中间件
 * @param {Object} req 前端的参数
 * @param {Object} res 返回给前端的数据
 * @param {Function} next 是否执行下一个中间件，如何不执行，则不会执行后续的中间件和路由
 */
const log4js = require('log4js');

log4js.configure({
    appenders: {
        out: { type: 'stdout',layout:{
            type: 'colored',
            pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] - %m%n'
        }},
        file:{
            type: 'file', filename: 'logs/server.log'
        }
    },
    categories: {
        default: { appenders: ['out', 'file'], level: 'debug' }
    }
})

const logger = log4js.getLogger('default'); // 获取日志对象

// 每个请求都会经过这个中间件
module.exports = (req, res, next) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
}