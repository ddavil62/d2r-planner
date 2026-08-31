import type { EnemyPresetId, EnemySettings } from '../types'

export const ENEMY_PRESETS: Record<Exclude<EnemyPresetId, 'custom'>, EnemySettings> = {
  normal: { presetId: 'normal', name: '지옥 일반 적', level: 85, life: 12000, defense: 1400, physicalResist: 0, fireResist: 33, coldResist: 33, lightningResist: 33, poisonResist: 33, magicResist: 0, playerCount: 1 },
  elite: { presetId: 'elite', name: '지옥 정예 적', level: 87, life: 60000, defense: 1900, physicalResist: 33, fireResist: 50, coldResist: 50, lightningResist: 50, poisonResist: 50, magicResist: 0, playerCount: 1 },
  boss: { presetId: 'boss', name: '지옥 보스', level: 88, life: 500000, defense: 2500, physicalResist: 50, fireResist: 50, coldResist: 50, lightningResist: 50, poisonResist: 50, magicResist: 0, playerCount: 1 },
}

export const DEFAULT_ENEMY: EnemySettings = { ...ENEMY_PRESETS.boss }
