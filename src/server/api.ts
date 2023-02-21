/** api 轻量请求 */
const formidable = require("formidable");
const minio = require("@/utils/minio.ts");
const chat = require("@/utils/chatGPT.ts");
const { ERROR_CODE, SUCCESS_CODE } = require("@/assets/global.ts");

module.exports.initAPi = (app) => {
  // minio 初始化
  minio.initMinio("sssh");

  /** 联通性测试 */
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  /** 文件列表获取 */
  app.post("/files", async (req, res) => {
    const files = await minio.getFiles();
    await res.json({
      code: SUCCESS_CODE,
      message: "文件列表获取成功",
      data: files,
    });
  });

  /** 文件上传 */
  app.post("/uploadFile", (req, res, next) => {

    const form = formidable();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }

      try {
        const minioRes = await minio.putObject(
          files.file.filepath,
          files.file.size,
          files.file.originalFilename
        );
        res.json({
          code: SUCCESS_CODE,
          message: "",
          data: minioRes,
        });
      } catch (error) {
        res.json({
          code: ERROR_CODE,
          message: error.toString(),
          data: null,
        });
      }
    });
  });

  /** 图片生成 */
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
};
