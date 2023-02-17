/** chatGPT应用 */
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

exports.generateImage = async (des) => {
  const response = await openai.createImage({
    prompt: des,
    n: 1,
    size: "1024x1024",
  });
  return response.data;
};
