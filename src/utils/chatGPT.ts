/** chatGPT应用 */
const { Configuration, OpenAIApi } = require("openai");
const { OPENAI } = require("@/assets/global.ts");

const configuration = new Configuration({
  apiKey: OPENAI.APIKEY,
});

const openai = new OpenAIApi(configuration);

// AI图片生成
exports.generateImage = async (des) => {
  try {
    const response = await openai.createImage({
      prompt: des,
      n: 1,
      size: "1024x1024",
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

// AI Chat
exports.chatAI = async (chatInfo) => {

  console.log('chatInfo---', chatInfo.toString('utf8'))
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: chatInfo.toString('utf8'), // 初始文本
      temperature: 0.9, // 用于控制生成文本的随机性和多样性。值越高，生成的文本越随机、多样
      max_tokens: 2048, // 限制生成文本的长度,已经是最大限制了
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"] // 指定生成文本时应停止的单词或短语
    });
    // console.log('response response', response)
    return response.data;
  } catch (error) {
    return error;
  }
};


