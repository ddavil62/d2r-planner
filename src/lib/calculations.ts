import { CLASS_DEFINITIONS } from '../data/classes'
import { ITEMS_BY_ID } from '../data/items'
import { ITEM_CATALOG } from '../data/catalog.generated'
import type { AttributeId, BuildProfile, BuildSummary, ClassId, EquippedItem, Modifiers, SkillDefinition } from '../types'

const numericKeys: (keyof Modifiers)[] = [
  'strength', 'strengthPerLevel', 'dexterity', 'vitality', 'energy', 'life', 'mana', 'lifePerLevel',
  'manaPerLevel', 'lifePercent', 'manaPercent',
  'allSkills', 'necromancerSkills', 'sorceressSkills', 'amazonSkills', 'paladinSkills', 'barbarianSkills',
  'druidSkills', 'assassinSkills', 'warlockSkills', 'summoningSkills', 'poisonBoneSkills', 'cursesSkills',
  'coldSkills', 'lightningSkills', 'fireSkills', 'bowCrossbowSkills', 'passiveMagicSkills', 'javelinSpearSkills',
  'paladinCombatSkills', 'offensiveAuraSkills', 'defensiveAuraSkills', 'barbarianCombatSkills',
  'combatMasteriesSkills', 'warcriesSkills', 'druidSummoningSkills', 'shapeShiftingSkills', 'elementalSkills',
  'trapsSkills', 'shadowDisciplinesSkills', 'martialArtsSkills', 'demonicBindingSkills', 'eldritchWeaponsSkills',
  'artsOfChaosSkills', 'fireResist', 'coldResist',
  'lightningResist', 'poisonResist', 'allResist', 'fasterCastRate', 'fasterHitRecovery',
  'fasterBlockRate', 'increasedAttackSpeed', 'fasterRunWalk', 'magicFind', 'goldFind',
  'damageReduction', 'magicDamageReduction', 'blockChance', 'cannotBeFrozen', 'magicFindPerLevel',
  'coldSunder', 'poisonSunder',
]

export function mergeModifiers(...modifierSets: (Modifiers | undefined)[]): Modifiers {
  const result: Modifiers = {}
  for (const modifiers of modifierSets) {
    if (!modifiers) continue
    for (const [key, value] of Object.entries(modifiers)) {
      if (typeof value === 'number') result[key as keyof Modifiers] = (result[key as keyof Modifiers] ?? 0) + value
    }
  }
  return result
}

export function getEquippedItemModifiers(equipped: EquippedItem): Modifiers {
  const definition = ITEMS_BY_ID[equipped.definitionId]
  const hasSavedModifiers = Object.values(equipped.modifiers ?? {}).some((value) => typeof value === 'number' && value !== 0)
  const recoveredCatalogModifiers = equipped.definitionId === 'custom' && equipped.name && !hasSavedModifiers
    ? ITEM_CATALOG.find((item) => item.id === equipped.catalogId || item.name === equipped.name || item.nameKo === equipped.name)?.modifiers
    : undefined
  return mergeModifiers(definition?.modifiers, hasSavedModifiers ? equipped.modifiers : recoveredCatalogModifiers)
}

export function getEquipmentModifiers(build: BuildProfile, includeSwap = false): Modifiers {
  const entries = Object.entries(build.equipment).filter(([slot]) => {
    if (includeSwap) return true
    if (slot === 'weapon' || slot === 'offhand') return build.activeWeaponSet === 1
    if (slot === 'swapWeapon' || slot === 'swapOffhand') return build.activeWeaponSet === 2
    return true
  })
  const inventoryModifiers = build.inventory.map((item) => ITEMS_BY_ID[item.definitionId]?.modifiers)
  return mergeModifiers(...entries.map(([, equipped]) => {
    if (!equipped) return undefined
    return getEquippedItemModifiers(equipped)
  }), ...inventoryModifiers)
}

export function availableSkillPoints(build: Pick<BuildProfile, 'level' | 'questSkillPoints'>): number {
  return Math.max(0, build.level - 1) + build.questSkillPoints
}

export function availableStatPoints(build: Pick<BuildProfile, 'level' | 'questStatPoints'>): number {
  return Math.max(0, build.level - 1) * 5 + build.questStatPoints
}

export function spentSkillPoints(build: Pick<BuildProfile, 'skills'>): number {
  return Object.values(build.skills).reduce((sum, points) => sum + points, 0)
}

export function spentStatPoints(build: Pick<BuildProfile, 'attributes'>): number {
  return Object.values(build.attributes).reduce((sum, points) => sum + points, 0)
}

export function skillCanIncrement(build: BuildProfile, definition: SkillDefinition): boolean {
  if ((build.skills[definition.id] ?? 0) >= 20) return false
  if (build.level < definition.requiredLevel) return false
  if (spentSkillPoints(build) >= availableSkillPoints(build)) return false
  return (definition.prerequisites ?? []).every((id) => (build.skills[id] ?? 0) > 0)
}

export function skillBonusFor(build: BuildProfile, skill: SkillDefinition, modifiers = getEquipmentModifiers(build)): number {
  const classKeyById: Record<ClassId, keyof Modifiers> = {
    amazon: 'amazonSkills', sorceress: 'sorceressSkills', necromancer: 'necromancerSkills', paladin: 'paladinSkills',
    barbarian: 'barbarianSkills', druid: 'druidSkills', assassin: 'assassinSkills', warlock: 'warlockSkills',
  }
  const branchKeyByName: Record<string, keyof Modifiers> = {
    '소환': 'summoningSkills', '독과 뼈': 'poisonBoneSkills', '저주': 'cursesSkills',
    '냉기': 'coldSkills', '번개': 'lightningSkills', '화염': 'fireSkills',
    '활과 쇠뇌': 'bowCrossbowSkills', '지속 효과와 마법': 'passiveMagicSkills', '투창과 창': 'javelinSpearSkills',
    '전투 기술': build.classId === 'barbarian' ? 'barbarianCombatSkills' : 'paladinCombatSkills',
    '공격 오라': 'offensiveAuraSkills', '방어 오라': 'defensiveAuraSkills', '전투 숙련': 'combatMasteriesSkills',
    '함성': 'warcriesSkills', '변신': 'shapeShiftingSkills', '원소': 'elementalSkills', '덫': 'trapsSkills',
    '그림자 단련': 'shadowDisciplinesSkills', '무술': 'martialArtsSkills', '악마 결속': 'demonicBindingSkills',
    '기괴 무기': 'eldritchWeaponsSkills', '혼돈 기술': 'artsOfChaosSkills',
  }
  return (modifiers.allSkills ?? 0)
    + (modifiers[classKeyById[build.classId]] ?? 0)
    + (modifiers[branchKeyByName[skill.branch]] ?? 0)
    + (modifiers[`skill:${skill.id}`] ?? 0)
}

export function calculateSummary(build: BuildProfile): BuildSummary {
  const classDefinition = CLASS_DEFINITIONS[build.classId]
  const rawModifiers = getEquipmentModifiers(build)
  const modifiers = mergeModifiers(rawModifiers, {
    strength: Math.floor((rawModifiers.strengthPerLevel ?? 0) * build.level),
    life: Math.floor((rawModifiers.lifePerLevel ?? 0) * build.level),
    mana: Math.floor((rawModifiers.manaPerLevel ?? 0) * build.level),
    magicFind: Math.floor((rawModifiers.magicFindPerLevel ?? 0) * build.level),
  })
  const attributes = {} as Record<AttributeId, number>
  for (const attribute of ['strength', 'dexterity', 'vitality', 'energy'] as AttributeId[]) {
    attributes[attribute] = classDefinition.base[attribute] + build.attributes[attribute] + (modifiers[attribute] ?? 0)
  }

  const addedVitality = attributes.vitality - classDefinition.base.vitality
  const addedEnergy = attributes.energy - classDefinition.base.energy
  const rawLife = classDefinition.baseLife + (build.level - 1) * classDefinition.lifePerLevel
    + addedVitality * classDefinition.lifePerVitality + (modifiers.life ?? 0)
  const rawMana = classDefinition.baseMana + (build.level - 1) * classDefinition.manaPerLevel
    + addedEnergy * classDefinition.manaPerEnergy + (modifiers.mana ?? 0)
  const difficultyPenalty = build.difficulty === 'hell' ? -100 : build.difficulty === 'nightmare' ? -40 : 0
  const resistanceBase = difficultyPenalty + build.questResistPoints + (modifiers.allResist ?? 0)

  return {
    attributes,
    life: Math.floor(rawLife * (1 + (modifiers.lifePercent ?? 0) / 100)),
    mana: Math.floor(rawMana * (1 + (modifiers.manaPercent ?? 0) / 100)),
    resistances: {
      fire: resistanceBase + (modifiers.fireResist ?? 0),
      cold: resistanceBase + (modifiers.coldResist ?? 0),
      lightning: resistanceBase + (modifiers.lightningResist ?? 0),
      poison: resistanceBase + (modifiers.poisonResist ?? 0),
    },
    fasterCastRate: modifiers.fasterCastRate ?? 0,
    fasterHitRecovery: modifiers.fasterHitRecovery ?? 0,
    fasterBlockRate: modifiers.fasterBlockRate ?? 0,
    increasedAttackSpeed: modifiers.increasedAttackSpeed ?? 0,
    fasterRunWalk: modifiers.fasterRunWalk ?? 0,
    magicFind: modifiers.magicFind ?? 0,
    goldFind: modifiers.goldFind ?? 0,
    allSkills: modifiers.allSkills ?? 0,
    spentSkillPoints: spentSkillPoints(build),
    availableSkillPoints: availableSkillPoints(build),
    spentStatPoints: spentStatPoints(build),
    availableStatPoints: availableStatPoints(build),
  }
}

export const BREAKPOINTS: Record<ClassId, { fcr: number[]; fhr: number[]; fbr: number[] }> = {
  amazon: { fcr: [0, 7, 14, 22, 32, 48, 68, 99, 152], fhr: [0, 6, 13, 20, 32, 52, 86, 174, 600], fbr: [0, 4, 6, 11, 15, 23, 29, 40, 56, 80, 120, 200, 480] },
  sorceress: {
    fcr: [0, 9, 20, 37, 63, 105, 200],
    fhr: [0, 5, 9, 14, 20, 30, 42, 60, 86, 142, 280],
    fbr: [0, 7, 15, 27, 48, 86, 200],
  },
  necromancer: {
    fcr: [0, 9, 18, 30, 48, 75, 125],
    fhr: [0, 5, 10, 16, 26, 39, 56, 86, 152, 377],
    fbr: [0, 6, 13, 20, 32, 52, 86, 174, 600],
  },
  paladin: { fcr: [0, 9, 18, 30, 48, 75, 125], fhr: [0, 7, 15, 27, 48, 86, 200], fbr: [0, 7, 15, 27, 48, 86, 200] },
  barbarian: { fcr: [0, 9, 20, 37, 63, 105, 200], fhr: [0, 7, 15, 27, 48, 86, 200], fbr: [0, 9, 20, 42, 86, 280] },
  druid: { fcr: [0, 4, 10, 19, 30, 46, 68, 99, 163], fhr: [0, 5, 10, 16, 26, 39, 56, 86, 152, 377], fbr: [0, 6, 13, 20, 32, 52, 86, 174, 600] },
  assassin: { fcr: [0, 8, 16, 27, 42, 65, 102, 174], fhr: [0, 7, 15, 27, 48, 86, 200], fbr: [0, 13, 32, 86, 600] },
  warlock: { fcr: [0, 9, 18, 30, 48, 75, 125], fhr: [0, 7, 15, 27, 48, 86, 200], fbr: [0, 7, 15, 27, 48, 86, 200] },
}

const BREAKPOINT_FRAMES: Record<ClassId, { fcr: number[]; fhr: number[]; fbr: number[] }> = {
  amazon: { fcr: [19, 18, 17, 16, 15, 14, 13, 12, 11], fhr: [11, 10, 9, 8, 7, 6, 5, 4, 3], fbr: [17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5] },
  sorceress: { fcr: [13, 12, 11, 10, 9, 8, 7], fhr: [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5], fbr: [9, 8, 7, 6, 5, 4, 3] },
  necromancer: { fcr: [15, 14, 13, 12, 11, 10, 9], fhr: [13, 12, 11, 10, 9, 8, 7, 6, 5, 4], fbr: [11, 10, 9, 8, 7, 6, 5, 4, 3] },
  paladin: { fcr: [15, 14, 13, 12, 11, 10, 9], fhr: [9, 8, 7, 6, 5, 4, 3], fbr: [8, 7, 6, 5, 4, 3, 2] },
  barbarian: { fcr: [13, 12, 11, 10, 9, 8, 7], fhr: [9, 8, 7, 6, 5, 4, 3], fbr: [7, 6, 5, 4, 3, 2] },
  druid: { fcr: [18, 17, 16, 15, 14, 13, 12, 11, 10], fhr: [13, 12, 11, 10, 9, 8, 7, 6, 5, 4], fbr: [11, 10, 9, 8, 7, 6, 5, 4, 3] },
  assassin: { fcr: [16, 15, 14, 13, 12, 11, 10, 9], fhr: [9, 8, 7, 6, 5, 4, 3], fbr: [8, 7, 6, 5, 4] },
  warlock: { fcr: [15, 14, 13, 12, 11, 10, 9], fhr: [9, 8, 7, 6, 5, 4, 3], fbr: [8, 7, 6, 5, 4, 3, 2] },
}

export function breakpointProgress(classId: ClassId, type: 'fcr' | 'fhr' | 'fbr', value: number) {
  const points = BREAKPOINTS[classId][type]
  const reached = [...points].reverse().find((point) => point <= value) ?? 0
  const next = points.find((point) => point > value)
  const index = points.indexOf(reached)
  return { reached, next, needed: next === undefined ? 0 : next - value, frame: BREAKPOINT_FRAMES[classId][type][index], nextFrame: next === undefined ? undefined : BREAKPOINT_FRAMES[classId][type][index + 1] }
}

export function emptyModifiers(): Modifiers {
  return Object.fromEntries(numericKeys.map((key) => [key, 0])) as Modifiers
}
