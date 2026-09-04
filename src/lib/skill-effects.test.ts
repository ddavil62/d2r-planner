import { describe, expect, it } from 'vitest'
import { CLASS_DEFINITIONS } from '../data/classes'
import { skillEffectRows } from './skill-effects'

describe('skillEffectRows', () => {
  it('calculates current and next values from the 3.3 level curves', () => {
    const mastery = CLASS_DEFINITIONS.sorceress.skills.find((skill) => skill.id === 'cold-mastery')!
    expect(skillEffectRows(mastery, 1, true)).toContainEqual({ label: '냉기 저항 감소', current: '20%', next: '25%' })
  })

  it('shows base damage and mana cost for damaging skills', () => {
    const fireBall = CLASS_DEFINITIONS.sorceress.skills.find((skill) => skill.id === 'fire-ball')!
    const rows = skillEffectRows(fireBall, 1, true)
    expect(rows).toContainEqual({ label: '기본 화염 피해', current: '6–14', next: '13–22' })
    expect(rows).toContainEqual({ label: '마나 소모', current: '5', next: '5.5' })
  })

  it('surfaces per-level growth rules that do not have a baseline pair', () => {
    const raiseSkeleton = CLASS_DEFINITIONS.necromancer.skills.find((skill) => skill.id === 'raise-skeleton')!
    const rows = skillEffectRows(raiseSkeleton, 1, true)
    expect(rows).toContainEqual({ label: '레벨당 생명력', current: '+50%' })
    expect(rows).toContainEqual({ label: '레벨당 피해', current: '+7%' })
  })
})
