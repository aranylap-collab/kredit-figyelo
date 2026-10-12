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

import { chips, chipText } from './band'

test('sáv: színszint a százalék szerint', () => {
  const c = chips(
    [
      { kind: 'five_hour', percentUsed: 42, resetsAt: '2026-10-12T23:40:00Z' },
      { kind: 'seven_day', percentUsed: 75, resetsAt: '2026-10-15T07:00:00Z' },
      { kind: 'spend_limit', percentUsed: 95 },
    ],
    { window: 200000, percent: 37.4 },
  )
  expect(c.map(x => x.level)).toEqual(['ok', 'warn', 'high', 'ok'])
  expect(c[3]).toEqual({ label: 'Kontextus', percent: 37, level: 'ok' })
  expect(chipText(c[0])).toBe('5 óra 42% (↺ 01:40)')
  expect(chipText(c[1])).toBe('Hét 75% (↺ okt. 15. 09:00)')
  expect(chipText(c[2])).toBe('⚠ Keret 95%')
})
