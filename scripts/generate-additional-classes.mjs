import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const rawRoot = resolve(root, 'data/raw/3.3/rotw')
const localizationRevision = '4a5d4580e90a60d1fa7bbf93d895a1cfc8f8805b'

function readTsv(name) {
  const [header, ...lines] = readFileSync(resolve(rawRoot, name), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/)
  const keys = header.split('\t')
  return lines.filter(Boolean).map((line) => Object.fromEntries(line.split('\t').map((value, index) => [keys[index], value])))
}

const classConfigs = {
  amazon: { raw: 'Amazon', code: 'ama', nameKo: '아마존', nameEn: 'Amazon', accent: '#d5a84f', branches: ['활과 쇠뇌', '지속 효과와 마법', '투창과 창'] },
  paladin: { raw: 'Paladin', code: 'pal', nameKo: '성기사', nameEn: 'Paladin', accent: '#d9c879', branches: ['전투 기술', '공격 오라', '방어 오라'] },
  barbarian: { raw: 'Barbarian', code: 'bar', nameKo: '야만용사', nameEn: 'Barbarian', accent: '#c98255', branches: ['전투 기술', '전투 숙련', '함성'] },
  druid: { raw: 'Druid', code: 'dru', nameKo: '드루이드', nameEn: 'Druid', accent: '#8eb66d', branches: ['소환', '변신', '원소'] },
  assassin: { raw: 'Assassin', code: 'ass', nameKo: '암살자', nameEn: 'Assassin', accent: '#b18ad0', branches: ['덫', '그림자 단련', '무술'] },
  warlock: { raw: 'Warlock', code: 'war', nameKo: '악마술사', nameEn: 'Warlock', accent: '#c45a78', branches: ['악마 결속', '기괴 무기', '혼돈 기술'] },
}

const warlockSkills = {
  'Summon Goatman': ['염소인간 소환', '전투를 돕는 염소인간 악마를 소환합니다.'],
  'Demonic Mastery': ['악마 숙련', '소환하고 결속한 악마의 능력을 강화합니다.'],
  'Death Mark': ['죽음의 표식', '대상에게 죽음의 표식을 남겨 악마의 공격을 집중시킵니다.'],
  'Summon Tainted': ['오염된 자 소환', '원거리에서 화염을 사용하는 오염된 자를 소환합니다.'],
  'Summon Defiler': ['파멸자 소환', '마법으로 적을 공격하는 파멸자를 소환합니다.'],
  'Blood Oath': ['피의 맹세', '피의 맹세로 자신과 악마의 전투력을 높입니다.'],
  Engorge: ['포식', '악마의 힘을 포식하여 능력을 강화합니다.'],
  'Blood Boil': ['피 끓이기', '소환된 악마의 피를 끓여 폭발적인 힘을 부여합니다.'],
  Consume: ['소모', '지배 중인 악마를 소모해 그 힘을 흡수합니다.'],
  'Bind Demon': ['악마 결속', '적 악마를 결속하여 자신의 하수인으로 만듭니다.'],
  Levitate: ['공중 부양', '무기를 공중에 띄워 기괴 기술의 기반을 마련합니다.'],
  'Eldritch Blast': ['기괴 폭발', '정신력으로 무기를 폭발시켜 주변 적을 공격합니다.'],
  'Hex Bane': ['사술 파멸', '무기에 적을 약화시키는 사술을 주입합니다.'],
  'Hex Siphon': ['사술 흡수', '사술에 걸린 적의 생명력을 흡수합니다.'],
  'Psychic Ward': ['정신 방벽', '정신력으로 피해를 막아내는 방벽을 생성합니다.'],
  'Echoing Strike': ['메아리 일격', '무기의 환영이 뒤따라 같은 대상을 다시 공격합니다.'],
  'Hex Purge': ['사술 정화', '사술을 폭발시켜 대상과 주변 적에게 피해를 줍니다.'],
  'Blade Warp': ['칼날 도약', '무기를 던진 위치로 순간 이동합니다.'],
  Cleave: ['가르기', '정신력으로 조종한 무기로 다수의 적을 가릅니다.'],
  'Mirrored Blades': ['거울 칼날', '무기의 무형 복제물을 만들어 적들을 공격합니다.'],
  'Sigil Lethargy': ['무기력의 인장', '적의 움직임을 둔화시키는 인장을 새깁니다.'],
  'Ring of Fire': ['불의 고리', '사방으로 퍼지는 화염 투사체의 고리를 방출합니다.'],
  'Miasma Bolt': ['독기 화살', '폭발하며 엔트로피 독기를 남기는 투사체를 발사합니다.'],
  'Sigil Rancor': ['원한의 인장', '적이 받는 피해를 증폭하는 인장을 새깁니다.'],
  'Enhanced Entropy': ['강화된 엔트로피', '독기와 엔트로피 기술의 파괴력을 강화합니다.'],
  'Flame Wave': ['화염 파동', '전방으로 거대한 화염의 파동을 내보냅니다.'],
  'Miasma Chains': ['독기 사슬', '독기를 적들 사이로 연쇄시켜 지속 피해를 줍니다.'],
  'Sigil Death': ['죽음의 인장', '죽음의 힘이 축적되는 강력한 인장을 새깁니다.'],
  Apocalypse: ['대재앙', '지옥불을 쏟아부어 넓은 지역을 불태웁니다.'],
  Abyss: ['심연', '현실을 찢어 주변의 적을 빨아들이는 심연을 엽니다.'],
}

function clean(value = '') { return value.replace(/ÿc./g, '').replace(/\s+/g, ' ').trim() }
function slug(value) { return value.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() }

const response = await fetch(`https://raw.githubusercontent.com/SeonEngineer/D2R/${localizationRevision}/skills.json`)
if (!response.ok) throw new Error(`Failed to fetch skill localization: ${response.status}`)
const localizedRows = JSON.parse((await response.text()).replace(/^\uFEFF/, ''))
const localizedByKey = new Map(localizedRows.map((row) => [row.Key, clean(row.koKR)]))
const skills = readTsv('skills.txt')
const descriptions = new Map(readTsv('skilldesc.txt').map((row) => [row.skilldesc, row]))
const charStats = new Map(readTsv('charstats.txt').map((row) => [row.class, row]))

const definitions = {}
for (const [id, config] of Object.entries(classConfigs)) {
  const stats = charStats.get(config.raw)
  const classSkills = skills.filter((row) => row.charclass === config.code).map((row) => {
    const description = descriptions.get(row.skilldesc)
    const manual = warlockSkills[row.skill]
    return {
      id: slug(row.skill),
      nameKo: localizedByKey.get(description?.['str name']) || manual?.[0] || row.skill,
      nameEn: row.skill,
      dataKey: row.skill,
      branch: config.branches[(Number(description?.SkillPage) || 1) - 1],
      row: Number(description?.SkillRow) || 1,
      col: Number(description?.SkillColumn) || 2,
      requiredLevel: Number(row.reqlevel) || 1,
      description: localizedByKey.get(description?.['str long']) || manual?.[1] || `${row.skill} 기술입니다.`,
      prerequisites: [row.reqskill1, row.reqskill2, row.reqskill3].filter(Boolean).map(slug),
    }
  })
  definitions[id] = {
    id, nameKo: config.nameKo, nameEn: config.nameEn, accent: config.accent, branches: config.branches,
    base: { strength: Number(stats.str), dexterity: Number(stats.dex), vitality: Number(stats.vit), energy: Number(stats.int) },
    baseLife: Number(stats.hpadd) + Number(stats.vit), baseMana: Number(stats.int),
    lifePerLevel: Number(stats.LifePerLevel) / 4, manaPerLevel: Number(stats.ManaPerLevel) / 4,
    lifePerVitality: Number(stats.LifePerVitality) / 4, manaPerEnergy: Number(stats.ManaPerMagic) / 4,
    skills: classSkills,
  }
}

writeFileSync(resolve(root, 'src/data/additional-classes.generated.ts'), `// Generated from installed Reign of the Warlock 3.3 data and pinned koKR strings.\nimport type { ClassDefinition, ClassId } from '../types'\n\nexport const ADDITIONAL_CLASS_DEFINITIONS = ${JSON.stringify(definitions, null, 2)} as unknown as Record<Exclude<ClassId, 'necromancer' | 'sorceress'>, ClassDefinition>\n`)
console.log(`Generated ${Object.keys(definitions).length} classes and ${Object.values(definitions).reduce((sum, definition) => sum + definition.skills.length, 0)} skills.`)
