import { test, expect } from '@playwright/test'

test.describe('Auth — Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
    })
  })

  test('redirects unauthenticated user to /login', async ({ page }) => {
    await page.goto('/products')
    await expect(page).toHaveURL(/\/login/)
  })

  test('shows login page with key elements', async ({ page }) => {
    await expect(page.getByText('Добро пожаловать!')).toBeVisible()
    await expect(page.getByText('Пожалуйста, авторизируйтесь')).toBeVisible()
    await expect(page.locator('#username')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.getByText('Запомнить данные')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Войти' })).toBeVisible()
  })

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.getByRole('button', { name: 'Войти' }).click()
    const errors = page.getByText('Обязательное поле')
    await expect(errors).toHaveCount(2)
  })

  test('toggles password visibility', async ({ page }) => {
    const passwordInput = page.locator('#password')
    await expect(passwordInput).toHaveAttribute('type', 'password')
    await page.getByRole('button', { name: 'Показать пароль' }).click()
    await expect(passwordInput).toHaveAttribute('type', 'text')
    await page.getByRole('button', { name: 'Скрыть пароль' }).click()
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('shows API error on wrong credentials', async ({ page }) => {
    await page.locator('#username').fill('wronguser')
    await page.locator('#password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Войти' }).click()
    // DummyJSON returns { message: "Invalid credentials" } on 400
    await expect(page.getByText(/Invalid credentials|ошибка авторизации/i)).toBeVisible({ timeout: 8000 })
  })

  test('successful login navigates to /products', async ({ page }) => {
    await page.locator('#username').fill('emilys')
    await page.locator('#password').fill('emilyspass')
    await page.getByRole('button', { name: 'Войти' }).click()
    await expect(page).toHaveURL(/\/products/, { timeout: 10000 })
  })

  test('remember me: stores token in localStorage', async ({ page }) => {
    await page.locator('#username').fill('emilys')
    await page.locator('#password').fill('emilyspass')
    await page.locator('#rememberMe').click()
    await page.getByRole('button', { name: 'Войти' }).click()
    await expect(page).toHaveURL(/\/products/, { timeout: 10000 })
    const token = await page.evaluate(() => localStorage.getItem('token'))
    expect(token).toBeTruthy()
  })

  test('without remember me: stores token in sessionStorage', async ({ page }) => {
    await page.locator('#username').fill('emilys')
    await page.locator('#password').fill('emilyspass')
    await page.getByRole('button', { name: 'Войти' }).click()
    await expect(page).toHaveURL(/\/products/, { timeout: 10000 })
    const localToken = await page.evaluate(() => localStorage.getItem('token'))
    const sessionToken = await page.evaluate(() => sessionStorage.getItem('token'))
    expect(localToken).toBeNull()
    expect(sessionToken).toBeTruthy()
  })
})
