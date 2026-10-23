const {
    BedrockRuntimeClient,
    InvokeModelCommand
  } = require("@aws-sdk/client-bedrock-runtime");
  
  const client =
  new BedrockRuntimeClient({
    region: "ap-northeast-1"
  });
  
  async function generateTasks(goal) {
  
    const prompt = `
  目的を達成するためのタスクを、箇条書きで5つ生成してください。
  
  ${goal}
  何も説明しない
  markdownは禁止
  \`\`\`.は禁止
  JSON形式で出力してください。:
  
  {
    "tasks":[
      "task 1",
      "task 2"
    ]
  }
  `;
  
    const command =
    new InvokeModelCommand({
  
      modelId:
      "apac.amazon.nova-micro-v1:0",
  
      contentType:
      "application/json",
  
      accept:
      "application/json",
  
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });
  
    const response =
      await client.send(command);
  
    const body =
      JSON.parse(
        new TextDecoder()
        .decode(response.body)
      );
  
    return JSON.parse(
      body.output.message.content[0].text
    );
  }
  
  module.exports = generateTasks;