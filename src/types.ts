export type ClassId = 'amazon' | 'sorceress' | 'necromancer' | 'paladin' | 'barbarian' | 'druid' | 'assassin' | 'warlock'
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
  amazonSkills?: number
  paladinSkills?: number
  barbarianSkills?: number
  druidSkills?: number
  assassinSkills?: number
  warlockSkills?: number
  summoningSkills?: number
  poisonBoneSkills?: number
  cursesSkills?: number
  coldSkills?: number
  lightningSkills?: number
  fireSkills?: number
  bowCrossbowSkills?: number
  passiveMagicSkills?: number
  javelinSpearSkills?: number
  paladinCombatSkills?: number
  offensiveAuraSkills?: number
  defensiveAuraSkills?: number
  barbarianCombatSkills?: number
  combatMasteriesSkills?: number
  warcriesSkills?: number
  druidSummoningSkills?: number
  shapeShiftingSkills?: number
  elementalSkills?: number
  trapsSkills?: number
  shadowDisciplinesSkills?: number
  martialArtsSkills?: number
  demonicBindingSkills?: number
  eldritchWeaponsSkills?: number
  artsOfChaosSkills?: number
  fireResist?: number
  coldResist?: number
  lightningResist?: number
  poisonResist?: number
  allResist?: number
  fasterCastRate?: number
  fasterHitRecovery?: number
  fasterBlockRate?: number
  increasedAttackSpeed?: number
  enhancedDamage?: number
  flatMinDamage?: number
  flatMaxDamage?: number
  fireMinDamage?: number
  fireMaxDamage?: number
  coldMinDamage?: number
  coldMaxDamage?: number
  lightningMinDamage?: number
  lightningMaxDamage?: number
  magicMinDamage?: number
  magicMaxDamage?: number
  crushingBlow?: number
  deadlyStrike?: number
  deadlyStrikePerLevel?: number
  openWounds?: number
  lifeSteal?: number
  manaSteal?: number
  attackRating?: number
  attackRatingPercent?: number
  enemyFireResistance?: number
  enemyColdResistance?: number
  enemyLightningResistance?: number
  enemyPoisonResistance?: number
  enemyMagicResistance?: number
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
  catalogId?: string
  name?: string
  modifiers?: Modifiers
  baseWeaponCode?: string
  ethereal?: boolean
}

export interface WeaponBase {
  code: string
  name: string
  types: readonly string[]
  minDamage: number
  maxDamage: number
  twoHanded: boolean
  strengthBonus: number
  dexterityBonus: number
  speed: number
  requiredLevel: number
  maxSockets: number
}

export interface InventoryItem {
  id: string
  definitionId: string
  x: number
  y: number
}

export interface CatalogItem {
  id: string
  name: string
  nameKo: string
  baseName: string
  baseNameKo: string
  aliases: readonly string[]
  category: 'unique' | 'set' | 'runeword'
  requiredLevel: number
  slot: 'head' | 'amulet' | 'weapon' | 'offhand' | 'armor' | 'gloves' | 'ring' | 'belt' | 'boots' | 'charm'
  width: number
  height: number
  properties: readonly string[]
  modifiers: Modifiers
  baseCode?: string
  allowedBaseTypes?: readonly string[]
  excludedBaseTypes?: readonly string[]
  requiredSockets?: number
}

export interface CombatSummary {
  ready: boolean
  weaponName?: string
  baseWeaponName?: string
  physicalMin: number
  physicalMax: number
  elementalMin: number
  elementalMax: number
  averageHit: number
  weaponEnhancedDamage: number
  attributeDamageBonus: number
  increasedAttackSpeed: number
  crushingBlow: number
  deadlyStrike: number
  openWounds: number
  enemyResistReduction: Record<'fire' | 'cold' | 'lightning' | 'poison' | 'magic', number>
  missingBase: boolean
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
  inventory: InventoryItem[]
  activeWeaponSet: 1 | 2
  notes: string
  createdAt: string
  updatedAt: string
  schemaVersion: 2
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
