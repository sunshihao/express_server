// 约定: 关于返回的成功状态均在类似此类中进行处理 引入的三方或其他方法仅做数据处理 不参与数据封装
const mysqlU = require("@/utils/mysql.ts");
const JWT = require("@/utils/jwt.ts");
const AES_SECRET = require("@/utils/aes.ts");

module.exports.initLoginAPi = (app) => {
  mysqlU.initMySQL();

  /** 获取登录信息 */
  app.post("/login", async (req, res) => {
    // 将数据进行解密处理 传输数据往返进行加密处理
    const res_format = AES_SECRET.decrypt(req.body.replaceAll('"', "")); // text的参数在带回时会多两个"号~~

    const res_sql = await mysqlU.queryUser(res_format);

    if (res_sql.code === "200") {
      // 生成jwt token数据并返回给cookie的参数禁止前端进行操作
      // TODO 登录单独走非对称加密 , AES 密钥进行非对称加密
      const token = JWT.generateToken(res_sql.data);
      res.cookie("authToken", token, { maxAge: 3600000, httpOnly: true });

      await res.json({
        code: res_sql.code,
        message: "登录成功",
        success: true,
        data: "",
      });
    } else {
      await res.json({
        code: res_sql.code,
        message: `登录失败${res_sql.data}`,
        success: false,
        data: "",
      });
    }
  });
};
