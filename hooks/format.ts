import type { SessionRateLimit, SessionContextUsage } from 'claude-code'

const LABELS: Record<string, string> = {
  five_hour: '5ó',
  seven_day: 'Hét',
  spend_limit: 'Keret',
}

const TZ = 'Europe/Budapest'

function resetText(kind: string, iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  try {
    const opts: Intl.DateTimeFormatOptions =
      kind === 'five_hour'
        ? { hour: '2-digit', minute: '2-digit', timeZone: TZ }
        : { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: TZ }
    return d.toLocaleString('hu-HU', opts)
  } catch {
    return iso.slice(5, 16).replace('T', ' ') + ' UTC'
  }
}

export function formatStatus(
  rateLimits: readonly SessionRateLimit[],
  context?: SessionContextUsage,
): string | undefined {
  const parts: string[] = []
  for (const r of rateLimits) {
    const label = LABELS[r.kind] ?? r.kind
    const warn = r.percentUsed >= 90 ? '⚠ ' : ''
    const reset = resetText(r.kind, r.resetsAt)
    parts.push(`${warn}${label} ${r.percentUsed}%${reset ? ` (↺ ${reset})` : ''}`)
  }
  if (context?.percent !== undefined) {
    parts.push(`Kontextus ${Math.round(context.percent)}%`)
  }
  return parts.length ? parts.join(' · ') : undefined
}
