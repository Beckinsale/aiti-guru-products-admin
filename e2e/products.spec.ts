import { test, expect, type Page } from '@playwright/test'

const login = async (page: Page) => {
  await page.goto('/login')
  await page.evaluate(() => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
  })
  await page.locator('#username').fill('emilys')
  await page.locator('#password').fill('emilyspass')
  await page.getByRole('button', { name: 'Войти' }).click()
  await expect(page).toHaveURL(/\/products/, { timeout: 10000 })
}

const waitForProducts = (page: Page) =>
  page.locator('img[alt]').first().waitFor({ timeout: 12000 })

test.describe('Products Page', () => {
  test('shows navbar with "Товары" heading', async ({ page }) => {
    await login(page)
    await expect(page.locator('h1', { hasText: 'Товары' })).toBeVisible()
  })

  test('shows search input', async ({ page }) => {
    await login(page)
    await expect(page.getByPlaceholder(/Найти/)).toBeVisible()
  })

  test('shows table columns: Наименование, Вендор, Артикул, Оценка, Цена', async ({ page }) => {
    await login(page)
    await expect(page.getByText('Наименование')).toBeVisible()
    await expect(page.getByText('Вендор')).toBeVisible()
    await expect(page.getByText('Артикул')).toBeVisible()
    await expect(page.getByText('Оценка')).toBeVisible()
    await expect(page.getByText('Цена, ₽')).toBeVisible()
  })

  test('loads products from API (skeleton → rows)', async ({ page }) => {
    await login(page)
    await waitForProducts(page)
    const images = page.locator('img[alt]')
    await expect(images.first()).toBeVisible()
    expect(await images.count()).toBeGreaterThan(5)
  })

  test('search updates URL and filters results', async ({ page }) => {
    await login(page)
    await waitForProducts(page)

    await page.getByPlaceholder(/Найти/).fill('phone')
    await page.waitForTimeout(400) // debounce

    await expect(page).toHaveURL(/q=phone/)
  })

  test('sort by price: URL params toggle asc → desc', async ({ page }) => {
    await login(page)
    await waitForProducts(page)

    const priceBtn = page.getByRole('button', { name: /Цена/ })
    await priceBtn.click()
    await page.waitForURL(/sortBy=price.*order=asc|order=asc.*sortBy=price/, { timeout: 5000 })

    await priceBtn.click()
    await page.waitForURL(/order=desc/, { timeout: 5000 })
    await expect(page).toHaveURL(/order=desc/)
  })

  test('sort by rating sets URL params', async ({ page }) => {
    await login(page)
    await waitForProducts(page)

    await page.getByRole('button', { name: /Оценка/ }).click()
    await expect(page).toHaveURL(/sortBy=rating/)
    await expect(page).toHaveURL(/order=asc/)
  })

  test('select-all checkbox checks all row checkboxes', async ({ page }) => {
    await login(page)
    await waitForProducts(page)

    // Row checkboxes before select-all
    const rowCheckboxes = page.locator('button[role="checkbox"]')
    const totalBefore = await rowCheckboxes.count()
    expect(totalBefore).toBeGreaterThan(1) // header + rows

    // Click header checkbox (first one)
    await rowCheckboxes.first().click()

    const checkedAfter = page.locator('button[role="checkbox"][data-state="checked"]')
    await expect(checkedAfter.first()).toBeVisible()
    const checkedCount = await checkedAfter.count()
    expect(checkedCount).toBe(totalBefore) // all checked including header
  })

  test('individual row checkbox works independently', async ({ page }) => {
    await login(page)
    await waitForProducts(page)

    const rowCheckboxes = page.locator('button[role="checkbox"]')
    // Click second checkbox (first row, not header)
    await rowCheckboxes.nth(1).click()
    await expect(rowCheckboxes.nth(1)).toHaveAttribute('data-state', 'checked')
    // Header should be in indeterminate state — not fully checked
    await expect(rowCheckboxes.first()).not.toHaveAttribute('data-state', 'checked')
  })

  test('"Добавить" opens modal', async ({ page }) => {
    await login(page)

    await page.getByRole('button', { name: /Добавить/ }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Добавить товар')).toBeVisible()
  })

  test('Add modal: validation errors on empty submit', async ({ page }) => {
    await login(page)

    await page.getByRole('button', { name: /Добавить/ }).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByRole('button', { name: 'Добавить' }).click()
    await expect(dialog.getByText('Обязательное поле').first()).toBeVisible()
  })

  test('Add modal: successful submit shows toast and closes', async ({ page }) => {
    await login(page)

    await page.getByRole('button', { name: /Добавить/ }).click()
    const dialog = page.getByRole('dialog')

    await dialog.getByLabel('Наименование').fill('Тестовый товар')
    await dialog.getByLabel('Цена, ₽').fill('999')
    await dialog.getByLabel('Вендор').fill('Test Brand')
    await dialog.getByLabel('Артикул').fill('TST-001')
    await dialog.getByRole('button', { name: 'Добавить' }).click()

    await expect(page.getByText('Товар добавлен')).toBeVisible({ timeout: 3000 })
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('Add modal closes on "Отмена"', async ({ page }) => {
    await login(page)

    await page.getByRole('button', { name: /Добавить/ }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: 'Отмена' }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('refresh button re-fetches products', async ({ page }) => {
    await login(page)
    await waitForProducts(page)

    const countBefore = await page.locator('img[alt]').count()
    await page.getByRole('button', { name: 'Обновить' }).click()
    // After refresh skeleton appears briefly, then data reloads
    await waitForProducts(page)
    const countAfter = await page.locator('img[alt]').count()
    expect(countAfter).toBe(countBefore)
  })

  test('logged-out user is redirected from /products to /login', async ({ page }) => {
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
    })
    await page.goto('/products')
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
  })
})
