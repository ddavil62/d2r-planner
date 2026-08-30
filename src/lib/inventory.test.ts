import { describe, expect, it } from 'vitest'
import { canPlaceInventory, charmSize, firstInventoryPosition } from './inventory'

describe('inventory placement', () => {
  it('uses the correct charm footprints', () => {
    expect(charmSize('annihilus')).toEqual({ width: 1, height: 1 })
    expect(charmSize('hellfire-torch-necro')).toEqual({ width: 1, height: 2 })
    expect(charmSize('cold-skiller')).toEqual({ width: 1, height: 3 })
  })

  it('prevents overlap and finds the next column', () => {
    const items = [{ id: 'a', definitionId: 'cold-skiller', x: 0, y: 0 }]
    expect(canPlaceInventory(items, { id: 'b', definitionId: 'annihilus', x: 0, y: 0 }, 0, 0)).toBe(false)
    expect(firstInventoryPosition(items, 'cold-skiller')).toEqual({ x: 1, y: 0 })
  })
})
