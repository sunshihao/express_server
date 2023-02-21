/**  websocket */
const WebSockets = require("ws");
const { chatAI } = require("./chatGPT.ts");
const https = require("node:https");
const fs = require("node:fs");

const path = require("path");
const isSSL = false;

/** 对websocket进行初始化 */
exports.initSocekt = (app) => {
  const options = {
    cert: fs.readFileSync(`${__dirname}/../assets/file/dhc.crt`), // 证书文件路径
    key: fs.readFileSync(`${__dirname}/../assets/file/dhc.key`), // 私钥文件路径
  };

  // 配置 HTTPS 服务器
  let wss;
  let server;
  if (isSSL) {
    server = https.createServer(options);
    wss = new WebSockets.Server({ server });
  } else {
    wss = new WebSockets.Server({ port: 8080 });
  }

  // 当WebSocket连接建立时触发的事件处理程序
  wss.on("connection", function connection(ws) {
    console.log("WebSocket 连接已建立。");

    // 当WebSocket接收到消息时触发的事件处理程序
    ws.on("message", async function incoming(data) {
      if (data.toString() !== 'heartbeat') {
        //   将消息广播给所有连接的WebSocket客户端
        wss.clients.forEach(async function each(client) {
          if (client.readyState === WebSockets.OPEN) {
            console.log(`收到消息：${data}`);
            client.send(
              Buffer.from(
                JSON.stringify({
                  code: "200",
                  user: "SSSH",
                  content: data.toString(),
                  date: "2023-02-20 13:45",
                })
              )
            );

            // 消息传递是通过Buffer来互相进行传递的
            const answerAI = await chatAI(data);

            if (answerAI && answerAI.choices && answerAI.choices.length > 0) {
              client.send(
                Buffer.from(
                  JSON.stringify({
                    code: "200",
                    user: "AI",
                    content: answerAI.choices[0].text,
                    message: "请求成功",
                    date: "2023-02-20 13:45",
                  })
                )
              );
            } else {
              client.send(
                Buffer.from(
                  JSON.stringify({
                    code: "500",
                    user: "AI",
                    content: "",
                    message: JSON.stringify(answerAI),
                    date: "2023-02-20 13:45",
                  })
                )
              );
            }
          }
        });
      } else {
        ws.send(Buffer.from(JSON.stringify({
          code: "300",
          content: "连接正常",
        })))
      }
    });

    // 当WebSocket断开连接时触发的事件处理程序
    ws.on("close", function close() {
      console.log("WebSocket 连接已关闭。");
    });
  });

  if (isSSL) {
    server.listen(8080);
  }
};
