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
  await page.getByTestId('item-select-weapon').selectOption('heart-of-the-oak')
  await page.getByTestId('item-select-offhand').selectOption('spirit-shield')
  await page.getByTestId('item-select-armor').selectOption('vipermagi')
  await page.getByTestId('item-select-belt').selectOption('arachnid-mesh')

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
  await expect(page.getByText('서버 없이 공유')).toBeVisible()
})

test('applies a legal starter template', async ({ page }) => {
  await page.locator('.template-field select').selectOption('poison-necro')
  await expect(page.getByRole('heading', { name: '독조넥 골격' })).toBeVisible()
  await page.getByTestId('nav-skills').click()
  await expect(page.locator('.budget-pill')).toContainText('보유101')
  await expect(page.getByRole('button', { name: '맹독 확산 증가' })).toBeDisabled()
})

test('renders desktop overview', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'desktop capture only')
  await expect(page.getByRole('heading', { name: '새 네크로맨서 빌드' })).toBeVisible()
  await page.screenshot({ path: 'tests/screenshots/overview-desktop.png', fullPage: true })
})

test('renders mobile skill planner with bottom navigation', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile capture only')
  await page.getByTestId('nav-skills').click()
  await expect(page.getByRole('heading', { name: '네크로맨서 기술' })).toBeVisible()
  await page.screenshot({ path: 'tests/screenshots/skills-mobile.png', fullPage: true })
})
