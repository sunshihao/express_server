const express = require('express');
const swaggerUi = require('swagger-ui-express');
const api = require("./api.ts"); 
const sql = require("./mysql.ts");
const swaggerDocument = require('./swagger.json');

const app = express();

const PORT = 5000

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)

  // 初始化请求
  api.initAPi(app);

  // 初始化MYSQL连接
  // sql.initMySQL();
})

