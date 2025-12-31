import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export const datetimeTool = createTool({
  id: 'get_current_datetime',
  description: 'Get the current date and time',
  inputSchema: z.object({
    timezone: z.string().optional().describe('Timezone (e.g., Asia/Tokyo)'),
  }),
  outputSchema: z.object({
    datetime: z.string(),
  }),
  execute: async (inputData: any) => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      timeZone: inputData.timezone || 'Asia/Tokyo',
      dateStyle: 'full',
      timeStyle: 'long',
    }
    return {
      datetime: new Intl.DateTimeFormat('ja-JP', options).format(now),
    }
  },
})
