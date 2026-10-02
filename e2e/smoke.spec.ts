import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const PUBLIC_PAGES = ['/', '/contacts', '/login']

test.describe('smoke', () => {
  for (const path of PUBLIC_PAGES) {
    test(`${path} renders without accessibility violations`, async ({ page }) => {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()

      expect(violations).toEqual([])
    })
  }

  test('protected page redirects guests to login with a return url', async ({ page }) => {
    await page.goto('/dashboard')

    await expect(page).toHaveURL('/login?redirect=%2Fdashboard')
    await expect(page.getByRole('heading', { level: 1, name: 'Sign in' })).toBeVisible()
  })

  test('unknown url shows the 404 page', async ({ page }) => {
    await page.goto('/does-not-exist')

    await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible()
  })

  test('navigation between pages works', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('navigation').getByRole('link', { name: 'Contacts' }).click()

    await expect(page).toHaveURL('/contacts')
    await expect(page).toHaveTitle('Contacts · React Starter')
  })
})
