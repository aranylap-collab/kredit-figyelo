import { atom, read, update } from 'claude-code'
import type { Register, EngineInterface } from 'claude-code'
import { formatStatus } from './format'
import type { KreditLine } from '../types'

const line = atom({ plugin: 'kredit-figyelo', key: 'text' } as const, null as KreditLine)
const WAITING = 'Kredit: az első válasz után frissül'

async function show($: EngineInterface, text: string) {
  $.ui.status(text)
  await update($, line, () => text)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    try {
      const u = await $.session.usage()
      await show($, formatStatus(u.rateLimits, u.context) ?? WAITING)
    } catch {
      await show($, WAITING)
    }
    return result
  })

  on('session.measure', async ($, e, next) => {
    const result = await next(e)
    const text = formatStatus(e.rateLimits, e.context)
    if (text) await show($, text)
    if (e.changed.includes('rateLimits')) {
      const high = e.rateLimits.find(r => r.percentUsed >= 90)
      if (high) {
        const name = high.kind === 'five_hour' ? '5 órás' : high.kind === 'seven_day' ? 'heti' : high.kind
        $.ui.toast(`Figyelem: a(z) ${name} keret ${high.percentUsed}%-on áll.`)
      }
    }
    return result
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const text = await read($, line)
    if (!text || e.props.hasSurvey) return next(e)
    const { Box, Text } = $.ui.resolve(e)
    return (
      <Box>
        <Text dimColor>{text}</Text>
      </Box>
    )
  })
}
