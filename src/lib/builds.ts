import { CLASS_DEFINITIONS } from '../data/classes'
import type { AttributeId, BuildProfile, ClassId } from '../types'

export const STORAGE_KEY = 'sanctuary-blueprint-builds-v1'
export const DRAFT_KEY = 'sanctuary-blueprint-draft-v1'

export function createBuild(classId: ClassId = 'necromancer'): BuildProfile {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name: classId === 'necromancer' ? '새 네크로맨서 빌드' : '새 원소술사 빌드',
    classId,
    level: 90,
    difficulty: 'hell',
    questSkillPoints: 12,
    questStatPoints: 15,
    questResistPoints: 30,
    attributes: { strength: 0, dexterity: 0, vitality: 0, energy: 0 },
    skills: {},
    equipment: {},
    activeWeaponSet: 1,
    notes: '',
    createdAt: now,
    updatedAt: now,
    schemaVersion: 1,
    gameVersion: '3.3',
    era: 'reign-of-the-warlock',
    ladder: false,
  }
}

export function normalizeBuild(value: unknown): BuildProfile {
  if (!value || typeof value !== 'object') throw new Error('빌드 데이터가 올바르지 않습니다.')
  const raw = value as Partial<BuildProfile>
  if (raw.classId !== 'necromancer' && raw.classId !== 'sorceress') throw new Error('지원하지 않는 직업입니다.')
  const base = createBuild(raw.classId)
  const attributes = { ...base.attributes }
  for (const key of Object.keys(attributes) as AttributeId[]) {
    attributes[key] = Math.max(0, Math.floor(Number(raw.attributes?.[key]) || 0))
  }
  const knownSkills = new Set(CLASS_DEFINITIONS[raw.classId].skills.map((item) => item.id))
  const skills = Object.fromEntries(Object.entries(raw.skills ?? {})
    .filter(([id]) => knownSkills.has(id))
    .map(([id, points]) => [id, Math.max(0, Math.min(20, Math.floor(Number(points) || 0)))]))
  return {
    ...base,
    ...raw,
    id: typeof raw.id === 'string' ? raw.id : base.id,
    name: typeof raw.name === 'string' ? raw.name.slice(0, 80) : base.name,
    level: Math.max(1, Math.min(99, Math.floor(Number(raw.level) || 1))),
    questSkillPoints: Math.max(0, Math.min(12, Math.floor(Number(raw.questSkillPoints) || 0))),
    questStatPoints: Math.max(0, Math.min(15, Math.floor(Number(raw.questStatPoints) || 0))),
    questResistPoints: Math.max(0, Math.min(30, Math.floor(Number(raw.questResistPoints) || 0))),
    attributes,
    skills,
    equipment: raw.equipment && typeof raw.equipment === 'object' ? raw.equipment : {},
    activeWeaponSet: raw.activeWeaponSet === 2 ? 2 : 1,
    notes: typeof raw.notes === 'string' ? raw.notes.slice(0, 4000) : '',
    schemaVersion: 1,
    gameVersion: '3.3',
    era: 'reign-of-the-warlock',
    ladder: false,
  }
}

export function loadDraft(): BuildProfile {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? normalizeBuild(JSON.parse(raw)) : createBuild()
  } catch {
    return createBuild()
  }
}

export function loadBuilds(): BuildProfile[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(raw) ? raw.map(normalizeBuild) : []
  } catch {
    return []
  }
}

export function encodeBuild(build: BuildProfile): string {
  const bytes = new TextEncoder().encode(JSON.stringify(build))
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

export function decodeBuild(code: string): BuildProfile {
  const normalized = code.trim().replaceAll('-', '+').replaceAll('_', '/')
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4)
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return normalizeBuild(JSON.parse(new TextDecoder().decode(bytes)))
}
