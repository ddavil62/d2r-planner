import type { BuildProfile, ClassId, EquipmentSlot } from '../types'

export interface BuildTemplate {
  id: string
  classId: ClassId
  name: string
  description: string
  skills: Record<string, number>
  attributes: BuildProfile['attributes']
  equipment: Partial<Record<EquipmentSlot, { definitionId: string }>>
}

export const BUILD_TEMPLATES: BuildTemplate[] = [
  {
    id: 'lightning-fury-amazon', classId: 'amazon', name: '번개 격노 아마존 골격',
    description: '번개 격노와 전류의 일격을 함께 사용하는 투창 중심 빌드',
    skills: { jab: 1, 'power-strike': 20, 'poison-javelin': 1, 'lightning-bolt': 1, 'charged-strike': 20, 'plague-javelin': 1, 'lightning-strike': 20, 'lightning-fury': 20, 'critical-strike': 1, penetrate: 1, pierce: 15 },
    attributes: { strength: 120, dexterity: 140, vitality: 200, energy: 0 },
    equipment: { head: { definitionId: 'griffons-eye' }, amulet: { definitionId: 'maras' }, armor: { definitionId: 'enigma' }, gloves: { definitionId: 'custom' }, belt: { definitionId: 'custom' }, boots: { definitionId: 'war-traveler' } },
  },
  {
    id: 'hammer-paladin', classId: 'paladin', name: '축복받은 망치 성기사 골격',
    description: '축복받은 망치와 집중, 원기를 조합한 대표적인 시전 빌드',
    skills: { 'holy-bolt': 1, 'blessed-hammer': 20, might: 1, 'blessed-aim': 20, concentration: 20, prayer: 1, cleansing: 1, defiance: 1, vigor: 20, redemption: 1, smite: 1, charge: 1, 'holy-shield': 13 },
    attributes: { strength: 120, dexterity: 100, vitality: 240, energy: 0 },
    equipment: { head: { definitionId: 'harlequin-crest' }, amulet: { definitionId: 'maras' }, weapon: { definitionId: 'heart-of-the-oak' }, offhand: { definitionId: 'spirit-shield' }, armor: { definitionId: 'enigma' }, gloves: { definitionId: 'magefist' }, belt: { definitionId: 'arachnid-mesh' }, boots: { definitionId: 'war-traveler' } },
  },
  {
    id: 'whirlwind-barbarian', classId: 'barbarian', name: '소용돌이 야만용사 골격',
    description: '소용돌이와 검 숙련, 전투 명령 계열을 갖춘 근접 빌드',
    skills: { bash: 1, leap: 1, stun: 1, 'leap-attack': 1, concentrate: 1, whirlwind: 20, 'blade-mastery': 20, 'iron-skin': 1, 'natural-resistance': 13, howl: 1, shout: 20, 'battle-orders': 20, 'battle-command': 1 },
    attributes: { strength: 180, dexterity: 80, vitality: 200, energy: 0 },
    equipment: { head: { definitionId: 'harlequin-crest' }, amulet: { definitionId: 'highlords' }, armor: { definitionId: 'enigma' }, belt: { definitionId: 'verdungos' }, boots: { definitionId: 'war-traveler' } },
  },
  {
    id: 'tornado-druid', classId: 'druid', name: '회오리바람 드루이드 골격',
    description: '회오리바람과 허리케인, 회오리 갑옷 시너지 중심의 원소 빌드',
    skills: { raven: 1, 'arctic-blast': 1, 'cyclone-armor': 20, twister: 20, tornado: 20, hurricane: 20, 'oak-sage': 19 },
    attributes: { strength: 120, dexterity: 0, vitality: 340, energy: 0 },
    equipment: { head: { definitionId: 'harlequin-crest' }, amulet: { definitionId: 'maras' }, weapon: { definitionId: 'heart-of-the-oak' }, offhand: { definitionId: 'spirit-shield' }, armor: { definitionId: 'enigma' }, gloves: { definitionId: 'magefist' }, belt: { definitionId: 'arachnid-mesh' }, boots: { definitionId: 'sandstorm-trek' } },
  },
  {
    id: 'lightning-trap-assassin', classId: 'assassin', name: '번개 덫 암살자 골격',
    description: '번개 파수기와 죽음 파수기, 그림자 기술을 조합한 덫 빌드',
    skills: { 'fire-trauma': 1, 'shock-field': 1, 'charged-bolt-sentry': 20, 'lightning-sentry': 20, 'death-sentry': 20, 'blade-sentinel': 1, 'wake-of-fire-sentry': 1, 'blade-fury': 1, 'claw-mastery': 1, quickness: 1, fade: 1, venom: 20, 'weapon-block': 1, 'psychic-hammer': 1, 'cloak-of-shadows': 1, 'shadow-warrior': 1, 'shadow-master': 9 },
    attributes: { strength: 120, dexterity: 80, vitality: 260, energy: 0 },
    equipment: { head: { definitionId: 'harlequin-crest' }, amulet: { definitionId: 'maras' }, armor: { definitionId: 'enigma' }, gloves: { definitionId: 'magefist' }, belt: { definitionId: 'arachnid-mesh' }, boots: { definitionId: 'sandstorm-trek' } },
  },
  {
    id: 'abyss-warlock', classId: 'warlock', name: '심연 악마술사 골격',
    description: '독기와 엔트로피를 축적해 심연과 대재앙으로 마무리하는 혼돈 빌드',
    skills: { 'miasma-bolt': 20, 'miasma-chains': 20, 'enhanced-entropy': 16, abyss: 20, 'ring-of-fire': 1, 'flame-wave': 20, 'sigil-lethargy': 1, 'sigil-rancor': 1, 'sigil-death': 1, apocalypse: 1 },
    attributes: { strength: 120, dexterity: 0, vitality: 220, energy: 120 },
    equipment: { head: { definitionId: 'harlequin-crest' }, amulet: { definitionId: 'maras' }, armor: { definitionId: 'enigma' }, gloves: { definitionId: 'magefist' }, belt: { definitionId: 'arachnid-mesh' }, boots: { definitionId: 'war-traveler' } },
  },
  {
    id: 'summon-necro', classId: 'necromancer', name: '조폭 네크 골격',
    description: '해골 군단과 시체 폭발 중심의 안정적인 사냥 빌드',
    skills: { 'raise-skeleton': 20, 'skeleton-mastery': 20, 'clay-golem': 1, 'golem-mastery': 1, 'raise-skeletal-mage': 20, 'blood-golem': 1, 'iron-golem': 1, 'summon-resist': 1, revive: 1, teeth: 1, 'corpse-explosion': 20, 'amplify-damage': 1, weaken: 1, terror: 1, decrepify: 1 },
    attributes: { strength: 80, dexterity: 0, vitality: 380, energy: 0 },
    equipment: { head: { definitionId: 'harlequin-crest' }, amulet: { definitionId: 'maras' }, weapon: { definitionId: 'heart-of-the-oak' }, offhand: { definitionId: 'homunculus' }, armor: { definitionId: 'enigma' }, gloves: { definitionId: 'trang-gloves' }, ring1: { definitionId: 'stone-of-jordan' }, ring2: { definitionId: 'stone-of-jordan' }, belt: { definitionId: 'arachnid-mesh' }, boots: { definitionId: 'war-traveler' }, swapWeapon: { definitionId: 'call-to-arms' }, swapOffhand: { definitionId: 'spirit-shield' } },
  },
  {
    id: 'poison-necro', classId: 'necromancer', name: '독조넥 골격',
    description: '맹독 확산과 저항 감소, 시체 폭발을 조합한 사냥 빌드',
    skills: { 'poison-dagger': 20, teeth: 1, 'corpse-explosion': 1, 'poison-explosion': 20, 'poison-nova': 20, 'amplify-damage': 1, weaken: 1, terror: 1, decrepify: 1, 'iron-maiden': 1, 'life-tap': 1, 'lower-resist': 10, 'clay-golem': 1, 'golem-mastery': 1, 'summon-resist': 1, 'raise-skeleton': 1, 'skeleton-mastery': 1, 'raise-skeletal-mage': 1, 'blood-golem': 1, 'iron-golem': 1, revive: 1 },
    attributes: { strength: 80, dexterity: 0, vitality: 380, energy: 0 },
    equipment: { head: { definitionId: 'harlequin-crest' }, amulet: { definitionId: 'maras' }, weapon: { definitionId: 'deaths-web' }, offhand: { definitionId: 'trang-wing' }, armor: { definitionId: 'enigma' }, gloves: { definitionId: 'trang-gloves' }, ring1: { definitionId: 'stone-of-jordan' }, ring2: { definitionId: 'stone-of-jordan' }, belt: { definitionId: 'arachnid-mesh' }, boots: { definitionId: 'sandstorm-trek' }, charm1: { definitionId: 'sunder-poison' }, charm2: { definitionId: 'hellfire-torch-necro' }, charm3: { definitionId: 'annihilus' }, charm4: { definitionId: 'pnb-skiller' } },
  },
  {
    id: 'bone-necro', classId: 'necromancer', name: '본 네크 골격',
    description: '뼈 창과 뼈 영혼, 방어 시너지에 집중한 마법 피해 빌드',
    skills: { teeth: 19, 'bone-armor': 1, 'corpse-explosion': 1, 'bone-wall': 20, 'bone-spear': 20, 'bone-prison': 20, 'bone-spirit': 20 },
    attributes: { strength: 80, dexterity: 0, vitality: 380, energy: 0 },
    equipment: { head: { definitionId: 'harlequin-crest' }, amulet: { definitionId: 'maras' }, weapon: { definitionId: 'heart-of-the-oak' }, offhand: { definitionId: 'spirit-shield' }, armor: { definitionId: 'enigma' }, gloves: { definitionId: 'trang-gloves' }, ring1: { definitionId: 'stone-of-jordan' }, ring2: { definitionId: 'stone-of-jordan' }, belt: { definitionId: 'arachnid-mesh' }, boots: { definitionId: 'sandstorm-trek' } },
  },
  {
    id: 'blizzard-sorc', classId: 'sorceress', name: '눈보라 소서 골격',
    description: '눈보라와 냉기 시너지, 105 패캐를 목표로 한 사냥 빌드',
    skills: { 'ice-bolt': 20, 'ice-blast': 20, 'frost-nova': 1, 'glacial-spike': 20, blizzard: 20, 'cold-mastery': 15, 'static-field': 1, telekinesis: 1, teleport: 1, warmth: 1 },
    attributes: { strength: 146, dexterity: 0, vitality: 314, energy: 0 },
    equipment: { head: { definitionId: 'nightwings-veil' }, amulet: { definitionId: 'maras' }, weapon: { definitionId: 'deaths-fathom' }, offhand: { definitionId: 'spirit-shield' }, armor: { definitionId: 'vipermagi' }, gloves: { definitionId: 'magefist' }, ring1: { definitionId: 'stone-of-jordan' }, ring2: { definitionId: 'stone-of-jordan' }, belt: { definitionId: 'arachnid-mesh' }, boots: { definitionId: 'war-traveler' }, charm1: { definitionId: 'sunder-cold' }, charm2: { definitionId: 'hellfire-torch-sorc' }, charm3: { definitionId: 'annihilus' }, charm4: { definitionId: 'cold-skiller' } },
  },
  {
    id: 'nova-sorc', classId: 'sorceress', name: '번개 파장 소서 골격',
    description: '전자기장, 번개 파장, 마력 보호막에 집중한 근접 광역 빌드',
    skills: { 'charged-bolt': 1, 'static-field': 20, telekinesis: 20, nova: 20, lightning: 1, 'chain-lightning': 1, teleport: 1, 'energy-shield': 20, 'lightning-mastery': 17 },
    attributes: { strength: 146, dexterity: 0, vitality: 100, energy: 214 },
    equipment: { head: { definitionId: 'griffons-eye' }, amulet: { definitionId: 'maras' }, weapon: { definitionId: 'heart-of-the-oak' }, offhand: { definitionId: 'spirit-shield' }, armor: { definitionId: 'vipermagi' }, gloves: { definitionId: 'magefist' }, ring1: { definitionId: 'stone-of-jordan' }, ring2: { definitionId: 'stone-of-jordan' }, belt: { definitionId: 'arachnid-mesh' }, boots: { definitionId: 'silkweave' }, charm1: { definitionId: 'hellfire-torch-sorc' }, charm2: { definitionId: 'annihilus' }, charm3: { definitionId: 'lightning-skiller' } },
  },
  {
    id: 'hydra-sorc', classId: 'sorceress', name: '히드라 소서 골격',
    description: '히드라와 화염구를 함께 사용하는 안정적인 화염 빌드',
    skills: { 'fire-bolt': 20, warmth: 20, 'fire-ball': 20, enchant: 1, hydra: 20, 'fire-mastery': 20 },
    attributes: { strength: 146, dexterity: 0, vitality: 314, energy: 0 },
    equipment: { head: { definitionId: 'flickering-flame' }, amulet: { definitionId: 'maras' }, weapon: { definitionId: 'eschutas' }, offhand: { definitionId: 'spirit-shield' }, armor: { definitionId: 'vipermagi' }, gloves: { definitionId: 'magefist' }, ring1: { definitionId: 'stone-of-jordan' }, ring2: { definitionId: 'stone-of-jordan' }, belt: { definitionId: 'arachnid-mesh' }, boots: { definitionId: 'war-traveler' }, charm1: { definitionId: 'hellfire-torch-sorc' }, charm2: { definitionId: 'annihilus' }, charm3: { definitionId: 'fire-skiller' } },
  },
]
