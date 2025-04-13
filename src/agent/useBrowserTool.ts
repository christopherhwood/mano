import Tool from "./Tool.js";
import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";

const useBrowserSchema = z.object({
  url: z.string(),
  query: z.string(),
});

export default class UseBrowserTool extends Tool<typeof useBrowserSchema> {
  constructor() {
    super("useBrowser", "Use a browser to navigate websites and find information", useBrowserSchema, async (parameters) => {
      await this.stagehand.init();
      await this.stagehand.page.goto(parameters.url);
      const agent = this.stagehand.agent({
        provider: "openai",
        model: "computer-use-preview",
        instructions: `You are a helpful assistant that can use a web browser.
	Do not ask follow up questions, the user will trust your judgement.`,

        options: {
          apiKey: process.env.OPENAI_API_KEY,
        }
      });

      const response = await agent.execute(parameters.query);
      return response.message;
    });
  }

  stagehand = new Stagehand({
    env: "BROWSERBASE",
    apiKey: process.env.BROWSERBASE_API_KEY,
    projectId: process.env.BROWSERBASE_PROJECT_ID,

    browserbaseSessionCreateParams: {
      projectId: process.env.BROWSERBASE_PROJECT_ID!,
      browserSettings: {
        blockAds: true,
        viewport: {
          width: 1920,
          height: 1080,
        },
      },
    },
  });
}