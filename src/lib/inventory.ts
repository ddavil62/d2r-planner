import type { InventoryItem } from '../types'

export const INVENTORY_WIDTH = 10
export const INVENTORY_HEIGHT = 4

export function charmSize(definitionId: string): { width: number; height: number } {
  if (definitionId === 'horadric-cube') return { width: 2, height: 2 }
  if (definitionId === 'hellfire-torch-necro' || definitionId === 'hellfire-torch-sorc') return { width: 1, height: 2 }
  if (definitionId === 'annihilus') return { width: 1, height: 1 }
  return { width: 1, height: 3 }
}

export function canPlaceInventory(items: InventoryItem[], candidate: InventoryItem, x: number, y: number): boolean {
  const size = charmSize(candidate.definitionId)
  if (x < 0 || y < 0 || x + size.width > INVENTORY_WIDTH || y + size.height > INVENTORY_HEIGHT) return false
  return !items.some((item) => {
    if (item.id === candidate.id) return false
    const itemSize = charmSize(item.definitionId)
    return x < item.x + itemSize.width && x + size.width > item.x && y < item.y + itemSize.height && y + size.height > item.y
  })
}

export function firstInventoryPosition(items: InventoryItem[], definitionId: string) {
  const candidate = { id: 'candidate', definitionId, x: 0, y: 0 }
  for (let y = 0; y < INVENTORY_HEIGHT; y += 1) {
    for (let x = 0; x < INVENTORY_WIDTH; x += 1) {
      if (canPlaceInventory(items, candidate, x, y)) return { x, y }
    }
  }
  return undefined
}
