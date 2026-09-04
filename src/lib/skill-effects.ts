import { RAW_SKILL_EFFECTS } from '../data/skill-effects.generated'
import type { SkillDefinition } from '../types'

export interface SkillEffectRow {
  label: string
  current: string
  next?: string
}

type RawEffect = (typeof RAW_SKILL_EFFECTS)[keyof typeof RAW_SKILL_EFFECTS]

const elementalNames: Record<string, string> = { fire: '화염', cold: '냉기', ltng: '번개', pois: '독', mag: '마법' }
const ignoredParam = /frame|anim|mode|id|delay|divisor|server|calc|state|offset|velocity|airborn|rollback|sub-?missile|activation/i
const usefulParam = /damage|HP|mana|stamina|attack rating|attack speed|defense|armor|resistance|duration|length|radius|range|chance|target|missile|absorb/i

function progression(base: number, increments: number[], level: number): number {
  if (level <= 0) return 0
  let value = base
  const bands = [7, 8, 6, 6, Infinity]
  let remaining = level - 1
  for (let index = 0; index < bands.length && remaining > 0; index += 1) {
    const steps = Math.min(remaining, bands[index])
    value += steps * increments[index]
    remaining -= steps
  }
  return value
}

function damageRange(raw: RawEffect, kind: 'physical' | 'elemental', level: number): [number, number] {
  const values = raw[kind]
  const min = progression(values[0], [values[2], values[4], values[6], values[8], values[10]], level)
  const max = progression(values[1], [values[3], values[5], values[7], values[9], values[11]], level)
  const multiplier = 2 ** (raw.hitShift - 8)
  return [Math.round(min * multiplier), Math.round(max * multiplier)]
}

function formatNumber(value: number, unit = ''): string {
  const rounded = Number.isInteger(value) ? value.toString() : value.toFixed(1).replace(/\.0$/, '')
  return `${rounded}${unit}`
}

function parameterLabel(description: string): string {
  return description
    .replace(/baseline|per level|minimum|maximum|min|max/gi, '')
    .replace(/HP/gi, '생명력').replace(/Mana/gi, '마나').replace(/Stamina/gi, '지구력')
    .replace(/Attack Rating/gi, '공격 등급').replace(/Attack Speed/gi, '공격 속도')
    .replace(/Cold/gi, '냉기').replace(/Fire/gi, '화염').replace(/Lightning/gi, '번개').replace(/Poison/gi, '독').replace(/Physical/gi, '물리')
    .replace(/Damage/gi, '피해').replace(/Defense|Armor/gi, '방어력').replace(/Resistance/gi, '저항')
    .replace(/Duration|Length/gi, '지속시간').replace(/Radius|Range/gi, '반경').replace(/Chance/gi, '확률')
    .replace(/Critical Hit/gi, '치명타').replace(/returned/gi, '반사').replace(/absorbed/gi, '흡수')
    .replace(/reduction/gi, '감소').replace(/bonus/gi, '보너스').replace(/targets?/gi, '대상 수').replace(/#?\s*of Missiles created/gi, '투사체 수')
    .replace(/%/g, '').replace(/\s+/g, ' ').trim()
}

function parameterUnit(description: string): { unit: string; scale: number } {
  if (/%|resistance|chance|attack speed|damage.*synergy/i.test(description)) return { unit: '%', scale: 1 }
  if (/duration|length/i.test(description)) return { unit: '초', scale: 1 / 25 }
  if (/radius|range/i.test(description)) return { unit: 'm', scale: 2 / 3 }
  return { unit: '', scale: 1 }
}

function valueAt(base: number, perLevel: number, level: number, scale: number): number {
  return (base + Math.max(0, level - 1) * perLevel) * scale
}

export function skillEffectRows(skill: SkillDefinition, currentLevel: number, canRaise: boolean): SkillEffectRow[] {
  const raw = RAW_SKILL_EFFECTS[(skill.dataKey ?? skill.nameEn) as keyof typeof RAW_SKILL_EFFECTS] as RawEffect | undefined
  if (!raw) return []
  const nextLevel = canRaise ? currentLevel + 1 : undefined
  const rows: SkillEffectRow[] = []
  const add = (label: string, current: string, next?: string) => rows.push({ label, current: currentLevel > 0 ? current : '—', next })

  if (raw.physical.some((value) => value !== 0)) {
    const current = damageRange(raw, 'physical', Math.max(1, currentLevel))
    const next = nextLevel ? damageRange(raw, 'physical', nextLevel) : undefined
    add('기본 물리 피해', `${current[0]}–${current[1]}`, next ? `${next[0]}–${next[1]}` : undefined)
  }
  if (raw.elementalType && raw.elemental.some((value) => value !== 0) && raw.elementalType !== 'pois') {
    const current = damageRange(raw, 'elemental', Math.max(1, currentLevel))
    const next = nextLevel ? damageRange(raw, 'elemental', nextLevel) : undefined
    add(`기본 ${elementalNames[raw.elementalType] ?? raw.elementalType} 피해`, `${current[0]}–${current[1]}`, next ? `${next[0]}–${next[1]}` : undefined)
  }
  if (raw.mana > 0 || raw.lvlMana !== 0) {
    const manaAt = (level: number) => Math.max(raw.minMana, (raw.mana + Math.max(0, level - 1) * raw.lvlMana) * 2 ** raw.manaShift / 256)
    add('마나 소모', formatNumber(manaAt(Math.max(1, currentLevel))), nextLevel ? formatNumber(manaAt(nextLevel)) : undefined)
  }

  const params = [...raw.params] as { value: number; description: string }[]
  const seenRules = new Set<string>()
  for (let index = 0; index < params.length && rows.length < 7; index += 1) {
    const entry = params[index]
    if (ignoredParam.test(entry.description) || !usefulParam.test(entry.description)) continue
    if (/synergy/i.test(entry.description)) {
      const label = parameterLabel(entry.description).replace(/synergy/gi, '시너지')
      const ruleKey = `${label}-${entry.value}`
      if (!seenRules.has(ruleKey)) {
        const { unit, scale } = parameterUnit(entry.description)
        rows.push({ label, current: `관련 기술 1P당 +${formatNumber(entry.value * scale, unit)}` })
        seenRules.add(ruleKey)
      }
      continue
    }
    const baseMatch = entry.description.match(/^(.*?)\s*baseline/i)
    const nextParam = params[index + 1]
    if (baseMatch && nextParam && /per level/i.test(nextParam.description) && parameterLabel(entry.description) === parameterLabel(nextParam.description)) {
      const { unit, scale } = parameterUnit(entry.description)
      const current = valueAt(entry.value, nextParam.value, Math.max(1, currentLevel), scale)
      const next = nextLevel ? valueAt(entry.value, nextParam.value, nextLevel, scale) : undefined
      add(parameterLabel(entry.description), formatNumber(current, unit), next === undefined ? undefined : formatNumber(next, unit))
      index += 1
      continue
    }
    if (/per level/i.test(entry.description)) {
      const { unit, scale } = parameterUnit(entry.description)
      const label = `레벨당 ${parameterLabel(entry.description)}`
      if (!seenRules.has(label)) {
        rows.push({ label, current: `+${formatNumber(entry.value * scale, unit)}` })
        seenRules.add(label)
      }
      continue
    }
    const minMatch = entry.description.match(/^(.*?)\s*(?:Min|Minimum)$/i)
    if (minMatch && nextParam && /(?:Max|Maximum)$/i.test(nextParam.description) && parameterLabel(entry.description) === parameterLabel(nextParam.description)) {
      const { unit, scale } = parameterUnit(entry.description)
      add(parameterLabel(entry.description), `${formatNumber(entry.value * scale, unit)}–${formatNumber(nextParam.value * scale, unit)}`)
      index += 1
    }
  }
  return rows
}
