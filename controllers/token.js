const jwt = require("jsonwebtoken");
const secret = "token"; //签名

//登录接口 生成token的方法
const setToken = function (user_name, user_id) {
  return new Promise((resolve, reject) => {
    //expiresln 设置token过期的时间
    //{ user_name: user_name, user_id: user_id } 传入需要解析的值（ 一般为用户名，用户id 等）
    const token = jwt.sign({ user_name: user_name, user_id: user_id }, secret, {expiresIn: 60 * 60 * 24});
    resolve(token);
  });
};

module.exports = {
  secret,
  setToken,
};
