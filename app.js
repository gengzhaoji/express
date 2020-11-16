var createError = require('http-errors');
var express = require('express');//加载express模块
var path = require('path');//路径模块
var cookieParser = require('cookie-parser');//这就是一个解析Cookie的工具。通过req.cookies可以取到传过来的cookie，并把它们转成对象。
var logger = require('morgan');//在控制台中，显示req请求的信息
var bodyParser = require('body-parser');//请求中间层处理post请求体

var app = express();

// 自定义跨域中间件
var allowCors = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
};
app.use(allowCors);//使用跨域中间件

// 模板引擎部分
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// 载入中间件
app.use(logger('dev'));
/**
 * post请求数据处理中间件  一定要在挂载路由之前配置
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
/**
 * 静态资源
 */
app.use(express.static(path.join(__dirname, 'public')));//页面入口

/**
 * node服务器路由模块
 */
var indexRouter = require('./routes/index');
var personnelRouter = require('./routes/personnel');
var vehicleRouter = require('./routes/vehicle')

/**
 * 挂载路由
 */
app.use('/service/index', indexRouter);//路由
app.use('/service/personnel', personnelRouter);//路由
app.use('/service/vehicle', vehicleRouter);//路由

//请求地址404错误
app.use(function (req, res, next) {
  next(createError(404));
});

// 请求错误
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/** 未能try-catch Exception 处理 **/
process.on('uncaughtException', function (err) {
  /** 打印错误 **/
  console.log(err);
  /** 打印错误堆栈 **/
  console.log(err.stack);
});

module.exports = app;
