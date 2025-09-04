const { executeSql } = require("../connectDB");
const vertoken = require("../token");

module.exports = {
  queryService: function (data) {
    return new Promise((resolve, reject) => {
      executeSql("SELECT * FROM sys_user")
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.error("index>>>>>>>queryService>>>>>>>" + err.message);
          reject();
        });
    });
  },
  loginService: function () {
    return new Promise((resolve, reject) => {
      vertoken.setToken("耿朝继", "001").then((token) => {
        resolve({
          code: 200,
          message: "登录成功",
          token,
          //前端获取token后存储在localStroage中,
          //**调用接口时 设置axios(ajax)请求头Authorization的格式为`Bearer ` +token
        });
      });
    });
  },
};
