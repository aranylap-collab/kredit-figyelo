import { test, expect } from 'claude-code/testing'
import { formatStatus } from './format'

test('kiírja a kereteket és a kontextust', () => {
  const s = formatStatus(
    [
      { kind: 'five_hour', percentUsed: 42, resetsAt: '2026-10-12T16:30:00Z' },
      { kind: 'seven_day', percentUsed: 13 },
    ],
    { window: 200000, tokens: 74000, percent: 37 },
  )
  expect(s).toContain('5ó 42%')
  expect(s).toContain('18:30')
  expect(s).toContain('Hét 13%')
  expect(s).toContain('Kontextus 37%')
})

test('90% fölött figyelmeztető jel', () => {
  expect(formatStatus([{ kind: 'five_hour', percentUsed: 93 }])).toContain('⚠ 5ó 93%')
})

test('adat nélkül nincs szöveg', () => {
  expect(formatStatus([])).toBeUndefined()
})
