import { Agent } from '@mastra/core/agent'
import { datetimeTool } from './tools/datetime'
import { calculatorTool } from './tools/calculator'

export const chatAgent = new Agent({
  id: 'chat-agent',
  name: 'Chat Agent',
  instructions:
    'You are a helpful and friendly AI assistant. You can help with various tasks and answer questions. When users ask for time or calculations, use the available tools.',
  model: 'anthropic/claude-sonnet-4-20250514',
  tools: {
    datetimeTool,
    calculatorTool,
  },
})
