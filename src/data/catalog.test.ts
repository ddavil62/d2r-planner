import { describe, expect, it } from 'vitest'
import { ITEM_CATALOG } from './catalog.generated'

describe('generated 3.3 item catalog', () => {
  it('contains every active unique, set and runeword row', () => {
    expect(ITEM_CATALOG.filter((item) => item.category === 'unique')).toHaveLength(403)
    expect(ITEM_CATALOG.filter((item) => item.category === 'set')).toHaveLength(135)
    expect(ITEM_CATALOG.filter((item) => item.category === 'runeword')).toHaveLength(99)
    expect(new Set(ITEM_CATALOG.map((item) => item.id)).size).toBe(637)
  })

  it('normalizes calculation modifiers for non-preset database items', () => {
    const suicideBranch = ITEM_CATALOG.find((item) => item.name === 'Suicide Branch')
    expect(suicideBranch?.modifiers).toMatchObject({ fasterCastRate: 50, allSkills: 1, allResist: 10, life: 40 })
    const wizardspike = ITEM_CATALOG.find((item) => item.name === 'Wizardspike')
    expect(wizardspike?.modifiers).toMatchObject({ fasterCastRate: 50, allResist: 75, manaPerLevel: 2 })
  })
})
