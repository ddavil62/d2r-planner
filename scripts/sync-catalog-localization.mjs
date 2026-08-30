import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const sourceRevision = '4a5d4580e90a60d1fa7bbf93d895a1cfc8f8805b'
const sourceRoot = `https://raw.githubusercontent.com/SeonEngineer/D2R/${sourceRevision}`
const sourceFiles = ['item-names.json', 'item-runes.json', 'item-nameaffixes.json']

const manualNames = {
  Bulwark: '방벽', Coven: '결사', Cure: '치료', Ground: '접지', Hearth: '화로',
  'Hustle (armor)': '투지 (방어구)', 'Hustle (weapon)': '투지 (무기)', Metamorphosis: '변신',
  Mosaic: '모자이크', Ritual: '의식', Temper: '담금질', Vigilance: '경계',
  "Bane's Authority": '베인의 권위', "Bane's Oathmaker": '베인의 맹세 제작자',
  "Bane's Wraithskin": '베인의 망령 가죽', "Horazon's Countenance": '호라존의 용모',
  "Horazon's Dominion": '호라존의 지배', "Horazon's Hold": '호라존의 손아귀',
  "Horazon's Legacy": '호라존의 유산', "Horazon's Secrets": '호라존의 비밀',
  "Ars Al'Diablolos": '디아블로의 비전', "Ars Dul'Mephistos": '메피스토의 비전',
  "Ars Tor'Baalos": '바알의 비전', 'Bloodpact Shard': '피의 계약 파편', Dreadfang: '공포의 송곳니',
  'Entropy Locket': '엔트로피 목걸이', "Gheed's Wager": '기드의 내기', 'Measured Wrath': '절제된 분노',
  Opalvein: '오팔맥', 'PreCrafted Black Cleft': '사전 제작된 검은 균열',
  'PreCrafted Bone Break': '사전 제작된 뼈의 분쇄', 'PreCrafted Cold Rupture': '사전 제작된 추위의 파열',
  'PreCrafted Crack of the Heavens': '사전 제작된 천상의 틈', 'PreCrafted Flame Rift': '사전 제작된 불길의 균열',
  'PreCrafted Rotting Fissure': '사전 제작된 부패의 분열', Sling: '투석구',
  'Unique Warlock Helm': '고유 흑마법사 투구', Wraithstep: '망령걸음',
}

const aliases = {
  'Harlequin Crest': ['샤코'], "Griffon's Eye": ['다뎀', '그리폰'], 'Heart of the Oak': ['오심'],
  Enigma: ['수수'], 'Call to Arms': ['콜투', '콜투암스'], Spirit: ['스피릿'],
  'Spirit Sword': ['스피릿 검'], 'Spirit Shield': ['스피릿 방패'], 'The Stone of Jordan': ['조던', '조던링'],
  'Arachnid Mesh': ['스웹', '스파이더웹'], Wartraveler: ['배추'], 'War Traveler': ['배추'],
  Magefist: ['메피장'], "Titan's Revenge": ['타이탄'], "Death's Web": ['데스웹'], 'The Oculus': ['신오브'],
}

function clean(value = '') {
  return value.replace(/ÿc./g, '').replace(/\s+/g, ' ').trim()
}

const catalogSource = readFileSync(resolve(root, 'src/data/catalog.generated.ts'), 'utf8')
const catalog = JSON.parse(catalogSource.slice(catalogSource.indexOf('['), catalogSource.lastIndexOf(']') + 1))
const localized = []
for (const file of sourceFiles) {
  const response = await fetch(`${sourceRoot}/${file}`)
  if (!response.ok) throw new Error(`Failed to fetch ${file}: ${response.status}`)
  localized.push(...JSON.parse((await response.text()).replace(/^\uFEFF/, '')))
}

const lookup = new Map()
for (const entry of localized) {
  const korean = clean(entry.koKR)
  if (!korean) continue
  for (const key of [entry.Key, clean(entry.enUS)]) if (key) lookup.set(key, korean)
}

const result = Object.fromEntries(catalog.map((item) => [item.id, {
  nameKo: lookup.get(item.name) ?? manualNames[item.name] ?? item.name,
  baseNameKo: lookup.get(item.baseName) ?? manualNames[item.baseName] ?? item.baseName,
  aliases: aliases[item.name] ?? [],
}]))
const translatedCount = catalog.filter((item) => result[item.id].nameKo !== item.name).length

mkdirSync(resolve(root, 'data/localization'), { recursive: true })
writeFileSync(resolve(root, 'data/localization/catalog-ko.json'), `${JSON.stringify(result, null, 2)}\n`)
console.log(`Localized ${catalog.length} catalog entries (${translatedCount} Korean names).`)
