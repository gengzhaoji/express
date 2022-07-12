const createError = require("http-errors");
const express = require("express"); //加载express模块
const path = require("path"); //路径模块
const cookieParser = require("cookie-parser"); //这就是一个解析Cookie的工具。通过req.cookies可以取到传过来的cookie，并把它们转成对象。
const logger = require("morgan"); //在控制台中，显示req请求的信息
const bodyParser = require("body-parser"); //请求中间层处理post请求体
const app = express();

/**
 * 静态资源
 */
app.use(express.static(path.join(__dirname, "views"))); //页面入口

// 自定义跨域中间件
const allowCors = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Expose-Headers", "Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
};
app.use(allowCors); //使用跨域中间件

// 模板引擎部分
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// 载入中间件
app.use(logger("dev"));
/**
 * post请求数据处理中间件  一定要在挂载路由之前配置
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// token验证
const { secret } = require("./controllers/token");
const { expressjwt } = require("express-jwt");

//验证token是否过期并规定那些路由不需要验证
app.use(
  expressjwt({
    credentialsRequired: true, //对不带Token的请求也进行解析和抛出异常，如果是false，不会对没有token的请求进行解析和抛出异常
    secret, //加密密钥，可换
    algorithms: ["HS256"],
    getToken:  (req) => req.headers?.token
  }).unless({
    //用户第一次登录的时候不需要验证token
    path: ["/service/login"], //不需要验证的接口名称
  })
);

/**
 * node服务器路由模块
 */
const indexRouter = require("./routes/index");
const personnelRouter = require("./routes/personnel");
const vehicleRouter = require("./routes/vehicle");

/**
 * 挂载路由
 */
app.use("/service", indexRouter); //路由
app.use("/service/personnel", personnelRouter); //路由
app.use("/service/vehicle", vehicleRouter); //路由

//请求地址404错误
app.use(function (req, res, next) {
  next(createError(404));
});

// 请求错误
app.use(function (err, req, res, next) {
  //token解析失败导致的错误，过期或不合法
  if (err.name === "UnauthorizedError"){
    return res.send({ status: 401, message: "无效token" });
  }
  return res.send({ status: err.status || 500, message: err.message });
});

/** 未能try-catch Exception 处理 **/
process.on("uncaughtException", function (err) {
  /** 打印错误 **/
  console.log(err);
  /** 打印错误堆栈 **/
  console.log(err.stack);
});

module.exports = app;
