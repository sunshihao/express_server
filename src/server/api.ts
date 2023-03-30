/** api 轻量请求 */
const formidable = require("formidable");
const chat = require("@/utils/chatGPT.ts");
const { ERROR_CODE, SUCCESS_CODE } = require("@/assets/global.ts");
const loginAPi = require("./login.ts");
const minioApi = require("./minio.ts");

// 调整结构使用总分的方式进行下发 避免ts的检验报错
const initAPi = (app) => {
  // 登录接口初始化
  loginAPi.initLoginAPi(app, { SUCCESS_CODE, ERROR_CODE });

  minioApi.initMinioAPi(app, { SUCCESS_CODE, ERROR_CODE });

  /** 联通性测试 */
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  /** chat 图片生成 */
  app.post("/generateImage", async (req, res) => {
    console.log("Body:", req.body);

    if (!req.body.describe) {
      res.json({
        code: ERROR_CODE,
        message: "请按格式输入关键描述语",
      });
    }

    const imgRes = await chat.generateImage(req.body.describe);

    await res.json({
      code: SUCCESS_CODE,
      message: "图片生成成功",
      data: imgRes,
    });
  });

  /** 接收 SECRET KEY */
  app.post("/generateImage", async (req, res) => {
    // 对接收到的 SECRET KEY 进行解密
    const res_format = AES_SECRET.decrypt(req.body);

    const resKey = JSON.parse(res_format);

    console.log("传入SECRET KEY: ", resKey);

    global.SECRET_KEY = resKey;

    await res.json({
      code: SUCCESS_CODE,
      message: "SECRET KEY 获取成功",
      success: true,
      data: "",
    });
  });
};

module.exports = {
  initAPi,
};
