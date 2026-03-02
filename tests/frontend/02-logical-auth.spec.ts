import { expect, test, type Page } from '@playwright/test';

const mockApi = async (page: Page) => {
  await page.route('**/api/treks**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ packages: [] }),
    });
  });

  await page.route('**/api/blog**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [] }),
    });
  });
};

test.describe('Frontend logical flows (11 tests)', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
  });

  test('[13] Navbar About Us link navigates to /about', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('link', { name: /About Us/i }).click();
    await expect(page).toHaveURL(/\/about$/);
  });

  test('[14] Navbar Trek Packages link navigates to /treks', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('link', { name: /Trek Packages/i }).click();
    await expect(page).toHaveURL(/\/treks$/);
  });

  test('[15] Login validation shows required-fields error', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByRole('button', { name: /Log In/i }).click();
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    await expect(emailInput).toHaveAttribute('required', '');
    await expect(passwordInput).toHaveAttribute('required', '');
    expect(await emailInput.evaluate((el) => (el as HTMLInputElement).validity.valueMissing)).toBe(true);
  });

  test('[16] Login forgot-password link navigates correctly', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByRole('link', { name: /Forget Password/i }).click();
    await expect(page).toHaveURL(/\/auth\/forgot-password$/);
  });

  test('[17] Register validation shows required-fields error', async ({ page }) => {
    await page.goto('/auth/register');
    await page.getByRole('button', { name: /Sign Up/i }).click();
    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    await expect(nameInput).toHaveAttribute('required', '');
    await expect(emailInput).toHaveAttribute('required', '');
    expect(await nameInput.evaluate((el) => (el as HTMLInputElement).validity.valueMissing)).toBe(true);
  });

  test('[18] Register validation rejects invalid email format', async ({ page }) => {
    await page.goto('/auth/register');
    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="email"]').fill('invalid-email');
    await page.locator('input[name="password"]').fill('123456');
    await page.locator('input[name="confirmPassword"]').fill('123456');
    await page.getByRole('button', { name: /Sign Up/i }).click();
    const emailInput = page.locator('input[name="email"]');
    expect(await emailInput.evaluate((el) => (el as HTMLInputElement).validity.typeMismatch)).toBe(true);
  });

  test('[19] Register validation rejects short password', async ({ page }) => {
    await page.goto('/auth/register');
    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('12345');
    await page.locator('input[name="confirmPassword"]').fill('12345');
    await page.getByRole('button', { name: /Sign Up/i }).click();
    const passwordInput = page.locator('input[name="password"]');
    expect(await passwordInput.evaluate((el) => (el as HTMLInputElement).validity.tooShort)).toBe(true);
  });

  test('[20] Register validation rejects mismatched passwords', async ({ page }) => {
    await page.goto('/auth/register');
    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('123456');
    await page.locator('input[name="confirmPassword"]').fill('abcdef');
    await page.getByRole('button', { name: /Sign Up/i }).click();
    await expect(page.getByText(/Passwords do not match/i)).toBeVisible();
  });

  test('[21] Reset-password with token+email shows reset form', async ({ page }) => {
    await page.goto('/auth/reset-password?token=dummy-token&email=test@example.com');
    await expect(page.getByRole('heading', { name: /Reset Password/i })).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
  });

  test('[22] Resend-verification form renders email input and submit button', async ({ page }) => {
    await page.goto('/auth/resend-verification');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /Send Verification Email/i })).toBeVisible();
  });

  test('[23] Home search submits and redirects to /treks with query', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder(/Search treks, guides, destinations/i);
    await searchInput.fill('everest base camp');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page).toHaveURL(/\/treks\?search=everest%20base%20camp$/);
  });
});
