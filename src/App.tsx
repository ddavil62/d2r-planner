import { useEffect, useMemo, useState } from 'react'
import { CLASS_DEFINITIONS } from './data/classes'
import { ITEMS, ITEMS_BY_ID } from './data/items'
import { ITEM_CATALOG } from './data/catalog.generated'
import { BUILD_TEMPLATES } from './data/templates'
import { ENEMY_PRESETS } from './data/enemies'
import { WEAPON_BASES } from './data/weapon-bases.generated'
import {
  availableSkillPoints,
  availableStatPoints,
  breakpointProgress,
  calculateCombatSummary,
  calculateSummary,
  getEquipmentModifiers,
  getEquippedItemModifiers,
  skillBonusFor,
  skillCanIncrement,
  spentSkillPoints,
  spentStatPoints,
} from './lib/calculations'
import {
  createBuild,
  buildExportFilename,
  decodeBuild,
  decodeBuildCompressed,
  DRAFT_KEY,
  encodeBuild,
  encodeBuildCompressed,
  exportBuildFile,
  HISTORY_KEY,
  loadHistory,
  loadBuilds,
  loadDraft,
  normalizeBuild,
  importBuildFile,
  STORAGE_KEY,
  WISHLIST_KEY,
} from './lib/builds'
import { canPlaceInventory, charmSize, firstInventoryPosition, INVENTORY_HEIGHT, INVENTORY_WIDTH } from './lib/inventory'
import type {
  AttributeId,
  BuildProfile,
  BuildSummary,
  CatalogItem,
  ClassId,
  EquippedItem,
  EquipmentSlot,
  EnemySettings,
  Modifiers,
  SkillDefinition,
  WeaponBase,
} from './types'

type Page = 'overview' | 'skills' | 'attributes' | 'equipment' | 'items' | 'inventory' | 'library'
type ItemLanguage = 'ko' | 'en'

const ITEM_LANGUAGE_KEY = 'd2r-planner-item-language'
const classGlyphs: Record<ClassId, string> = {
  amazon: '⌁', sorceress: '✧', necromancer: '☠', paladin: '✚', barbarian: '⚒', druid: '❦', assassin: '◈', warlock: '⛧',
}
const classOrder: ClassId[] = ['amazon', 'sorceress', 'necromancer', 'paladin', 'barbarian', 'druid', 'assassin', 'warlock']

const pages: { id: Page; label: string; icon: string }[] = [
  { id: 'overview', label: '빌드 요약', icon: '◆' },
  { id: 'skills', label: '기술', icon: '✦' },
  { id: 'attributes', label: '능력치', icon: '▲' },
  { id: 'equipment', label: '장비', icon: '◇' },
  { id: 'items', label: '아이템 도감', icon: '◈' },
  { id: 'inventory', label: '인벤토리', icon: '▦' },
  { id: 'library', label: '보관함·비교', icon: '▤' },
]

const attributeLabels: Record<AttributeId, string> = {
  strength: '힘', dexterity: '민첩', vitality: '활력', energy: '마력',
}

const slotLabels: Record<EquipmentSlot, string> = {
  head: '투구', amulet: '목걸이', weapon: '주 무기', offhand: '보조 장비', armor: '갑옷',
  gloves: '장갑', ring1: '왼쪽 반지', ring2: '오른쪽 반지', belt: '허리띠', boots: '장화',
  swapWeapon: '교체 무기', swapOffhand: '교체 보조', charm1: '부적 1', charm2: '부적 2',
  charm3: '부적 3', charm4: '부적 4',
}

const modifierFields: { key: keyof Modifiers; label: string }[] = [
  { key: 'allSkills', label: '모든 기술' }, { key: 'amazonSkills', label: '아마존 기술' },
  { key: 'sorceressSkills', label: '원소술사 기술' }, { key: 'necromancerSkills', label: '네크로맨서 기술' },
  { key: 'paladinSkills', label: '성기사 기술' }, { key: 'barbarianSkills', label: '야만용사 기술' },
  { key: 'druidSkills', label: '드루이드 기술' }, { key: 'assassinSkills', label: '암살자 기술' },
  { key: 'warlockSkills', label: '악마술사 기술' }, { key: 'summoningSkills', label: '소환 기술' },
  { key: 'poisonBoneSkills', label: '독과 뼈' }, { key: 'cursesSkills', label: '저주 기술' },
  { key: 'coldSkills', label: '냉기 기술' }, { key: 'lightningSkills', label: '번개 기술' },
  { key: 'fireSkills', label: '화염 기술' }, { key: 'bowCrossbowSkills', label: '활과 쇠뇌' },
  { key: 'passiveMagicSkills', label: '지속 효과와 마법' }, { key: 'javelinSpearSkills', label: '투창과 창' },
  { key: 'paladinCombatSkills', label: '성기사 전투 기술' }, { key: 'offensiveAuraSkills', label: '공격 오라' },
  { key: 'defensiveAuraSkills', label: '방어 오라' }, { key: 'barbarianCombatSkills', label: '야만용사 전투 기술' },
  { key: 'combatMasteriesSkills', label: '전투 숙련' }, { key: 'warcriesSkills', label: '함성' },
  { key: 'druidSummoningSkills', label: '드루이드 소환' }, { key: 'shapeShiftingSkills', label: '변신' },
  { key: 'elementalSkills', label: '원소' }, { key: 'trapsSkills', label: '덫' },
  { key: 'shadowDisciplinesSkills', label: '그림자 단련' }, { key: 'martialArtsSkills', label: '무술' },
  { key: 'demonicBindingSkills', label: '악마 결속' }, { key: 'eldritchWeaponsSkills', label: '기괴 무기' },
  { key: 'artsOfChaosSkills', label: '혼돈 기술' }, { key: 'strength', label: '힘' },
  { key: 'dexterity', label: '민첩' }, { key: 'vitality', label: '활력' },
  { key: 'energy', label: '마력' }, { key: 'life', label: '생명력' }, { key: 'mana', label: '마나' },
  { key: 'allResist', label: '모든 저항' }, { key: 'fireResist', label: '화염 저항' },
  { key: 'coldResist', label: '냉기 저항' }, { key: 'lightningResist', label: '번개 저항' },
  { key: 'poisonResist', label: '독 저항' }, { key: 'fasterCastRate', label: '패캐' },
  { key: 'fasterHitRecovery', label: '패힛' }, { key: 'fasterBlockRate', label: '패블럭' },
  { key: 'increasedAttackSpeed', label: '공속' }, { key: 'fasterRunWalk', label: '달리기' },
  { key: 'magicFind', label: '매찬' }, { key: 'goldFind', label: '골찬' },
  { key: 'damageReduction', label: '피해 감소 %' },
  { key: 'enhancedDamage', label: '피해 증가 %' }, { key: 'flatMinDamage', label: '최소 피해' },
  { key: 'flatMaxDamage', label: '최대 피해' }, { key: 'crushingBlow', label: '강타 확률' },
  { key: 'deadlyStrike', label: '치명적 공격' }, { key: 'openWounds', label: '상처 악화' },
  { key: 'lifeSteal', label: '생명력 훔침' }, { key: 'manaSteal', label: '마나 훔침' },
  { key: 'enemyFireResistance', label: '적 화염 저항 감소' }, { key: 'enemyColdResistance', label: '적 냉기 저항 감소' },
  { key: 'enemyLightningResistance', label: '적 번개 저항 감소' }, { key: 'enemyPoisonResistance', label: '적 독 저항 감소' },
]

const catalogPropertyLabels: Record<string, string> = {
  'dmg%': '피해 증가', crush: '강타 확률', deadly: '치명적 공격', openwounds: '상처 악화',
  'kill-skill': '적 처치 시 기술', 'hit-skill': '타격 시 기술', 'gethit-skill': '피격 시 기술',
  'att-skill': '공격 시 기술', 'death-skill': '사망 시 기술', 'levelup-skill': '레벨 상승 시 기술',
  'pierce-fire': '적 화염 저항 감소', 'pierce-cold': '적 냉기 저항 감소', 'pierce-ltng': '적 번개 저항 감소',
  'pierce-pois': '적 독 저항 감소', 'pierce-mag': '적 마법 저항 감소', ac: '방어력', 'ac%': '방어력 증가',
  balance1: '타격 회복 속도', balance2: '타격 회복 속도', balance3: '타격 회복 속도',
  'res-all': '모든 저항', 'res-fire': '화염 저항', 'res-cold': '냉기 저항', 'res-ltng': '번개 저항', 'res-pois': '독 저항',
  allskills: '모든 기술', str: '힘', dex: '민첩', vit: '활력', enr: '마력', hp: '생명력', mana: '마나',
  swing1: '공격 속도', swing2: '공격 속도', swing3: '공격 속도', cast1: '시전 속도', cast2: '시전 속도', cast3: '시전 속도',
  move1: '달리기/걷기 속도', move2: '달리기/걷기 속도', move3: '달리기/걷기 속도',
  lifesteal: '생명력 훔침', manasteal: '마나 훔침', 'mag%': '마법 아이템 발견', 'gold%': '금화 획득',
  aura: '장착 시 오라', oskill: '기술 사용 가능', skill: '개별 기술', skilltab: '기술 계열', charged: '충전 기술',
  nofreeze: '빙결되지 않음', indestruct: '파괴 불가', 'all-stats': '모든 능력치',
}
const catalogPercentProperties = new Set(['dmg%', 'crush', 'deadly', 'openwounds', 'pierce-fire', 'pierce-cold', 'pierce-ltng', 'pierce-pois', 'pierce-mag', 'ac%', 'balance1', 'balance2', 'balance3', 'res-all', 'res-fire', 'res-cold', 'res-ltng', 'res-pois', 'swing1', 'swing2', 'swing3', 'cast1', 'cast2', 'cast3', 'move1', 'move2', 'move3', 'lifesteal', 'manasteal', 'mag%', 'gold%'])
const catalogSkillPropertyCodes = new Set(['kill-skill', 'hit-skill', 'gethit-skill', 'att-skill', 'death-skill', 'levelup-skill', 'aura', 'oskill', 'skill', 'charged'])
const catalogSkillNames = new Map(Object.values(CLASS_DEFINITIONS).flatMap((definition) => definition.skills.flatMap((skill) => [skill.nameEn, skill.dataKey].filter(Boolean).map((name) => [name!.toLowerCase(), skill.nameKo] as const))))

function formatCatalogProperty(property: string): string {
  const [code, ...values] = property.split(' · ')
  const displayedValues = [...values]
  if (catalogSkillPropertyCodes.has(code) && displayedValues[0]) displayedValues[0] = catalogSkillNames.get(displayedValues[0].toLowerCase()) ?? displayedValues[0]
  if (catalogPercentProperties.has(code) && displayedValues.length === 1) displayedValues[0] = `${displayedValues[0]}%`
  return `${catalogPropertyLabels[code] ?? code}${displayedValues.length ? ` · ${displayedValues.join(' · ')}` : ''}`
}

function App() {
  const [page, setPage] = useState<Page>('overview')
  const [build, setBuild] = useState<BuildProfile>(() => loadDraft())
  const [savedBuilds, setSavedBuilds] = useState<BuildProfile[]>(() => loadBuilds())
  const [history, setHistory] = useState<BuildProfile[]>(() => loadHistory())
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? '[]') } catch { return [] }
  })
  const [shareOpen, setShareOpen] = useState(false)
  const [shareCode, setShareCode] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [toast, setToast] = useState('')
  const summary = useMemo(() => calculateSummary(build), [build])
  const classDefinition = CLASS_DEFINITIONS[build.classId]

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(build))
  }, [build])

  useEffect(() => {
    const code = new URLSearchParams(window.location.hash.slice(1)).get('b')
    if (!code) return
    decodeBuildCompressed(code).then((imported) => {
      setBuild({ ...imported, id: crypto.randomUUID(), name: `${imported.name} (링크)` })
      setToast('공유 링크의 빌드를 불러왔습니다.')
    }).catch(() => setToast('공유 링크를 읽지 못했습니다.'))
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2400)
    return () => window.clearTimeout(timer)
  }, [toast])

  const updateBuild = (patch: Partial<BuildProfile>) => {
    setBuild((current) => ({ ...current, ...patch, updatedAt: new Date().toISOString() }))
  }

  const switchClass = (classId: ClassId) => {
    if (classId === build.classId) return
    const next = createBuild(classId)
    setBuild({
      ...next,
      level: build.level,
      difficulty: build.difficulty,
      questSkillPoints: build.questSkillPoints,
      questStatPoints: build.questStatPoints,
      questResistPoints: build.questResistPoints,
      name: `새 ${CLASS_DEFINITIONS[classId].nameKo} 빌드`,
    })
    setToast('직업에 맞춰 기술과 장비를 초기화했습니다.')
  }

  const applyTemplate = (templateId: string) => {
    const template = BUILD_TEMPLATES.find((item) => item.id === templateId)
    if (!template) return
    const base = createBuild(template.classId)
    setBuild(normalizeBuild({ ...base, name: template.name, skills: { ...template.skills }, attributes: { ...template.attributes }, equipment: { ...template.equipment }, notes: template.description }))
    setToast(`${template.name}을 적용했습니다.`)
  }

  const saveCurrent = () => {
    const snapshot = { ...build, updatedAt: new Date().toISOString() }
    const previous = savedBuilds.find((item) => item.id === snapshot.id)
    if (previous) {
      const nextHistory = [previous, ...history].slice(0, 20)
      setHistory(nextHistory)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory))
    }
    const next = [...savedBuilds.filter((item) => item.id !== snapshot.id), snapshot]
    setSavedBuilds(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setBuild(snapshot)
    setToast('보관함에 저장했습니다.')
  }

  const openShare = async () => {
    setShareCode(encodeBuild(build))
    const compressed = await encodeBuildCompressed(build)
    setShareLink(`${window.location.origin}${window.location.pathname}#b=${compressed}`)
    setShareOpen(true)
  }

  const importCode = () => {
    try {
      const imported = decodeBuild(shareCode)
      setBuild({ ...imported, id: crypto.randomUUID(), name: `${imported.name} (가져옴)` })
      setShareOpen(false)
      setToast('빌드 코드를 가져왔습니다.')
    } catch (error) {
      setToast(error instanceof Error ? error.message : '빌드 코드를 읽지 못했습니다.')
    }
  }

  const copyShareCode = async () => {
    await navigator.clipboard.writeText(encodeBuild(build))
    setToast('빌드 코드를 복사했습니다.')
  }

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(shareLink)
    setToast('공유 링크를 복사했습니다.')
  }

  const shareExternally = async () => {
    if (!navigator.share) {
      await copyShareLink()
      setToast('이 브라우저에서는 공유 앱을 열 수 없어 링크를 복사했습니다.')
      return
    }
    try {
      await navigator.share({ title: build.name, text: `${build.name} · D2R 3.3 빌드`, url: shareLink })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setToast('외부 공유를 열지 못했습니다.')
    }
  }

  const downloadBuild = () => {
    const blob = new Blob([exportBuildFile(build)], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = buildExportFilename(build.name)
    anchor.click()
    URL.revokeObjectURL(url)
    setToast('빌드 파일을 내보냈습니다.')
  }

  const importFile = async (file?: File) => {
    if (!file) return
    try {
      const imported = importBuildFile(await file.text())
      setBuild({ ...imported, id: crypto.randomUUID(), name: `${imported.name} (가져옴)` })
      setShareOpen(false)
      setToast('빌드 파일을 가져왔습니다.')
    } catch (error) {
      setToast(error instanceof Error ? error.message : '빌드 파일을 읽지 못했습니다.')
    }
  }

  const toggleWishlist = (id: string) => {
    const next = wishlist.includes(id) ? wishlist.filter((item) => item !== id) : [...wishlist, id]
    setWishlist(next)
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(next))
  }

  return (
    <div className="app-shell" style={{ '--class-accent': classDefinition.accent } as React.CSSProperties}>
      <header className="topbar">
        <div className="brand-block">
          <span className="brand-mark">S</span>
          <div><strong>성역의 설계서</strong><small>D2R BUILD PLANNER</small></div>
        </div>
        <div className="version-badges">
          <span>악마술사의 군림</span><span>3.3</span><span className="offline-badge">비래더</span>
        </div>
        <div className="top-actions">
          <button className="button ghost" onClick={openShare}>빌드 공유</button>
          <button className="button primary" onClick={saveCurrent}>현재 저장</button>
        </div>
      </header>

      <aside className="sidebar">
        <nav>
          {pages.map((item) => (
            <button key={item.id} data-testid={`nav-${item.id}`} className={page === item.id ? 'active' : ''} onClick={() => setPage(item.id)}>
              <span>{item.icon}</span>{item.label}
              {item.id === 'skills' && <em>{summary.spentSkillPoints}/{summary.availableSkillPoints}</em>}
              {item.id === 'library' && savedBuilds.length > 0 && <em>{savedBuilds.length}</em>}
            </button>
          ))}
        </nav>
        <div className="accuracy-note">
          <span className="status-dot" />
          <strong>계산 기준</strong>
          <p>3.3.93847 · 한국어 클라이언트</p>
          <p>기본 공격 피해 · 기술 DPS 준비 중</p>
        </div>
      </aside>

      <main className="workspace">
        <ProfileBar build={build} updateBuild={updateBuild} switchClass={switchClass} applyTemplate={applyTemplate} />
        {page === 'overview' && <Overview build={build} summary={summary} setPage={setPage} updateBuild={updateBuild} />}
        {page === 'skills' && <SkillPlanner build={build} setBuild={setBuild} />}
        {page === 'attributes' && <AttributePlanner build={build} setBuild={setBuild} summary={summary} />}
        {page === 'equipment' && <EquipmentPlanner build={build} setBuild={setBuild} />}
        {page === 'items' && <ItemCatalog build={build} setBuild={setBuild} wishlist={wishlist} toggleWishlist={toggleWishlist} setPage={setPage} />}
        {page === 'inventory' && <InventoryPlanner build={build} setBuild={setBuild} />}
        {page === 'library' && <Library builds={savedBuilds} history={history} current={build} onLoad={setBuild} onDelete={(id) => {
          const next = savedBuilds.filter((item) => item.id !== id)
          setSavedBuilds(next)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        }} />}
      </main>

      <SummaryRail build={build} summary={summary} />

      {shareOpen && (
        <div className="modal-backdrop" onMouseDown={() => setShareOpen(false)}>
          <section className="modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-header"><div><small>EXPORT · IMPORT</small><h2>빌드 내보내기</h2></div><button aria-label="공유 창 닫기" onClick={() => setShareOpen(false)}>×</button></div>
            <p>링크나 파일로 전체 세팅을 공유하면 상대가 같은 기술, 능력치, 장비와 메모를 불러올 수 있습니다.</p>
            <div className="export-options">
              <button className="export-option primary" data-testid="share-external" onClick={shareExternally}><span>↗</span><strong>외부 앱으로 공유</strong><small>텔레그램·카카오톡 등에 링크 전송</small></button>
              <button className="export-option" data-testid="download-build" onClick={downloadBuild}><span>⇩</span><strong>파일로 내보내기</strong><small>.d2rbuild 파일로 세팅 보관</small></button>
            </div>
            <label className="share-link-field"><span>공유 링크</span><input value={shareLink} readOnly /></label>
            <div className="share-link-actions"><button className="button primary" onClick={copyShareLink}>링크 복사</button><button className="button ghost" onClick={copyShareCode}>빌드 코드 복사</button></div>
            <details className="advanced-import">
              <summary>코드 또는 파일 가져오기</summary>
              <textarea aria-label="빌드 코드" value={shareCode} onChange={(event) => setShareCode(event.target.value)} rows={6} spellCheck={false} />
              <div className="modal-actions">
                <label className="button ghost file-import">파일 선택<input data-testid="import-build-file" type="file" accept=".d2rbuild,.json,application/json" onChange={(event) => importFile(event.target.files?.[0])} /></label>
                <button className="button primary" onClick={importCode}>입력한 코드 가져오기</button>
              </div>
            </details>
          </section>
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function ProfileBar({ build, updateBuild, switchClass, applyTemplate }: {
  build: BuildProfile
  updateBuild: (patch: Partial<BuildProfile>) => void
  switchClass: (classId: ClassId) => void
  applyTemplate: (templateId: string) => void
}) {
  return (
    <section className="profile-bar panel">
      <div className="class-switcher">
        {classOrder.map((classId) => CLASS_DEFINITIONS[classId]).map((definition) => (
          <button key={definition.id} type="button" data-testid={`class-${definition.id}`} className={build.classId === definition.id ? 'selected' : ''} onClick={() => switchClass(definition.id)}>
            <span className={`class-sigil ${definition.id}`}>{classGlyphs[definition.id]}</span>
            <span><strong>{definition.nameKo}</strong><small>{definition.nameEn}</small></span>
          </button>
        ))}
      </div>
      <label className="build-name"><span>빌드 이름</span><input value={build.name} onChange={(event) => updateBuild({ name: event.target.value })} /></label>
      <label className="compact-field template-field"><span>추천 골격</span><select value="" onChange={(event) => applyTemplate(event.target.value)}><option value="">선택…</option>{BUILD_TEMPLATES.filter((item) => item.classId === build.classId).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label className="compact-field"><span>레벨</span><input type="number" min={1} max={99} value={build.level} onChange={(event) => updateBuild({ level: Math.max(1, Math.min(99, Number(event.target.value))) })} /></label>
      <label className="compact-field"><span>난이도</span><select value={build.difficulty} onChange={(event) => updateBuild({ difficulty: event.target.value as BuildProfile['difficulty'] })}><option value="normal">보통</option><option value="nightmare">악몽</option><option value="hell">지옥</option></select></label>
    </section>
  )
}

function Overview({ build, summary, setPage, updateBuild }: { build: BuildProfile; summary: BuildSummary; setPage: (page: Page) => void; updateBuild: (patch: Partial<BuildProfile>) => void }) {
  const classDefinition = CLASS_DEFINITIONS[build.classId]
  const topSkills = classDefinition.skills
    .map((skill) => ({ skill, hard: build.skills[skill.id] ?? 0, bonus: skillBonusFor(build, skill) }))
    .filter((entry) => entry.hard > 0)
    .sort((a, b) => (b.hard + b.bonus) - (a.hard + a.bonus))
    .slice(0, 6)
  const warnings = [
    summary.spentSkillPoints > summary.availableSkillPoints ? '기술 포인트가 예산을 초과했습니다.' : '',
    summary.spentStatPoints > summary.availableStatPoints ? '능력치 포인트가 예산을 초과했습니다.' : '',
    Object.entries(build.equipment).some(([, item]) => item && (ITEMS_BY_ID[item.definitionId]?.requiredLevel ?? 0) > build.level) ? '현재 레벨보다 요구 레벨이 높은 장비가 있습니다.' : '',
  ].filter(Boolean)
  return (
    <div className="page-stack">
      <section className="hero-card panel">
        <div><small>{classDefinition.nameEn.toUpperCase()} · LEVEL {build.level}</small><h1>{build.name}</h1><p>{build.difficulty === 'hell' ? '지옥' : build.difficulty === 'nightmare' ? '악몽' : '보통'} 난이도 · 악마술사의 군림 3.3 · 비래더</p></div>
        <div className="hero-stats"><div><span>생명력</span><strong>{summary.life}</strong></div><div><span>마나</span><strong>{summary.mana}</strong></div><div><span>남은 기술</span><strong>{summary.availableSkillPoints - summary.spentSkillPoints}</strong></div><div><span>남은 능력치</span><strong>{summary.availableStatPoints - summary.spentStatPoints}</strong></div></div>
      </section>
      {warnings.length > 0 && <section className="warning-strip">{warnings.map((warning) => <span key={warning}>! {warning}</span>)}</section>}
      <div className="overview-grid">
        <section className="panel section-card">
          <div className="section-heading"><div><small>CORE SKILLS</small><h2>주요 기술</h2></div><button onClick={() => setPage('skills')}>편집 →</button></div>
          {topSkills.length ? <div className="top-skills">{topSkills.map(({ skill, hard, bonus }) => <div key={skill.id}><span>{skill.nameKo}</span><strong>{hard + bonus}</strong><small>기본 {hard}{bonus > 0 ? ` + 장비 ${bonus}` : ''}</small></div>)}</div> : <EmptyState text="아직 투자한 기술이 없습니다." action="기술 배분하기" onClick={() => setPage('skills')} />}
        </section>
        <BreakpointPanel build={build} summary={summary} />
        <section className="panel section-card resist-card">
          <div className="section-heading"><div><small>HELL RESISTANCES</small><h2>저항</h2></div><button onClick={() => setPage('equipment')}>장비 편집 →</button></div>
          <div className="resist-grid">{Object.entries(summary.resistances).map(([type, value]) => <div key={type} className={type}><span>{type === 'fire' ? '화염' : type === 'cold' ? '냉기' : type === 'lightning' ? '번개' : '독'}</span><strong>{value > 0 ? '+' : ''}{value}%</strong><div><i style={{ width: `${Math.max(0, Math.min(100, (value + 100) / 1.75))}%` }} /></div></div>)}</div>
        </section>
        <section className="panel section-card notes-card">
          <div className="section-heading"><div><small>BUILD NOTES</small><h2>메모</h2></div></div>
          <textarea value={build.notes} onChange={(event) => updateBuild({ notes: event.target.value })} placeholder="사냥 목적, 용병, 교체 장비 같은 메모를 남겨두세요." />
        </section>
      </div>
    </div>
  )
}

function SkillPlanner({ build, setBuild }: { build: BuildProfile; setBuild: React.Dispatch<React.SetStateAction<BuildProfile>> }) {
  const definition = CLASS_DEFINITIONS[build.classId]
  const [selectedBranch, setSelectedBranch] = useState(definition.branches[0])
  const [selectedSkillId, setSelectedSkillId] = useState(definition.skills[0].id)
  const spent = spentSkillPoints(build)
  const available = availableSkillPoints(build)
  const equipmentModifiers = getEquipmentModifiers(build)
  const treeRow = (skill: SkillDefinition) => skill.requiredLevel === 1 ? 1 : skill.requiredLevel / 6 + 1
  const treeLevels = [1, 6, 12, 18, 24, 30]
  const treeRowHeight = 132
  const skillNodeHeight = 116
  const skillNodeTop = (treeRowHeight - skillNodeHeight) / 2
  const branchSkills = definition.skills.filter((item) => item.branch === selectedBranch)
  const branchIds = new Set(branchSkills.map((item) => item.id))
  const selectedSkill = definition.skills.find((item) => item.id === selectedSkillId) ?? branchSkills[0]

  useEffect(() => {
    const firstBranch = definition.branches[0]
    setSelectedBranch(firstBranch)
    setSelectedSkillId(definition.skills.find((item) => item.branch === firstBranch)?.id ?? definition.skills[0].id)
  }, [definition])

  useEffect(() => {
    if (selectedSkill?.branch === selectedBranch) return
    const firstSkill = definition.skills.find((item) => item.branch === selectedBranch)
    if (firstSkill) setSelectedSkillId(firstSkill.id)
  }, [definition, selectedBranch, selectedSkill?.branch])

  const changeSkill = (skill: SkillDefinition, delta: number) => {
    setBuild((current) => {
      const currentPoints = current.skills[skill.id] ?? 0
      if (delta > 0 && !skillCanIncrement(current, skill)) return current
      if (delta < 0) {
        if (currentPoints <= 0) return current
        const hasDependent = definition.skills.some((candidate) => (candidate.prerequisites ?? []).includes(skill.id) && (current.skills[candidate.id] ?? 0) > 0)
        if (currentPoints === 1 && hasDependent) return current
      }
      return { ...current, skills: { ...current.skills, [skill.id]: currentPoints + delta }, updatedAt: new Date().toISOString() }
    })
  }
  const occupied = (col: number, row: number) => branchSkills.some((skill) => skill.col === col && treeRow(skill) === row)
  const connectorPath = (prerequisite: SkillDefinition, item: SkillDefinition) => {
    const sourceX = (prerequisite.col - .5) * 100
    const targetX = (item.col - .5) * 100
    const sourceRow = treeRow(prerequisite)
    const targetRow = treeRow(item)
    const sourceY = (sourceRow - 1) * treeRowHeight + skillNodeTop + skillNodeHeight
    const targetY = (targetRow - 1) * treeRowHeight + skillNodeTop
    if (prerequisite.col === item.col) return `M ${sourceX} ${sourceY} V ${targetY}`
    if (sourceRow === targetRow) {
      const isLastRow = targetRow === treeLevels.length
      const routeY = isLastRow ? (targetRow - 1) * treeRowHeight : targetRow * treeRowHeight
      const anchorY = isLastRow ? targetY : sourceY
      return `M ${sourceX} ${anchorY} V ${routeY} H ${targetX} V ${anchorY}`
    }
    let bestGap = 0
    let bestCollisions = Infinity
    for (let gap = 0; gap <= targetRow - sourceRow - 1; gap += 1) {
      let collisions = 0
      for (let row = sourceRow + 1; row <= sourceRow + gap; row += 1) if (occupied(prerequisite.col, row)) collisions += 1
      for (let row = sourceRow + gap + 1; row <= targetRow - 1; row += 1) if (occupied(item.col, row)) collisions += 1
      if (collisions < bestCollisions) { bestCollisions = collisions; bestGap = gap }
    }
    const jogY = (sourceRow + bestGap) * treeRowHeight
    return `M ${sourceX} ${sourceY} V ${jogY} H ${targetX} V ${targetY}`
  }

  const selectedHard = build.skills[selectedSkill.id] ?? 0
  const selectedBonus = skillBonusFor(build, selectedSkill, equipmentModifiers)
  const selectedPrerequisites = (selectedSkill.prerequisites ?? []).map((id) => definition.skills.find((item) => item.id === id)).filter(Boolean) as SkillDefinition[]

  return (
    <div className="page-stack">
      <section className="page-title skill-page-title"><div><small>SKILL PLANNER</small><h1>{definition.nameKo} 기술</h1><p>한 계열에 집중해 기술 이름과 연결 관계를 크게 보고, 선택한 기술의 세부 정보를 바로 확인합니다.</p></div><div className={`budget-pill ${spent > available ? 'over' : ''}`}><span>사용</span><strong>{spent}</strong><i>/</i><span>보유</span><strong>{available}</strong><button onClick={() => setBuild((current) => ({ ...current, skills: {} }))}>초기화</button></div></section>
      <div className="skill-branch-tabs" role="tablist" aria-label="기술 계열">
        {definition.branches.map((branch) => {
          const points = definition.skills.filter((item) => item.branch === branch).reduce((sum, item) => sum + (build.skills[item.id] ?? 0), 0)
          return <button key={branch} type="button" role="tab" aria-selected={selectedBranch === branch} className={selectedBranch === branch ? 'active' : ''} onClick={() => setSelectedBranch(branch)}><strong>{branch}</strong><span>{points} P</span></button>
        })}
      </div>
      <div className="skill-focus-layout">
        <section className="skill-tree panel" aria-label={`${selectedBranch} 기술 트리`}>
          <div className="tree-title"><div><small>SKILL TREE</small><h2>{selectedBranch}</h2></div><span>{branchSkills.reduce((sum, item) => sum + (build.skills[item.id] ?? 0), 0)} 포인트</span></div>
            <div className="skill-tree-canvas">
              <div className="tree-level-guide">{treeLevels.map((level) => <span key={level}>LV {level}</span>)}</div>
              <svg className="skill-connectors" viewBox="0 0 300 792" preserveAspectRatio="none" aria-hidden="true">
                {branchSkills.flatMap((item) => (item.prerequisites ?? []).filter((id) => branchIds.has(id)).map((prerequisiteId) => {
                  const prerequisite = branchSkills.find((candidate) => candidate.id === prerequisiteId)!
                  const active = (build.skills[prerequisite.id] ?? 0) > 0
                  const invested = (build.skills[item.id] ?? 0) > 0
                  return <path key={`${prerequisiteId}-${item.id}`} className={`${active ? 'ready' : ''} ${invested ? 'active' : ''}`} d={connectorPath(prerequisite, item)} />
                }))}
              </svg>
              {branchSkills.sort((a, b) => a.requiredLevel - b.requiredLevel || a.col - b.col).map((item) => {
                const hard = build.skills[item.id] ?? 0
                const bonus = skillBonusFor(build, item, equipmentModifiers)
                const locked = build.level < item.requiredLevel || !(item.prerequisites ?? []).every((id) => (build.skills[id] ?? 0) > 0)
                const canAdd = skillCanIncrement(build, item)
                return <article data-testid={`skill-${item.id}`} style={{ gridColumn: item.col, gridRow: treeRow(item) }} key={item.id} onClick={() => setSelectedSkillId(item.id)} className={`skill-node ${selectedSkill.id === item.id ? 'selected' : ''} ${hard ? 'invested' : ''} ${canAdd ? 'available' : ''} ${locked ? 'locked' : ''}`}>
                  <div className="skill-node-heading"><strong className="skill-name">{item.nameKo}</strong><small className="skill-level">요구 레벨 {item.requiredLevel}</small></div>
                  <div className="skill-rank-summary"><span>투자 {hard}/20</span>{bonus > 0 && <span>장비 +{bonus}</span>}</div>
                  <div className="skill-counter"><button aria-label={`${item.nameKo} 감소`} onClick={() => changeSkill(item, -1)} disabled={hard <= 0}>−</button><strong><small>최종</small>{hard + bonus}</strong><button aria-label={`${item.nameKo} 증가`} onClick={() => changeSkill(item, 1)} disabled={!canAdd}>+</button></div>
                  <div className="skill-tooltip"><strong>{item.nameKo}</strong><p>{item.description}</p>{item.prerequisites?.length ? <em>선행: {item.prerequisites.map((id) => definition.skills.find((candidate) => candidate.id === id)?.nameKo).join(', ')}</em> : <em>선행 기술 없음</em>}</div>
                </article>
              })}
            </div>
        </section>
        <aside className="skill-inspector panel" aria-live="polite">
          <div className="skill-inspector-heading"><small>SELECTED SKILL</small><span>{selectedBranch}</span></div>
          <h2>{selectedSkill.nameKo}</h2>
          <p className="skill-name-en">{selectedSkill.nameEn}</p>
          <p className="skill-description">{selectedSkill.description}</p>
          <div className="inspector-counter">
            <button aria-label={`${selectedSkill.nameKo} 상세에서 감소`} onClick={() => changeSkill(selectedSkill, -1)} disabled={selectedHard <= 0}>−</button>
            <strong>{selectedHard + selectedBonus}<small>최종 레벨</small></strong>
            <button aria-label={`${selectedSkill.nameKo} 상세에서 증가`} onClick={() => changeSkill(selectedSkill, 1)} disabled={!skillCanIncrement(build, selectedSkill)}>+</button>
          </div>
          <dl className="skill-facts">
            <div><dt>요구 레벨</dt><dd>{selectedSkill.requiredLevel}</dd></div>
            <div><dt>직접 투자</dt><dd>{selectedHard} / 20</dd></div>
            <div><dt>장비 보너스</dt><dd className={selectedBonus > 0 ? 'bonus' : ''}>+{selectedBonus}</dd></div>
            <div><dt>남은 포인트</dt><dd>{Math.max(0, available - spent)}</dd></div>
          </dl>
          <section className="prerequisite-list"><small>PREREQUISITES · 선행 기술</small>{selectedPrerequisites.length ? selectedPrerequisites.map((skill) => <button key={skill.id} onClick={() => { setSelectedBranch(skill.branch); setSelectedSkillId(skill.id) }}><span>{skill.nameKo}</span><em>{(build.skills[skill.id] ?? 0) > 0 ? '충족' : '미충족'}</em></button>) : <p>선행 기술이 없습니다.</p>}</section>
        </aside>
      </div>
    </div>
  )
}

function AttributePlanner({ build, setBuild, summary }: { build: BuildProfile; setBuild: React.Dispatch<React.SetStateAction<BuildProfile>>; summary: BuildSummary }) {
  const definition = CLASS_DEFINITIONS[build.classId]
  const remaining = availableStatPoints(build) - spentStatPoints(build)
  const change = (attribute: AttributeId, amount: number) => setBuild((current) => {
    const allowed = amount > 0 ? Math.min(amount, availableStatPoints(current) - spentStatPoints(current)) : Math.max(amount, -current.attributes[attribute])
    if (!allowed) return current
    return { ...current, attributes: { ...current.attributes, [attribute]: current.attributes[attribute] + allowed }, updatedAt: new Date().toISOString() }
  })
  return (
    <div className="page-stack narrow-page">
      <section className="page-title"><div><small>ATTRIBUTE PLANNER</small><h1>능력치 배분</h1><p>표시 수치는 기본 능력치, 직접 투자, 현재 장비 옵션을 모두 합산합니다.</p></div><div className={`budget-pill ${remaining < 0 ? 'over' : ''}`}><span>남은 포인트</span><strong>{remaining}</strong><button onClick={() => setBuild((current) => ({ ...current, attributes: { strength: 0, dexterity: 0, vitality: 0, energy: 0 } }))}>초기화</button></div></section>
      <div className="attribute-grid">
        {(Object.keys(attributeLabels) as AttributeId[]).map((attribute) => (
          <section className="attribute-card panel" key={attribute}>
            <div className="attribute-glyph">{attribute === 'strength' ? '◆' : attribute === 'dexterity' ? '⌁' : attribute === 'vitality' ? '♥' : '✦'}</div>
            <div><small>{attribute.toUpperCase()}</small><h2>{attributeLabels[attribute]}</h2><p>기본 {definition.base[attribute]} · 투자 {build.attributes[attribute]}</p></div>
            <strong className="attribute-total">{summary.attributes[attribute]}</strong>
            <div className="attribute-actions"><button onClick={() => change(attribute, -5)}>−5</button><button onClick={() => change(attribute, -1)}>−</button><button onClick={() => change(attribute, 1)} disabled={remaining <= 0}>+</button><button onClick={() => change(attribute, 5)} disabled={remaining <= 0}>+5</button></div>
          </section>
        ))}
      </div>
      <section className="panel quest-panel">
        <div><small>QUEST REWARDS</small><h2>퀘스트 보너스</h2><p>완료한 난이도에 맞춰 직접 조절할 수 있습니다.</p></div>
        <label>기술 포인트<input type="number" min={0} max={12} value={build.questSkillPoints} onChange={(event) => setBuild((current) => ({ ...current, questSkillPoints: Number(event.target.value) }))} /><span>/ 12</span></label>
        <label>능력치 포인트<input type="number" min={0} max={15} step={5} value={build.questStatPoints} onChange={(event) => setBuild((current) => ({ ...current, questStatPoints: Number(event.target.value) }))} /><span>/ 15</span></label>
        <label>저항 보너스<input type="number" min={0} max={30} step={10} value={build.questResistPoints} onChange={(event) => setBuild((current) => ({ ...current, questResistPoints: Number(event.target.value) }))} /><span>/ 30</span></label>
      </section>
      <button className="vitality-fill" disabled={remaining <= 0} onClick={() => change('vitality', remaining)}>남은 포인트를 모두 활력에 투자</button>
    </div>
  )
}

function EquipmentPlanner({ build, setBuild }: { build: BuildProfile; setBuild: React.Dispatch<React.SetStateAction<BuildProfile>> }) {
  const slots = (Object.keys(slotLabels) as EquipmentSlot[]).filter((slot) => !slot.startsWith('charm'))
  const classSkills = CLASS_DEFINITIONS[build.classId].skills
  const catalog = ITEM_CATALOG as readonly unknown[] as readonly CatalogItem[]
  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot>('weapon')
  const [itemLanguage, setItemLanguage] = useState<ItemLanguage>(() => localStorage.getItem(ITEM_LANGUAGE_KEY) === 'en' ? 'en' : 'ko')
  useEffect(() => localStorage.setItem(ITEM_LANGUAGE_KEY, itemLanguage), [itemLanguage])
  const catalogName = (item: CatalogItem) => itemLanguage === 'ko' ? item.nameKo : item.name
  const catalogSecondaryName = (item: CatalogItem) => itemLanguage === 'ko' ? item.name : item.nameKo
  const catalogBaseName = (item: CatalogItem) => itemLanguage === 'ko' ? item.baseNameKo : item.baseName
  const selectItem = (slot: EquipmentSlot, definitionId: string) => setBuild((current) => {
    const equipment = { ...current.equipment }
    if (!definitionId) delete equipment[slot]
    else equipment[slot] = { definitionId, name: definitionId === 'custom' ? `사용자 ${slotLabels[slot]}` : undefined, modifiers: {} }
    return { ...current, equipment, updatedAt: new Date().toISOString() }
  })
  const updateItem = (slot: EquipmentSlot, patch: Partial<EquippedItem>) => setBuild((current) => ({
    ...current,
    equipment: { ...current.equipment, [slot]: { ...current.equipment[slot]!, ...patch } },
    updatedAt: new Date().toISOString(),
  }))
  const visibleSlots = slots.filter((slot) => !slot.startsWith('swap') && !slot.startsWith('charm')).map((slot) => {
    if (slot === 'weapon' && build.activeWeaponSet === 2) return 'swapWeapon' as EquipmentSlot
    if (slot === 'offhand' && build.activeWeaponSet === 2) return 'swapOffhand' as EquipmentSlot
    return slot
  })
  const selectedEquipped = build.equipment[selectedSlot]
  const selectedDefinition = selectedEquipped ? ITEMS_BY_ID[selectedEquipped.definitionId] : undefined
  const selectedCatalogItem = selectedEquipped?.catalogId ? catalog.find((item) => item.id === selectedEquipped.catalogId) : undefined
  const selectedModifiers = selectedEquipped ? getEquippedItemModifiers(selectedEquipped) : {}
  const selectedChoices = ITEMS.filter((item) => item.slots.includes(selectedSlot))
  const activeWeaponSlot: EquipmentSlot = build.activeWeaponSet === 1 ? 'weapon' : 'swapWeapon'
  const activeWeapon = build.equipment[activeWeaponSlot]
  const activeCatalogItem = activeWeapon?.catalogId ? catalog.find((item) => item.id === activeWeapon.catalogId) : undefined
  const weaponBases = WEAPON_BASES as readonly unknown[] as readonly WeaponBase[]
  const compatibleWeaponBases = activeCatalogItem?.category === 'runeword' ? weaponBases.filter((base) => {
    const allowed = activeCatalogItem.allowedBaseTypes?.some((type) => base.types.includes(type)) ?? false
    const excluded = activeCatalogItem.excludedBaseTypes?.some((type) => base.types.includes(type)) ?? false
    return allowed && !excluded && base.maxSockets >= (activeCatalogItem.requiredSockets ?? 0)
  }).sort((left, right) => left.requiredLevel - right.requiredLevel || left.name.localeCompare(right.name)) : []
  const combatSummary = calculateCombatSummary(build)
  const updateEnemy = (patch: Partial<EnemySettings>) => setBuild((current) => ({ ...current, enemy: { ...current.enemy, ...patch }, updatedAt: new Date().toISOString() }))
  const slotGlyphs: Partial<Record<EquipmentSlot, string>> = { head: '♜', amulet: '◉', weapon: '†', swapWeapon: '†', offhand: '⬙', swapOffhand: '⬙', armor: '♟', gloves: '⌁', ring1: '○', ring2: '○', belt: '═', boots: '♞' }
  const positionClass = (slot: EquipmentSlot) => slot === 'swapWeapon' ? 'weapon' : slot === 'swapOffhand' ? 'offhand' : slot
  return (
    <div className="page-stack">
      <section className="page-title equipment-page-title"><div><small>EQUIPMENT LAB</small><h1>장비 구성</h1><p>게임 인벤토리와 같은 위치에서 착용 장비를 확인하고, 선택한 슬롯을 큰 편집기에서 수정합니다.</p></div><div className="weapon-set-toggle"><span>활성 무기</span><button className={build.activeWeaponSet === 1 ? 'active' : ''} onClick={() => { setBuild((current) => ({ ...current, activeWeaponSet: 1 })); setSelectedSlot('weapon') }}>I</button><button className={build.activeWeaponSet === 2 ? 'active' : ''} onClick={() => { setBuild((current) => ({ ...current, activeWeaponSet: 2 })); setSelectedSlot('swapWeapon') }}>II</button></div></section>
      <div className="equipment-focus-layout">
        <section className="equipment-doll-panel panel">
          <div className="equipment-panel-heading"><div><small>CLASSIC EQUIPMENT</small><h2>착용 장비</h2></div><span>슬롯을 선택해 옵션을 편집하세요</span></div>
          <div className="equipment-doll">
            <div className="equipment-character-mark"><img src="assets/equipment-wanderer.png" alt="" /><small>{CLASS_DEFINITIONS[build.classId].nameEn.toUpperCase()}</small></div>
            <div className="equipment-position-grid">
              {visibleSlots.map((slot) => {
                const equipped = build.equipment[slot]
                const definition = equipped ? ITEMS_BY_ID[equipped.definitionId] : undefined
                const modifiers = equipped ? getEquippedItemModifiers(equipped) : {}
                const catalogItem = equipped?.catalogId ? catalog.find((item) => item.id === equipped.catalogId) : undefined
                const itemName = catalogItem ? catalogName(catalogItem) : definition ? (itemLanguage === 'ko' ? definition.nameKo : definition.nameEn) : equipped?.name ?? '비어 있음'
                const primaryModifier = Object.entries(modifiers).find(([, value]) => value)
                return <button type="button" data-testid={`doll-slot-${slot}`} aria-label={`${slotLabels[slot]}: ${itemName}`} title={`${slotLabels[slot]} · ${itemName}`} className={`doll-equipment-slot position-${positionClass(slot)} ${selectedSlot === slot ? 'selected' : ''} ${equipped ? 'equipped' : ''}`} key={slot} onClick={() => setSelectedSlot(slot)}>
                  <small>{slotLabels[slot]}</small><i>{slotGlyphs[slot] ?? '◇'}</i><strong>{itemName}</strong>
                  <em>{primaryModifier ? `${modifierFields.find((field) => field.key === primaryModifier[0])?.label ?? primaryModifier[0]} ${Number(primaryModifier[1]) > 0 ? '+' : ''}${primaryModifier[1]}` : '아이템 선택'}</em>
                </button>
              })}
            </div>
          </div>
        </section>
        <aside className="equipment-detail-panel panel" data-testid="equipment-detail">
          <div className="equipment-detail-heading"><small>SELECTED SLOT</small><span>{slotLabels[selectedSlot]}</span></div>
          <div className="equipment-detail-title"><i>{slotGlyphs[selectedSlot] ?? '◇'}</i><div><h2>{selectedCatalogItem ? catalogName(selectedCatalogItem) : selectedDefinition ? (itemLanguage === 'ko' ? selectedDefinition.nameKo : selectedDefinition.nameEn) : selectedEquipped?.name ?? '비어 있음'}</h2><p>{selectedCatalogItem ? catalogSecondaryName(selectedCatalogItem) : selectedDefinition ? (itemLanguage === 'ko' ? selectedDefinition.nameEn : selectedDefinition.nameKo) : '장착할 아이템을 선택하세요'}</p></div></div>
          <label className="equipment-item-select"><span>장착 아이템</span><select data-testid={`focus-item-select-${selectedSlot}`} value={selectedEquipped?.definitionId ?? ''} onChange={(event) => selectItem(selectedSlot, event.target.value)}><option value="">비어 있음</option>{selectedCatalogItem && <option value="custom">{catalogName(selectedCatalogItem)} · {catalogSecondaryName(selectedCatalogItem)}</option>}{selectedChoices.filter((item) => !selectedCatalogItem || item.id !== 'custom').map((item) => <option key={item.id} value={item.id}>{itemLanguage === 'ko' ? `${item.nameKo} · ${item.nameEn}` : `${item.nameEn} · ${item.nameKo}`}</option>)}</select></label>
          {selectedEquipped && selectedDefinition && <>
            {selectedDefinition.id === 'custom' && !selectedCatalogItem && <input className="custom-name" value={selectedEquipped.name ?? ''} placeholder="아이템 이름" onChange={(event) => updateItem(selectedSlot, { name: event.target.value })} />}
            {Object.values(selectedModifiers).some((value) => value) && <><h3 className="equipment-mod-section-title">시뮬레이터 계산 반영</h3><div className="equipment-detail-mods">{Object.entries(selectedModifiers).filter(([, value]) => value).map(([key, value]) => <span key={key}>{modifierFields.find((field) => field.key === key)?.label ?? key}<strong>{Number(value) > 0 ? '+' : ''}{value}</strong></span>)}</div></>}
            {selectedCatalogItem && <section className="catalog-equipped-properties" data-testid="selected-catalog-properties"><h3>아이템 전체 옵션</h3><ul>{selectedCatalogItem.properties.map((property) => <li key={property}>{formatCatalogProperty(property)}</li>)}</ul><p>현재 수치 계산이 지원되는 옵션은 위 계산 반영 구역에 합산되며, 나머지 원본 옵션도 장비 정보에 그대로 유지됩니다.</p></section>}
            {selectedDefinition.note && !selectedCatalogItem && <p className="item-note">{selectedDefinition.note}</p>}
            <details className="equipment-detail-custom"><summary>{selectedDefinition.id === 'custom' && !selectedCatalogItem ? '옵션 입력' : '추가 보정 입력'}</summary><div className="individual-skill-editor"><span>개별 기술 보너스</span><select value="" onChange={(event) => { const skillId = event.target.value; if (skillId) updateItem(selectedSlot, { modifiers: { ...selectedEquipped.modifiers, [`skill:${skillId}`]: 1 } }) }}><option value="">기술 추가…</option>{classSkills.map((skill) => <option value={skill.id} key={skill.id}>{skill.nameKo}</option>)}</select>{Object.entries(selectedEquipped.modifiers ?? {}).filter(([key]) => key.startsWith('skill:')).map(([key, value]) => { const skillId = key.slice(6); const skill = classSkills.find((item) => item.id === skillId); return <label key={key}><span>{skill?.nameKo ?? skillId}</span><input type="number" value={value ?? 0} onChange={(event) => updateItem(selectedSlot, { modifiers: { ...selectedEquipped.modifiers, [key]: Number(event.target.value) || 0 } })} /></label> })}</div><div className="modifier-editor">{modifierFields.map((field) => <label key={field.key as string}><span>{field.label}</span><input type="number" value={(selectedEquipped.modifiers?.[field.key] as number | undefined) ?? ''} placeholder="0" onChange={(event) => updateItem(selectedSlot, { modifiers: { ...selectedEquipped.modifiers, [field.key]: Number(event.target.value) || 0 } })} /></label>)}</div></details>
          </>}
        </aside>
      </div>
      <section className="panel combat-panel" data-testid="combat-calculator">
        <div className="section-heading combat-heading"><div><small>COMBAT DAMAGE</small><h2>전투 피해 계산</h2></div><span>일반 공격 1회 기준</span></div>
        <div className="enemy-settings" data-testid="enemy-settings">
          <div className="enemy-settings-head"><div><small>TARGET PROFILE</small><h3>적 설정</h3></div><label><span>프리셋</span><select aria-label="적 프리셋" value={build.enemy.presetId} onChange={(event) => { const presetId = event.target.value as EnemySettings['presetId']; if (presetId !== 'custom') updateEnemy({ ...ENEMY_PRESETS[presetId] }); else updateEnemy({ presetId: 'custom', name: '사용자 지정 적' }) }}><option value="normal">지옥 일반 적</option><option value="elite">지옥 정예 적</option><option value="boss">지옥 보스</option><option value="custom">사용자 지정</option></select></label></div>
          <div className="enemy-input-grid">
            <label><span>적 레벨</span><input aria-label="적 레벨" type="number" min={1} max={99} value={build.enemy.level} onChange={(event) => updateEnemy({ presetId: 'custom', level: Math.max(1, Math.min(99, Number(event.target.value) || 1)) })} /></label>
            <label><span>기본 생명력</span><input aria-label="적 생명력" type="number" min={1} value={build.enemy.life} onChange={(event) => updateEnemy({ presetId: 'custom', life: Math.max(1, Number(event.target.value) || 1) })} /></label>
            <label><span>방어력</span><input aria-label="적 방어력" type="number" min={0} value={build.enemy.defense} onChange={(event) => updateEnemy({ presetId: 'custom', defense: Math.max(0, Number(event.target.value) || 0) })} /></label>
            <label><span>인원</span><select aria-label="플레이어 수" value={build.enemy.playerCount} onChange={(event) => updateEnemy({ playerCount: Number(event.target.value) })}>{[1,2,3,4,5,6,7,8].map((count) => <option key={count} value={count}>P{count}</option>)}</select></label>
            {([['physicalResist','물리'],['fireResist','화염'],['coldResist','냉기'],['lightningResist','번개'],['poisonResist','독'],['magicResist','마법']] as const).map(([key, label]) => <label key={key}><span>{label} 저항</span><input aria-label={`적 ${label} 저항`} type="number" min={-100} max={99} value={build.enemy[key]} onChange={(event) => updateEnemy({ presetId: 'custom', [key]: Math.max(-100, Math.min(99, Number(event.target.value) || 0)) })} /></label>)}
          </div>
          <p>프리셋은 비교용 훈련 대상입니다. 실제 몬스터 수치는 사용자 지정에서 직접 입력할 수 있습니다.</p>
        </div>
        {activeCatalogItem?.category === 'runeword' && activeWeapon && <div className="combat-weapon-config">
          <label><span>룬워드 베이스</span><select data-testid="weapon-base-select" value={activeWeapon.baseWeaponCode ?? ''} onChange={(event) => updateItem(activeWeaponSlot, { baseWeaponCode: event.target.value || undefined })}>
            <option value="">베이스 무기 선택…</option>
            {compatibleWeaponBases.map((base) => <option value={base.code} key={base.code}>{base.name} · 피해 {base.minDamage}–{base.maxDamage} · {base.maxSockets}홈</option>)}
          </select></label>
          <label className="ethereal-toggle"><input data-testid="weapon-ethereal" type="checkbox" checked={activeWeapon.ethereal ?? false} onChange={(event) => updateItem(activeWeaponSlot, { ethereal: event.target.checked })} /><span>무형(에테리얼) 베이스</span></label>
        </div>}
        {!activeWeapon && <EmptyState text="활성 무기 슬롯이 비어 있습니다." action="아이템 도감에서 무기를 장착하세요." />}
        {activeWeapon && combatSummary.missingBase && <div className="combat-callout"><strong>베이스 무기가 필요합니다.</strong><span>룬워드는 같은 조합이라도 베이스 피해가 달라집니다. 위 목록에서 실제 제작할 무기를 선택하세요.</span></div>}
        {activeWeapon && !combatSummary.ready && !combatSummary.missingBase && <EmptyState text="이 무기는 아직 베이스 피해 정보가 없습니다." action="3.3 아이템 카탈로그의 무기를 장착하면 자동 계산됩니다." />}
        {combatSummary.ready && <>
          <div className="combat-damage-grid">
            <article className="combat-primary"><small>명중률 반영 기본 DPS</small><strong data-testid="combat-dps">{combatSummary.dps.toLocaleString()}</strong><span>{combatSummary.attackFrames}프레임 · 초당 {combatSummary.attacksPerSecond}회 · 명중 {combatSummary.hitChance}%</span></article>
            <article><small>첫 적중 기대 피해</small><strong data-testid="combat-final-hit">{combatSummary.finalAverageHit.toLocaleString()}</strong><span>저항·첫 강타 기대값 반영</span></article>
            <article><small>저항 전 평균 피해</small><strong data-testid="combat-average-hit">{combatSummary.averageHit.toLocaleString()}</strong><span>{combatSummary.weaponName} · {combatSummary.baseWeaponName}{activeWeapon?.ethereal ? ' · 무형' : ''}</span></article>
            <article><small>물리 피해</small><strong data-testid="combat-physical-damage">{combatSummary.physicalMin.toLocaleString()}–{combatSummary.physicalMax.toLocaleString()}</strong><span>무기 피해와 능력치 보정</span></article>
          </div>
          <div className="combat-detail-grid">
            <div className="combat-breakdown"><h3>피해 구성</h3><dl><div><dt>무기 피해 증가</dt><dd>+{combatSummary.weaponEnhancedDamage}%</dd></div><div><dt>힘·민첩 보정</dt><dd>+{combatSummary.attributeDamageBonus}%</dd></div><div><dt>장비 공격 속도</dt><dd>+{combatSummary.increasedAttackSpeed}%</dd></div><div><dt>공격 명중률</dt><dd>{combatSummary.hitChance}%</dd></div></dl></div>
            <div className="combat-effects"><h3>공격 효과</h3><div><span>강타 <strong>{combatSummary.crushingBlow}%</strong></span><span>치명적 공격 <strong>{combatSummary.deadlyStrike}%</strong></span><span>상처 악화 <strong>{combatSummary.openWounds}%</strong></span><span>첫 강타 기대 <strong>+{combatSummary.crushingBlowDamage.toLocaleString()}</strong></span></div></div>
            <div className="combat-resists"><h3>적 유효 저항</h3><div>{Object.entries(combatSummary.effectiveEnemyResist).map(([type, value]) => { const reduction = type === 'physical' ? 0 : combatSummary.enemyResistReduction[type as keyof typeof combatSummary.enemyResistReduction]; return <span key={type}>{({ physical: '물리', fire: '화염', cold: '냉기', lightning: '번개', poison: '독', magic: '마법' } as Record<string, string>)[type]} <strong>{value}%</strong>{reduction > 0 && <small> (-{reduction})</small>}</span> })}</div></div>
          </div>
          <p className="combat-note">일반 공격 추정치입니다. 기본 DPS에는 치명적 공격·적 저항·명중률을 반영하며, 생명력에 따라 감소하는 강타는 첫 적중 피해에만 표시합니다. 직업·무기 기본 동작에 EIAS를 적용했고 기술 고유 애니메이션, 상처 악화와 발동 기술은 제외합니다.</p>
        </>}
      </section>
      <div className="equipment-grid legacy-equipment-grid" aria-hidden="true">
        {slots.map((slot) => {
          const equipped = build.equipment[slot]
          const definition = equipped ? ITEMS_BY_ID[equipped.definitionId] : undefined
          const displayedModifiers = equipped ? getEquippedItemModifiers(equipped) : {}
          const choices = ITEMS.filter((item) => item.slots.includes(slot))
          const isSwap = slot.startsWith('swap')
          return <section data-testid={`slot-${slot}`} className={`equipment-slot panel ${isSwap ? 'swap-slot' : ''}`} key={slot}>
            <div className="slot-heading"><span>{isSwap ? 'II' : 'I'}</span><div><small>{slot.toUpperCase()}</small><h3>{slotLabels[slot]}</h3></div>{definition && definition.requiredLevel && definition.requiredLevel > build.level ? <em>레벨 부족</em> : null}</div>
            <select data-testid={`item-select-${slot}`} value={equipped?.definitionId ?? ''} onChange={(event) => selectItem(slot, event.target.value)}>
              <option value="">비어 있음</option>
              {choices.map((item) => <option key={item.id} value={item.id}>{item.nameKo} · {item.nameEn}</option>)}
            </select>
            {equipped && definition && <>
              {definition.id === 'custom' && <input className="custom-name" value={equipped.name ?? ''} placeholder="아이템 이름" onChange={(event) => updateItem(slot, { name: event.target.value })} />}
              <div className="item-mods">{Object.entries(displayedModifiers).filter(([, value]) => value).map(([key, value]) => <span key={key}>{modifierFields.find((field) => field.key === key)?.label ?? key} <strong>{Number(value) > 0 ? '+' : ''}{value}</strong></span>)}</div>
              {definition.note && <p className="item-note">{definition.note}</p>}
              <details><summary>{definition.id === 'custom' ? '옵션 입력' : '추가 보정 입력'}</summary><div className="individual-skill-editor"><span>개별 기술 보너스</span><select value="" onChange={(event) => { const skillId = event.target.value; if (skillId) updateItem(slot, { modifiers: { ...equipped.modifiers, [`skill:${skillId}`]: 1 } }) }}><option value="">기술 추가…</option>{classSkills.map((skill) => <option value={skill.id} key={skill.id}>{skill.nameKo}</option>)}</select>{Object.entries(equipped.modifiers ?? {}).filter(([key]) => key.startsWith('skill:')).map(([key, value]) => { const skillId = key.slice(6); const skill = classSkills.find((item) => item.id === skillId); return <label key={key}><span>{skill?.nameKo ?? skillId}</span><input type="number" value={value ?? 0} onChange={(event) => updateItem(slot, { modifiers: { ...equipped.modifiers, [key]: Number(event.target.value) || 0 } })} /></label> })}</div><div className="modifier-editor">{modifierFields.map((field) => <label key={field.key as string}><span>{field.label}</span><input type="number" value={(equipped.modifiers?.[field.key] as number | undefined) ?? ''} placeholder="0" onChange={(event) => updateItem(slot, { modifiers: { ...equipped.modifiers, [field.key]: Number(event.target.value) || 0 } })} /></label>)}</div></details>
            </>}
          </section>
        })}
      </div>
    </div>
  )
}

const catalogSlots = [
  { id: 'all', label: '전체', glyph: '✦' },
  { id: 'weapon', label: '무기', glyph: '†' },
  { id: 'offhand', label: '방패·보조', glyph: '⬙' },
  { id: 'head', label: '투구', glyph: '♜' },
  { id: 'armor', label: '갑옷', glyph: '♟' },
  { id: 'gloves', label: '장갑', glyph: '⌁' },
  { id: 'belt', label: '허리띠', glyph: '═' },
  { id: 'boots', label: '장화', glyph: '♞' },
  { id: 'amulet', label: '목걸이', glyph: '◉' },
  { id: 'ring', label: '반지', glyph: '○' },
  { id: 'charm', label: '부적', glyph: '◆' },
] as const

function ItemCatalog({ build, setBuild, wishlist, toggleWishlist, setPage }: { build: BuildProfile; setBuild: React.Dispatch<React.SetStateAction<BuildProfile>>; wishlist: string[]; toggleWishlist: (id: string) => void; setPage: (page: Page) => void }) {
  const catalog = ITEM_CATALOG as readonly unknown[] as readonly CatalogItem[]
  const equipmentSlots = (Object.keys(slotLabels) as EquipmentSlot[]).filter((slot) => !slot.startsWith('charm'))
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [catalogSlot, setCatalogSlot] = useState('all')
  const [maxRequiredLevel, setMaxRequiredLevel] = useState(99)
  const [wishlistOnly, setWishlistOnly] = useState(false)
  const [candidateIds, setCandidateIds] = useState<[string, string]>(['', ''])
  const [visibleLimit, setVisibleLimit] = useState(48)
  const [itemLanguage, setItemLanguage] = useState<ItemLanguage>(() => localStorage.getItem(ITEM_LANGUAGE_KEY) === 'en' ? 'en' : 'ko')
  useEffect(() => localStorage.setItem(ITEM_LANGUAGE_KEY, itemLanguage), [itemLanguage])
  useEffect(() => setVisibleLimit(48), [query, category, catalogSlot, maxRequiredLevel, wishlistOnly])

  const catalogName = (item: CatalogItem) => itemLanguage === 'ko' ? item.nameKo : item.name
  const catalogSecondaryName = (item: CatalogItem) => itemLanguage === 'ko' ? item.name : item.nameKo
  const catalogBaseName = (item: CatalogItem) => itemLanguage === 'ko' ? item.baseNameKo : item.baseName
  const filteredCatalog = useMemo(() => catalog.filter((item) => {
    const needle = query.trim().toLowerCase()
    return (!needle || `${item.name} ${item.nameKo} ${item.baseName} ${item.baseNameKo} ${item.aliases.join(' ')} ${item.properties.join(' ')}`.toLowerCase().includes(needle))
      && (category === 'all' || item.category === category)
      && (catalogSlot === 'all' || item.slot === catalogSlot)
      && (!item.requiredLevel || item.requiredLevel <= maxRequiredLevel)
      && (!wishlistOnly || wishlist.includes(item.id))
  }), [catalog, query, category, catalogSlot, maxRequiredLevel, wishlistOnly, wishlist])
  const visibleItems = filteredCatalog.slice(0, visibleLimit)
  const candidates = candidateIds.map((id) => catalog.find((item) => item.id === id))
  const currentSummary = calculateSummary(build)
  const currentCombat = calculateCombatSummary(build)
  const activeWeaponSlot: EquipmentSlot = build.activeWeaponSet === 1 ? 'weapon' : 'swapWeapon'
  const activeWeapon = build.equipment[activeWeaponSlot]

  const equipCatalogItem = (item: CatalogItem) => {
    const slot = (item.slot === 'ring' ? 'ring1' : item.slot) as EquipmentSlot
    if (!equipmentSlots.includes(slot)) return
    setBuild((current) => ({
      ...current,
      equipment: { ...current.equipment, [slot]: { definitionId: 'custom', catalogId: item.id, name: item.name, modifiers: { ...item.modifiers }, baseWeaponCode: item.baseCode } },
      updatedAt: new Date().toISOString(),
    }))
  }
  const compareCandidate = (item: CatalogItem) => {
    const slot = (item.slot === 'ring' ? 'ring1' : item.slot === 'weapon' ? activeWeaponSlot : item.slot) as EquipmentSlot
    const baseWeaponCode = item.baseCode ?? (item.slot === 'weapon' ? activeWeapon?.baseWeaponCode : undefined)
    const candidateItem: EquippedItem = { definitionId: 'custom', catalogId: item.id, name: item.name, modifiers: { ...item.modifiers }, baseWeaponCode }
    return calculateCombatSummary({ ...build, equipment: { ...build.equipment, [slot]: candidateItem } })
  }

  return <div className="page-stack item-catalog-page">
    <section className="page-title item-catalog-title"><div><small>HORADRIC ARCHIVE · 3.3</small><h1>아이템 도감</h1><p>고유, 세트, 룬워드 아이템을 부위별로 탐색하고 현재 빌드에 바로 적용할 수 있습니다.</p></div><div className="catalog-title-stats"><span><strong>{catalog.length}</strong>전체 아이템</span><span><strong>{wishlist.length}</strong>파밍 목록</span><button className="button ghost" onClick={() => setPage('equipment')}>착용 장비 보기 →</button></div></section>
    <section className="catalog-category-strip" aria-label="아이템 부위 분류">
      {catalogSlots.map((slot) => {
        const count = slot.id === 'all' ? catalog.length : catalog.filter((item) => item.slot === slot.id).length
        return <button type="button" key={slot.id} data-testid={`catalog-slot-${slot.id}`} className={catalogSlot === slot.id ? 'active' : ''} aria-pressed={catalogSlot === slot.id} onClick={() => setCatalogSlot(slot.id)}><i>{slot.glyph}</i><span>{slot.label}</span><small>{count}</small></button>
      })}
    </section>
    <section className="panel catalog-panel">
      <div className="section-heading catalog-heading"><div><small>SEARCH THE ARCHIVE</small><h2>{catalogSlots.find((slot) => slot.id === catalogSlot)?.label ?? '전체'} 아이템</h2></div><div className="catalog-heading-actions"><span>{filteredCatalog.length}개 검색됨</span><div className="item-language-toggle" role="group" aria-label="아이템 표시 언어"><button type="button" data-testid="item-language-ko" className={itemLanguage === 'ko' ? 'active' : ''} aria-pressed={itemLanguage === 'ko'} onClick={() => setItemLanguage('ko')}>한국어</button><button type="button" data-testid="item-language-en" className={itemLanguage === 'en' ? 'active' : ''} aria-pressed={itemLanguage === 'en'} onClick={() => setItemLanguage('en')}>English</button></div></div></div>
      <div className="catalog-filters">
        <input aria-label="아이템 검색" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="한글·영문 이름, 베이스, 별칭, 옵션 검색" />
        <select aria-label="아이템 등급" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">모든 등급</option><option value="unique">고유</option><option value="set">세트</option><option value="runeword">룬워드</option></select>
        <label>요구 레벨 ≤ <input aria-label="최대 요구 레벨" type="number" min={1} max={99} value={maxRequiredLevel} onChange={(event) => setMaxRequiredLevel(Math.max(1, Math.min(99, Number(event.target.value) || 1)))} /></label>
        <label className="wishlist-filter"><input type="checkbox" checked={wishlistOnly} onChange={(event) => setWishlistOnly(event.target.checked)} /> ★ 파밍 목록만</label>
      </div>
      <div className="catalog-results">{visibleItems.map((item) => {
        const selected = candidateIds.includes(item.id)
        const previewSlot = (item.slot === 'ring' ? 'ring1' : item.slot) as EquipmentSlot
        const previewItem: EquippedItem = { definitionId: 'custom', catalogId: item.id, name: item.name, modifiers: { ...item.modifiers }, baseWeaponCode: item.baseCode }
        const previewSummary = equipmentSlots.includes(previewSlot) && Object.keys(item.modifiers).length ? calculateSummary({ ...build, equipment: { ...build.equipment, [previewSlot]: previewItem } }) : undefined
        const fcrDelta = previewSummary ? previewSummary.fasterCastRate - currentSummary.fasterCastRate : 0
        return <article className={`catalog-item quality-${item.category} ${selected ? 'selected' : ''}`} key={item.id}>
          <div><small>{item.category.toUpperCase()} · LV {item.requiredLevel || '—'}</small><strong>{catalogName(item)}</strong><span className="catalog-item-english">{catalogSecondaryName(item)}</span><span>{catalogBaseName(item)} · {catalogSlots.find((slot) => slot.id === item.slot)?.label ?? item.slot}</span></div>
          <p>{item.properties.slice(0, 4).map(formatCatalogProperty).join(' / ') || '원본 옵션 없음'}</p>
          {previewSummary && <small className="impact-chip">현재 장비 교체 시 패캐 {fcrDelta >= 0 ? '+' : ''}{fcrDelta} · 생명력 {previewSummary.life - currentSummary.life >= 0 ? '+' : ''}{previewSummary.life - currentSummary.life}</small>}
          <details className="catalog-item-details"><summary>전체 옵션 {item.properties.length}개</summary><ul>{item.properties.map((property) => <li key={property}>{formatCatalogProperty(property)}</li>)}</ul></details>
          <div><button onClick={() => toggleWishlist(item.id)}>{wishlist.includes(item.id) ? '★ 파밍 중' : '☆ 파밍'}</button><button onClick={() => setCandidateIds(([left, right]) => !left ? [item.id, right] : !right ? [left, item.id] : [item.id, ''])}>비교</button>{item.slot !== 'charm' && <button className="catalog-equip" onClick={() => equipCatalogItem(item)}>착용</button>}</div>
        </article>
      })}</div>
      {filteredCatalog.length === 0 && <EmptyState text="조건에 맞는 아이템이 없습니다." action="검색어나 필터를 바꿔보세요." />}
      {visibleLimit < filteredCatalog.length && <button className="button ghost catalog-more" onClick={() => setVisibleLimit((limit) => limit + 48)}>더 보기 · {filteredCatalog.length - visibleLimit}개 남음</button>}
    </section>
    {(candidates[0] || candidates[1]) && <section className="panel candidate-compare"><div className="section-heading"><div><small>CANDIDATE COMPARE</small><h2>현재 장비 대비 전투 비교</h2></div><button onClick={() => setCandidateIds(['', ''])}>비우기</button></div><div>{candidates.map((item, index) => {
      const candidateCombat = item ? compareCandidate(item) : undefined
      const dpsDelta = candidateCombat?.ready && currentCombat.ready ? candidateCombat.dps - currentCombat.dps : undefined
      const hitDelta = candidateCombat?.ready && currentCombat.ready ? candidateCombat.finalAverageHit - currentCombat.finalAverageHit : undefined
      return <article key={index}>{item ? <><small>후보 {index + 1}</small><h3>{catalogName(item)}</h3><p>{catalogSecondaryName(item)} · {catalogBaseName(item)} · 요구 레벨 {item.requiredLevel || '없음'}</p>{candidateCombat?.ready ? <div className="candidate-combat-stats"><span><small>예상 DPS</small><strong>{candidateCombat.dps.toLocaleString()}</strong><em className={(dpsDelta ?? 0) >= 0 ? 'positive' : 'negative'}>{dpsDelta !== undefined ? `${dpsDelta >= 0 ? '+' : ''}${dpsDelta.toLocaleString()}` : '—'}</em></span><span><small>적중 피해</small><strong>{candidateCombat.finalAverageHit.toLocaleString()}</strong><em className={(hitDelta ?? 0) >= 0 ? 'positive' : 'negative'}>{hitDelta !== undefined ? `${hitDelta >= 0 ? '+' : ''}${hitDelta.toLocaleString()}` : '—'}</em></span><span><small>공격 속도</small><strong>{candidateCombat.attackFrames}F</strong><em>{candidateCombat.attacksPerSecond}/초</em></span></div> : <div className="candidate-combat-empty">무기 베이스를 정하면 전투 수치를 비교할 수 있습니다.</div>}</> : <EmptyState text={`후보 ${index + 1}이 비어 있습니다.`} action="검색 결과에서 비교를 누르세요." />}</article>
    })}</div></section>}
  </div>
}

function InventoryPlanner({ build, setBuild }: { build: BuildProfile; setBuild: React.Dispatch<React.SetStateAction<BuildProfile>> }) {
  const charms = ITEMS.filter((item) => item.category === 'charm')
  const [selectedCharm, setSelectedCharm] = useState(charms[0]?.id ?? '')
  const [movingId, setMovingId] = useState('')
  const usedCells = build.inventory.reduce((sum, item) => { const size = charmSize(item.definitionId); return sum + size.width * size.height }, 0)
  const addCharm = () => {
    const position = firstInventoryPosition(build.inventory, selectedCharm)
    if (!position) return
    const unique = ['annihilus', 'hellfire-torch-necro', 'hellfire-torch-sorc', 'sunder-cold', 'sunder-poison'].includes(selectedCharm)
    if (unique && build.inventory.some((item) => item.definitionId === selectedCharm)) return
    setBuild((current) => ({ ...current, inventory: [...current.inventory, { id: crypto.randomUUID(), definitionId: selectedCharm, ...position }], updatedAt: new Date().toISOString() }))
  }
  const moveTo = (x: number, y: number) => {
    const moving = build.inventory.find((item) => item.id === movingId)
    if (!moving || !canPlaceInventory(build.inventory, moving, x, y)) return
    setBuild((current) => ({ ...current, inventory: current.inventory.map((item) => item.id === movingId ? { ...item, x, y } : item), updatedAt: new Date().toISOString() }))
    setMovingId('')
  }
  return <div className="page-stack">
    <section className="page-title"><div><small>CHARM INVENTORY</small><h1>인벤토리와 부적</h1><p>10×4 공간에 부적과 큐브를 배치하면 옵션과 남은 공간을 함께 확인할 수 있습니다.</p></div><div className="budget-pill"><span>사용</span><strong>{usedCells}</strong><i>·</i><span>빈 공간</span><strong>{INVENTORY_WIDTH * INVENTORY_HEIGHT - usedCells}</strong></div></section>
    <div className="inventory-layout">
      <section className="panel inventory-panel">
        <div className="inventory-board">
          {Array.from({ length: INVENTORY_WIDTH * INVENTORY_HEIGHT }, (_, index) => { const x = index % INVENTORY_WIDTH; const y = Math.floor(index / INVENTORY_WIDTH); return <button aria-label={`인벤토리 ${x + 1},${y + 1}`} key={index} className="inventory-cell" onClick={() => moveTo(x, y)} /> })}
          {build.inventory.map((item) => { const definition = ITEMS_BY_ID[item.definitionId]; const size = charmSize(item.definitionId); const name = item.definitionId === 'horadric-cube' ? '호라드림의 함' : definition?.nameKo ?? item.definitionId; return <button title={name} key={item.id} className={`inventory-charm ${item.definitionId === 'horadric-cube' ? 'cube' : ''} ${movingId === item.id ? 'moving' : ''}`} style={{ gridColumn: `${item.x + 1} / span ${size.width}`, gridRow: `${item.y + 1} / span ${size.height}` }} onClick={() => setMovingId(movingId === item.id ? '' : item.id)}><strong>{size.width === 1 && size.height === 1 ? name.slice(0, 1) : name}</strong><small>{item.definitionId === 'horadric-cube' ? '2×2' : size.height === 1 ? '작은 부적' : size.height === 2 ? '큰 부적' : '거대 부적'}</small></button> })}
        </div>
        <p className="calc-caveat">옮길 부적을 선택한 다음 빈 칸을 누르세요. 겹치거나 범위를 벗어나는 위치에는 놓을 수 없습니다.</p>
      </section>
      <section className="panel charm-palette">
        <div className="section-heading"><div><small>CHARM RACK</small><h2>부적 추가</h2></div><span>{build.inventory.length}개</span></div>
        <select aria-label="추가할 부적" value={selectedCharm} onChange={(event) => setSelectedCharm(event.target.value)}>{charms.map((item) => <option key={item.id} value={item.id}>{item.nameKo} · {item.nameEn}</option>)}</select>
        <button className="button primary" onClick={addCharm} disabled={!firstInventoryPosition(build.inventory, selectedCharm)}>빈 공간에 추가</button>
        <button className="button ghost cube-toggle" onClick={() => setBuild((current) => { const existing = current.inventory.find((item) => item.definitionId === 'horadric-cube'); if (existing) return { ...current, inventory: current.inventory.filter((item) => item.id !== existing.id), updatedAt: new Date().toISOString() }; const position = firstInventoryPosition(current.inventory, 'horadric-cube'); return position ? { ...current, inventory: [...current.inventory, { id: crypto.randomUUID(), definitionId: 'horadric-cube', ...position }], updatedAt: new Date().toISOString() } : current })}>{build.inventory.some((item) => item.definitionId === 'horadric-cube') ? '호라드림의 함 제거' : '호라드림의 함 2×2 추가'}</button>
        <div className="charm-list">{build.inventory.map((item) => <div key={item.id}><span>{item.definitionId === 'horadric-cube' ? '호라드림의 함' : ITEMS_BY_ID[item.definitionId]?.nameKo ?? item.definitionId}</span><button onClick={() => setBuild((current) => ({ ...current, inventory: current.inventory.filter((candidate) => candidate.id !== item.id), updatedAt: new Date().toISOString() }))}>제거</button></div>)}</div>
      </section>
    </div>
  </div>
}

function Library({ builds, history, current, onLoad, onDelete }: { builds: BuildProfile[]; history: BuildProfile[]; current: BuildProfile; onLoad: (build: BuildProfile) => void; onDelete: (id: string) => void }) {
  const [compareId, setCompareId] = useState('')
  const compared = builds.find((item) => item.id === compareId)
  const currentSummary = calculateSummary(current)
  const comparedSummary = compared ? calculateSummary(compared) : undefined
  return (
    <div className="page-stack">
      <section className="page-title"><div><small>LOCAL VAULT</small><h1>보관함과 비교</h1><p>저장할 때 이전 상태가 최대 20개까지 남습니다. 상단 공유 버튼에서는 압축 URL을 만들 수 있습니다.</p></div><select value={compareId} onChange={(event) => setCompareId(event.target.value)}><option value="">현재 빌드와 비교할 저장본 선택</option>{builds.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></section>
      {compared && comparedSummary && <ComparePanel left={current} leftSummary={currentSummary} right={compared} rightSummary={comparedSummary} />}
      <div className="build-library">
        {builds.length === 0 ? <EmptyState text="아직 저장된 빌드가 없습니다." action="상단의 현재 저장을 눌러 첫 빌드를 보관하세요." /> : [...builds].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map((item) => {
          const definition = CLASS_DEFINITIONS[item.classId]
          const itemSummary = calculateSummary(item)
          return <article className="saved-build panel" key={item.id}>
            <span className={`class-sigil ${item.classId}`}>{classGlyphs[item.classId]}</span>
            <div className="saved-copy"><small>{definition.nameKo} · 레벨 {item.level}</small><h2>{item.name}</h2><p>기술 {itemSummary.spentSkillPoints}/{itemSummary.availableSkillPoints} · 패캐 {itemSummary.fasterCastRate} · 매찬 {itemSummary.magicFind}</p></div>
            <time>{new Date(item.updatedAt).toLocaleString('ko-KR')}</time>
            <div><button className="button ghost" onClick={() => onLoad({ ...item })}>불러오기</button><button className="delete-button" onClick={() => onDelete(item.id)}>삭제</button></div>
          </article>
        })}
      </div>
      {history.length > 0 && <section className="panel history-panel"><div className="section-heading"><div><small>REVISION HISTORY</small><h2>변경 이력</h2></div><span>최근 {history.length}개</span></div><div>{history.slice(0, 10).map((item, index) => <article key={`${item.id}-${item.updatedAt}-${index}`}><div><strong>{item.name}</strong><small>{new Date(item.updatedAt).toLocaleString('ko-KR')} · 패캐 {calculateSummary(item).fasterCastRate}</small></div><button className="button ghost" onClick={() => onLoad({ ...item, updatedAt: new Date().toISOString() })}>이 상태 복원</button></article>)}</div></section>}
      <section className="panel notes-editor"><div><small>BUILD NOTES</small><h2>현재 빌드 메모</h2></div><textarea value={current.notes} readOnly placeholder="현재는 빌드 화면 초안에 메모가 포함되어 저장됩니다." /></section>
    </div>
  )
}

function ComparePanel({ left, leftSummary, right, rightSummary }: { left: BuildProfile; leftSummary: BuildSummary; right: BuildProfile; rightSummary: BuildSummary }) {
  const rows: { label: string; left: number; right: number; suffix?: string }[] = [
    { label: '생명력', left: leftSummary.life, right: rightSummary.life }, { label: '마나', left: leftSummary.mana, right: rightSummary.mana },
    { label: '패캐', left: leftSummary.fasterCastRate, right: rightSummary.fasterCastRate, suffix: '%' }, { label: '패힛', left: leftSummary.fasterHitRecovery, right: rightSummary.fasterHitRecovery, suffix: '%' },
    { label: '매찬', left: leftSummary.magicFind, right: rightSummary.magicFind, suffix: '%' }, { label: '화염 저항', left: leftSummary.resistances.fire, right: rightSummary.resistances.fire, suffix: '%' },
    { label: '냉기 저항', left: leftSummary.resistances.cold, right: rightSummary.resistances.cold, suffix: '%' }, { label: '번개 저항', left: leftSummary.resistances.lightning, right: rightSummary.resistances.lightning, suffix: '%' },
    { label: '독 저항', left: leftSummary.resistances.poison, right: rightSummary.resistances.poison, suffix: '%' }, { label: '모든 기술', left: leftSummary.allSkills, right: rightSummary.allSkills },
  ]
  const gearSlots = (Object.keys(slotLabels) as EquipmentSlot[]).filter((slot) => !slot.startsWith('charm'))
  const gearChanges = gearSlots.map((slot) => {
    const leftItem = left.equipment[slot]; const rightItem = right.equipment[slot]
    const leftName = leftItem?.name ?? ITEMS_BY_ID[leftItem?.definitionId ?? '']?.nameKo ?? '비어 있음'
    const rightName = rightItem?.name ?? ITEMS_BY_ID[rightItem?.definitionId ?? '']?.nameKo ?? '비어 있음'
    return { slot, leftName, rightName }
  }).filter((item) => item.leftName !== item.rightName)
  const definition = CLASS_DEFINITIONS[left.classId]
  const skillChanges = left.classId === right.classId ? definition.skills.map((skill) => ({ name: skill.nameKo, left: left.skills[skill.id] ?? 0, right: right.skills[skill.id] ?? 0 })).filter((item) => item.left !== item.right).slice(0, 12) : []
  return <section className="compare-panel panel"><div className="compare-names"><strong>{left.name}</strong><span>VS</span><strong>{right.name}</strong></div>{rows.map((row) => <div className="compare-row" key={row.label}><span className={row.left > row.right ? 'winner' : ''}>{row.left}{row.suffix}</span><small>{row.label}</small><span className={row.right > row.left ? 'winner' : ''}>{row.right}{row.suffix}</span></div>)}{gearChanges.length > 0 && <div className="difference-list"><h3>장비 차이</h3>{gearChanges.map((item) => <div key={item.slot}><span>{item.leftName}</span><small>{slotLabels[item.slot]}</small><span>{item.rightName}</span></div>)}</div>}{skillChanges.length > 0 && <div className="difference-list"><h3>기술 차이</h3>{skillChanges.map((item) => <div key={item.name}><span>{item.left}</span><small>{item.name}</small><span>{item.right}</span></div>)}</div>}</section>
}

function BreakpointPanel({ build, summary }: { build: BuildProfile; summary: BuildSummary }) {
  const values = [{ type: 'fcr' as const, label: '패캐', value: summary.fasterCastRate }, { type: 'fhr' as const, label: '패힛', value: summary.fasterHitRecovery }, { type: 'fbr' as const, label: '패블럭', value: summary.fasterBlockRate }]
  const recommendedByClass: Record<ClassId, { fcr: number; fhr: number; fbr: number }> = {
    amazon: { fcr: 99, fhr: 86, fbr: 56 }, sorceress: { fcr: 105, fhr: 60, fbr: 48 }, necromancer: { fcr: 125, fhr: 56, fbr: 52 },
    paladin: { fcr: 125, fhr: 86, fbr: 48 }, barbarian: { fcr: 105, fhr: 86, fbr: 42 }, druid: { fcr: 99, fhr: 86, fbr: 52 },
    assassin: { fcr: 102, fhr: 86, fbr: 32 }, warlock: { fcr: 125, fhr: 86, fbr: 48 },
  }
  const recommended = recommendedByClass[build.classId]
  return <section className="panel section-card breakpoint-card"><div className="section-heading"><div><small>BREAKPOINTS</small><h2>프레임 목표</h2></div><span>{CLASS_DEFINITIONS[build.classId].nameKo} {recommended.fcr} 패캐 권장</span></div><div className="breakpoint-list">{values.map((entry) => { const progress = breakpointProgress(build.classId, entry.type, entry.value); const target = recommended[entry.type]; const targetNeed = Math.max(0, target - entry.value); return <div key={entry.type}><span>{entry.label}</span><strong>{entry.value}% · {progress.frame}프레임</strong><div><i style={{ width: `${Math.min(100, entry.value / target * 100)}%` }} /></div><small>{progress.next ? `다음 ${progress.next}% (${progress.nextFrame}프레임)까지 ${progress.needed}` : '최고 구간 도달'} · 권장 {targetNeed ? `${targetNeed} 부족` : '달성'}</small></div> })}</div><p className="calc-caveat">일반 시전·피격·방패 막기 애니메이션 기준입니다. 변신, 특수 시전, 기술 고유 애니메이션은 별도 프레임을 사용할 수 있습니다.</p></section>
}

function SummaryRail({ build, summary }: { build: BuildProfile; summary: BuildSummary }) {
  const definition = CLASS_DEFINITIONS[build.classId]
  return <aside className="summary-rail"><div className="rail-class"><span className={`class-sigil ${build.classId}`}>{classGlyphs[build.classId]}</span><div><small>ACTIVE BUILD</small><strong>{definition.nameKo}</strong><span>레벨 {build.level}</span></div></div><section><h3>핵심 수치</h3><dl><div><dt>생명력</dt><dd>{summary.life}</dd></div><div><dt>마나</dt><dd>{summary.mana}</dd></div><div><dt>패캐</dt><dd>{summary.fasterCastRate}%</dd></div><div><dt>패힛</dt><dd>{summary.fasterHitRecovery}%</dd></div><div><dt>달리기</dt><dd>{summary.fasterRunWalk}%</dd></div><div><dt>매찬</dt><dd>{summary.magicFind}%</dd></div></dl></section><section><h3>능력치</h3><dl>{(Object.keys(attributeLabels) as AttributeId[]).map((key) => <div key={key}><dt>{attributeLabels[key]}</dt><dd>{summary.attributes[key]}</dd></div>)}</dl></section><section className="rail-budget"><h3>포인트 예산</h3><div><span>기술</span><progress max={summary.availableSkillPoints} value={summary.spentSkillPoints} /><strong>{summary.spentSkillPoints}/{summary.availableSkillPoints}</strong></div><div><span>능력치</span><progress max={summary.availableStatPoints} value={summary.spentStatPoints} /><strong>{summary.spentStatPoints}/{summary.availableStatPoints}</strong></div></section></aside>
}

function EmptyState({ text, action, onClick }: { text: string; action: string; onClick?: () => void }) {
  return <div className="empty-state"><span>◇</span><p>{text}</p>{onClick ? <button onClick={onClick}>{action}</button> : <small>{action}</small>}</div>
}

export default App
