import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import OpenAI from 'openai';

class Tool<T extends z.ZodType> {
  protected name: string;
  protected description: string;
  protected schema: T;
  protected execute: (parameters: z.infer<T>) => Promise<string>;

  constructor(
    name: string, 
    description: string, 
    schema: T, 
    execute: (parameters: z.infer<T>) => Promise<string>
  ) {
    this.name = name;
    this.description = description;
    this.schema = schema;
    this.execute = execute;
  }
  
  public async run(parameters: Record<string, any>) {
    // Validate parameters against the schema
    const validatedParams = this.schema.parse(parameters);
    return this.execute(validatedParams);
  }

  public toJSON(): OpenAI.Chat.ChatCompletionTool {
    const jsonSchema = zodToJsonSchema(this.schema);
    
    return {
      type: "function" as const,
      function: {
        name: this.name,
        description: this.description,
        parameters: jsonSchema
      }
    };
  }
}

export default Tool;