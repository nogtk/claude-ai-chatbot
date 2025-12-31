import { describe, it, expect } from 'vitest'
import { calculatorTool } from '@/src/lib/mastra/tools/calculator'

describe('calculatorTool', () => {
  it('should perform simple addition', async () => {
    const result = await calculatorTool.execute({
      expression: '2 + 2',
    } as any)

    expect(result.result).toBe('4')
  })

  it('should perform subtraction', async () => {
    const result = await calculatorTool.execute({
      expression: '10 - 3',
    } as any)

    expect(result.result).toBe('7')
  })

  it('should perform multiplication', async () => {
    const result = await calculatorTool.execute({
      expression: '5 * 3',
    } as any)

    expect(result.result).toBe('15')
  })

  it('should perform division', async () => {
    const result = await calculatorTool.execute({
      expression: '10 / 2',
    } as any)

    expect(result.result).toBe('5')
  })

  it('should handle mathematical functions', async () => {
    const result = await calculatorTool.execute({
      expression: 'sqrt(16)',
    } as any)

    expect(result.result).toBe('4')
  })

  it('should handle complex expressions', async () => {
    const result = await calculatorTool.execute({
      expression: '(10 + 5) * 2',
    } as any)

    expect(result.result).toBe('30')
  })

  it('should handle invalid expressions gracefully', async () => {
    const result = await calculatorTool.execute({
      expression: 'invalid expression !@#$',
    } as any)

    expect(result.result).toContain('Error')
  })

  it('should support trigonometric functions', async () => {
    const result = await calculatorTool.execute({
      expression: 'sin(0)',
    } as any)

    expect(result.result).toBe('0')
  })
})
