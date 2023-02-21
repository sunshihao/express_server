/**  websocket */
const WebSockets = require("ws");
const { chatAI } = require("./chatGPT.ts");

const wss = new WebSockets.Server({ port: 8080 });

// 当WebSocket连接建立时触发的事件处理程序
wss.on("connection", function connection(ws) {
  console.log("WebSocket 连接已建立。");

  // 当WebSocket接收到消息时触发的事件处理程序
  ws.on("message", async function incoming(data) {
    if (data) {
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

          console.log("recver answerAI: ", answerAI);

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
    }
  });

  // 当WebSocket断开连接时触发的事件处理程序
  ws.on("close", function close() {
    console.log("WebSocket 连接已关闭。");
  });
});
