import OpenAI from "openai";
import FindRestaurantTool from "./findRestaurantTool.js";
import UseBrowserTool from "./useBrowserTool.js";

export class RestaurantAgent {
  private llm: OpenAI;
  private findRestaurantTool: FindRestaurantTool;
  private useBrowserTool: UseBrowserTool;
  constructor() {
    this.llm = new OpenAI({baseURL: "https://api.groq.com/openai/v1", apiKey: process.env.GROQ_API_KEY });
    this.findRestaurantTool = new FindRestaurantTool();
    this.useBrowserTool = new UseBrowserTool();
  }

  async run(userQuery: string) {
    const conversation: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: "You are a helpful assistant that can find restaurants and use a browser to navigate websites and find information like menu items, prices, and reviews. You prefer to use websites like Eater, The Infatuation, and Reddit to find reviews and recommendations. You always answer the user with several options, indicating your recommendation of the best option and why you recommend it.",
      },
      {
        role: "user",
        content: userQuery,
      },
    ];
    return this.loop(conversation);
  }
  
  async loop(conversation: OpenAI.Chat.ChatCompletionMessageParam[]): Promise<string> {
    const response = await this.llm.chat.completions.create({
      model: "deepseek-r1-distill-llama-70b",
      messages: conversation,
      temperature: 0.3,
      max_tokens: 4000,
      tools: [
        this.findRestaurantTool.toJSON(),
        this.useBrowserTool.toJSON(),
      ],
      tool_choice: "auto",
    });

    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (toolCall) {
      const toolName = toolCall.function.name;
      const toolArgs = JSON.parse(toolCall.function.arguments);
      
      if (toolName === "findRestaurant") {
        const result = await this.findRestaurantTool.run(toolArgs);
        conversation.push(response.choices[0].message);
      } else if (toolName === "useBrowser") {
        const result = await this.useBrowserTool.run(toolArgs);
        conversation.push(response.choices[0].message);
      } else {
        throw new Error(`Unknown tool: ${toolName}`);
      }

      return this.loop(conversation);
    }

    return response.choices[0].message.content ?? "Sorry, something went wrong";
  }
}