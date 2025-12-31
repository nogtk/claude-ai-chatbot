import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { evaluate } from 'mathjs'

export const calculatorTool = createTool({
  id: 'calculate',
  description: 'Perform mathematical calculations',
  inputSchema: z.object({
    expression: z.string().describe('Mathematical expression to evaluate (e.g., "2 + 2", "sin(pi/2)")'),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
  execute: async (inputData: any) => {
    try {
      const result = evaluate(inputData.expression)
      return {
        result: String(result),
      }
    } catch (error) {
      return {
        result: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  },
})
