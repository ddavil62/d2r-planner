import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const source = resolve(root, 'data/raw/3.3/rotw/skills.txt')
const [header, ...lines] = readFileSync(source, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/)
const keys = header.split('\t')
const rows = lines.filter(Boolean).map((line) => Object.fromEntries(line.split('\t').map((value, index) => [keys[index], value])))
const number = (value) => value === '' || value === undefined ? 0 : Number(value) || 0
const effects = {}

for (const row of rows.filter((entry) => entry.charclass)) {
  const params = []
  for (let index = 1; index <= 20; index += 1) {
    const description = row[`*Param${index} Description`] || row[`*Param${index}Description`] || row[`*Param${index} Description2`]
    if (description && row[`Param${index}`] !== '') params.push({ value: number(row[`Param${index}`]), description })
  }
  effects[row.skill] = {
    mana: number(row.mana), lvlMana: number(row.lvlmana), manaShift: number(row.manashift), minMana: number(row.minmana),
    hitShift: number(row.HitShift),
    physical: [number(row.MinDam), number(row.MaxDam), ...[1, 2, 3, 4, 5].flatMap((index) => [number(row[`MinLevDam${index}`]), number(row[`MaxLevDam${index}`])])],
    elementalType: row.EType || '',
    elemental: [number(row.EMin), number(row.EMax), ...[1, 2, 3, 4, 5].flatMap((index) => [number(row[`EMinLev${index}`]), number(row[`EMaxLev${index}`])])],
    elementalLength: [number(row.ELen), number(row.ELevLen1), number(row.ELevLen2), number(row.ELevLen3)],
    params,
  }
}

writeFileSync(resolve(root, 'src/data/skill-effects.generated.ts'), `// Generated from data/raw/3.3/rotw/skills.txt.\nexport const RAW_SKILL_EFFECTS = ${JSON.stringify(effects)} as const\n`)
console.log(`Generated effect data for ${Object.keys(effects).length} skills.`)
