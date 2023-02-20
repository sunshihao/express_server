/**  websocket 代码*/
const WebSockets = require("ws");
const { chatAI } = require("./chatGPT.ts");

const wss = new WebSockets.Server({ port: 8080 });

// 当WebSocket连接建立时触发的事件处理程序
wss.on("connection", function connection(ws) {
  console.log("WebSocket 连接已建立。");

  // 当WebSocket接收到消息时触发的事件处理程序
  ws.on("message", async function incoming(data) {
    console.log(`收到消息：${data}`);

    if (data) {
      //   将消息广播给所有连接的WebSocket客户端
      wss.clients.forEach(async function each(client) {
        if (client.readyState === WebSockets.OPEN) {
          client.send(data);

          // 消息传递是通过Buffer来互相进行传递的
          const answerAI = await chatAI(data);

          console.log("recver answerAI: ", answerAI);

          if (answerAI) {
            client.send(Buffer.from(`AI: ${answerAI.choices[0].text}`, "utf8"));
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
