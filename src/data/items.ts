import type { ItemDefinition } from '../types'

export const ITEMS: ItemDefinition[] = [
  { id: 'custom', nameKo: '사용자 아이템', nameEn: 'Custom Item', category: 'custom', slots: ['head', 'amulet', 'weapon', 'offhand', 'armor', 'gloves', 'ring1', 'ring2', 'belt', 'boots', 'swapWeapon', 'swapOffhand', 'charm1', 'charm2', 'charm3', 'charm4'], note: '실제 보유 아이템의 옵션을 직접 입력하세요.', modifiers: {} },
  { id: 'harlequin-crest', nameKo: '할리퀸 관모', nameEn: 'Harlequin Crest', category: 'unique', slots: ['head'], requiredLevel: 62, note: '생명력과 마나는 캐릭터 레벨에 따라 자동 계산', modifiers: { allSkills: 2, strength: 2, dexterity: 2, vitality: 2, energy: 2, lifePerLevel: 1.5, manaPerLevel: 1.5, magicFind: 50, damageReduction: 10 } },
  { id: 'griffons-eye', nameKo: '그리폰의 눈', nameEn: "Griffon's Eye", category: 'unique', slots: ['head'], requiredLevel: 76, note: '적 번개 저항/번개 피해는 상세 피해 계산 단계에서 지원', modifiers: { allSkills: 1, fasterCastRate: 25 } },
  { id: 'nightwings-veil', nameKo: '밤날개의 너울', nameEn: "Nightwing's Veil", category: 'unique', slots: ['head'], requiredLevel: 67, modifiers: { allSkills: 2, dexterity: 15 } },
  { id: 'lore', nameKo: '전승', nameEn: 'Lore', category: 'runeword', slots: ['head'], requiredLevel: 27, modifiers: { allSkills: 1, energy: 10, lightningResist: 30 } },
  { id: 'flickering-flame', nameKo: '꺼져가는 불길', nameEn: 'Flickering Flame', category: 'runeword', slots: ['head'], requiredLevel: 55, modifiers: { fireSkills: 3, fireResist: 50 } },
  { id: 'maras', nameKo: '마라의 만화경', nameEn: "Mara's Kaleidoscope", category: 'unique', slots: ['amulet'], requiredLevel: 67, note: '변동 저항은 최대치 30 기준', modifiers: { allSkills: 2, strength: 5, dexterity: 5, vitality: 5, energy: 5, allResist: 30 } },
  { id: 'tal-amulet', nameKo: '탈 라샤의 선고', nameEn: "Tal Rasha's Adjudication", category: 'set', slots: ['amulet'], requiredLevel: 67, modifiers: { sorceressSkills: 2, life: 50, mana: 42, lightningResist: 33 } },
  { id: 'highlords', nameKo: '대군주의 진노', nameEn: "Highlord's Wrath", category: 'unique', slots: ['amulet'], requiredLevel: 65, modifiers: { allSkills: 1, increasedAttackSpeed: 20, lightningResist: 35 } },

  { id: 'heart-of-the-oak', nameKo: '참나무의 심장', nameEn: 'Heart of the Oak', category: 'runeword', slots: ['weapon', 'swapWeapon'], requiredLevel: 55, note: '모든 저항 최대치 40 기준', modifiers: { allSkills: 3, fasterCastRate: 40, allResist: 40, dexterity: 10, manaPercent: 15 } },
  { id: 'spirit-sword', nameKo: '영혼 (도검)', nameEn: 'Spirit Sword', category: 'runeword', slots: ['weapon', 'swapWeapon'], requiredLevel: 25, note: '시전 속도 최대치 35 기준', modifiers: { allSkills: 2, fasterCastRate: 35, fasterHitRecovery: 55, vitality: 22, mana: 112, magicDamageReduction: 8 } },
  { id: 'oculus', nameKo: '망울', nameEn: 'The Oculus', category: 'unique', slots: ['weapon'], requiredLevel: 42, modifiers: { sorceressSkills: 3, fasterCastRate: 30, vitality: 20, energy: 20, allResist: 20, magicFind: 50 } },
  { id: 'eschutas', nameKo: '에슈타의 성미', nameEn: "Eschuta's Temper", category: 'unique', slots: ['weapon'], requiredLevel: 72, modifiers: { sorceressSkills: 3, fasterCastRate: 40, energy: 30 } },
  { id: 'deaths-fathom', nameKo: '죽음의 깊이', nameEn: "Death's Fathom", category: 'unique', slots: ['weapon'], requiredLevel: 73, modifiers: { sorceressSkills: 3, fasterCastRate: 20, fireResist: 40, lightningResist: 40 } },
  { id: 'deaths-web', nameKo: '죽음의 거미줄', nameEn: "Death's Web", category: 'unique', slots: ['weapon'], requiredLevel: 66, modifiers: { allSkills: 2, poisonBoneSkills: 2, life: 12, mana: 12 } },
  { id: 'call-to-arms', nameKo: '소집', nameEn: 'Call to Arms', category: 'runeword', slots: ['swapWeapon'], requiredLevel: 57, note: '전투 명령/지시는 개별 기술 보너스이며 지속 효과 자동 적용은 미지원', modifiers: { allSkills: 1, increasedAttackSpeed: 40, 'skill:battle-command': 6, 'skill:battle-orders': 6 } },

  { id: 'spirit-shield', nameKo: '영혼 (방패)', nameEn: 'Spirit Shield', category: 'runeword', slots: ['offhand', 'swapOffhand'], requiredLevel: 54, note: '시전 속도 최대치 35 기준', modifiers: { allSkills: 2, fasterCastRate: 35, fasterHitRecovery: 55, vitality: 22, mana: 112, coldResist: 35, lightningResist: 35, poisonResist: 35, magicDamageReduction: 8 } },
  { id: 'homunculus', nameKo: '호문쿨루스', nameEn: 'Homunculus', category: 'unique', slots: ['offhand'], requiredLevel: 42, modifiers: { necromancerSkills: 2, cursesSkills: 2, energy: 20, allResist: 40, blockChance: 30 } },
  { id: 'trang-wing', nameKo: '트래그울의 날개', nameEn: "Trang-Oul's Wing", category: 'set', slots: ['offhand'], requiredLevel: 54, modifiers: { poisonBoneSkills: 2, strength: 25, dexterity: 15, fireResist: 45, poisonResist: 40, blockChance: 30 } },
  { id: 'lidless-wall', nameKo: '각성의 벽', nameEn: 'Lidless Wall', category: 'unique', slots: ['offhand'], requiredLevel: 41, modifiers: { allSkills: 1, fasterCastRate: 20, energy: 10, manaPercent: 10 } },
  { id: 'splendor', nameKo: '광채', nameEn: 'Splendor', category: 'runeword', slots: ['offhand'], requiredLevel: 37, modifiers: { allSkills: 1, fasterCastRate: 10, fasterBlockRate: 20, magicFind: 20 } },

  { id: 'enigma', nameKo: '수수께끼', nameEn: 'Enigma', category: 'runeword', slots: ['armor'], requiredLevel: 65, note: '레벨 비례 힘과 매찬을 자동 계산', modifiers: { allSkills: 2, strengthPerLevel: 0.75, fasterRunWalk: 45, damageReduction: 8, magicFindPerLevel: 1, 'skill:teleport': 1 } },
  { id: 'chains-of-honor', nameKo: '명예의 굴레', nameEn: 'Chains of Honor', category: 'runeword', slots: ['armor'], requiredLevel: 63, modifiers: { allSkills: 2, strength: 20, allResist: 65, damageReduction: 8, magicFind: 25 } },
  { id: 'vipermagi', nameKo: '독사마술사의 가죽', nameEn: 'Skin of the Vipermagi', category: 'unique', slots: ['armor'], requiredLevel: 29, note: '모든 저항 최대치 35 기준', modifiers: { allSkills: 1, fasterCastRate: 30, allResist: 35, magicDamageReduction: 13 } },
  { id: 'ormus', nameKo: '오르무스의 장포', nameEn: "Ormus' Robes", category: 'unique', slots: ['armor'], requiredLevel: 75, note: '무작위 개별 기술 +3은 사용자 옵션으로 추가', modifiers: { fasterCastRate: 20, mana: 15 } },
  { id: 'tal-armor', nameKo: '탈 라샤의 보호', nameEn: "Tal Rasha's Guardianship", category: 'set', slots: ['armor'], requiredLevel: 71, modifiers: { coldResist: 40, lightningResist: 40, fireResist: 40, magicDamageReduction: 15, magicFind: 88 } },
  { id: 'stealth', nameKo: '잠행', nameEn: 'Stealth', category: 'runeword', slots: ['armor'], requiredLevel: 17, modifiers: { fasterCastRate: 25, fasterHitRecovery: 25, fasterRunWalk: 25, dexterity: 6, mana: 15, poisonResist: 30 } },

  { id: 'magefist', nameKo: '마수', nameEn: 'Magefist', category: 'unique', slots: ['gloves'], requiredLevel: 23, modifiers: { fasterCastRate: 20, fireSkills: 1 } },
  { id: 'trang-gloves', nameKo: '트래그울의 발톱', nameEn: "Trang-Oul's Claws", category: 'set', slots: ['gloves'], requiredLevel: 45, modifiers: { fasterCastRate: 20, cursesSkills: 2, coldResist: 30 } },
  { id: 'frostburn', nameKo: '서리불꽃', nameEn: 'Frostburn', category: 'unique', slots: ['gloves'], requiredLevel: 29, modifiers: { manaPercent: 40 } },

  { id: 'stone-of-jordan', nameKo: '요르단의 반지', nameEn: 'Stone of Jordan', category: 'unique', slots: ['ring1', 'ring2'], requiredLevel: 29, modifiers: { allSkills: 1, mana: 20, manaPercent: 25 } },
  { id: 'bul-kathos', nameKo: '불카토스의 결혼 반지', nameEn: "Bul-Kathos' Wedding Band", category: 'unique', slots: ['ring1', 'ring2'], requiredLevel: 58, modifiers: { allSkills: 1, lifePerLevel: 0.5 } },
  { id: 'raven-frost', nameKo: '칠흑 서리', nameEn: 'Raven Frost', category: 'unique', slots: ['ring1', 'ring2'], requiredLevel: 45, modifiers: { dexterity: 20, mana: 40, coldResist: 20, cannotBeFrozen: 1 } },

  { id: 'arachnid-mesh', nameKo: '거미 그물띠', nameEn: 'Arachnid Mesh', category: 'unique', slots: ['belt'], requiredLevel: 80, modifiers: { allSkills: 1, fasterCastRate: 20, manaPercent: 5 } },
  { id: 'tal-belt', nameKo: '탈 라샤의 고운 띠', nameEn: "Tal Rasha's Fine-Spun Cloth", category: 'set', slots: ['belt'], requiredLevel: 53, modifiers: { dexterity: 20, mana: 30, magicFind: 15 } },
  { id: 'verdungos', nameKo: '베르둔고의 튼튼한 노끈', nameEn: "Verdungo's Hearty Cord", category: 'unique', slots: ['belt'], requiredLevel: 63, modifiers: { vitality: 40, fasterHitRecovery: 10, damageReduction: 15 } },

  { id: 'war-traveler', nameKo: '전쟁 여행자', nameEn: 'War Traveler', category: 'unique', slots: ['boots'], requiredLevel: 42, modifiers: { strength: 10, vitality: 10, fasterRunWalk: 25, magicFind: 50 } },
  { id: 'sandstorm-trek', nameKo: '모래폭풍 여로', nameEn: 'Sandstorm Trek', category: 'unique', slots: ['boots'], requiredLevel: 64, modifiers: { strength: 15, vitality: 15, fasterRunWalk: 20, fasterHitRecovery: 20, poisonResist: 70 } },
  { id: 'silkweave', nameKo: '비단매듭', nameEn: 'Silkweave', category: 'unique', slots: ['boots'], requiredLevel: 36, modifiers: { fasterRunWalk: 30, manaPercent: 10 } },

  { id: 'annihilus', nameKo: '어나이얼러스', nameEn: 'Annihilus', category: 'charm', slots: ['charm1', 'charm2', 'charm3', 'charm4'], requiredLevel: 70, note: '능력치와 저항 최대치 기준', modifiers: { allSkills: 1, strength: 20, dexterity: 20, vitality: 20, energy: 20, allResist: 20 } },
  { id: 'hellfire-torch-necro', nameKo: '지옥불 횃불 (네크로맨서)', nameEn: 'Hellfire Torch (Necromancer)', category: 'charm', slots: ['charm1', 'charm2', 'charm3', 'charm4'], requiredLevel: 75, note: '능력치와 저항 최대치 기준', modifiers: { necromancerSkills: 3, strength: 20, dexterity: 20, vitality: 20, energy: 20, allResist: 20 } },
  { id: 'hellfire-torch-sorc', nameKo: '지옥불 횃불 (원소술사)', nameEn: 'Hellfire Torch (Sorceress)', category: 'charm', slots: ['charm1', 'charm2', 'charm3', 'charm4'], requiredLevel: 75, note: '능력치와 저항 최대치 기준', modifiers: { sorceressSkills: 3, strength: 20, dexterity: 20, vitality: 20, energy: 20, allResist: 20 } },
  { id: 'sunder-cold', nameKo: '추위의 파열', nameEn: 'Cold Rupture', category: 'charm', slots: ['charm1', 'charm2', 'charm3', 'charm4'], requiredLevel: 75, note: '냉기 면역 파괴 · 플레이어 저항 페널티 최상급 -70 기준', modifiers: { coldResist: -70, coldSunder: 1 } },
  { id: 'sunder-poison', nameKo: '부패의 분열', nameEn: 'The Rotting Fissure', category: 'charm', slots: ['charm1', 'charm2', 'charm3', 'charm4'], requiredLevel: 75, note: '독 면역 파괴 · 플레이어 저항 페널티 최상급 -70 기준', modifiers: { poisonResist: -70, poisonSunder: 1 } },
  { id: 'cold-skiller', nameKo: '냉기 기술 거대 부적', nameEn: 'Chilling Grand Charm', category: 'charm', slots: ['charm1', 'charm2', 'charm3', 'charm4'], requiredLevel: 42, modifiers: { coldSkills: 1 } },
  { id: 'lightning-skiller', nameKo: '번개 기술 거대 부적', nameEn: 'Sparking Grand Charm', category: 'charm', slots: ['charm1', 'charm2', 'charm3', 'charm4'], requiredLevel: 42, modifiers: { lightningSkills: 1 } },
  { id: 'fire-skiller', nameKo: '화염 기술 거대 부적', nameEn: 'Burning Grand Charm', category: 'charm', slots: ['charm1', 'charm2', 'charm3', 'charm4'], requiredLevel: 42, modifiers: { fireSkills: 1 } },
  { id: 'summon-skiller', nameKo: '소환 기술 거대 부적', nameEn: 'Graverobber Grand Charm', category: 'charm', slots: ['charm1', 'charm2', 'charm3', 'charm4'], requiredLevel: 42, modifiers: { summoningSkills: 1 } },
  { id: 'pnb-skiller', nameKo: '독과 뼈 기술 거대 부적', nameEn: 'Fungal Grand Charm', category: 'charm', slots: ['charm1', 'charm2', 'charm3', 'charm4'], requiredLevel: 42, modifiers: { poisonBoneSkills: 1 } },
]

export const ITEMS_BY_ID = Object.fromEntries(ITEMS.map((item) => [item.id, item]))
