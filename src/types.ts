export type ClassId = 'necromancer' | 'sorceress'
export type Difficulty = 'normal' | 'nightmare' | 'hell'
export type AttributeId = 'strength' | 'dexterity' | 'vitality' | 'energy'
export type EquipmentSlot =
  | 'head'
  | 'amulet'
  | 'weapon'
  | 'offhand'
  | 'armor'
  | 'gloves'
  | 'ring1'
  | 'ring2'
  | 'belt'
  | 'boots'
  | 'swapWeapon'
  | 'swapOffhand'
  | 'charm1'
  | 'charm2'
  | 'charm3'
  | 'charm4'

export interface SkillDefinition {
  id: string
  nameKo: string
  nameEn: string
  dataKey?: string
  branch: string
  row: number
  col: number
  requiredLevel: number
  prerequisites?: string[]
  description: string
}

export interface ClassDefinition {
  id: ClassId
  nameKo: string
  nameEn: string
  accent: string
  branches: string[]
  base: Record<AttributeId, number>
  baseLife: number
  baseMana: number
  lifePerLevel: number
  manaPerLevel: number
  lifePerVitality: number
  manaPerEnergy: number
  skills: SkillDefinition[]
}

export interface Modifiers {
  strength?: number
  strengthPerLevel?: number
  dexterity?: number
  vitality?: number
  energy?: number
  life?: number
  mana?: number
  lifePerLevel?: number
  manaPerLevel?: number
  lifePercent?: number
  manaPercent?: number
  allSkills?: number
  necromancerSkills?: number
  sorceressSkills?: number
  summoningSkills?: number
  poisonBoneSkills?: number
  cursesSkills?: number
  coldSkills?: number
  lightningSkills?: number
  fireSkills?: number
  fireResist?: number
  coldResist?: number
  lightningResist?: number
  poisonResist?: number
  allResist?: number
  fasterCastRate?: number
  fasterHitRecovery?: number
  fasterBlockRate?: number
  increasedAttackSpeed?: number
  fasterRunWalk?: number
  magicFind?: number
  magicFindPerLevel?: number
  goldFind?: number
  damageReduction?: number
  magicDamageReduction?: number
  blockChance?: number
  cannotBeFrozen?: number
  coldSunder?: number
  poisonSunder?: number
  [skillId: `skill:${string}`]: number | undefined
}

export interface ItemDefinition {
  id: string
  nameKo: string
  nameEn: string
  category: 'unique' | 'set' | 'runeword' | 'custom' | 'charm'
  slots: EquipmentSlot[]
  requiredLevel?: number
  note?: string
  modifiers: Modifiers
}

export interface EquippedItem {
  definitionId: string
  name?: string
  modifiers?: Modifiers
}

export interface BuildProfile {
  id: string
  name: string
  classId: ClassId
  level: number
  difficulty: Difficulty
  questSkillPoints: number
  questStatPoints: number
  questResistPoints: number
  attributes: Record<AttributeId, number>
  skills: Record<string, number>
  equipment: Partial<Record<EquipmentSlot, EquippedItem>>
  activeWeaponSet: 1 | 2
  notes: string
  createdAt: string
  updatedAt: string
  schemaVersion: 1
  gameVersion: '3.3'
  era: 'reign-of-the-warlock'
  ladder: false
}

export interface BuildSummary {
  attributes: Record<AttributeId, number>
  life: number
  mana: number
  resistances: Record<'fire' | 'cold' | 'lightning' | 'poison', number>
  fasterCastRate: number
  fasterHitRecovery: number
  fasterBlockRate: number
  increasedAttackSpeed: number
  fasterRunWalk: number
  magicFind: number
  goldFind: number
  allSkills: number
  spentSkillPoints: number
  availableSkillPoints: number
  spentStatPoints: number
  availableStatPoints: number
}
