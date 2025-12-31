import { describe, it, expect } from 'vitest'
import { datetimeTool } from '@/src/lib/mastra/tools/datetime'

describe('datetimeTool', () => {
  it('should return current datetime in Asia/Tokyo timezone by default', async () => {
    const result = await datetimeTool.execute({
      timezone: undefined,
    } as any)

    expect(result).toHaveProperty('datetime')
    expect(typeof result.datetime).toBe('string')
    expect(result.datetime.length).toBeGreaterThan(0)
  })

  it('should return datetime with specified timezone', async () => {
    const result = await datetimeTool.execute({
      timezone: 'America/New_York',
    } as any)

    expect(result).toHaveProperty('datetime')
    expect(typeof result.datetime).toBe('string')
  })

  it('should include both date and time in response', async () => {
    const result = await datetimeTool.execute({
      timezone: 'Asia/Tokyo',
    } as any)

    // Response should contain Japanese date/time format
    expect(result.datetime).toMatch(/\d{4}年/)
  })

  it('should handle invalid timezone gracefully', async () => {
    const result = await datetimeTool.execute({
      timezone: 'Invalid/Timezone',
    } as any)

    // Should still return a string, even with invalid timezone
    expect(typeof result.datetime).toBe('string')
  })
})
