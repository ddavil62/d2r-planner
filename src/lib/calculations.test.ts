import { describe, expect, it } from 'vitest'
import { createBuild, decodeBuild, decodeBuildCompressed, encodeBuild, encodeBuildCompressed } from './builds'
import { availableSkillPoints, availableStatPoints, breakpointProgress, calculateSummary, skillCanIncrement } from './calculations'
import { CLASS_DEFINITIONS } from '../data/classes'

describe('build calculations', () => {
  it('calculates level and quest point budgets', () => {
    const build = createBuild('sorceress')
    expect(availableSkillPoints(build)).toBe(101)
    expect(availableStatPoints(build)).toBe(460)
  })

  it('requires prerequisites before investing', () => {
    const build = createBuild('sorceress')
    const teleport = CLASS_DEFINITIONS.sorceress.skills.find((skill) => skill.id === 'teleport')!
    expect(skillCanIncrement(build, teleport)).toBe(false)
    build.skills.telekinesis = 1
    expect(skillCanIncrement(build, teleport)).toBe(true)
  })

  it('combines caster gear and level-scaled Enigma values', () => {
    const build = createBuild('necromancer')
    build.equipment = {
      weapon: { definitionId: 'heart-of-the-oak' },
      offhand: { definitionId: 'spirit-shield' },
      armor: { definitionId: 'enigma' },
      belt: { definitionId: 'arachnid-mesh' },
    }
    const summary = calculateSummary(build)
    expect(summary.fasterCastRate).toBe(95)
    expect(summary.attributes.strength).toBe(15 + Math.floor(90 * 0.75))
    expect(summary.magicFind).toBe(90)
  })

  it('applies Hell penalty, Anya rewards, all resist and sunder penalty', () => {
    const build = createBuild('sorceress')
    build.equipment = {
      amulet: { definitionId: 'maras' },
      charm1: { definitionId: 'sunder-cold' },
    }
    const summary = calculateSummary(build)
    expect(summary.resistances.fire).toBe(-40)
    expect(summary.resistances.cold).toBe(-110)
  })

  it('reports the next breakpoint', () => {
    expect(breakpointProgress('sorceress', 'fcr', 64)).toEqual({ reached: 63, next: 105, needed: 41, frame: 9, nextFrame: 8 })
  })

  it('uses only the active weapon set', () => {
    const build = createBuild('necromancer')
    build.equipment = {
      weapon: { definitionId: 'heart-of-the-oak' },
      offhand: { definitionId: 'spirit-shield' },
      swapWeapon: { definitionId: 'call-to-arms' },
      swapOffhand: { definitionId: 'splendor' },
    }
    expect(calculateSummary(build).fasterCastRate).toBe(75)
    build.activeWeaponSet = 2
    expect(calculateSummary(build).fasterCastRate).toBe(10)
  })

  it('recovers stats for database items equipped before catalog normalization', () => {
    const build = createBuild('necromancer')
    build.equipment.weapon = { definitionId: 'custom', name: 'Suicide Branch', modifiers: {} }
    const summary = calculateSummary(build)
    expect(summary.fasterCastRate).toBe(50)
    expect(summary.resistances.fire).toBe(-60)
  })

  it('round-trips Korean build data through a share code', () => {
    const build = createBuild('necromancer')
    build.name = '독조넥 실험'
    build.skills['poison-nova'] = 20
    expect(decodeBuild(encodeBuild(build))).toMatchObject({ name: build.name, skills: build.skills, gameVersion: '3.3' })
  })

  it('round-trips a compressed URL payload', async () => {
    const build = createBuild('sorceress')
    build.name = '친구 공유용 냉기 소서'
    const code = await encodeBuildCompressed(build)
    expect(code.length).toBeLessThan(encodeBuild(build).length)
    await expect(decodeBuildCompressed(code)).resolves.toMatchObject({ name: build.name, classId: 'sorceress' })
  })
})
