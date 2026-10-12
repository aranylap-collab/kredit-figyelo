export type KreditLine = string | null

declare module 'claude-code' {
  interface PluginState {
    'kredit-figyelo': { text: KreditLine }
  }
}
