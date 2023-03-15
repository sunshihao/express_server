const mysqlU = require("@/utils/mysql.ts");

const JWT = require("@/utils/jwt.ts");

module.exports.initLoginAPi = (app) => {
  mysqlU.initMySQL();

  /** 获取登录信息 */
  app.post("/login", async (req, res) => {
    const ressql = await mysqlU.queryUser(req.body);

    if (ressql.code === "200") {
      const token = JWT.generateToken({
        id: "1",
        name: "sssh",
        email: "sssh@dhc.com.cn",
      });
      res.cookie("authToken", token, { maxAge: 3600000, httpOnly: true });
    }

    await res.json(ressql);
  });
};
