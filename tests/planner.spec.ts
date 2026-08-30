import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('allocates skills with 3.3 prerequisites', async ({ page }) => {
  await page.getByTestId('nav-skills').click()
  await expect(page.getByRole('heading', { name: '네크로맨서 기술' })).toBeVisible()

  const masteryAdd = page.getByRole('button', { name: '해골 숙련 증가' })
  await expect(masteryAdd).toBeDisabled()
  await page.getByRole('button', { name: '해골 되살리기 증가' }).click()
  await expect(masteryAdd).toBeEnabled()
  await masteryAdd.click()

  await expect(page.locator('.budget-pill')).toContainText('2')
})

test('combines representative caster equipment and saves the build', async ({ page }) => {
  await page.getByTestId('nav-equipment').click()
  for (const [slot, item] of [['weapon', 'heart-of-the-oak'], ['offhand', 'spirit-shield'], ['armor', 'vipermagi'], ['belt', 'arachnid-mesh']] as const) {
    await page.getByTestId(`doll-slot-${slot}`).click()
    await page.getByTestId(`focus-item-select-${slot}`).selectOption(item)
  }

  await page.getByTestId('nav-overview').click()
  await expect(page.locator('.breakpoint-card')).toContainText('125%')
  await page.getByRole('button', { name: '현재 저장' }).click()
  await expect(page.getByText('보관함에 저장했습니다.')).toBeVisible()
  await page.getByTestId('nav-library').click()
  await expect(page.getByRole('heading', { name: '새 네크로맨서 빌드' })).toBeVisible()
})

test('switches to Sorceress and exports a share code', async ({ page }) => {
  await page.getByRole('button', { name: /원소술사/ }).click()
  await expect(page.getByText('새 원소술사 빌드', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '빌드 공유' }).click()
  const code = page.locator('.modal textarea')
  await expect(code).not.toHaveValue('')
  await expect(page.getByRole('heading', { name: '빌드 내보내기' })).toBeVisible()
})

test('shares externally and exports the complete build as a file', async ({ page }) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: async (payload: ShareData) => { (window as typeof window & { sharedPayload?: ShareData }).sharedPayload = payload },
    })
  })
  await page.locator('.build-name input').fill('공유용 네크 빌드')
  await page.getByRole('button', { name: '빌드 공유' }).click()
  await page.getByTestId('share-external').click()
  await expect.poll(() => page.evaluate(() => (window as typeof window & { sharedPayload?: ShareData }).sharedPayload?.title)).toBe('공유용 네크 빌드')

  const downloadPromise = page.waitForEvent('download')
  await page.getByTestId('download-build').click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('공유용 네크 빌드.d2rbuild')
  const downloadPath = await download.path()
  expect(downloadPath).not.toBeNull()
})

test('imports a d2rbuild file', async ({ page }) => {
  const draft = await page.evaluate(() => JSON.parse(localStorage.getItem('sanctuary-blueprint-draft-v1')!))
  draft.name = '파일에서 온 빌드'
  draft.notes = '파일 가져오기 확인'
  await page.getByRole('button', { name: '빌드 공유' }).click()
  await page.getByText('코드 또는 파일 가져오기', { exact: true }).click()
  await page.getByTestId('import-build-file').setInputFiles({
    name: 'shared.d2rbuild',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ format: 'd2r-planner-build', version: 1, exportedAt: new Date().toISOString(), build: draft })),
  })
  await expect(page.locator('.build-name input')).toHaveValue('파일에서 온 빌드 (가져옴)')
  await expect(page.getByText('빌드 파일을 가져왔습니다.')).toBeVisible()
})

test('switches across all eight classes and renders the Warlock trees', async ({ page }) => {
  const classes = [
    ['amazon', '아마존'], ['sorceress', '원소술사'], ['necromancer', '네크로맨서'], ['paladin', '성기사'],
    ['barbarian', '야만용사'], ['druid', '드루이드'], ['assassin', '암살자'], ['warlock', '악마술사'],
  ] as const

  for (const [classId, name] of classes) {
    await page.getByTestId(`class-${classId}`).click()
    await expect(page.getByTestId(`class-${classId}`)).toHaveClass(/selected/)
    await expect(page.locator('.summary-rail')).toContainText(name)
  }

  await page.getByTestId('nav-skills').click()
  await expect(page.getByRole('heading', { name: '악마술사 기술' })).toBeVisible()
  await expect(page.getByRole('tab', { name: '악마 결속' })).toBeVisible()
  await expect(page.getByRole('tab', { name: '기괴 무기' })).toBeVisible()
  await expect(page.getByRole('tab', { name: '혼돈 기술' })).toBeVisible()
  await expect(page.locator('.skill-node')).toHaveCount(10)
})

test('applies a legal starter template', async ({ page }) => {
  await page.locator('.template-field select').selectOption('poison-necro')
  await expect(page.getByRole('heading', { name: '독조넥 골격' })).toBeVisible()
  await page.getByTestId('nav-skills').click()
  await expect(page.locator('.budget-pill')).toContainText('보유101')
  await page.getByRole('tab', { name: /독과 뼈/ }).click()
  await expect(page.getByRole('button', { name: '맹독 확산 증가' })).toBeDisabled()
})

test('searches the full item catalog and adds a farming target', async ({ page }) => {
  await page.getByTestId('nav-equipment').click()
  await page.getByLabel('아이템 검색').fill('Harlequin Crest')
  const result = page.locator('.catalog-item').filter({ hasText: 'Harlequin Crest' })
  await expect(result).toHaveCount(1)
  await result.getByRole('button', { name: '☆ 파밍' }).click()
  await expect(result.getByRole('button', { name: '★ 파밍 중' })).toBeVisible()
})

test('searches Korean names and aliases and persists the item language', async ({ page }) => {
  await page.getByTestId('nav-equipment').click()
  await page.getByLabel('아이템 검색').fill('샤코')
  const result = page.locator('.catalog-item').filter({ hasText: '할리퀸 관모' })
  await expect(result).toHaveCount(1)
  await expect(result).toContainText('Harlequin Crest')
  await page.getByTestId('item-language-en').click()
  await expect(page.getByTestId('item-language-en')).toHaveAttribute('aria-pressed', 'true')
  await expect(result.locator('strong')).toHaveText('Harlequin Crest')
  await page.reload()
  await page.getByTestId('nav-equipment').click()
  await expect(page.getByTestId('item-language-en')).toHaveAttribute('aria-pressed', 'true')
})

test('applies stats from a non-preset database item', async ({ page }) => {
  await page.getByTestId('nav-equipment').click()
  await page.getByLabel('아이템 검색').fill('Suicide Branch')
  const result = page.locator('.catalog-item').filter({ hasText: 'Suicide Branch' })
  await expect(result).toHaveCount(1)
  await expect(result.locator('.impact-chip')).toContainText('패캐 +50')
  await result.getByRole('button', { name: '착용' }).click()
  await expect(page.getByTestId('slot-weapon')).toContainText('패캐 +50')
  await expect(page.locator('.summary-rail')).toContainText('50%')
})

test('equips Obedience with its catalog identity, full options and calculated stats', async ({ page }, testInfo) => {
  await page.getByTestId('nav-equipment').click()
  await page.getByLabel('아이템 검색').fill('순종')
  const result = page.locator('.catalog-item').filter({ hasText: 'Obedience' })
  await expect(result).toHaveCount(1)
  await result.getByRole('button', { name: '착용' }).click()

  await expect(page.getByTestId('equipment-detail').getByRole('heading', { name: '순종' })).toBeVisible()
  await expect(page.getByTestId('focus-item-select-weapon').locator('option:checked')).toHaveText('순종 · Obedience')
  const properties = page.getByTestId('selected-catalog-properties')
  await expect(properties.locator('li')).toHaveCount(7)
  await expect(properties).toContainText('피해 증가 · 370%')
  await expect(properties).toContainText('강타 확률 · 40%')
  await expect(properties).toContainText('적 화염 저항 감소 · 25%')
  await expect(properties).toContainText('적 처치 시 기술 · 마법부여')
  await expect(page.getByTestId('equipment-detail')).toContainText('패힛+40')
  await expect(page.getByTestId('equipment-detail')).toContainText('모든 저항+30')
  await expect(page.locator('.summary-rail')).toContainText('40%')
  if (testInfo.project.name === 'desktop-chromium') await page.screenshot({ path: 'tests/screenshots/obedience-equipped-desktop.png', fullPage: true })

  await page.reload()
  await page.getByTestId('nav-equipment').click()
  await expect(page.getByTestId('equipment-detail').getByRole('heading', { name: '순종' })).toBeVisible()
})

test('places a charm in the inventory grid', async ({ page }) => {
  await page.getByTestId('nav-inventory').click()
  await page.getByLabel('추가할 부적').selectOption('annihilus')
  await page.getByRole('button', { name: '빈 공간에 추가' }).click()
  await expect(page.locator('.inventory-charm')).toHaveCount(1)
  await expect(page.locator('.budget-pill')).toContainText('1')
})

test('creates a compressed URL and keeps save history', async ({ page }) => {
  await page.getByRole('button', { name: '현재 저장' }).click()
  await page.locator('.build-name input').fill('변경 이력 테스트')
  await page.getByRole('button', { name: '현재 저장' }).click()
  await page.getByRole('button', { name: '빌드 공유' }).click()
  await expect(page.locator('.share-link-field input')).toHaveValue(/#b=/)
  await page.getByRole('button', { name: '공유 창 닫기' }).click()
  await page.getByTestId('nav-library').click()
  await expect(page.getByRole('heading', { name: '변경 이력', exact: true })).toBeVisible()
})

test('renders desktop overview', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'desktop capture only')
  await expect(page.getByRole('heading', { name: '새 네크로맨서 빌드' })).toBeVisible()
  await page.screenshot({ path: 'tests/screenshots/overview-desktop.png', fullPage: true })
})

test('renders the responsive export dialog', async ({ page }, testInfo) => {
  await page.getByRole('button', { name: '빌드 공유' }).click()
  await expect(page.getByRole('heading', { name: '빌드 내보내기' })).toBeVisible()
  const formFactor = testInfo.project.name === 'desktop-chromium' ? 'desktop' : 'mobile'
  await page.screenshot({ path: `tests/screenshots/export-${formFactor}.png`, fullPage: true })
})

test('renders the eight-class selector and Warlock skill planner', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'desktop capture only')
  await expect(page.locator('.class-switcher button')).toHaveCount(8)
  await page.getByTestId('class-warlock').click()
  await page.getByTestId('nav-skills').click()
  await expect(page.getByRole('heading', { name: '악마술사 기술' })).toBeVisible()
  await page.screenshot({ path: 'tests/screenshots/classes-desktop.png', fullPage: true })
})

test('renders mobile skill planner with bottom navigation', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile capture only')
  await page.getByTestId('nav-skills').click()
  await expect(page.getByRole('heading', { name: '네크로맨서 기술' })).toBeVisible()
  await page.screenshot({ path: 'tests/screenshots/skills-mobile.png', fullPage: true })
})

test('renders desktop skill trees with prerequisite connectors', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'desktop capture only')
  await page.getByTestId('nav-skills').click()
  await expect(page.locator('.skill-tree')).toHaveCount(1)
  await expect(page.getByRole('tab', { name: /소환/ })).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.skill-connectors path')).not.toHaveCount(0)
  await expect(page.locator('.skill-icon')).toHaveCount(0)
  await expect(page.getByTestId('skill-raise-skeletal-mage').locator('.skill-name')).toBeVisible()
  await expect(page.locator('.skill-inspector')).toContainText('해골 되살리기')
  await page.getByRole('tab', { name: /독과 뼈/ }).click()
  await expect(page.getByTestId('skill-bone-spirit')).toBeVisible()
  await expect(page.getByTestId('skill-raise-skeleton')).toHaveCount(0)
  await page.screenshot({ path: 'tests/screenshots/skills-desktop-tree.png', fullPage: true })
})

test('renders desktop item catalog', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'desktop capture only')
  await page.getByTestId('nav-equipment').click()
  const head = await page.getByTestId('doll-slot-head').boundingBox()
  const armor = await page.getByTestId('doll-slot-armor').boundingBox()
  const weapon = await page.getByTestId('doll-slot-weapon').boundingBox()
  const offhand = await page.getByTestId('doll-slot-offhand').boundingBox()
  expect(head!.y).toBeLessThan(armor!.y)
  expect(weapon!.x).toBeLessThan(armor!.x)
  expect(offhand!.x).toBeGreaterThan(armor!.x)
  const itemNameSize = await page.getByTestId('doll-slot-weapon').locator('strong').evaluate((element) => parseFloat(getComputedStyle(element).fontSize))
  expect(itemNameSize).toBeGreaterThanOrEqual(14)
  await page.getByLabel('아이템 검색').fill('Tal Rasha')
  await expect(page.locator('.catalog-item')).not.toHaveCount(0)
  await page.screenshot({ path: 'tests/screenshots/catalog-desktop.png', fullPage: true })
})

test('renders mobile equipment paper doll', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile capture only')
  await page.getByTestId('nav-equipment').click()
  await expect(page.getByTestId('doll-slot-head')).toBeVisible()
  await expect(page.getByTestId('equipment-detail')).toBeVisible()
  const slotNameSize = await page.getByTestId('doll-slot-weapon').locator('strong').evaluate((element) => parseFloat(getComputedStyle(element).fontSize))
  expect(slotNameSize).toBeGreaterThanOrEqual(10)
  await page.screenshot({ path: 'tests/screenshots/equipment-mobile.png', fullPage: true })
})

test('renders mobile charm inventory', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile capture only')
  await page.getByTestId('nav-inventory').click()
  await page.getByLabel('추가할 부적').selectOption('annihilus')
  await page.getByRole('button', { name: '빈 공간에 추가' }).click()
  await page.screenshot({ path: 'tests/screenshots/inventory-mobile.png', fullPage: true })
})
