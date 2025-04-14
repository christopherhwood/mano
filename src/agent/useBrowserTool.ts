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
    super("useBrowser", "Use a browser to navigate websites and find information. Deliver queries as instructions to the browser agent in fully formed sentences. You almost always want to start with a google search url, for example 'https://www.google.com/search?q=best+restaurants+in+new+york+reddit'. Don't specify the site url in the google query, if you want to specify a website just name the site in the query.", useBrowserSchema, async (parameters) => {
      await this.stagehand.init();
      await this.stagehand.page.goto(parameters.url);
      const agent = this.stagehand.agent({
        provider: "openai",
        model: "computer-use-preview",
        instructions: `You are a helpful assistant that can use a web browser.
	Do not ask follow up questions, the user will trust your judgement. Do your best to always provide a response and answer the user's question. Incomplete information is better than no information.`,

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