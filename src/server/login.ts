const mysqlU = require("@/utils/mysql.ts");

module.exports.initLoginAPi = (app) => {
  mysqlU.initMySQL();

  /** 获取登录信息 */
  app.post("/login", async (req, res) => {

    res.set('Access-Control-Allow-Origin', '*');
    res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // res.set('ncc', 'whoami')


    const ressql = await mysqlU.queryUser(req.body);

    console.log('ressqlressqlressql', ressql)

    await res.json(ressql);
  });
};
