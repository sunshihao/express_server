// 约定: 关于返回的成功状态均在类似此类中进行处理 引入的三方或其他方法仅做数据处理 不参与数据封装
const minio = require("@/utils/minio.ts");

module.exports.initMinioAPi = (app, { SUCCESS_CODE, ERROR_CODE }) => {
  // minio 初始化
  minio.initMinio("sssh");

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
};
