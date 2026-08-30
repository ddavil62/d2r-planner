import { describe, expect, it } from 'vitest'
import { ITEM_CATALOG } from './catalog.generated'

describe('generated 3.3 item catalog', () => {
  it('contains every active unique, set and runeword row', () => {
    expect(ITEM_CATALOG.filter((item) => item.category === 'unique')).toHaveLength(403)
    expect(ITEM_CATALOG.filter((item) => item.category === 'set')).toHaveLength(135)
    expect(ITEM_CATALOG.filter((item) => item.category === 'runeword')).toHaveLength(99)
    expect(new Set(ITEM_CATALOG.map((item) => item.id)).size).toBe(637)
  })
})
