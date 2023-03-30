require('module-alias/register');
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const api = require("@/server/api.ts"); 
const sql = require("@/utils/mysql.ts");
const socket = require("@/utils/websocket.ts"); 

const swaggerDocument = require('./swagger.json');

const PORT = 5000

// 设置CORS
app.all('*',function (req, res, next) {
  // res.header('Access-Control-Allow-Origin','http://localhost:3000'); //当允许携带cookies此处的白名单不能写’*’
  res.header('Access-Control-Allow-Origin','http://127.0.0.1:3000'); //当允许携带cookies此处的白名单不能写’*’  虽然说是不能写* 但是还是好用啊 也就是要注意这个地方可能不一样

  res.header('Access-Control-Allow-Headers','content-type,Content-Length, Authorization,Origin,Accept,X-Requested-With'); //允许的请求头
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT'); //允许的请求方法
  res.header('Access-Control-Allow-Credentials',true);  //允许携带cookies
  next();
});

// 使用中间件解析post请求的
app.use(bodyParser.json()); // "Content-Type": "application/json"
app.use(bodyParser.text({ type: 'text/html' })); // "Content-Type": "text/html"

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)

  // 初始化请求
  api.initAPi(app);

  // 初始化websocket
  socket.initSocekt(app);

  // 初始化MYSQL连接
  // sql.initMySQL();
})

