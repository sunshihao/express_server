/** minio */
const Minio = require("minio");
const Fs = require("fs");
const DEFINE_BUCKET_NAME = "sssh";

let bucketName = DEFINE_BUCKET_NAME;

let minioClient;

/**
 * minio初始化,并检测存储桶sssh是否存在
 */
const initMinio = async (dbName = DEFINE_BUCKET_NAME) => {
  bucketName = dbName;

  try {
    /** 根据miniojs的思想一定是nodejs express的服务器端 */
    if (!minioClient)
      minioClient = await new Minio.Client({
        endPoint: "82.157.139.89",
        port: 9000,
        useSSL: false,
        accessKey: "minio",
        secretKey: "minio123456AS",
      });

    const isExistBucket = await checkBucketExists();

    if (!isExistBucket) {
      console.warn(`warn`, `存储桶${bucketName}不存在!`);
      return;
    }

    const buckets = await listBuckets();

    console.log("buckets_buckets_buckets", buckets);
  } catch (err) {
    console.error(`err`, `minio初始化失败${err}`);
  }
};

/**
 * 验证 bucket 是否存在
 * @param {object} dbName 数据库的名字
 * @return {object} bucket是否存在boolearn
 */
const checkBucketExists = () => {
  return minioClient?.bucketExists(bucketName);
};

/**
 * 获取
 * @param {object} dbName 数据库的名字
 * @return {object} bucket是否存在boolean
 * */
const listBuckets = () => {
  return minioClient?.listBuckets();
};

/**
 * 获取存储桶中文件
 * @param {object} fileName 文件名称
 * @return {Stream} 返回文件流
 * */
const getObject = (fileName) => {
  let size = 0;
  return new Promise((resolve, reject) => {
    minioClient?.getObject(bucketName, fileName, function (err, dataStream) {
      if (err) {
        console.log(err);
        return err;
      }
      dataStream.on("data", function (chunk) {
        size += chunk.length;
      });
      dataStream.on("end", function () {
        console.log("End. Total size = " + size);
        resolve(dataStream);
      });
      dataStream.on("error", function (err) {
        console.log(err);
        reject(err);
      });
    });
  });
};

/**
 * 获取存储桶中文件URL
 * @param {object} fileName 文件名称
 * @return {Promise} 返回文件URL
 */
const presignedUrl = (fileName = "") => {
  let url = null;
  minioClient?.presignedUrl(
    "GET",
    bucketName,
    fileName,
    1000,
    {
      prefix: "data",
      "max-keys": 1000,
    },
    function (err, presignedUrl) {
      if (err) return console.log(err);
      url = presignedUrl;
    }
  );
  return url;
};

/**
 * 获取存储桶中文件URL
 * @param {object} fileName 文件名称
 * @return {Promise} 返回文件URL
 */
const listObjects = (prefix = "") => {
  return new Promise((resolve, reject) => {
    let data = [];
    const stream = minioClient?.listObjects(bucketName, prefix, true);
    stream.on("data", function (obj) {
      data.push(obj);
    });
    stream.on("end", function (obj) {
      resolve(data);
    });
    stream.on("error", function (err) {
      console.log(err);
      reject(data);
    });
  });
};

/**
 * 获取存储桶中文件list
 * @return {Array} 返回文件数组
 */
const getFiles = async () => {
  let objArr = await listObjects();
  if (objArr && objArr.length >= 0)
    objArr = objArr.map((item) => {
      const url = presignedUrl(item?.name);
      return {
        ...item,
        url: url || "111",
      };
    });

  return objArr;
};

/**
 * 文件上传
 * @param {fileStream} fileStream 文件名称
 * @return {object}
 */
const putObject = (filePath, fileSize, fileName) => {

  const fileStream = Fs.createReadStream(`${filePath}`)

  return minioClient.putObject(bucketName, fileName, fileStream, fileSize);
};

module.exports = {
  initMinio,
  getObject,
  presignedUrl,
  listObjects,
  getFiles,
  putObject,
};
