export type Chip = { label: string; percent: number; level: 'ok' | 'warn' | 'high'; reset?: string }

declare module 'claude-code' {
  interface PluginState {
    'kredit-figyelo': { chips: Chip[] }
  }
}
