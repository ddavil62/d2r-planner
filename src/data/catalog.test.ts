import { describe, expect, it } from 'vitest'
import { ITEM_CATALOG } from './catalog.generated'
import { WEAPON_BASES } from './weapon-bases.generated'

describe('generated 3.3 item catalog', () => {
  it('contains every active unique, set and runeword row', () => {
    expect(ITEM_CATALOG.filter((item) => item.category === 'unique')).toHaveLength(403)
    expect(ITEM_CATALOG.filter((item) => item.category === 'set')).toHaveLength(135)
    expect(ITEM_CATALOG.filter((item) => item.category === 'runeword')).toHaveLength(99)
    expect(new Set(ITEM_CATALOG.map((item) => item.id)).size).toBe(637)
    expect(ITEM_CATALOG.every((item) => item.nameKo !== item.name && /[가-힣]/.test(item.nameKo))).toBe(true)
  })

  it('includes bilingual names and common Korean search aliases', () => {
    const shako = ITEM_CATALOG.find((item) => item.name === 'Harlequin Crest')
    expect(shako).toMatchObject({ nameKo: '할리퀸 관모', aliases: ['샤코'] })
    expect(ITEM_CATALOG.find((item) => item.name === 'Enigma')).toMatchObject({ nameKo: '수수께끼', aliases: ['수수'] })
  })

  it('normalizes calculation modifiers for non-preset database items', () => {
    const suicideBranch = ITEM_CATALOG.find((item) => item.name === 'Suicide Branch')
    expect(suicideBranch?.modifiers).toMatchObject({ fasterCastRate: 50, allSkills: 1, allResist: 10, life: 40 })
    const wizardspike = ITEM_CATALOG.find((item) => item.name === 'Wizardspike')
    expect(wizardspike?.modifiers).toMatchObject({ fasterCastRate: 50, allResist: 75, manaPerLevel: 2 })
  })

  it('normalizes class and skill-tree bonuses for every expansion generation', () => {
    expect(ITEM_CATALOG.find((item) => item.name === 'Peace')?.modifiers).toMatchObject({ amazonSkills: 2 })
    expect(ITEM_CATALOG.find((item) => item.name === 'Authority')?.modifiers).toMatchObject({ warlockSkills: 2 })
    expect(ITEM_CATALOG.find((item) => item.name === "Ars Al'Diablolos")?.modifiers).toMatchObject({ artsOfChaosSkills: 2 })
  })

  it('keeps combat modifiers and compatible bases for runewords', () => {
    const obedience = ITEM_CATALOG.find((item) => item.name === 'Obedience')
    expect(obedience).toMatchObject({
      modifiers: { enhancedDamage: 370, crushingBlow: 40, enemyFireResistance: 25 },
      allowedBaseTypes: ['pole', 'spea'],
      requiredSockets: 5,
    })
    expect(WEAPON_BASES).toHaveLength(297)
    expect(WEAPON_BASES.find((item) => item.code === '7s8')).toMatchObject({ name: 'Thresher', minDamage: 12, maxDamage: 141, maxSockets: 5 })
  })
})
