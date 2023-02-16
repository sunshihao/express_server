/** api 轻量请求 */
const formidable = require("formidable");
const minio = require("./minio.ts");
const SUCCESS_CODE = "200";
const ERROR_CODE = "500";

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


    // console.log('req------------', req)

    const form = formidable();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }
      console.log("parseparseparse", files, fields);

      
      try {
        const minioRes = await minio.putObject(
          files.file.filepath,
          files.file.size,
          files.file.originalFilename
        );
        res.json({
          code: SUCCESS_CODE,
          message: '',
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
};
