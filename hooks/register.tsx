import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'
import { formatStatus } from './format'
import { chips, chipText, FILL } from './band'

const state = atom({ plugin: 'kredit-figyelo', key: 'chips' } as const, [])

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    try {
      const u = await $.session.usage()
      $.ui.status(formatStatus(u.rateLimits, u.context) ?? 'Keret: első válasz után frissül')
      await update($, state, () => chips(u.rateLimits, u.context))
    } catch {
      // a státuszsor nem kritikus
    }
    return result
  })

  on('session.measure', async ($, e, next) => {
    const result = await next(e)
    const text = formatStatus(e.rateLimits, e.context)
    if (text) $.ui.status(text)
    await update($, state, () => chips(e.rateLimits, e.context))
    if (e.changed.includes('rateLimits')) {
      const high = e.rateLimits.find(r => r.percentUsed >= 90)
      if (high) $.ui.toast(`Figyelem: a(z) ${high.kind === 'five_hour' ? '5 órás' : high.kind === 'seven_day' ? 'heti' : high.kind} keret ${high.percentUsed}%-on áll.`)
    }
    return result
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const list = await read($, state)
    if (e.props.hasSurvey || list.length === 0) return next(e)

    const { Box, Text } = $.ui.resolve(e)
    return (
      <Box flexDirection="row" flexWrap="wrap" gap={1}>
        {list.map(c => (
          <Text bold color="#ffffff" backgroundColor={FILL[c.level]}>
            {` ${chipText(c)} `}
          </Text>
        ))}
      </Box>
    )
  })
}
