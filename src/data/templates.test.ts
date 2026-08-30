import { describe, expect, it } from 'vitest'
import { CLASS_DEFINITIONS } from './classes'
import { BUILD_TEMPLATES } from './templates'

describe('starter templates', () => {
  for (const template of BUILD_TEMPLATES) {
    it(`${template.name} is a legal level 90 skeleton`, () => {
      const definition = CLASS_DEFINITIONS[template.classId]
      expect(Object.values(template.skills).reduce((sum, points) => sum + points, 0)).toBeLessThanOrEqual(101)
      expect(Object.values(template.attributes).reduce((sum, points) => sum + points, 0)).toBeLessThanOrEqual(460)
      for (const [skillId, points] of Object.entries(template.skills)) {
        expect(points).toBeLessThanOrEqual(20)
        const skill = definition.skills.find((item) => item.id === skillId)
        expect(skill, skillId).toBeDefined()
        for (const prerequisite of skill!.prerequisites ?? []) {
          expect(template.skills[prerequisite], `${skillId} requires ${prerequisite}`).toBeGreaterThan(0)
        }
      }
    })
  }
})
