import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const rawRoot = resolve(root, 'data/raw/3.3/rotw')

function readTsv(name) {
  const [header, ...lines] = readFileSync(resolve(rawRoot, name), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/)
  const keys = header.split('\t')
  return lines.filter(Boolean).map((line) => Object.fromEntries(line.split('\t').map((value, index) => [keys[index], value])))
}

const bases = new Map()
for (const file of ['armor.txt', 'weapons.txt', 'misc.txt']) {
  for (const row of readTsv(file)) bases.set(row.code, { name: row.name, type: row.type, width: Number(row.invwidth) || 1, height: Number(row.invheight) || 1 })
}

function slotFor(type = '') {
  if (/helm|circ|phlm|pelt/i.test(type)) return 'head'
  if (/tors/i.test(type)) return 'armor'
  if (/shld|head|vood/i.test(type)) return 'offhand'
  if (/glov/i.test(type)) return 'gloves'
  if (/boot/i.test(type)) return 'boots'
  if (/belt/i.test(type)) return 'belt'
  if (/amul/i.test(type)) return 'amulet'
  if (/ring/i.test(type)) return 'ring'
  if (/char|scha|mcha|lcha/i.test(type)) return 'charm'
  return 'weapon'
}

function properties(row, limit) {
  const result = []
  for (let index = 1; index <= limit; index += 1) {
    const code = row[`prop${index}`] ?? row[`T1Code${index}`]
    if (!code) continue
    const param = row[`par${index}`] ?? row[`T1Param${index}`]
    const min = row[`min${index}`] ?? row[`T1Min${index}`]
    const max = row[`max${index}`] ?? row[`T1Max${index}`]
    const range = min && max ? (min === max ? min : `${min}–${max}`) : min || max || ''
    result.push([code, param, range].filter(Boolean).join(' · '))
  }
  return result
}

const catalog = []
for (const row of readTsv('uniqueitems.txt').filter((item) => item.spawnable === '1')) {
  const base = bases.get(row.code) ?? {}
  catalog.push({ id: `unique-${row['*ID']}`, name: row.index, baseName: row['*ItemName'] || base.name || row.code, category: 'unique', requiredLevel: Number(row['lvl req']) || 0, slot: slotFor(base.type), width: base.width || 1, height: base.height || 1, properties: properties(row, 12) })
}
for (const row of readTsv('setitems.txt').filter((item) => item.spawnable === '1')) {
  const base = bases.get(row.item) ?? {}
  catalog.push({ id: `set-${row['*ID']}`, name: row.index, baseName: row['*ItemName'] || base.name || row.item, category: 'set', requiredLevel: Number(row['lvl req']) || 0, slot: slotFor(base.type), width: base.width || 1, height: base.height || 1, properties: properties(row, 9) })
}
for (const [index, row] of readTsv('runes.txt').filter((item) => item.complete === '1').entries()) {
  catalog.push({ id: `runeword-${index}-${row.Name}`, name: row['*Rune Name'], baseName: row['*RunesUsed'] || 'Runeword', category: 'runeword', requiredLevel: 0, slot: slotFor(row.itype1), width: 2, height: 3, properties: properties(row, 7) })
}

catalog.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
writeFileSync(resolve(root, 'src/data/catalog.generated.ts'), `// Generated from installed Reign of the Warlock 3.3 data.\nexport const ITEM_CATALOG = ${JSON.stringify(catalog)} as const\n`)
console.log(`Generated ${catalog.length} catalog entries.`)
