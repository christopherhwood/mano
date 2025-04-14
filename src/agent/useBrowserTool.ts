import Tool from "./Tool.js";
import env from '../config/env.js';
import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";

const useBrowserSchema = z.object({
  url: z.string(),
  query: z.string(),
});

export default class UseBrowserTool extends Tool<typeof useBrowserSchema> {
  constructor() {
    super("useBrowser", env.USE_BROWSER_TOOL_DESCRIPTION, useBrowserSchema, async (parameters) => {
      await this.stagehand.init();
      await this.stagehand.page.goto(parameters.url);
      const agent = this.stagehand.agent({
        provider: "openai",
        model: "computer-use-preview",
        instructions: env.USE_BROWSER_TOOL_PROMPT,

        options: {
          apiKey: env.OPENAI_API_KEY,
        }
      });

      const response = await agent.execute(parameters.query);
      console.log('browser tool response: ', response);
      if (!response.success) {
        return 'Browser agent failed to find information';
      }
      if (!response.completed && !response.message) {
        return 'Browser agent failed to find information';
      }
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