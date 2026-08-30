import { CLASS_DEFINITIONS } from '../data/classes'
import { ITEMS_BY_ID } from '../data/items'
import type { AttributeId, BuildProfile, BuildSummary, ClassId, Modifiers, SkillDefinition } from '../types'

const numericKeys: (keyof Modifiers)[] = [
  'strength', 'strengthPerLevel', 'dexterity', 'vitality', 'energy', 'life', 'mana', 'lifePerLevel',
  'manaPerLevel', 'lifePercent', 'manaPercent',
  'allSkills', 'necromancerSkills', 'sorceressSkills', 'summoningSkills', 'poisonBoneSkills',
  'cursesSkills', 'coldSkills', 'lightningSkills', 'fireSkills', 'fireResist', 'coldResist',
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
    return mergeModifiers(ITEMS_BY_ID[equipped.definitionId]?.modifiers, equipped.modifiers)
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
  const classKey = build.classId === 'necromancer' ? 'necromancerSkills' : 'sorceressSkills'
  const branchKeyByName: Record<string, keyof Modifiers> = {
    '소환': 'summoningSkills', '독과 뼈': 'poisonBoneSkills', '저주': 'cursesSkills',
    '냉기': 'coldSkills', '번개': 'lightningSkills', '화염': 'fireSkills',
  }
  return (modifiers.allSkills ?? 0)
    + (modifiers[classKey] ?? 0)
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
}

const BREAKPOINT_FRAMES: Record<ClassId, { fcr: number[]; fhr: number[]; fbr: number[] }> = {
  sorceress: { fcr: [13, 12, 11, 10, 9, 8, 7], fhr: [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5], fbr: [9, 8, 7, 6, 5, 4, 3] },
  necromancer: { fcr: [15, 14, 13, 12, 11, 10, 9], fhr: [13, 12, 11, 10, 9, 8, 7, 6, 5, 4], fbr: [11, 10, 9, 8, 7, 6, 5, 4, 3] },
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
