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

const skillsById = new Map(readTsv('skills.txt').map((row) => [row.Id, row.skill]))

function skillId(value = '') {
  const name = skillsById.get(String(value)) || value
  return name.trim().replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase()
}

const simpleModifierMap = {
  str: 'strength', dex: 'dexterity', vit: 'vitality', enr: 'energy', hp: 'life', mana: 'mana',
  'hp%': 'lifePercent', 'mana%': 'manaPercent', allskills: 'allSkills', nec: 'necromancerSkills', sor: 'sorceressSkills',
  fireskill: 'fireSkills', 'res-fire': 'fireResist', 'res-cold': 'coldResist', 'res-ltng': 'lightningResist',
  'res-pois': 'poisonResist', 'res-all': 'allResist', 'gold%': 'goldFind', 'mag%': 'magicFind',
  'red-dmg%': 'damageReduction', 'red-mag': 'magicDamageReduction', block: 'blockChance', nofreeze: 'cannotBeFrozen',
}

function numericValue(row, index, prefix = '') {
  const max = row[`${prefix}Max${index}`] ?? row[`max${index}`]
  const min = row[`${prefix}Min${index}`] ?? row[`min${index}`]
  return Number(max !== '' && max !== undefined ? max : min) || 0
}

function modifiers(row, limit, runeword = false) {
  const result = {}
  const add = (key, value) => { if (key && value) result[key] = (result[key] || 0) + value }
  for (let index = 1; index <= limit; index += 1) {
    const code = row[runeword ? `T1Code${index}` : `prop${index}`]
    if (!code) continue
    const param = row[runeword ? `T1Param${index}` : `par${index}`]
    const value = numericValue(row, index, runeword ? 'T1' : '')
    if (simpleModifierMap[code]) add(simpleModifierMap[code], value || (code === 'nofreeze' ? 1 : 0))
    else if (code === 'all-stats') for (const key of ['strength', 'dexterity', 'vitality', 'energy']) add(key, value)
    else if (/^cast[123]$/.test(code)) add('fasterCastRate', value)
    else if (/^balance[123]$/.test(code)) add('fasterHitRecovery', value)
    else if (/^block[123]$/.test(code)) add('fasterBlockRate', value)
    else if (/^swing[123]$/.test(code)) add('increasedAttackSpeed', value)
    else if (/^move[123]$/.test(code)) add('fasterRunWalk', value)
    else if (code === 'hp/lvl') add('lifePerLevel', (Number(param) || 0) / 8)
    else if (code === 'mana/lvl') add('manaPerLevel', (Number(param) || 0) / 8)
    else if (code === 'mag%/lvl') add('magicFindPerLevel', (Number(param) || 0) / 8)
    else if (code === 'skilltab') {
      const tabs = { 3: 'fireSkills', 4: 'lightningSkills', 5: 'coldSkills', 6: 'cursesSkills', 7: 'poisonBoneSkills', 8: 'summoningSkills' }
      add(tabs[Number(param)], value)
    } else if (code === 'skill' || code === 'oskill') add(`skill:${skillId(param)}`, value)
  }
  return result
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
  catalog.push({ id: `unique-${row['*ID']}`, name: row.index, baseName: row['*ItemName'] || base.name || row.code, category: 'unique', requiredLevel: Number(row['lvl req']) || 0, slot: slotFor(base.type), width: base.width || 1, height: base.height || 1, properties: properties(row, 12), modifiers: modifiers(row, 12) })
}
for (const row of readTsv('setitems.txt').filter((item) => item.spawnable === '1')) {
  const base = bases.get(row.item) ?? {}
  catalog.push({ id: `set-${row['*ID']}`, name: row.index, baseName: row['*ItemName'] || base.name || row.item, category: 'set', requiredLevel: Number(row['lvl req']) || 0, slot: slotFor(base.type), width: base.width || 1, height: base.height || 1, properties: properties(row, 9), modifiers: modifiers(row, 9) })
}
for (const [index, row] of readTsv('runes.txt').filter((item) => item.complete === '1').entries()) {
  catalog.push({ id: `runeword-${index}-${row.Name}`, name: row['*Rune Name'], baseName: row['*RunesUsed'] || 'Runeword', category: 'runeword', requiredLevel: 0, slot: slotFor(row.itype1), width: 2, height: 3, properties: properties(row, 7), modifiers: modifiers(row, 7, true) })
}

catalog.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
writeFileSync(resolve(root, 'src/data/catalog.generated.ts'), `// Generated from installed Reign of the Warlock 3.3 data.\nexport const ITEM_CATALOG = ${JSON.stringify(catalog)} as const\n`)
console.log(`Generated ${catalog.length} catalog entries.`)
