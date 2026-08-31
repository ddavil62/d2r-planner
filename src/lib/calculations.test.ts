import { describe, expect, it } from 'vitest'
import { createBuild, decodeBuild, decodeBuildCompressed, encodeBuild, encodeBuildCompressed } from './builds'
import { availableSkillPoints, availableStatPoints, breakpointProgress, calculateCombatSummary, calculateSummary, getEquippedItemModifiers, skillBonusFor, skillCanIncrement } from './calculations'
import { CLASS_DEFINITIONS } from '../data/classes'
import { ITEM_CATALOG } from '../data/catalog.generated'

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

  it('creates a valid build summary for every playable class', () => {
    for (const classId of Object.keys(CLASS_DEFINITIONS) as (keyof typeof CLASS_DEFINITIONS)[]) {
      const summary = calculateSummary(createBuild(classId))
      expect(summary.life, classId).toBeGreaterThan(0)
      expect(summary.mana, classId).toBeGreaterThan(0)
    }
  })

  it('combines Warlock class and Arts of Chaos tree bonuses', () => {
    const build = createBuild('warlock')
    build.equipment.armor = { definitionId: 'custom', modifiers: { warlockSkills: 2, artsOfChaosSkills: 3 } }
    const chaosSkill = CLASS_DEFINITIONS.warlock.skills.find((skill) => skill.branch === '혼돈 기술')!
    expect(skillBonusFor(build, chaosSkill)).toBe(5)
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

  it('keeps normalized Obedience stats when equipped from the runeword catalog', () => {
    const obedience = ITEM_CATALOG.find((item) => item.name === 'Obedience')!
    const equipped = { definitionId: 'custom', catalogId: obedience.id, name: obedience.name, modifiers: { ...obedience.modifiers } }
    expect(getEquippedItemModifiers(equipped)).toMatchObject({ fasterHitRecovery: 40, allResist: 30 })

    const build = createBuild('barbarian')
    build.equipment.weapon = equipped
    const summary = calculateSummary(build)
    expect(summary.fasterHitRecovery).toBe(40)
    expect(summary.resistances.fire).toBe(-40)
  })

  it('calculates an ethereal Obedience Thresher basic attack', () => {
    const obedience = ITEM_CATALOG.find((item) => item.name === 'Obedience')!
    const build = createBuild('necromancer')
    build.equipment.weapon = {
      definitionId: 'custom', catalogId: obedience.id, name: obedience.name,
      modifiers: { ...obedience.modifiers }, baseWeaponCode: '7s8', ethereal: true,
    }

    expect(calculateCombatSummary(build)).toMatchObject({
      ready: true,
      weaponName: '순종',
      baseWeaponName: 'Thresher',
      physicalMin: 96,
      physicalMax: 1139,
      averageHit: 618,
      weaponEnhancedDamage: 370,
      attributeDamageBonus: 15,
      crushingBlow: 40,
      enemyResistReduction: { fire: 25 },
      effectiveEnemyResist: { physical: 50, fire: 25 },
      finalAverageHit: 12809,
      crushingBlowDamage: 12500,
      attackRating: 90,
      hitChance: 5,
      attackFrames: 14,
      attacksPerSecond: 1.79,
      dps: 28,
      targetLife: 500000,
      missingBase: false,
    })
  })

  it('scales target life and first-hit crushing blow with player count', () => {
    const obedience = ITEM_CATALOG.find((item) => item.name === 'Obedience')!
    const build = createBuild('necromancer')
    build.enemy.playerCount = 8
    build.equipment.weapon = { definitionId: 'custom', catalogId: obedience.id, name: obedience.name, modifiers: { ...obedience.modifiers }, baseWeaponCode: '7s8', ethereal: true }
    expect(calculateCombatSummary(build)).toMatchObject({ targetLife: 2250000, crushingBlowDamage: 56250, finalAverageHit: 56559 })
  })

  it('requires a weapon base before calculating a runeword', () => {
    const obedience = ITEM_CATALOG.find((item) => item.name === 'Obedience')!
    const build = createBuild('barbarian')
    build.equipment.weapon = { definitionId: 'custom', catalogId: obedience.id, name: obedience.name, modifiers: { ...obedience.modifiers } }
    expect(calculateCombatSummary(build)).toMatchObject({ ready: false, missingBase: true })
  })

  it('applies physical damage added by non-weapon gear', () => {
    const windforce = ITEM_CATALOG.find((item) => item.name === 'Windforce')!
    const warTraveler = ITEM_CATALOG.find((item) => item.name === 'Wartraveler')!
    const build = createBuild('amazon')
    build.equipment.weapon = { definitionId: 'custom', catalogId: windforce.id, name: windforce.name, modifiers: { ...windforce.modifiers }, baseWeaponCode: '6lw' }
    build.equipment.boots = { definitionId: 'custom', catalogId: warTraveler.id, name: warTraveler.name, modifiers: { ...warTraveler.modifiers } }
    const withBoots = calculateCombatSummary(build)
    delete build.equipment.boots
    const withoutBoots = calculateCombatSummary(build)
    expect(withBoots.physicalMin).toBeGreaterThan(withoutBoots.physicalMin)
    expect(withBoots.physicalMax).toBeGreaterThan(withoutBoots.physicalMax)
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
