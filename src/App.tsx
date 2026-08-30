import { useEffect, useMemo, useState } from 'react'
import { CLASS_DEFINITIONS } from './data/classes'
import { ITEMS, ITEMS_BY_ID } from './data/items'
import { BUILD_TEMPLATES } from './data/templates'
import {
  availableSkillPoints,
  availableStatPoints,
  breakpointProgress,
  calculateSummary,
  getEquipmentModifiers,
  skillBonusFor,
  skillCanIncrement,
  spentSkillPoints,
  spentStatPoints,
} from './lib/calculations'
import {
  createBuild,
  decodeBuild,
  DRAFT_KEY,
  encodeBuild,
  loadBuilds,
  loadDraft,
  STORAGE_KEY,
} from './lib/builds'
import type {
  AttributeId,
  BuildProfile,
  BuildSummary,
  ClassId,
  EquipmentSlot,
  Modifiers,
  SkillDefinition,
} from './types'

type Page = 'overview' | 'skills' | 'attributes' | 'equipment' | 'library'

const pages: { id: Page; label: string; icon: string }[] = [
  { id: 'overview', label: '빌드 요약', icon: '◆' },
  { id: 'skills', label: '기술', icon: '✦' },
  { id: 'attributes', label: '능력치', icon: '▲' },
  { id: 'equipment', label: '장비', icon: '◇' },
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
  { key: 'allSkills', label: '모든 기술' }, { key: 'necromancerSkills', label: '네크 기술' },
  { key: 'sorceressSkills', label: '소서 기술' }, { key: 'summoningSkills', label: '소환 기술' },
  { key: 'poisonBoneSkills', label: '독과 뼈' }, { key: 'cursesSkills', label: '저주 기술' },
  { key: 'coldSkills', label: '냉기 기술' }, { key: 'lightningSkills', label: '번개 기술' },
  { key: 'fireSkills', label: '화염 기술' }, { key: 'strength', label: '힘' },
  { key: 'dexterity', label: '민첩' }, { key: 'vitality', label: '활력' },
  { key: 'energy', label: '마력' }, { key: 'life', label: '생명력' }, { key: 'mana', label: '마나' },
  { key: 'allResist', label: '모든 저항' }, { key: 'fireResist', label: '화염 저항' },
  { key: 'coldResist', label: '냉기 저항' }, { key: 'lightningResist', label: '번개 저항' },
  { key: 'poisonResist', label: '독 저항' }, { key: 'fasterCastRate', label: '패캐' },
  { key: 'fasterHitRecovery', label: '패힛' }, { key: 'fasterBlockRate', label: '패블럭' },
  { key: 'increasedAttackSpeed', label: '공속' }, { key: 'fasterRunWalk', label: '달리기' },
  { key: 'magicFind', label: '매찬' }, { key: 'goldFind', label: '골찬' },
  { key: 'damageReduction', label: '피해 감소 %' },
]

function App() {
  const [page, setPage] = useState<Page>('overview')
  const [build, setBuild] = useState<BuildProfile>(() => loadDraft())
  const [savedBuilds, setSavedBuilds] = useState<BuildProfile[]>(() => loadBuilds())
  const [shareOpen, setShareOpen] = useState(false)
  const [shareCode, setShareCode] = useState('')
  const [toast, setToast] = useState('')
  const summary = useMemo(() => calculateSummary(build), [build])
  const classDefinition = CLASS_DEFINITIONS[build.classId]

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(build))
  }, [build])

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
      name: classId === 'necromancer' ? '새 네크로맨서 빌드' : '새 원소술사 빌드',
    })
    setToast('직업에 맞춰 기술과 장비를 초기화했습니다.')
  }

  const applyTemplate = (templateId: string) => {
    const template = BUILD_TEMPLATES.find((item) => item.id === templateId)
    if (!template) return
    const base = createBuild(template.classId)
    setBuild({ ...base, name: template.name, skills: { ...template.skills }, attributes: { ...template.attributes }, equipment: { ...template.equipment }, notes: template.description })
    setToast(`${template.name}을 적용했습니다.`)
  }

  const saveCurrent = () => {
    const snapshot = { ...build, updatedAt: new Date().toISOString() }
    const next = [...savedBuilds.filter((item) => item.id !== snapshot.id), snapshot]
    setSavedBuilds(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setBuild(snapshot)
    setToast('보관함에 저장했습니다.')
  }

  const openShare = () => {
    setShareCode(encodeBuild(build))
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
          <p>합산 지원 · 상세 DPS 준비 중</p>
        </div>
      </aside>

      <main className="workspace">
        <ProfileBar build={build} updateBuild={updateBuild} switchClass={switchClass} applyTemplate={applyTemplate} />
        {page === 'overview' && <Overview build={build} summary={summary} setPage={setPage} updateBuild={updateBuild} />}
        {page === 'skills' && <SkillPlanner build={build} setBuild={setBuild} />}
        {page === 'attributes' && <AttributePlanner build={build} setBuild={setBuild} summary={summary} />}
        {page === 'equipment' && <EquipmentPlanner build={build} setBuild={setBuild} />}
        {page === 'library' && <Library builds={savedBuilds} current={build} onLoad={setBuild} onDelete={(id) => {
          const next = savedBuilds.filter((item) => item.id !== id)
          setSavedBuilds(next)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        }} />}
      </main>

      <SummaryRail build={build} summary={summary} />

      {shareOpen && (
        <div className="modal-backdrop" onMouseDown={() => setShareOpen(false)}>
          <section className="modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-header"><div><small>서버 없이 공유</small><h2>빌드 코드</h2></div><button onClick={() => setShareOpen(false)}>×</button></div>
            <p>아래 코드를 텔레그램으로 보내면 상대가 같은 화면에서 가져올 수 있습니다.</p>
            <textarea value={shareCode} onChange={(event) => setShareCode(event.target.value)} rows={8} spellCheck={false} />
            <div className="modal-actions">
              <button className="button ghost" onClick={copyShareCode}>현재 빌드 복사</button>
              <button className="button primary" onClick={importCode}>입력한 코드 가져오기</button>
            </div>
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
        {(Object.values(CLASS_DEFINITIONS)).map((definition) => (
          <button key={definition.id} className={build.classId === definition.id ? 'selected' : ''} onClick={() => switchClass(definition.id)}>
            <span className={`class-sigil ${definition.id}`}>{definition.id === 'necromancer' ? '☠' : '✧'}</span>
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
  const spent = spentSkillPoints(build)
  const available = availableSkillPoints(build)
  const equipmentModifiers = getEquipmentModifiers(build)
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
  return (
    <div className="page-stack">
      <section className="page-title"><div><small>SKILL PLANNER</small><h1>{definition.nameKo} 기술</h1><p>선행 기술과 요구 레벨을 검사하며 장비 보너스는 청록색으로 따로 표시합니다.</p></div><div className={`budget-pill ${spent > available ? 'over' : ''}`}><span>사용</span><strong>{spent}</strong><i>/</i><span>보유</span><strong>{available}</strong><button onClick={() => setBuild((current) => ({ ...current, skills: {} }))}>초기화</button></div></section>
      <div className="skill-columns">
        {definition.branches.map((branch) => (
          <section className="skill-tree panel" key={branch}>
            <div className="tree-title"><small>SKILL TREE</small><h2>{branch}</h2><span>{definition.skills.filter((item) => item.branch === branch).reduce((sum, item) => sum + (build.skills[item.id] ?? 0), 0)} 포인트</span></div>
            <div className="skill-list">
              {definition.skills.filter((item) => item.branch === branch).sort((a, b) => a.requiredLevel - b.requiredLevel || a.col - b.col).map((item) => {
                const hard = build.skills[item.id] ?? 0
                const bonus = skillBonusFor(build, item, equipmentModifiers)
                const locked = build.level < item.requiredLevel || !(item.prerequisites ?? []).every((id) => (build.skills[id] ?? 0) > 0)
                return <article key={item.id} className={`skill-node ${hard ? 'invested' : ''} ${locked ? 'locked' : ''}`}>
                  <div className="skill-icon">{item.nameKo.slice(0, 1)}</div>
                  <div className="skill-copy"><div><strong>{item.nameKo}</strong><small>요구 레벨 {item.requiredLevel}</small></div><p>{item.description}</p>{item.prerequisites?.length ? <em>선행: {item.prerequisites.map((id) => definition.skills.find((candidate) => candidate.id === id)?.nameKo).join(', ')}</em> : null}</div>
                  <div className="skill-counter"><button aria-label={`${item.nameKo} 감소`} onClick={() => changeSkill(item, -1)}>−</button><strong>{hard}{bonus > 0 && <span>+{bonus}</span>}</strong><button aria-label={`${item.nameKo} 증가`} onClick={() => changeSkill(item, 1)} disabled={!skillCanIncrement(build, item)}>+</button></div>
                </article>
              })}
            </div>
          </section>
        ))}
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
  const slots = Object.keys(slotLabels) as EquipmentSlot[]
  const classSkills = CLASS_DEFINITIONS[build.classId].skills
  const selectItem = (slot: EquipmentSlot, definitionId: string) => setBuild((current) => {
    const equipment = { ...current.equipment }
    if (!definitionId) delete equipment[slot]
    else equipment[slot] = { definitionId, name: definitionId === 'custom' ? `사용자 ${slotLabels[slot]}` : undefined, modifiers: {} }
    return { ...current, equipment, updatedAt: new Date().toISOString() }
  })
  const updateItem = (slot: EquipmentSlot, patch: { name?: string; modifiers?: Modifiers }) => setBuild((current) => ({
    ...current,
    equipment: { ...current.equipment, [slot]: { ...current.equipment[slot]!, ...patch } },
    updatedAt: new Date().toISOString(),
  }))
  return (
    <div className="page-stack">
      <section className="page-title"><div><small>EQUIPMENT LAB</small><h1>장비 구성</h1><p>대표 아이템은 최대 변동치 기준입니다. 실제 수치는 추가 보정에서 차이를 입력할 수 있습니다.</p></div><div className="weapon-set-toggle"><span>활성 무기</span><button className={build.activeWeaponSet === 1 ? 'active' : ''} onClick={() => setBuild((current) => ({ ...current, activeWeaponSet: 1 }))}>I</button><button className={build.activeWeaponSet === 2 ? 'active' : ''} onClick={() => setBuild((current) => ({ ...current, activeWeaponSet: 2 }))}>II</button></div></section>
      <div className="equipment-grid">
        {slots.map((slot) => {
          const equipped = build.equipment[slot]
          const definition = equipped ? ITEMS_BY_ID[equipped.definitionId] : undefined
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
              <div className="item-mods">{Object.entries(definition.modifiers).filter(([, value]) => value).map(([key, value]) => <span key={key}>{modifierFields.find((field) => field.key === key)?.label ?? key} <strong>+{value}</strong></span>)}</div>
              {definition.note && <p className="item-note">{definition.note}</p>}
              <details><summary>{definition.id === 'custom' ? '옵션 입력' : '추가 보정 입력'}</summary><div className="individual-skill-editor"><span>개별 기술 보너스</span><select value="" onChange={(event) => { const skillId = event.target.value; if (skillId) updateItem(slot, { modifiers: { ...equipped.modifiers, [`skill:${skillId}`]: 1 } }) }}><option value="">기술 추가…</option>{classSkills.map((skill) => <option value={skill.id} key={skill.id}>{skill.nameKo}</option>)}</select>{Object.entries(equipped.modifiers ?? {}).filter(([key]) => key.startsWith('skill:')).map(([key, value]) => { const skillId = key.slice(6); const skill = classSkills.find((item) => item.id === skillId); return <label key={key}><span>{skill?.nameKo ?? skillId}</span><input type="number" value={value ?? 0} onChange={(event) => updateItem(slot, { modifiers: { ...equipped.modifiers, [key]: Number(event.target.value) || 0 } })} /></label> })}</div><div className="modifier-editor">{modifierFields.map((field) => <label key={field.key as string}><span>{field.label}</span><input type="number" value={(equipped.modifiers?.[field.key] as number | undefined) ?? ''} placeholder="0" onChange={(event) => updateItem(slot, { modifiers: { ...equipped.modifiers, [field.key]: Number(event.target.value) || 0 } })} /></label>)}</div></details>
            </>}
          </section>
        })}
      </div>
    </div>
  )
}

function Library({ builds, current, onLoad, onDelete }: { builds: BuildProfile[]; current: BuildProfile; onLoad: (build: BuildProfile) => void; onDelete: (id: string) => void }) {
  const [compareId, setCompareId] = useState('')
  const compared = builds.find((item) => item.id === compareId)
  const currentSummary = calculateSummary(current)
  const comparedSummary = compared ? calculateSummary(compared) : undefined
  return (
    <div className="page-stack">
      <section className="page-title"><div><small>LOCAL VAULT</small><h1>보관함과 비교</h1><p>모든 데이터는 이 브라우저에만 저장됩니다. 공유는 상단의 빌드 코드를 사용하세요.</p></div><select value={compareId} onChange={(event) => setCompareId(event.target.value)}><option value="">현재 빌드와 비교할 저장본 선택</option>{builds.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></section>
      {compared && comparedSummary && <ComparePanel left={current} leftSummary={currentSummary} right={compared} rightSummary={comparedSummary} />}
      <div className="build-library">
        {builds.length === 0 ? <EmptyState text="아직 저장된 빌드가 없습니다." action="상단의 현재 저장을 눌러 첫 빌드를 보관하세요." /> : [...builds].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map((item) => {
          const definition = CLASS_DEFINITIONS[item.classId]
          const itemSummary = calculateSummary(item)
          return <article className="saved-build panel" key={item.id}>
            <span className={`class-sigil ${item.classId}`}>{item.classId === 'necromancer' ? '☠' : '✧'}</span>
            <div className="saved-copy"><small>{definition.nameKo} · 레벨 {item.level}</small><h2>{item.name}</h2><p>기술 {itemSummary.spentSkillPoints}/{itemSummary.availableSkillPoints} · 패캐 {itemSummary.fasterCastRate} · 매찬 {itemSummary.magicFind}</p></div>
            <time>{new Date(item.updatedAt).toLocaleString('ko-KR')}</time>
            <div><button className="button ghost" onClick={() => onLoad({ ...item })}>불러오기</button><button className="delete-button" onClick={() => onDelete(item.id)}>삭제</button></div>
          </article>
        })}
      </div>
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
  ]
  return <section className="compare-panel panel"><div className="compare-names"><strong>{left.name}</strong><span>VS</span><strong>{right.name}</strong></div>{rows.map((row) => <div className="compare-row" key={row.label}><span className={row.left > row.right ? 'winner' : ''}>{row.left}{row.suffix}</span><small>{row.label}</small><span className={row.right > row.left ? 'winner' : ''}>{row.right}{row.suffix}</span></div>)}</section>
}

function BreakpointPanel({ build, summary }: { build: BuildProfile; summary: BuildSummary }) {
  const values = [{ type: 'fcr' as const, label: '패캐', value: summary.fasterCastRate }, { type: 'fhr' as const, label: '패힛', value: summary.fasterHitRecovery }, { type: 'fbr' as const, label: '패블럭', value: summary.fasterBlockRate }]
  return <section className="panel section-card breakpoint-card"><div className="section-heading"><div><small>BREAKPOINTS</small><h2>프레임 구간</h2></div><span>일반 시전 기준</span></div><div className="breakpoint-list">{values.map((entry) => { const progress = breakpointProgress(build.classId, entry.type, entry.value); return <div key={entry.type}><span>{entry.label}</span><strong>{entry.value}%</strong><div><i style={{ width: `${progress.next ? Math.min(100, entry.value / progress.next * 100) : 100}%` }} /></div><small>{progress.next ? `다음 ${progress.next}% · ${progress.needed}% 필요` : '최고 구간 도달'}</small></div> })}</div><p className="calc-caveat">번개·연쇄 번개, 곰 변신 등 별도 애니메이션은 추후 분리됩니다.</p></section>
}

function SummaryRail({ build, summary }: { build: BuildProfile; summary: BuildSummary }) {
  const definition = CLASS_DEFINITIONS[build.classId]
  return <aside className="summary-rail"><div className="rail-class"><span className={`class-sigil ${build.classId}`}>{build.classId === 'necromancer' ? '☠' : '✧'}</span><div><small>ACTIVE BUILD</small><strong>{definition.nameKo}</strong><span>레벨 {build.level}</span></div></div><section><h3>핵심 수치</h3><dl><div><dt>생명력</dt><dd>{summary.life}</dd></div><div><dt>마나</dt><dd>{summary.mana}</dd></div><div><dt>패캐</dt><dd>{summary.fasterCastRate}%</dd></div><div><dt>패힛</dt><dd>{summary.fasterHitRecovery}%</dd></div><div><dt>달리기</dt><dd>{summary.fasterRunWalk}%</dd></div><div><dt>매찬</dt><dd>{summary.magicFind}%</dd></div></dl></section><section><h3>능력치</h3><dl>{(Object.keys(attributeLabels) as AttributeId[]).map((key) => <div key={key}><dt>{attributeLabels[key]}</dt><dd>{summary.attributes[key]}</dd></div>)}</dl></section><section className="rail-budget"><h3>포인트 예산</h3><div><span>기술</span><progress max={summary.availableSkillPoints} value={summary.spentSkillPoints} /><strong>{summary.spentSkillPoints}/{summary.availableSkillPoints}</strong></div><div><span>능력치</span><progress max={summary.availableStatPoints} value={summary.spentStatPoints} /><strong>{summary.spentStatPoints}/{summary.availableStatPoints}</strong></div></section></aside>
}

function EmptyState({ text, action, onClick }: { text: string; action: string; onClick?: () => void }) {
  return <div className="empty-state"><span>◇</span><p>{text}</p>{onClick ? <button onClick={onClick}>{action}</button> : <small>{action}</small>}</div>
}

export default App
