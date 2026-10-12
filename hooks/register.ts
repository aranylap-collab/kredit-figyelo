import type { Register } from 'claude-code'
import { formatStatus } from './format'

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    try {
      const u = await $.session.usage()
      $.ui.status(formatStatus(u.rateLimits, u.context) ?? 'Keret: első válasz után frissül')
    } catch {
      // a státuszsor nem kritikus
    }
    return result
  })

  on('session.measure', async ($, e, next) => {
    const result = await next(e)
    const text = formatStatus(e.rateLimits, e.context)
    if (text) $.ui.status(text)
    if (e.changed.includes('rateLimits')) {
      const high = e.rateLimits.find(r => r.percentUsed >= 90)
      if (high) $.ui.toast(`Figyelem: a(z) ${high.kind === 'five_hour' ? '5 órás' : high.kind === 'seven_day' ? 'heti' : high.kind} keret ${high.percentUsed}%-on áll.`)
    }
    return result
  })
}
