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

  await page.route('**/api/guides**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [] }),
    });
  });
};

test.describe('Frontend public + auth routes (12 tests)', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
  });

  test('[1] Home page renders main hero heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Trekking the world made easy/i })).toBeVisible();
  });

  test('[2] Home search input and button are visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByPlaceholder(/Search treks, guides, destinations/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
  });

  test('[3] About page renders mission section', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { name: /Our Mission/i })).toBeVisible();
  });

  test('[4] Blog page renders hero title', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('heading', { name: /Trek Stories & Guides/i })).toBeVisible();
  });

  test('[5] Treks page renders hero title', async ({ page }) => {
    await page.goto('/treks');
    await expect(page.getByRole('heading', { name: /Explore Trek Packages/i })).toBeVisible();
  });

  test('[6] Login page renders heading', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByRole('heading', { name: /Welcome Back/i })).toBeVisible();
  });

  test('[7] Register page renders heading', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.getByRole('heading', { name: /Hi, Get Started Now/i })).toBeVisible();
  });

  test('[8] Forgot-password page renders form CTA', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await expect(page.getByRole('heading', { name: /Forgot Password\?/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Send Reset Link/i })).toBeVisible();
  });

  test('[9] Reset-password without params shows invalid-link state', async ({ page }) => {
    await page.goto('/auth/reset-password');
    await expect(page.getByRole('heading', { name: /Invalid Reset Link/i })).toBeVisible();
  });

  test('[10] Verify-email without token shows failure state', async ({ page }) => {
    await page.goto('/auth/verify-email');
    await expect(page.getByRole('heading', { name: /Verification Failed/i })).toBeVisible();
  });

  test('[11] Resend-verification page renders heading', async ({ page }) => {
    await page.goto('/auth/resend-verification');
    await expect(page.getByRole('heading', { name: /Verify Email/i })).toBeVisible();
  });

  test('[12] Unknown route shows not-found page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /This page could not be found\./i })).toBeVisible();
  });
});
