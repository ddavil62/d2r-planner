import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CLASS_DEFINITIONS } from './classes'

function readSkills() {
  const source = readFileSync(resolve('data/raw/3.3/rotw/skills.txt'), 'utf8')
  const [headerLine, ...lines] = source.split(/\r?\n/)
  const headers = headerLine.split('\t')
  return lines.filter(Boolean).map((line) => {
    const values = line.split('\t')
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']))
  })
}

describe('3.3 skill snapshot', () => {
  const rawSkills = readSkills()

  it('exposes all eight playable classes and 240 skills', () => {
    expect(Object.keys(CLASS_DEFINITIONS)).toHaveLength(8)
    expect(Object.values(CLASS_DEFINITIONS).flatMap((definition) => definition.skills)).toHaveLength(240)
  })

  for (const classDefinition of Object.values(CLASS_DEFINITIONS)) {
    it(`${classDefinition.nameEn} has 30 skills matching required levels and prerequisites`, () => {
      expect(classDefinition.skills).toHaveLength(30)
      const namesById = Object.fromEntries(classDefinition.skills.map((skill) => [skill.id, skill.dataKey ?? skill.nameEn]))
      for (const skill of classDefinition.skills) {
        const raw = rawSkills.find((row) => row.skill === (skill.dataKey ?? skill.nameEn))
        expect(raw, skill.nameEn).toBeDefined()
        expect(Number(raw!.reqlevel), `${skill.nameEn} required level`).toBe(skill.requiredLevel)
        const expectedPrerequisites = (skill.prerequisites ?? []).map((id) => namesById[id]).sort()
        const actualPrerequisites = [raw!.reqskill1, raw!.reqskill2, raw!.reqskill3].filter(Boolean).sort()
        expect(actualPrerequisites, `${skill.nameEn} prerequisites`).toEqual(expectedPrerequisites)
      }
    })
  }
})
