import type { SessionRateLimit, SessionContextUsage } from 'claude-code'

import type { Chip } from '../types'
import { resetText } from './format'
export type { Chip }

export function chipText(c: Chip): string {
  return `${c.level === 'high' ? '⚠ ' : ''}${c.label} ${c.percent}%${c.reset ? ` (↺ ${c.reset})` : ''}`
}

const LABELS: Record<string, string> = {
  five_hour: '5 óra',
  seven_day: 'Hét',
  spend_limit: 'Keret',
}

export function level(percent: number): Chip['level'] {
  if (percent >= 90) return 'high'
  if (percent >= 70) return 'warn'
  return 'ok'
}

export function chips(
  rateLimits: readonly SessionRateLimit[],
  context?: SessionContextUsage,
): Chip[] {
  const out: Chip[] = rateLimits.map(r => {
    const reset = resetText(r.kind, r.resetsAt)
    return {
      label: LABELS[r.kind] ?? r.kind,
      percent: r.percentUsed,
      level: level(r.percentUsed),
      ...(reset ? { reset } : {}),
    }
  })
  if (context?.percent !== undefined) {
    const p = Math.round(context.percent)
    out.push({ label: 'Kontextus', percent: p, level: level(p) })
  }
  return out
}

// Erős, telített színek fehér felirattal: világos és sötét témán is jól látszik.
export const FILL: Record<Chip['level'], string> = {
  ok: '#16a34a',
  warn: '#ea580c',
  high: '#dc2626',
}
