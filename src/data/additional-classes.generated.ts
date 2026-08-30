// Generated from installed Reign of the Warlock 3.3 data and pinned koKR strings.
import type { ClassDefinition, ClassId } from '../types'

export const ADDITIONAL_CLASS_DEFINITIONS = {
  "amazon": {
    "id": "amazon",
    "nameKo": "아마존",
    "nameEn": "Amazon",
    "accent": "#d5a84f",
    "branches": [
      "활과 쇠뇌",
      "지속 효과와 마법",
      "투창과 창"
    ],
    "base": {
      "strength": 20,
      "dexterity": 25,
      "vitality": 20,
      "energy": 15
    },
    "baseLife": 50,
    "baseMana": 15,
    "lifePerLevel": 2,
    "manaPerLevel": 1.5,
    "lifePerVitality": 3,
    "manaPerEnergy": 1.5,
    "skills": [
      {
        "id": "magic-arrow",
        "nameKo": "마법 화살",
        "nameEn": "Magic Arrow",
        "dataKey": "Magic Arrow",
        "branch": "활과 쇠뇌",
        "row": 1,
        "col": 2,
        "requiredLevel": 1,
        "description": "추가 피해를 주는 마법 화살을 생성합니다.",
        "prerequisites": []
      },
      {
        "id": "fire-arrow",
        "nameKo": "불꽃 화살",
        "nameEn": "Fire Arrow",
        "dataKey": "Fire Arrow",
        "branch": "활과 쇠뇌",
        "row": 1,
        "col": 3,
        "requiredLevel": 1,
        "description": "마법으로 화살을 강화하여 화염 피해를 줍니다.",
        "prerequisites": []
      },
      {
        "id": "inner-sight",
        "nameKo": "내면의 시야",
        "nameEn": "Inner Sight",
        "dataKey": "Inner Sight",
        "branch": "지속 효과와 마법",
        "row": 1,
        "col": 1,
        "requiredLevel": 1,
        "description": "주위의 적에게 빛을 비춰 자신과 파티원의 적중률을 향상시킵니다.",
        "prerequisites": []
      },
      {
        "id": "critical-strike",
        "nameKo": "치명타",
        "nameEn": "Critical Strike",
        "dataKey": "Critical Strike",
        "branch": "지속 효과와 마법",
        "row": 1,
        "col": 3,
        "requiredLevel": 1,
        "description": "지속 효과 - 공격할 때 일정 확률로 2배의 피해를 줍니다.",
        "prerequisites": []
      },
      {
        "id": "jab",
        "nameKo": "찌르기",
        "nameEn": "Jab",
        "dataKey": "Jab",
        "branch": "투창과 창",
        "row": 1,
        "col": 1,
        "requiredLevel": 1,
        "description": "투창 또는 창 유형의 무기를 빠르게 연속으로 찔러 공격합니다.",
        "prerequisites": []
      },
      {
        "id": "cold-arrow",
        "nameKo": "냉기 화살",
        "nameEn": "Cold Arrow",
        "dataKey": "Cold Arrow",
        "branch": "활과 쇠뇌",
        "row": 2,
        "col": 1,
        "requiredLevel": 6,
        "description": "마법으로 화살을 강화하여 냉기 피해와 감속 효과를 추가합니다. 냉기 화살은 일반 피해의 절반에 해당하는 피해를 줍니다.",
        "prerequisites": []
      },
      {
        "id": "multiple-shot",
        "nameKo": "다발 사격",
        "nameEn": "Multiple Shot",
        "dataKey": "Multiple Shot",
        "branch": "활과 쇠뇌",
        "row": 2,
        "col": 2,
        "requiredLevel": 6,
        "description": "마법으로 하나의 화살을 여러 개로 분열시킵니다.",
        "prerequisites": [
          "magic-arrow"
        ]
      },
      {
        "id": "dodge",
        "nameKo": "흘리기",
        "nameEn": "Dodge",
        "dataKey": "Dodge",
        "branch": "지속 효과와 마법",
        "row": 2,
        "col": 2,
        "requiredLevel": 6,
        "description": "지속 효과 - 공격하거나 가만히 서 있을 때 일정 확률로 근접 공격을 흘려 냅니다.",
        "prerequisites": []
      },
      {
        "id": "power-strike",
        "nameKo": "전기의 일격",
        "nameEn": "Power Strike",
        "dataKey": "Power Strike",
        "branch": "투창과 창",
        "row": 2,
        "col": 2,
        "requiredLevel": 6,
        "description": "투창 및 창 유형의 무기에 번개 피해를 추가합니다.",
        "prerequisites": [
          "jab"
        ]
      },
      {
        "id": "poison-javelin",
        "nameKo": "맹독 투창",
        "nameEn": "Poison Javelin",
        "dataKey": "Poison Javelin",
        "branch": "투창과 창",
        "row": 2,
        "col": 3,
        "requiredLevel": 6,
        "description": "마법으로 투창을 강화하여 독 구름의 흔적을 남기게 합니다.",
        "prerequisites": []
      },
      {
        "id": "exploding-arrow",
        "nameKo": "폭발 화살",
        "nameEn": "Exploding Arrow",
        "dataKey": "Exploding Arrow",
        "branch": "활과 쇠뇌",
        "row": 3,
        "col": 3,
        "requiredLevel": 12,
        "description": "화살을 강화하여 접촉 시 폭발을 일으키고 주위의 모든 적에게 피해를 줍니다.",
        "prerequisites": [
          "fire-arrow",
          "multiple-shot"
        ]
      },
      {
        "id": "slow-missiles",
        "nameKo": "투사체 감속",
        "nameEn": "Slow Missiles",
        "dataKey": "Slow Missiles",
        "branch": "지속 효과와 마법",
        "row": 3,
        "col": 1,
        "requiredLevel": 12,
        "description": "주위의 적에게 빛을 비추고 대상의 투사체 속도를 감소시킵니다.",
        "prerequisites": [
          "inner-sight"
        ]
      },
      {
        "id": "avoid",
        "nameKo": "회피",
        "nameEn": "Avoid",
        "dataKey": "Avoid",
        "branch": "지속 효과와 마법",
        "row": 3,
        "col": 2,
        "requiredLevel": 12,
        "description": "지속 효과 - 공격하거나 가만히 서 있을 때 일정 확률로 적의 투사체를 회피합니다.",
        "prerequisites": [
          "dodge"
        ]
      },
      {
        "id": "impale",
        "nameKo": "꿰뚫기",
        "nameEn": "Impale",
        "dataKey": "Impale",
        "branch": "투창과 창",
        "row": 3,
        "col": 1,
        "requiredLevel": 12,
        "description": "공격력이 증가하지만 무기가 빠르게 손상됩니다.",
        "prerequisites": [
          "jab"
        ]
      },
      {
        "id": "lightning-bolt",
        "nameKo": "번갯불",
        "nameEn": "Lightning Bolt",
        "dataKey": "Lightning Bolt",
        "branch": "투창과 창",
        "row": 3,
        "col": 3,
        "requiredLevel": 12,
        "description": "마법으로 투창을 번개의 창으로 전환합니다.",
        "prerequisites": [
          "poison-javelin"
        ]
      },
      {
        "id": "ice-arrow",
        "nameKo": "얼음 화살",
        "nameEn": "Ice Arrow",
        "dataKey": "Ice Arrow",
        "branch": "활과 쇠뇌",
        "row": 4,
        "col": 1,
        "requiredLevel": 18,
        "description": "마법으로 화살을 강화하여 적을 빙결시킵니다.",
        "prerequisites": [
          "cold-arrow"
        ]
      },
      {
        "id": "guided-arrow",
        "nameKo": "유도 화살",
        "nameEn": "Guided Arrow",
        "dataKey": "Guided Arrow",
        "branch": "활과 쇠뇌",
        "row": 4,
        "col": 2,
        "requiredLevel": 18,
        "description": "화살을 강화하여 대상 또는 다른 적을 추적하게 합니다.",
        "prerequisites": [
          "cold-arrow",
          "multiple-shot"
        ]
      },
      {
        "id": "penetrate",
        "nameKo": "간파",
        "nameEn": "Penetrate",
        "dataKey": "Penetrate",
        "branch": "지속 효과와 마법",
        "row": 4,
        "col": 3,
        "requiredLevel": 18,
        "description": "지속 효과 - 명중률이 증가합니다.",
        "prerequisites": [
          "critical-strike"
        ]
      },
      {
        "id": "charged-strike",
        "nameKo": "전류의 일격",
        "nameEn": "Charged Strike",
        "dataKey": "Charged Strike",
        "branch": "투창과 창",
        "row": 4,
        "col": 2,
        "requiredLevel": 18,
        "description": "투창 및 창 유형의 무기에 번개 피해를 추가하고, 적중 시 번개 줄기를 방출하게 합니다.",
        "prerequisites": [
          "power-strike",
          "lightning-bolt"
        ]
      },
      {
        "id": "plague-javelin",
        "nameKo": "역병 투창",
        "nameEn": "Plague Javelin",
        "dataKey": "Plague Javelin",
        "branch": "투창과 창",
        "row": 4,
        "col": 3,
        "requiredLevel": 18,
        "description": "마법으로 투창을 강화하여 적중 시 점점 커지는 독 구름을 방출하게 합니다.",
        "prerequisites": [
          "lightning-bolt"
        ]
      },
      {
        "id": "strafe",
        "nameKo": "속사",
        "nameEn": "Strafe",
        "dataKey": "Strafe",
        "branch": "활과 쇠뇌",
        "row": 5,
        "col": 2,
        "requiredLevel": 24,
        "description": "마법으로 하나의 화살을 여러 개로 분열시켜 주위의 적 다수를 공격합니다.",
        "prerequisites": [
          "guided-arrow"
        ]
      },
      {
        "id": "immolation-arrow",
        "nameKo": "점화 화살",
        "nameEn": "Immolation Arrow",
        "dataKey": "Immolation Arrow",
        "branch": "활과 쇠뇌",
        "row": 5,
        "col": 3,
        "requiredLevel": 24,
        "description": "화살을 강화하여 큰 화염 피해를 주고 적중 시 거대한 불길을 생성합니다.",
        "prerequisites": [
          "exploding-arrow"
        ]
      },
      {
        "id": "dopplezon",
        "nameKo": "미끼",
        "nameEn": "Dopplezon",
        "dataKey": "Dopplezon",
        "branch": "지속 효과와 마법",
        "row": 5,
        "col": 1,
        "requiredLevel": 24,
        "description": "자신의 복제물을 만들어 적의 공격을 유도합니다.",
        "prerequisites": [
          "slow-missiles"
        ]
      },
      {
        "id": "evade",
        "nameKo": "피하기",
        "nameEn": "Evade",
        "dataKey": "Evade",
        "branch": "지속 효과와 마법",
        "row": 5,
        "col": 2,
        "requiredLevel": 24,
        "description": "지속 효과 - 걷거나 뛰고 있을 때 일정 확률로 근접 또는 투사체 공격을 회피합니다.",
        "prerequisites": [
          "avoid"
        ]
      },
      {
        "id": "fend",
        "nameKo": "난격",
        "nameEn": "Fend",
        "dataKey": "Fend",
        "branch": "투창과 창",
        "row": 5,
        "col": 1,
        "requiredLevel": 24,
        "description": "인접한 대상을 모두 공격합니다.",
        "prerequisites": [
          "impale"
        ]
      },
      {
        "id": "freezing-arrow",
        "nameKo": "빙결 화살",
        "nameEn": "Freezing Arrow",
        "dataKey": "Freezing Arrow",
        "branch": "활과 쇠뇌",
        "row": 6,
        "col": 1,
        "requiredLevel": 30,
        "description": "마법으로 화살을 강화하여 적 무리를 모두 빙결시킵니다.",
        "prerequisites": [
          "ice-arrow"
        ]
      },
      {
        "id": "valkyrie",
        "nameKo": "발키리",
        "nameEn": "Valkyrie",
        "dataKey": "Valkyrie",
        "branch": "지속 효과와 마법",
        "row": 6,
        "col": 1,
        "requiredLevel": 30,
        "description": "강력한 발키리 동료를 소환합니다.",
        "prerequisites": [
          "dopplezon",
          "evade"
        ]
      },
      {
        "id": "pierce",
        "nameKo": "관통",
        "nameEn": "Pierce",
        "dataKey": "Pierce",
        "branch": "지속 효과와 마법",
        "row": 6,
        "col": 3,
        "requiredLevel": 30,
        "description": "지속 효과 - 투사체가 일정 확률로 적중한 적을 관통합니다.",
        "prerequisites": [
          "penetrate"
        ]
      },
      {
        "id": "lightning-strike",
        "nameKo": "번개의 일격",
        "nameEn": "Lightning Strike",
        "dataKey": "Lightning Strike",
        "branch": "투창과 창",
        "row": 6,
        "col": 2,
        "requiredLevel": 30,
        "description": "투창 및 창 유형의 무기에 번개 피해를 추가하고, 적중 시 연쇄 번개를 방출하게 합니다.",
        "prerequisites": [
          "charged-strike"
        ]
      },
      {
        "id": "lightning-fury",
        "nameKo": "번개의 격노",
        "nameEn": "Lightning Fury",
        "dataKey": "Lightning Fury",
        "branch": "투창과 창",
        "row": 6,
        "col": 3,
        "requiredLevel": 30,
        "description": "투척한 투창을 강력한 번개의 창으로 변형하고 적중 시 여러 개로 분열시킵니다.",
        "prerequisites": [
          "plague-javelin"
        ]
      }
    ]
  },
  "paladin": {
    "id": "paladin",
    "nameKo": "성기사",
    "nameEn": "Paladin",
    "accent": "#d9c879",
    "branches": [
      "전투 기술",
      "공격 오라",
      "방어 오라"
    ],
    "base": {
      "strength": 25,
      "dexterity": 20,
      "vitality": 25,
      "energy": 15
    },
    "baseLife": 55,
    "baseMana": 15,
    "lifePerLevel": 2,
    "manaPerLevel": 1.5,
    "lifePerVitality": 3,
    "manaPerEnergy": 1.5,
    "skills": [
      {
        "id": "sacrifice",
        "nameKo": "희생",
        "nameEn": "Sacrifice",
        "dataKey": "Sacrifice",
        "branch": "전투 기술",
        "row": 1,
        "col": 1,
        "requiredLevel": 1,
        "description": "생명력을 희생하여 명중률과 공격력을 증가시킵니다.",
        "prerequisites": []
      },
      {
        "id": "smite",
        "nameKo": "강타",
        "nameEn": "Smite",
        "dataKey": "Smite",
        "branch": "전투 기술",
        "row": 1,
        "col": 3,
        "requiredLevel": 1,
        "description": "적을 방패로 강타하여 일시적으로 기절시킵니다.",
        "prerequisites": []
      },
      {
        "id": "might",
        "nameKo": "위세",
        "nameEn": "Might",
        "dataKey": "Might",
        "branch": "공격 오라",
        "row": 1,
        "col": 1,
        "requiredLevel": 1,
        "description": "오라를 활성화하면 자신과 파티원의 공격력이 증가합니다.",
        "prerequisites": []
      },
      {
        "id": "prayer",
        "nameKo": "기도",
        "nameEn": "Prayer",
        "dataKey": "Prayer",
        "branch": "방어 오라",
        "row": 1,
        "col": 1,
        "requiredLevel": 1,
        "description": "오라를 활성화하면 자신과 파티원의 생명력이 서서히 회복됩니다.",
        "prerequisites": []
      },
      {
        "id": "resist-fire",
        "nameKo": "화염 저항",
        "nameEn": "Resist Fire",
        "dataKey": "Resist Fire",
        "branch": "방어 오라",
        "row": 1,
        "col": 3,
        "requiredLevel": 1,
        "description": "오라를 활성화하면 자신과 파티원이 받는 화염 피해가 감소합니다.",
        "prerequisites": []
      },
      {
        "id": "holy-bolt",
        "nameKo": "신성한 빛줄기",
        "nameEn": "Holy Bolt",
        "dataKey": "Holy Bolt",
        "branch": "전투 기술",
        "row": 2,
        "col": 2,
        "requiredLevel": 6,
        "description": "신성한 마력으로 언데드 적에게 피해를 주고 아군을 치유합니다.",
        "prerequisites": []
      },
      {
        "id": "holy-fire",
        "nameKo": "신성한 불꽃",
        "nameEn": "Holy Fire",
        "dataKey": "Holy Fire",
        "branch": "공격 오라",
        "row": 2,
        "col": 2,
        "requiredLevel": 6,
        "description": "오라를 활성화하면 천상의 불길로 주위의 적에게 피해를 주고 공격에 화염 피해를 추가합니다.",
        "prerequisites": [
          "might"
        ]
      },
      {
        "id": "thorns",
        "nameKo": "가시",
        "nameEn": "Thorns",
        "dataKey": "Thorns",
        "branch": "공격 오라",
        "row": 2,
        "col": 3,
        "requiredLevel": 6,
        "description": "오라를 활성화하면 자신이 받는 피해를 공격자에게 반사합니다.",
        "prerequisites": []
      },
      {
        "id": "defiance",
        "nameKo": "인내",
        "nameEn": "Defiance",
        "dataKey": "Defiance",
        "branch": "방어 오라",
        "row": 2,
        "col": 2,
        "requiredLevel": 6,
        "description": "오라를 활성화하면 자신과 파티원의 방어력이 증가합니다.",
        "prerequisites": []
      },
      {
        "id": "resist-cold",
        "nameKo": "냉기 저항",
        "nameEn": "Resist Cold",
        "dataKey": "Resist Cold",
        "branch": "방어 오라",
        "row": 2,
        "col": 3,
        "requiredLevel": 6,
        "description": "오라를 활성화하면 자신과 파티원이 받는 냉기 피해가 감소합니다.",
        "prerequisites": []
      },
      {
        "id": "zeal",
        "nameKo": "열의",
        "nameEn": "Zeal",
        "dataKey": "Zeal",
        "branch": "전투 기술",
        "row": 3,
        "col": 1,
        "requiredLevel": 12,
        "description": "한 번의 공격으로 인접한 다수의 적을 공격합니다.",
        "prerequisites": [
          "sacrifice"
        ]
      },
      {
        "id": "charge",
        "nameKo": "돌진",
        "nameEn": "Charge",
        "dataKey": "Charge",
        "branch": "전투 기술",
        "row": 3,
        "col": 3,
        "requiredLevel": 12,
        "description": "적에게 돌진하여 공격합니다.",
        "prerequisites": [
          "smite"
        ]
      },
      {
        "id": "blessed-aim",
        "nameKo": "축복받은 조준",
        "nameEn": "Blessed Aim",
        "dataKey": "Blessed Aim",
        "branch": "공격 오라",
        "row": 3,
        "col": 1,
        "requiredLevel": 12,
        "description": "오라를 활성화하면 자신과 파티원의 명중률이 증가합니다.",
        "prerequisites": [
          "might"
        ]
      },
      {
        "id": "cleansing",
        "nameKo": "정화",
        "nameEn": "Cleansing",
        "dataKey": "Cleansing",
        "branch": "방어 오라",
        "row": 3,
        "col": 1,
        "requiredLevel": 12,
        "description": "오라를 활성화하면 자신과 파티원에게 걸린 독 또는 저주의 지속시간이 감소합니다.",
        "prerequisites": [
          "prayer"
        ]
      },
      {
        "id": "resist-lightning",
        "nameKo": "번개 저항",
        "nameEn": "Resist Lightning",
        "dataKey": "Resist Lightning",
        "branch": "방어 오라",
        "row": 3,
        "col": 3,
        "requiredLevel": 12,
        "description": "오라를 활성화하면 자신과 파티원이 받는 번개 피해가 감소합니다.",
        "prerequisites": []
      },
      {
        "id": "vengeance",
        "nameKo": "복수",
        "nameEn": "Vengeance",
        "dataKey": "Vengeance",
        "branch": "전투 기술",
        "row": 4,
        "col": 1,
        "requiredLevel": 18,
        "description": "공격이 적중할 때마다 화염, 번개, 냉기 피해가 추가됩니다.",
        "prerequisites": [
          "zeal"
        ]
      },
      {
        "id": "blessed-hammer",
        "nameKo": "축복받은 망치",
        "nameEn": "Blessed Hammer",
        "dataKey": "Blessed Hammer",
        "branch": "전투 기술",
        "row": 4,
        "col": 2,
        "requiredLevel": 18,
        "description": "소용돌이를 그리며 뻗어 나가는 무형의 망치를 소환하여 적중한 적에게 피해를 줍니다.",
        "prerequisites": [
          "holy-bolt"
        ]
      },
      {
        "id": "concentration",
        "nameKo": "집중",
        "nameEn": "Concentration",
        "dataKey": "Concentration",
        "branch": "공격 오라",
        "row": 4,
        "col": 1,
        "requiredLevel": 18,
        "description": "오라를 활성화하면 자신과 파티원의 공격력이 증가하고 공격이 방해받을 확률이 감소합니다.",
        "prerequisites": [
          "blessed-aim"
        ]
      },
      {
        "id": "holy-freeze",
        "nameKo": "신성한 빙결",
        "nameEn": "Holy Freeze",
        "dataKey": "Holy Freeze",
        "branch": "공격 오라",
        "row": 4,
        "col": 2,
        "requiredLevel": 18,
        "description": "오라를 활성화하면 주위의 괴물을 빙결시키고 공격에 냉기 피해를 추가합니다.",
        "prerequisites": [
          "holy-fire"
        ]
      },
      {
        "id": "vigor",
        "nameKo": "원기",
        "nameEn": "Vigor",
        "dataKey": "Vigor",
        "branch": "방어 오라",
        "row": 4,
        "col": 2,
        "requiredLevel": 18,
        "description": "오라를 활성화하면 자신과 파티원의 지구력 회복 속도, 최대 지구력, 이동 속도가 증가합니다.",
        "prerequisites": [
          "cleansing",
          "defiance"
        ]
      },
      {
        "id": "conversion",
        "nameKo": "전향",
        "nameEn": "Conversion",
        "dataKey": "Conversion",
        "branch": "전투 기술",
        "row": 5,
        "col": 1,
        "requiredLevel": 24,
        "description": "괴물을 전향시켜 다른 사악한 악마와 야수에 맞서 싸우게 합니다.",
        "prerequisites": [
          "vengeance"
        ]
      },
      {
        "id": "holy-shield",
        "nameKo": "신성한 방패",
        "nameEn": "Holy Shield",
        "dataKey": "Holy Shield",
        "branch": "전투 기술",
        "row": 5,
        "col": 3,
        "requiredLevel": 24,
        "description": "신성한 힘으로 방패를 강화합니다.",
        "prerequisites": [
          "charge",
          "blessed-hammer"
        ]
      },
      {
        "id": "holy-shock",
        "nameKo": "신성한 충격",
        "nameEn": "Holy Shock",
        "dataKey": "Holy Shock",
        "branch": "공격 오라",
        "row": 5,
        "col": 2,
        "requiredLevel": 24,
        "description": "오라를 활성화하면 전기 파동을 방출하여 주위의 적에게 피해를 주고 공격에 번개 피해를 추가합니다.",
        "prerequisites": [
          "holy-freeze"
        ]
      },
      {
        "id": "sanctuary",
        "nameKo": "성역",
        "nameEn": "Sanctuary",
        "dataKey": "Sanctuary",
        "branch": "공격 오라",
        "row": 5,
        "col": 3,
        "requiredLevel": 24,
        "description": "오라를 활성화하면 언데드에게 피해를 주고 뒤로 밀쳐냅니다.",
        "prerequisites": [
          "thorns",
          "holy-freeze"
        ]
      },
      {
        "id": "meditation",
        "nameKo": "명상",
        "nameEn": "Meditation",
        "dataKey": "Meditation",
        "branch": "방어 오라",
        "row": 5,
        "col": 1,
        "requiredLevel": 24,
        "description": "오라를 활성화하면 자신과 파티원의 마나 회복 속도가 증가합니다.",
        "prerequisites": [
          "cleansing"
        ]
      },
      {
        "id": "fist-of-the-heavens",
        "nameKo": "천상의 주먹",
        "nameEn": "Fist of the Heavens",
        "dataKey": "Fist of the Heavens",
        "branch": "전투 기술",
        "row": 6,
        "col": 2,
        "requiredLevel": 30,
        "description": "번개로 대상을 강타하여 피해를 주고 대상 주위의 적에게 신성한 빛줄기가 퍼져 나갑니다.",
        "prerequisites": [
          "blessed-hammer",
          "conversion"
        ]
      },
      {
        "id": "fanaticism",
        "nameKo": "광신",
        "nameEn": "Fanaticism",
        "dataKey": "Fanaticism",
        "branch": "공격 오라",
        "row": 6,
        "col": 1,
        "requiredLevel": 30,
        "description": "오라를 활성화하면 자신과 파티원의 공격력, 공격 속도, 명중률이 증가합니다.",
        "prerequisites": [
          "concentration"
        ]
      },
      {
        "id": "conviction",
        "nameKo": "선고",
        "nameEn": "Conviction",
        "dataKey": "Conviction",
        "branch": "공격 오라",
        "row": 6,
        "col": 3,
        "requiredLevel": 30,
        "description": "오라를 활성화하면 주위 적의 방어력과 저항이 감소합니다.",
        "prerequisites": [
          "sanctuary"
        ]
      },
      {
        "id": "redemption",
        "nameKo": "속죄",
        "nameEn": "Redemption",
        "dataKey": "Redemption",
        "branch": "방어 오라",
        "row": 6,
        "col": 2,
        "requiredLevel": 30,
        "description": "오라를 활성화하면 처치한 적의 영혼을 구원하여 자신의 생명력과 마나를 회복합니다.",
        "prerequisites": [
          "vigor"
        ]
      },
      {
        "id": "salvation",
        "nameKo": "구원",
        "nameEn": "Salvation",
        "dataKey": "Salvation",
        "branch": "방어 오라",
        "row": 6,
        "col": 3,
        "requiredLevel": 30,
        "description": "오라를 활성화하면 자신과 파티원이 받는 화염, 냉기, 번개 피해가 감소합니다.",
        "prerequisites": []
      }
    ]
  },
  "barbarian": {
    "id": "barbarian",
    "nameKo": "야만용사",
    "nameEn": "Barbarian",
    "accent": "#c98255",
    "branches": [
      "전투 기술",
      "전투 숙련",
      "함성"
    ],
    "base": {
      "strength": 30,
      "dexterity": 20,
      "vitality": 25,
      "energy": 10
    },
    "baseLife": 55,
    "baseMana": 10,
    "lifePerLevel": 2,
    "manaPerLevel": 1,
    "lifePerVitality": 4,
    "manaPerEnergy": 1,
    "skills": [
      {
        "id": "bash",
        "nameKo": "강격",
        "nameEn": "Bash",
        "dataKey": "Bash",
        "branch": "전투 기술",
        "row": 1,
        "col": 2,
        "requiredLevel": 1,
        "description": "강력한 타격으로 적에게 주는 피해량이 증가하고 적을 뒤로 밀쳐냅니다.",
        "prerequisites": []
      },
      {
        "id": "blade-mastery",
        "nameKo": "검 숙련",
        "nameEn": "Blade Mastery",
        "dataKey": "Blade Mastery",
        "branch": "전투 숙련",
        "row": 1,
        "col": 1,
        "requiredLevel": 1,
        "description": "지속 효과 - 검 전투 숙련도가 향상됩니다.",
        "prerequisites": []
      },
      {
        "id": "axe-mastery",
        "nameKo": "도끼 숙련",
        "nameEn": "Axe Mastery",
        "dataKey": "Axe Mastery",
        "branch": "전투 숙련",
        "row": 1,
        "col": 2,
        "requiredLevel": 1,
        "description": "지속 효과 - 도끼 전투 숙련도가 향상됩니다.",
        "prerequisites": []
      },
      {
        "id": "mace-mastery",
        "nameKo": "철퇴 숙련",
        "nameEn": "Mace Mastery",
        "dataKey": "Mace Mastery",
        "branch": "전투 숙련",
        "row": 1,
        "col": 3,
        "requiredLevel": 1,
        "description": "지속 효과 - 철퇴 전투 숙련도가 향상됩니다.",
        "prerequisites": []
      },
      {
        "id": "howl",
        "nameKo": "포효",
        "nameEn": "Howl",
        "dataKey": "Howl",
        "branch": "함성",
        "row": 1,
        "col": 1,
        "requiredLevel": 1,
        "description": "주위의 괴물들이 공포에 질려 도망치게 합니다.",
        "prerequisites": []
      },
      {
        "id": "find-potion",
        "nameKo": "물약 발견",
        "nameEn": "Find Potion",
        "dataKey": "Find Potion",
        "branch": "함성",
        "row": 1,
        "col": 3,
        "requiredLevel": 1,
        "description": "처치한 괴물의 시체에 사용하여 일정 확률로 물약을 발견합니다.",
        "prerequisites": []
      },
      {
        "id": "leap",
        "nameKo": "도약",
        "nameEn": "Leap",
        "dataKey": "Leap",
        "branch": "전투 기술",
        "row": 2,
        "col": 1,
        "requiredLevel": 6,
        "description": "공중으로 도약한 후 착지하여 주위의 적을 뒤로 밀쳐냅니다.",
        "prerequisites": []
      },
      {
        "id": "double-swing",
        "nameKo": "이중 타격",
        "nameEn": "Double Swing",
        "dataKey": "Double Swing",
        "branch": "전투 기술",
        "row": 2,
        "col": 3,
        "requiredLevel": 6,
        "description": "두 개의 무기를 장착하고 있을 때 가능하면 두 명의 대상을 공격하며 아니면 한 대상을 두 번 공격합니다.",
        "prerequisites": [
          "bash"
        ]
      },
      {
        "id": "pole-arm-mastery",
        "nameKo": "미늘창 숙련",
        "nameEn": "Pole Arm Mastery",
        "dataKey": "Pole Arm Mastery",
        "branch": "전투 숙련",
        "row": 2,
        "col": 1,
        "requiredLevel": 6,
        "description": "지속 효과 - 미늘창 전투 숙련도가 향상됩니다.",
        "prerequisites": []
      },
      {
        "id": "throwing-mastery",
        "nameKo": "투척 숙련",
        "nameEn": "Throwing Mastery",
        "dataKey": "Throwing Mastery",
        "branch": "전투 숙련",
        "row": 2,
        "col": 2,
        "requiredLevel": 6,
        "description": "지속 효과 - 투척 무기 전투 숙련도가 향상됩니다.",
        "prerequisites": []
      },
      {
        "id": "spear-mastery",
        "nameKo": "창 숙련",
        "nameEn": "Spear Mastery",
        "dataKey": "Spear Mastery",
        "branch": "전투 숙련",
        "row": 2,
        "col": 3,
        "requiredLevel": 6,
        "description": "지속 효과 - 창 전투 숙련도가 향상됩니다.",
        "prerequisites": []
      },
      {
        "id": "taunt",
        "nameKo": "도발",
        "nameEn": "Taunt",
        "dataKey": "Taunt",
        "branch": "함성",
        "row": 2,
        "col": 1,
        "requiredLevel": 6,
        "description": "주위의 괴물을 격분시켜 맹렬히 공격하게 합니다.",
        "prerequisites": [
          "howl"
        ]
      },
      {
        "id": "shout",
        "nameKo": "외침",
        "nameEn": "Shout",
        "dataKey": "Shout",
        "branch": "함성",
        "row": 2,
        "col": 2,
        "requiredLevel": 6,
        "description": "임박한 위험을 경고하여 자신과 파티원의 방어력을 증가시킵니다.",
        "prerequisites": [
          "howl"
        ]
      },
      {
        "id": "stun",
        "nameKo": "기절",
        "nameEn": "Stun",
        "dataKey": "Stun",
        "branch": "전투 기술",
        "row": 3,
        "col": 2,
        "requiredLevel": 12,
        "description": "대상을 잠시 동안 기절시키고 자신의 명중률을 증가시킵니다.",
        "prerequisites": [
          "bash"
        ]
      },
      {
        "id": "double-throw",
        "nameKo": "이중 투척",
        "nameEn": "Double Throw",
        "dataKey": "Double Throw",
        "branch": "전투 기술",
        "row": 3,
        "col": 3,
        "requiredLevel": 12,
        "description": "서로 다른 투척 무기 두 개를 동시에 투척할 수 있습니다.",
        "prerequisites": [
          "double-swing"
        ]
      },
      {
        "id": "increased-stamina",
        "nameKo": "지구력 증가",
        "nameEn": "Increased Stamina",
        "dataKey": "Increased Stamina",
        "branch": "전투 숙련",
        "row": 3,
        "col": 1,
        "requiredLevel": 12,
        "description": "지속 효과 - 지구력이 증가합니다.",
        "prerequisites": []
      },
      {
        "id": "find-item",
        "nameKo": "아이템 발견",
        "nameEn": "Find Item",
        "dataKey": "Find Item",
        "branch": "함성",
        "row": 3,
        "col": 3,
        "requiredLevel": 12,
        "description": "처치한 괴물의 시체에 사용하여 일정 확률로 숨겨진 보물을 발견합니다.",
        "prerequisites": [
          "find-potion"
        ]
      },
      {
        "id": "leap-attack",
        "nameKo": "도약 공격",
        "nameEn": "Leap Attack",
        "dataKey": "Leap Attack",
        "branch": "전투 기술",
        "row": 4,
        "col": 1,
        "requiredLevel": 18,
        "description": "대상 적에게 도약하여 신속하게 공격합니다.",
        "prerequisites": [
          "leap"
        ]
      },
      {
        "id": "concentrate",
        "nameKo": "집중 공격",
        "nameEn": "Concentrate",
        "dataKey": "Concentrate",
        "branch": "전투 기술",
        "row": 4,
        "col": 2,
        "requiredLevel": 18,
        "description": "방해받지 않으며 명중률과 방어력을 증가시키는 공격입니다.",
        "prerequisites": [
          "stun"
        ]
      },
      {
        "id": "iron-skin",
        "nameKo": "철갑 피부",
        "nameEn": "Iron Skin",
        "dataKey": "Iron Skin",
        "branch": "전투 숙련",
        "row": 4,
        "col": 3,
        "requiredLevel": 18,
        "description": "지속 효과 - 방어력이 향상됩니다.",
        "prerequisites": []
      },
      {
        "id": "battle-cry",
        "nameKo": "전투의 함성",
        "nameEn": "Battle Cry",
        "dataKey": "Battle Cry",
        "branch": "함성",
        "row": 4,
        "col": 1,
        "requiredLevel": 18,
        "description": "공포의 외침으로 적의 방어력과 공격력을 감소시킵니다.",
        "prerequisites": [
          "taunt"
        ]
      },
      {
        "id": "frenzy",
        "nameKo": "광분",
        "nameEn": "Frenzy",
        "dataKey": "Frenzy",
        "branch": "전투 기술",
        "row": 5,
        "col": 3,
        "requiredLevel": 24,
        "description": "두 개의 무기를 한번에 휘두릅니다. 공격이 적중할 때마다 전체 속도가 증가합니다. 두 개의 무기를 장착해야 합니다.",
        "prerequisites": [
          "double-throw"
        ]
      },
      {
        "id": "increased-speed",
        "nameKo": "속도 증가",
        "nameEn": "Increased Speed",
        "dataKey": "Increased Speed",
        "branch": "전투 숙련",
        "row": 5,
        "col": 1,
        "requiredLevel": 24,
        "description": "지속 효과 - 걷거나 달리는 속도가 증가합니다.",
        "prerequisites": [
          "increased-stamina"
        ]
      },
      {
        "id": "battle-orders",
        "nameKo": "전투 지시",
        "nameEn": "Battle Orders",
        "dataKey": "Battle Orders",
        "branch": "함성",
        "row": 5,
        "col": 2,
        "requiredLevel": 24,
        "description": "자신과 파티원의 최대 마나, 생명력, 지구력이 증가합니다.",
        "prerequisites": [
          "shout"
        ]
      },
      {
        "id": "grim-ward",
        "nameKo": "섬뜩한 호신부",
        "nameEn": "Grim Ward",
        "dataKey": "Grim Ward",
        "branch": "함성",
        "row": 5,
        "col": 3,
        "requiredLevel": 24,
        "description": "처치한 괴물의 시체에 사용하여 주위의 괴물이 도망치게 하는 섬뜩한 토템을 생성합니다.",
        "prerequisites": [
          "find-item"
        ]
      },
      {
        "id": "whirlwind",
        "nameKo": "소용돌이",
        "nameEn": "Whirlwind",
        "dataKey": "Whirlwind",
        "branch": "전투 기술",
        "row": 6,
        "col": 1,
        "requiredLevel": 30,
        "description": "소용돌이치는 죽음의 무도로 적 군단을 돌파합니다.",
        "prerequisites": [
          "leap-attack",
          "concentrate"
        ]
      },
      {
        "id": "berserk",
        "nameKo": "광폭화",
        "nameEn": "Berserk",
        "dataKey": "Berserk",
        "branch": "전투 기술",
        "row": 6,
        "col": 2,
        "requiredLevel": 30,
        "description": "강력하지만 무모한 공격으로 공격력과 명중률이 증가하지만 방어력이 감소합니다.",
        "prerequisites": [
          "concentrate"
        ]
      },
      {
        "id": "natural-resistance",
        "nameKo": "타고난 저항",
        "nameEn": "Natural Resistance",
        "dataKey": "Natural Resistance",
        "branch": "전투 숙련",
        "row": 6,
        "col": 3,
        "requiredLevel": 30,
        "description": "지속 효과 - 원소 및 독 피해에 대한 타고난 저항이 증가합니다.",
        "prerequisites": [
          "iron-skin"
        ]
      },
      {
        "id": "war-cry",
        "nameKo": "전장의 함성",
        "nameEn": "War Cry",
        "dataKey": "War Cry",
        "branch": "함성",
        "row": 6,
        "col": 1,
        "requiredLevel": 30,
        "description": "주위의 모든 괴물에게 피해를 주고 기절시킵니다.",
        "prerequisites": [
          "battle-cry",
          "battle-orders"
        ]
      },
      {
        "id": "battle-command",
        "nameKo": "전투 명령",
        "nameEn": "Battle Command",
        "dataKey": "Battle Command",
        "branch": "함성",
        "row": 6,
        "col": 2,
        "requiredLevel": 30,
        "description": "자신과 파티원의 현재 기술 레벨이 모두 증가합니다.",
        "prerequisites": [
          "battle-orders"
        ]
      }
    ]
  },
  "druid": {
    "id": "druid",
    "nameKo": "드루이드",
    "nameEn": "Druid",
    "accent": "#8eb66d",
    "branches": [
      "소환",
      "변신",
      "원소"
    ],
    "base": {
      "strength": 15,
      "dexterity": 20,
      "vitality": 25,
      "energy": 20
    },
    "baseLife": 55,
    "baseMana": 20,
    "lifePerLevel": 1.5,
    "manaPerLevel": 2,
    "lifePerVitality": 2,
    "manaPerEnergy": 2,
    "skills": [
      {
        "id": "raven",
        "nameKo": "큰까마귀",
        "nameEn": "Raven",
        "dataKey": "Raven",
        "branch": "소환",
        "row": 1,
        "col": 2,
        "requiredLevel": 1,
        "description": "큰까마귀를 소환하여 적의 눈을 파먹게 합니다.",
        "prerequisites": []
      },
      {
        "id": "plague-poppy",
        "nameKo": "맹독 덩굴",
        "nameEn": "Plague Poppy",
        "dataKey": "Plague Poppy",
        "branch": "소환",
        "row": 1,
        "col": 3,
        "requiredLevel": 1,
        "description": "접촉하는 적에게 질병을 퍼뜨리는 덩굴을 소환합니다.",
        "prerequisites": []
      },
      {
        "id": "wearwolf",
        "nameKo": "늑대인간",
        "nameEn": "Wearwolf",
        "dataKey": "Wearwolf",
        "branch": "변신",
        "row": 1,
        "col": 1,
        "requiredLevel": 1,
        "description": "늑대인간으로 변신합니다.",
        "prerequisites": []
      },
      {
        "id": "shape-shifting",
        "nameKo": "변신술",
        "nameEn": "Shape Shifting",
        "dataKey": "Shape Shifting",
        "branch": "변신",
        "row": 1,
        "col": 2,
        "requiredLevel": 1,
        "description": "지속 효과 - 늑대인간이나 곰인간 형태일 때 지속시간과 생명력이 증가합니다.",
        "prerequisites": [
          "wearwolf"
        ]
      },
      {
        "id": "firestorm",
        "nameKo": "화염폭풍",
        "nameEn": "Firestorm",
        "dataKey": "Firestorm",
        "branch": "원소",
        "row": 1,
        "col": 1,
        "requiredLevel": 1,
        "description": "혼돈의 화염을 방출하여 적을 불태웁니다.",
        "prerequisites": []
      },
      {
        "id": "oak-sage",
        "nameKo": "참나무 현자",
        "nameEn": "Oak Sage",
        "dataKey": "Oak Sage",
        "branch": "소환",
        "row": 2,
        "col": 1,
        "requiredLevel": 6,
        "description": "영혼 소환수를 소환하여 자신과 파티원의 생명력을 증가시킵니다.",
        "prerequisites": []
      },
      {
        "id": "summon-spirit-wolf",
        "nameKo": "영혼 늑대 소환",
        "nameEn": "Summon Spirit Wolf",
        "dataKey": "Summon Spirit Wolf",
        "branch": "소환",
        "row": 2,
        "col": 2,
        "requiredLevel": 6,
        "description": "순간이동 능력이 있는 늑대를 소환하여 전투를 돕게 합니다.",
        "prerequisites": [
          "raven"
        ]
      },
      {
        "id": "wearbear",
        "nameKo": "곰인간",
        "nameEn": "Wearbear",
        "dataKey": "Wearbear",
        "branch": "변신",
        "row": 2,
        "col": 3,
        "requiredLevel": 6,
        "description": "곰인간으로 변신합니다.",
        "prerequisites": []
      },
      {
        "id": "molten-boulder",
        "nameKo": "타오르는 바위",
        "nameEn": "Molten Boulder",
        "dataKey": "Molten Boulder",
        "branch": "원소",
        "row": 2,
        "col": 1,
        "requiredLevel": 6,
        "description": "타오르는 용암 바위를 날려 적을 뒤로 밀쳐냅니다.",
        "prerequisites": [
          "firestorm"
        ]
      },
      {
        "id": "arctic-blast",
        "nameKo": "극지 돌풍",
        "nameEn": "Arctic Blast",
        "dataKey": "Arctic Blast",
        "branch": "원소",
        "row": 2,
        "col": 3,
        "requiredLevel": 6,
        "description": "연속으로 얼음 줄기를 방출하여 서리로 적을 태웁니다.",
        "prerequisites": []
      },
      {
        "id": "cycle-of-life",
        "nameKo": "청소부 덩굴",
        "nameEn": "Cycle of Life",
        "dataKey": "Cycle of Life",
        "branch": "소환",
        "row": 3,
        "col": 3,
        "requiredLevel": 12,
        "description": "시체를 먹어 플레이어의 생명력을 회복시키는 덩굴을 소환합니다.",
        "prerequisites": [
          "plague-poppy"
        ]
      },
      {
        "id": "feral-rage",
        "nameKo": "흉포한 격노",
        "nameEn": "Feral Rage",
        "dataKey": "Feral Rage",
        "branch": "변신",
        "row": 3,
        "col": 1,
        "requiredLevel": 12,
        "description": "늑대인간 형태일 때 광분 상태가 되어 공격을 적중시킬 때마다 훔치는 생명력의 양이 점차 증가합니다.",
        "prerequisites": [
          "wearwolf"
        ]
      },
      {
        "id": "maul",
        "nameKo": "후려치기",
        "nameEn": "Maul",
        "dataKey": "Maul",
        "branch": "변신",
        "row": 3,
        "col": 3,
        "requiredLevel": 12,
        "description": "곰인간 형태일 때 적을 강하게 후려쳐 공격을 적중시킬 때마다 점점 더 큰 피해를 줍니다.",
        "prerequisites": [
          "wearbear"
        ]
      },
      {
        "id": "eruption",
        "nameKo": "균열",
        "nameEn": "Eruption",
        "dataKey": "Eruption",
        "branch": "원소",
        "row": 3,
        "col": 1,
        "requiredLevel": 12,
        "description": "적의 발밑에 화도를 열어 대상을 까맣게 불태웁니다.",
        "prerequisites": [
          "molten-boulder"
        ]
      },
      {
        "id": "cyclone-armor",
        "nameKo": "회오리 갑옷",
        "nameEn": "Cyclone Armor",
        "dataKey": "Cyclone Armor",
        "branch": "원소",
        "row": 3,
        "col": 3,
        "requiredLevel": 12,
        "description": "화염, 냉기, 번개 피해로부터 자신을 보호합니다.",
        "prerequisites": [
          "arctic-blast"
        ]
      },
      {
        "id": "heart-of-wolverine",
        "nameKo": "울버린의 심장",
        "nameEn": "Heart of Wolverine",
        "dataKey": "Heart of Wolverine",
        "branch": "소환",
        "row": 4,
        "col": 1,
        "requiredLevel": 18,
        "description": "영혼 소환수를 소환하여 자신과 파티원의 공격력과 명중률을 증가시킵니다.",
        "prerequisites": [
          "oak-sage"
        ]
      },
      {
        "id": "summon-fenris",
        "nameKo": "광포한 늑대 소환",
        "nameEn": "Summon Fenris",
        "dataKey": "Summon Fenris",
        "branch": "소환",
        "row": 4,
        "col": 2,
        "requiredLevel": 18,
        "description": "광포한 늑대를 소환합니다. 늑대는 시체를 먹어 적에게 더 큰 피해를 줍니다.",
        "prerequisites": [
          "oak-sage",
          "summon-spirit-wolf"
        ]
      },
      {
        "id": "rabies",
        "nameKo": "광견병",
        "nameEn": "Rabies",
        "dataKey": "Rabies",
        "branch": "변신",
        "row": 4,
        "col": 1,
        "requiredLevel": 18,
        "description": "늑대인간 형태일 때 적을 물어뜯어 다른 괴물들에게 퍼지는 질병에 감염시킵니다.",
        "prerequisites": [
          "feral-rage"
        ]
      },
      {
        "id": "fire-claws",
        "nameKo": "화염 발톱",
        "nameEn": "Fire Claws",
        "dataKey": "Fire Claws",
        "branch": "변신",
        "row": 4,
        "col": 2,
        "requiredLevel": 18,
        "description": "늑대인간이나 곰인간 형태일 때 화염 발톱으로 적을 강하게 후려칩니다.",
        "prerequisites": [
          "feral-rage",
          "maul"
        ]
      },
      {
        "id": "twister",
        "nameKo": "돌개바람",
        "nameEn": "Twister",
        "dataKey": "Twister",
        "branch": "원소",
        "row": 4,
        "col": 2,
        "requiredLevel": 18,
        "description": "적들을 뚫고 지나가는 작은 회오리바람을 여럿 내보냅니다.",
        "prerequisites": [
          "cyclone-armor"
        ]
      },
      {
        "id": "vines",
        "nameKo": "태양의 덩굴",
        "nameEn": "Vines",
        "dataKey": "Vines",
        "branch": "소환",
        "row": 5,
        "col": 3,
        "requiredLevel": 24,
        "description": "시체를 먹어 플레이어의 마나를 회복시키는 덩굴을 소환합니다.",
        "prerequisites": [
          "cycle-of-life"
        ]
      },
      {
        "id": "hunger",
        "nameKo": "굶주림",
        "nameEn": "Hunger",
        "dataKey": "Hunger",
        "branch": "변신",
        "row": 5,
        "col": 2,
        "requiredLevel": 24,
        "description": "늑대인간이나 곰인간 형태일 때 적을 물어뜯어 생명력과 마나를 흡수합니다.",
        "prerequisites": [
          "fire-claws"
        ]
      },
      {
        "id": "shock-wave",
        "nameKo": "충격파",
        "nameEn": "Shock Wave",
        "dataKey": "Shock Wave",
        "branch": "변신",
        "row": 5,
        "col": 3,
        "requiredLevel": 24,
        "description": "곰인간 형태일 때 충격파를 일으켜 주위의 적을 기절시킵니다.",
        "prerequisites": [
          "maul"
        ]
      },
      {
        "id": "volcano",
        "nameKo": "화산",
        "nameEn": "Volcano",
        "dataKey": "Volcano",
        "branch": "원소",
        "row": 5,
        "col": 1,
        "requiredLevel": 24,
        "description": "화산을 소환하여 적에게 죽음과 파괴의 비를 퍼붓습니다.",
        "prerequisites": [
          "eruption"
        ]
      },
      {
        "id": "tornado",
        "nameKo": "회오리바람",
        "nameEn": "Tornado",
        "dataKey": "Tornado",
        "branch": "원소",
        "row": 5,
        "col": 2,
        "requiredLevel": 24,
        "description": "바람과 잔해의 회오리 바람으로 적을 강타합니다.",
        "prerequisites": [
          "twister"
        ]
      },
      {
        "id": "spirit-of-barbs",
        "nameKo": "가시의 영혼",
        "nameEn": "Spirit of Barbs",
        "dataKey": "Spirit of Barbs",
        "branch": "소환",
        "row": 6,
        "col": 1,
        "requiredLevel": 30,
        "description": "영혼 소환수를 소환하여 자신과 파티원이 받는 피해를 적에게 되돌려 줍니다.",
        "prerequisites": [
          "heart-of-wolverine"
        ]
      },
      {
        "id": "summon-grizzly",
        "nameKo": "회색곰 소환",
        "nameEn": "Summon Grizzly",
        "dataKey": "Summon Grizzly",
        "branch": "소환",
        "row": 6,
        "col": 2,
        "requiredLevel": 30,
        "description": "흉포한 회색곰을 소환합니다.",
        "prerequisites": [
          "summon-fenris"
        ]
      },
      {
        "id": "fury",
        "nameKo": "분노",
        "nameEn": "Fury",
        "dataKey": "Fury",
        "branch": "변신",
        "row": 6,
        "col": 1,
        "requiredLevel": 30,
        "description": "늑대인간 형태일 때 인접한 다수의 대상을 동시에 공격하거나 하나의 대상을 여러 번 공격합니다.",
        "prerequisites": [
          "rabies"
        ]
      },
      {
        "id": "armageddon",
        "nameKo": "아마겟돈",
        "nameEn": "Armageddon",
        "dataKey": "Armageddon",
        "branch": "원소",
        "row": 6,
        "col": 1,
        "requiredLevel": 30,
        "description": "유성우를 생성하여 주위의 적에게 불타는 파괴의 비를 퍼붓습니다.",
        "prerequisites": [
          "volcano"
        ]
      },
      {
        "id": "hurricane",
        "nameKo": "허리케인",
        "nameEn": "Hurricane",
        "dataKey": "Hurricane",
        "branch": "원소",
        "row": 6,
        "col": 2,
        "requiredLevel": 30,
        "description": "거대한 바람과 잔해의 폭풍을 생성하여 적을 산산이 조각냅니다.",
        "prerequisites": [
          "tornado"
        ]
      }
    ]
  },
  "assassin": {
    "id": "assassin",
    "nameKo": "암살자",
    "nameEn": "Assassin",
    "accent": "#b18ad0",
    "branches": [
      "덫",
      "그림자 단련",
      "무술"
    ],
    "base": {
      "strength": 20,
      "dexterity": 20,
      "vitality": 20,
      "energy": 25
    },
    "baseLife": 50,
    "baseMana": 25,
    "lifePerLevel": 2,
    "manaPerLevel": 1.5,
    "lifePerVitality": 3,
    "manaPerEnergy": 1.75,
    "skills": [
      {
        "id": "fire-trauma",
        "nameKo": "화염 작렬",
        "nameEn": "Fire Trauma",
        "dataKey": "Fire Trauma",
        "branch": "덫",
        "row": 1,
        "col": 2,
        "requiredLevel": 1,
        "description": "화염 폭탄을 투척하여 적을 산산이 조각냅니다.",
        "prerequisites": []
      },
      {
        "id": "claw-mastery",
        "nameKo": "손톱 숙련",
        "nameEn": "Claw Mastery",
        "dataKey": "Claw Mastery",
        "branch": "그림자 단련",
        "row": 1,
        "col": 2,
        "requiredLevel": 1,
        "description": "지속 효과 - 손톱 유형 무기의 숙련도를 향상시킵니다.",
        "prerequisites": []
      },
      {
        "id": "psychic-hammer",
        "nameKo": "정신의 망치",
        "nameEn": "Psychic Hammer",
        "dataKey": "Psychic Hammer",
        "branch": "그림자 단련",
        "row": 1,
        "col": 3,
        "requiredLevel": 1,
        "description": "정신의 힘으로 정신 폭발을 일으켜 적을 제압하고 뒤로 밀쳐냅니다.",
        "prerequisites": []
      },
      {
        "id": "tiger-strike",
        "nameKo": "호랑이 일격",
        "nameEn": "Tiger Strike",
        "dataKey": "Tiger Strike",
        "branch": "무술",
        "row": 1,
        "col": 2,
        "requiredLevel": 1,
        "description": "충전 기술 연속으로 공격을 적중시키면 필살기의 공격력이 증가합니다. 용 필살기 또는 일반 공격을 사용하여 충전을 방출해야 합니다.",
        "prerequisites": []
      },
      {
        "id": "dragon-talon",
        "nameKo": "용의 발톱",
        "nameEn": "Dragon Talon",
        "dataKey": "Dragon Talon",
        "branch": "무술",
        "row": 1,
        "col": 3,
        "requiredLevel": 1,
        "description": "필살기 적을 걷어차서 날려버립니다. 발차기 기술에 충전 보너스가 추가됩니다.",
        "prerequisites": []
      },
      {
        "id": "shock-field",
        "nameKo": "감전 그물",
        "nameEn": "Shock Field",
        "dataKey": "Shock Field",
        "branch": "덫",
        "row": 2,
        "col": 1,
        "requiredLevel": 6,
        "description": "번개 그물을 투척하여 적을 감전시킵니다.",
        "prerequisites": [
          "fire-trauma"
        ]
      },
      {
        "id": "blade-sentinel",
        "nameKo": "파수꾼의 칼날",
        "nameEn": "Blade Sentinel",
        "dataKey": "Blade Sentinel",
        "branch": "덫",
        "row": 2,
        "col": 3,
        "requiredLevel": 6,
        "description": "회전하는 칼날을 내보내 자신과 목표 지점 사이를 오가게 합니다.",
        "prerequisites": []
      },
      {
        "id": "quickness",
        "nameKo": "폭발적인 속도",
        "nameEn": "Quickness",
        "dataKey": "Quickness",
        "branch": "그림자 단련",
        "row": 2,
        "col": 1,
        "requiredLevel": 6,
        "description": "일정 시간 동안 공격 및 이동 속도가 증가합니다.",
        "prerequisites": [
          "claw-mastery"
        ]
      },
      {
        "id": "fists-of-fire",
        "nameKo": "화염의 주먹",
        "nameEn": "Fists of Fire",
        "dataKey": "Fists of Fire",
        "branch": "무술",
        "row": 2,
        "col": 1,
        "requiredLevel": 6,
        "description": "충전 기술 연속으로 공격을 적중시키면 필살기에 화염 피해가 추가됩니다. 손톱 유형의 무기로만 사용할 수 있습니다. 용 필살기 또는 일반 공격을 사용하여 충전을 방출해야 합니다.",
        "prerequisites": []
      },
      {
        "id": "dragon-claw",
        "nameKo": "용의 손톱",
        "nameEn": "Dragon Claw",
        "dataKey": "Dragon Claw",
        "branch": "무술",
        "row": 2,
        "col": 3,
        "requiredLevel": 6,
        "description": "필살기 쌍수 손톱 유형의 무기로 적을 난도질합니다. 양손의 손톱 공격에 충전 보너스를 추가합니다.",
        "prerequisites": [
          "dragon-talon"
        ]
      },
      {
        "id": "charged-bolt-sentry",
        "nameKo": "번개 줄기 파수기",
        "nameEn": "Charged Bolt Sentry",
        "dataKey": "Charged Bolt Sentry",
        "branch": "덫",
        "row": 3,
        "col": 1,
        "requiredLevel": 12,
        "description": "근처를 지나가는 적에게 번개 줄기를 방출하는 덫을 설치합니다.",
        "prerequisites": [
          "shock-field"
        ]
      },
      {
        "id": "wake-of-fire-sentry",
        "nameKo": "불의 파동",
        "nameEn": "Wake of Fire Sentry",
        "dataKey": "Wake of Fire Sentry",
        "branch": "덫",
        "row": 3,
        "col": 2,
        "requiredLevel": 12,
        "description": "화염 파동을 방출하는 덫을 설치합니다.",
        "prerequisites": [
          "fire-trauma"
        ]
      },
      {
        "id": "weapon-block",
        "nameKo": "무기 막기",
        "nameEn": "Weapon Block",
        "dataKey": "Weapon Block",
        "branch": "그림자 단련",
        "row": 3,
        "col": 2,
        "requiredLevel": 12,
        "description": "지속 효과 - 쌍수 손톱 유형의 무기를 사용할 때 일정 확률로 적의 공격을 막습니다.",
        "prerequisites": [
          "claw-mastery"
        ]
      },
      {
        "id": "cloak-of-shadows",
        "nameKo": "그림자 망토",
        "nameEn": "Cloak of Shadows",
        "dataKey": "Cloak of Shadows",
        "branch": "그림자 단련",
        "row": 3,
        "col": 3,
        "requiredLevel": 12,
        "description": "그림자를 드리워 주위 적의 눈을 멀게 하고 일정 시간 동안 대상의 방어력을 감소시킵니다.",
        "prerequisites": [
          "psychic-hammer"
        ]
      },
      {
        "id": "cobra-strike",
        "nameKo": "코브라 일격",
        "nameEn": "Cobra Strike",
        "dataKey": "Cobra Strike",
        "branch": "무술",
        "row": 3,
        "col": 2,
        "requiredLevel": 12,
        "description": "충전 기술 연속으로 공격을 적중시키면 필살기에 생명력 및 마나 훔치기 효과가 추가됩니다. 용 필살기 또는 일반 공격을 사용하여 충전을 방출해야 합니다.",
        "prerequisites": [
          "tiger-strike"
        ]
      },
      {
        "id": "blade-fury",
        "nameKo": "분노의 칼날",
        "nameEn": "Blade Fury",
        "dataKey": "Blade Fury",
        "branch": "덫",
        "row": 4,
        "col": 3,
        "requiredLevel": 18,
        "description": "회전하는 칼날을 투척하여 적을 벱니다.",
        "prerequisites": [
          "blade-sentinel",
          "wake-of-fire-sentry"
        ]
      },
      {
        "id": "fade",
        "nameKo": "흐리기",
        "nameEn": "Fade",
        "dataKey": "Fade",
        "branch": "그림자 단련",
        "row": 4,
        "col": 1,
        "requiredLevel": 18,
        "description": "일정 시간 동안 모든 저항을 증가시키고 저주에 저항합니다.",
        "prerequisites": [
          "quickness"
        ]
      },
      {
        "id": "shadow-warrior",
        "nameKo": "그림자 전사",
        "nameEn": "Shadow Warrior",
        "dataKey": "Shadow Warrior",
        "branch": "그림자 단련",
        "row": 4,
        "col": 2,
        "requiredLevel": 18,
        "description": "자신의 그림자를 소환하여 자신의 기술을 흉내내며 전투를 돕게 합니다.",
        "prerequisites": [
          "cloak-of-shadows",
          "weapon-block"
        ]
      },
      {
        "id": "claws-of-thunder",
        "nameKo": "천둥의 손톱",
        "nameEn": "Claws of Thunder",
        "dataKey": "Claws of Thunder",
        "branch": "무술",
        "row": 4,
        "col": 1,
        "requiredLevel": 18,
        "description": "충전 기술 연속으로 공격을 적중시키면 필살기에 번개 피해가 추가됩니다. 손톱 유형의 무기로만 사용할 수 있습니다. 용 필살기 또는 일반 공격을 사용하여 충전을 방출해야 합니다.",
        "prerequisites": [
          "fists-of-fire"
        ]
      },
      {
        "id": "dragon-tail",
        "nameKo": "용의 꼬리",
        "nameEn": "Dragon Tail",
        "dataKey": "Dragon Tail",
        "branch": "무술",
        "row": 4,
        "col": 3,
        "requiredLevel": 18,
        "description": "필살기 폭발적인 힘으로 적을 걷어차 뒤로 밀쳐냅니다. 발차기 기술에 충전 보너스가 추가됩니다.",
        "prerequisites": [
          "dragon-claw"
        ]
      },
      {
        "id": "lightning-sentry",
        "nameKo": "번개 파수기",
        "nameEn": "Lightning Sentry",
        "dataKey": "Lightning Sentry",
        "branch": "덫",
        "row": 5,
        "col": 1,
        "requiredLevel": 24,
        "description": "번개를 방출하여 지나가는 적을 불태우는 덫을 설치합니다.",
        "prerequisites": [
          "charged-bolt-sentry"
        ]
      },
      {
        "id": "inferno-sentry",
        "nameKo": "지옥불의 파동",
        "nameEn": "Inferno Sentry",
        "dataKey": "Inferno Sentry",
        "branch": "덫",
        "row": 5,
        "col": 2,
        "requiredLevel": 24,
        "description": "지나가는 적에게 화염을 내뿜는 덫을 설치합니다.",
        "prerequisites": [
          "wake-of-fire-sentry"
        ]
      },
      {
        "id": "mind-blast",
        "nameKo": "정신 폭발",
        "nameEn": "Mind Blast",
        "dataKey": "Mind Blast",
        "branch": "그림자 단련",
        "row": 5,
        "col": 3,
        "requiredLevel": 24,
        "description": "정신의 힘을 사용하여 적 무리를 기절시키고 정신력이 약한 대상을 전향시킵니다.",
        "prerequisites": [
          "cloak-of-shadows"
        ]
      },
      {
        "id": "blades-of-ice",
        "nameKo": "얼음 칼날",
        "nameEn": "Blades of Ice",
        "dataKey": "Blades of Ice",
        "branch": "무술",
        "row": 5,
        "col": 1,
        "requiredLevel": 24,
        "description": "충전 기술 연속으로 공격을 적중시키면 필살기에 냉기 피해가 추가됩니다. 손톱 유형의 무기로만 사용할 수 있습니다. 용 필살기 또는 일반 공격을 사용하여 충전을 방출해야 합니다.",
        "prerequisites": [
          "claws-of-thunder"
        ]
      },
      {
        "id": "dragon-flight",
        "nameKo": "용의 비상",
        "nameEn": "Dragon Flight",
        "dataKey": "Dragon Flight",
        "branch": "무술",
        "row": 5,
        "col": 3,
        "requiredLevel": 24,
        "description": "필살기 적에게 순간이동한 후 걷어차 대상을 파괴합니다. 발차기 기술에 충전 보너스가 추가됩니다.",
        "prerequisites": [
          "dragon-tail"
        ]
      },
      {
        "id": "death-sentry",
        "nameKo": "죽음 파수기",
        "nameEn": "Death Sentry",
        "dataKey": "Death Sentry",
        "branch": "덫",
        "row": 6,
        "col": 1,
        "requiredLevel": 30,
        "description": "적에게 번개를 발사하거나 주위의 시체를 폭발시켜 적을 사멸시키는 덫을 설치합니다.",
        "prerequisites": [
          "lightning-sentry"
        ]
      },
      {
        "id": "blade-shield",
        "nameKo": "칼날 방패",
        "nameEn": "Blade Shield",
        "dataKey": "Blade Shield",
        "branch": "덫",
        "row": 6,
        "col": 3,
        "requiredLevel": 30,
        "description": "칼날이 주변을 회전하여 가까이 다가오는 적을 벱니다.",
        "prerequisites": [
          "blade-fury"
        ]
      },
      {
        "id": "venom",
        "nameKo": "맹독",
        "nameEn": "Venom",
        "dataKey": "Venom",
        "branch": "그림자 단련",
        "row": 6,
        "col": 1,
        "requiredLevel": 30,
        "description": "무기에 독 피해를 추가합니다.",
        "prerequisites": [
          "fade"
        ]
      },
      {
        "id": "shadow-master",
        "nameKo": "그림자 달인",
        "nameEn": "Shadow Master",
        "dataKey": "Shadow Master",
        "branch": "그림자 단련",
        "row": 6,
        "col": 2,
        "requiredLevel": 30,
        "description": "자신의 강력한 그림자를 소환하여 전투를 돕게 합니다.",
        "prerequisites": [
          "shadow-warrior"
        ]
      },
      {
        "id": "royal-strike",
        "nameKo": "불사조 일격",
        "nameEn": "Royal Strike",
        "dataKey": "Royal Strike",
        "branch": "무술",
        "row": 6,
        "col": 2,
        "requiredLevel": 30,
        "description": "충전 기술 필살기에 원소 공격이 추가됩니다. 용 필살기 또는 일반 공격을 사용하여 충전을 방출해야 합니다.",
        "prerequisites": [
          "cobra-strike",
          "blades-of-ice"
        ]
      }
    ]
  },
  "warlock": {
    "id": "warlock",
    "nameKo": "악마술사",
    "nameEn": "Warlock",
    "accent": "#c45a78",
    "branches": [
      "악마 결속",
      "기괴 무기",
      "혼돈 기술"
    ],
    "base": {
      "strength": 15,
      "dexterity": 20,
      "vitality": 25,
      "energy": 20
    },
    "baseLife": 55,
    "baseMana": 20,
    "lifePerLevel": 2,
    "manaPerLevel": 1.5,
    "lifePerVitality": 3,
    "manaPerEnergy": 2,
    "skills": [
      {
        "id": "summon-goatman",
        "nameKo": "염소인간 소환",
        "nameEn": "Summon Goatman",
        "dataKey": "Summon Goatman",
        "branch": "악마 결속",
        "row": 1,
        "col": 3,
        "requiredLevel": 1,
        "description": "전투를 돕는 염소인간 악마를 소환합니다.",
        "prerequisites": []
      },
      {
        "id": "demonic-mastery",
        "nameKo": "악마 숙련",
        "nameEn": "Demonic Mastery",
        "dataKey": "Demonic Mastery",
        "branch": "악마 결속",
        "row": 1,
        "col": 1,
        "requiredLevel": 1,
        "description": "소환하고 결속한 악마의 능력을 강화합니다.",
        "prerequisites": [
          "summon-goatman"
        ]
      },
      {
        "id": "death-mark",
        "nameKo": "죽음의 표식",
        "nameEn": "Death Mark",
        "dataKey": "Death Mark",
        "branch": "악마 결속",
        "row": 2,
        "col": 2,
        "requiredLevel": 6,
        "description": "대상에게 죽음의 표식을 남겨 악마의 공격을 집중시킵니다.",
        "prerequisites": [
          "summon-goatman"
        ]
      },
      {
        "id": "summon-tainted",
        "nameKo": "오염된 자 소환",
        "nameEn": "Summon Tainted",
        "dataKey": "Summon Tainted",
        "branch": "악마 결속",
        "row": 3,
        "col": 3,
        "requiredLevel": 12,
        "description": "원거리에서 화염을 사용하는 오염된 자를 소환합니다.",
        "prerequisites": [
          "summon-goatman"
        ]
      },
      {
        "id": "summon-defiler",
        "nameKo": "파멸자 소환",
        "nameEn": "Summon Defiler",
        "dataKey": "Summon Defiler",
        "branch": "악마 결속",
        "row": 4,
        "col": 3,
        "requiredLevel": 18,
        "description": "마법으로 적을 공격하는 파멸자를 소환합니다.",
        "prerequisites": [
          "summon-tainted"
        ]
      },
      {
        "id": "blood-oath",
        "nameKo": "피의 맹세",
        "nameEn": "Blood Oath",
        "dataKey": "Blood Oath",
        "branch": "악마 결속",
        "row": 2,
        "col": 1,
        "requiredLevel": 6,
        "description": "피의 맹세로 자신과 악마의 전투력을 높입니다.",
        "prerequisites": [
          "demonic-mastery"
        ]
      },
      {
        "id": "engorge",
        "nameKo": "포식",
        "nameEn": "Engorge",
        "dataKey": "Engorge",
        "branch": "악마 결속",
        "row": 5,
        "col": 2,
        "requiredLevel": 24,
        "description": "악마의 힘을 포식하여 능력을 강화합니다.",
        "prerequisites": [
          "blood-boil"
        ]
      },
      {
        "id": "blood-boil",
        "nameKo": "피 끓이기",
        "nameEn": "Blood Boil",
        "dataKey": "Blood Boil",
        "branch": "악마 결속",
        "row": 4,
        "col": 2,
        "requiredLevel": 18,
        "description": "소환된 악마의 피를 끓여 폭발적인 힘을 부여합니다.",
        "prerequisites": [
          "death-mark"
        ]
      },
      {
        "id": "consume",
        "nameKo": "소모",
        "nameEn": "Consume",
        "dataKey": "Consume",
        "branch": "악마 결속",
        "row": 6,
        "col": 1,
        "requiredLevel": 30,
        "description": "지배 중인 악마를 소모해 그 힘을 흡수합니다.",
        "prerequisites": [
          "blood-oath"
        ]
      },
      {
        "id": "bind-demon",
        "nameKo": "악마 결속",
        "nameEn": "Bind Demon",
        "dataKey": "Bind Demon",
        "branch": "악마 결속",
        "row": 6,
        "col": 3,
        "requiredLevel": 30,
        "description": "적 악마를 결속하여 자신의 하수인으로 만듭니다.",
        "prerequisites": [
          "engorge",
          "summon-defiler"
        ]
      },
      {
        "id": "levitate",
        "nameKo": "공중 부양",
        "nameEn": "Levitate",
        "dataKey": "Levitate",
        "branch": "기괴 무기",
        "row": 1,
        "col": 1,
        "requiredLevel": 1,
        "description": "무기를 공중에 띄워 기괴 기술의 기반을 마련합니다.",
        "prerequisites": []
      },
      {
        "id": "eldritch-blast",
        "nameKo": "기괴 폭발",
        "nameEn": "Eldritch Blast",
        "dataKey": "Eldritch Blast",
        "branch": "기괴 무기",
        "row": 5,
        "col": 2,
        "requiredLevel": 24,
        "description": "정신력으로 무기를 폭발시켜 주변 적을 공격합니다.",
        "prerequisites": [
          "psychic-ward"
        ]
      },
      {
        "id": "hex-bane",
        "nameKo": "사술 파멸",
        "nameEn": "Hex Bane",
        "dataKey": "Hex Bane",
        "branch": "기괴 무기",
        "row": 1,
        "col": 3,
        "requiredLevel": 1,
        "description": "무기에 적을 약화시키는 사술을 주입합니다.",
        "prerequisites": []
      },
      {
        "id": "hex-siphon",
        "nameKo": "사술 흡수",
        "nameEn": "Hex Siphon",
        "dataKey": "Hex Siphon",
        "branch": "기괴 무기",
        "row": 5,
        "col": 3,
        "requiredLevel": 24,
        "description": "사술에 걸린 적의 생명력을 흡수합니다.",
        "prerequisites": [
          "hex-purge"
        ]
      },
      {
        "id": "psychic-ward",
        "nameKo": "정신 방벽",
        "nameEn": "Psychic Ward",
        "dataKey": "Psychic Ward",
        "branch": "기괴 무기",
        "row": 4,
        "col": 2,
        "requiredLevel": 18,
        "description": "정신력으로 피해를 막아내는 방벽을 생성합니다.",
        "prerequisites": [
          "cleave"
        ]
      },
      {
        "id": "echoing-strike",
        "nameKo": "메아리 일격",
        "nameEn": "Echoing Strike",
        "dataKey": "Echoing Strike",
        "branch": "기괴 무기",
        "row": 3,
        "col": 1,
        "requiredLevel": 12,
        "description": "무기의 환영이 뒤따라 같은 대상을 다시 공격합니다.",
        "prerequisites": [
          "levitate"
        ]
      },
      {
        "id": "hex-purge",
        "nameKo": "사술 정화",
        "nameEn": "Hex Purge",
        "dataKey": "Hex Purge",
        "branch": "기괴 무기",
        "row": 3,
        "col": 3,
        "requiredLevel": 12,
        "description": "사술을 폭발시켜 대상과 주변 적에게 피해를 줍니다.",
        "prerequisites": [
          "hex-bane"
        ]
      },
      {
        "id": "blade-warp",
        "nameKo": "칼날 도약",
        "nameEn": "Blade Warp",
        "dataKey": "Blade Warp",
        "branch": "기괴 무기",
        "row": 4,
        "col": 1,
        "requiredLevel": 18,
        "description": "무기를 던진 위치로 순간 이동합니다.",
        "prerequisites": [
          "echoing-strike"
        ]
      },
      {
        "id": "cleave",
        "nameKo": "가르기",
        "nameEn": "Cleave",
        "dataKey": "Cleave",
        "branch": "기괴 무기",
        "row": 2,
        "col": 2,
        "requiredLevel": 6,
        "description": "정신력으로 조종한 무기로 다수의 적을 가릅니다.",
        "prerequisites": [
          "levitate"
        ]
      },
      {
        "id": "mirrored-blades",
        "nameKo": "거울 칼날",
        "nameEn": "Mirrored Blades",
        "dataKey": "Mirrored Blades",
        "branch": "기괴 무기",
        "row": 6,
        "col": 2,
        "requiredLevel": 30,
        "description": "무기의 무형 복제물을 만들어 적들을 공격합니다.",
        "prerequisites": [
          "blade-warp",
          "eldritch-blast"
        ]
      },
      {
        "id": "sigil-lethargy",
        "nameKo": "무기력의 인장",
        "nameEn": "Sigil Lethargy",
        "dataKey": "Sigil Lethargy",
        "branch": "혼돈 기술",
        "row": 2,
        "col": 2,
        "requiredLevel": 6,
        "description": "적의 움직임을 둔화시키는 인장을 새깁니다.",
        "prerequisites": []
      },
      {
        "id": "ring-of-fire",
        "nameKo": "불의 고리",
        "nameEn": "Ring of Fire",
        "dataKey": "Ring of Fire",
        "branch": "혼돈 기술",
        "row": 2,
        "col": 1,
        "requiredLevel": 6,
        "description": "사방으로 퍼지는 화염 투사체의 고리를 방출합니다.",
        "prerequisites": []
      },
      {
        "id": "miasma-bolt",
        "nameKo": "독기 화살",
        "nameEn": "Miasma Bolt",
        "dataKey": "Miasma Bolt",
        "branch": "혼돈 기술",
        "row": 1,
        "col": 3,
        "requiredLevel": 1,
        "description": "폭발하며 엔트로피 독기를 남기는 투사체를 발사합니다.",
        "prerequisites": []
      },
      {
        "id": "sigil-rancor",
        "nameKo": "원한의 인장",
        "nameEn": "Sigil Rancor",
        "dataKey": "Sigil Rancor",
        "branch": "혼돈 기술",
        "row": 3,
        "col": 2,
        "requiredLevel": 12,
        "description": "적이 받는 피해를 증폭하는 인장을 새깁니다.",
        "prerequisites": [
          "sigil-lethargy"
        ]
      },
      {
        "id": "enhanced-entropy",
        "nameKo": "강화된 엔트로피",
        "nameEn": "Enhanced Entropy",
        "dataKey": "Enhanced Entropy",
        "branch": "혼돈 기술",
        "row": 5,
        "col": 3,
        "requiredLevel": 24,
        "description": "독기와 엔트로피 기술의 파괴력을 강화합니다.",
        "prerequisites": [
          "miasma-chains"
        ]
      },
      {
        "id": "flame-wave",
        "nameKo": "화염 파동",
        "nameEn": "Flame Wave",
        "dataKey": "Flame Wave",
        "branch": "혼돈 기술",
        "row": 4,
        "col": 1,
        "requiredLevel": 18,
        "description": "전방으로 거대한 화염의 파동을 내보냅니다.",
        "prerequisites": [
          "ring-of-fire"
        ]
      },
      {
        "id": "miasma-chains",
        "nameKo": "독기 사슬",
        "nameEn": "Miasma Chains",
        "dataKey": "Miasma Chains",
        "branch": "혼돈 기술",
        "row": 3,
        "col": 3,
        "requiredLevel": 12,
        "description": "독기를 적들 사이로 연쇄시켜 지속 피해를 줍니다.",
        "prerequisites": [
          "miasma-bolt"
        ]
      },
      {
        "id": "sigil-death",
        "nameKo": "죽음의 인장",
        "nameEn": "Sigil Death",
        "dataKey": "Sigil Death",
        "branch": "혼돈 기술",
        "row": 5,
        "col": 2,
        "requiredLevel": 24,
        "description": "죽음의 힘이 축적되는 강력한 인장을 새깁니다.",
        "prerequisites": [
          "sigil-rancor"
        ]
      },
      {
        "id": "apocalypse",
        "nameKo": "대재앙",
        "nameEn": "Apocalypse",
        "dataKey": "Apocalypse",
        "branch": "혼돈 기술",
        "row": 6,
        "col": 1,
        "requiredLevel": 30,
        "description": "지옥불을 쏟아부어 넓은 지역을 불태웁니다.",
        "prerequisites": [
          "flame-wave",
          "sigil-death"
        ]
      },
      {
        "id": "abyss",
        "nameKo": "심연",
        "nameEn": "Abyss",
        "dataKey": "Abyss",
        "branch": "혼돈 기술",
        "row": 6,
        "col": 3,
        "requiredLevel": 30,
        "description": "현실을 찢어 주변의 적을 빨아들이는 심연을 엽니다.",
        "prerequisites": [
          "enhanced-entropy"
        ]
      }
    ]
  }
} as unknown as Record<Exclude<ClassId, 'necromancer' | 'sorceress'>, ClassDefinition>
