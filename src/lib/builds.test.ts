import { describe, expect, it } from 'vitest'
import { buildExportFilename, createBuild, exportBuildFile, importBuildFile } from './builds'

describe('build file export', () => {
  it('round-trips the complete build through a versioned file', () => {
    const build = createBuild('warlock')
    build.name = '심연 / 혼돈 세팅'
    build.skills.abyss = 20
    build.equipment.armor = { definitionId: 'enigma' }
    build.notes = '외부 공유용 메모'

    const exported = JSON.parse(exportBuildFile(build))
    expect(exported).toMatchObject({ format: 'd2r-planner-build', version: 1 })
    expect(importBuildFile(JSON.stringify(exported))).toMatchObject({
      name: build.name,
      classId: 'warlock',
      skills: { abyss: 20 },
      equipment: build.equipment,
      notes: build.notes,
    })
  })

  it('creates a safe download filename', () => {
    expect(buildExportFilename('  심연 / 혼돈: 세팅  ')).toBe('심연 - 혼돈- 세팅.d2rbuild')
    expect(buildExportFilename('***')).toBe('d2r-build.d2rbuild')
  })

  it('rejects unknown file formats', () => {
    expect(() => importBuildFile('{"format":"unknown","version":1}')).toThrow('지원하지 않는 빌드 파일입니다.')
  })
})
