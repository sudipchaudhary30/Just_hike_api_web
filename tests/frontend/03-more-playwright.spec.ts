import { expect, test, type Page } from '@playwright/test';

type MockData = {
  treks?: any[];
  blogs?: any[];
  guides?: any[];
};

const setupMockApi = async (page: Page, data: MockData = {}) => {
  const treks = data.treks ?? [];
  const blogs = data.blogs ?? [];
  const guides = data.guides ?? [];

  await page.route('**/api/treks**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ packages: treks }),
    });
  });

  await page.route('**/api/blog**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: blogs }),
    });
  });

  await page.route('**/api/guides**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: guides }),
    });
  });
};

const trekItem = {
  _id: 't1',
  title: 'Everest View Trek',
  description: 'Beautiful Himalayan trek',
  difficulty: 'easy',
  durationDays: 5,
  price: 12000,
  location: 'Solukhumbu',
  maxGroupSize: 10,
  imageUrl: '/uploads/treks/everest.jpg',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const blogItem = {
  _id: 'b1',
  title: 'High Altitude Basics',
  excerpt: 'How to prepare for high altitude routes.',
  tags: ['Safety'],
  imageUrl: '/uploads/blog/high-altitude.jpg',
  author: { name: 'Admin' },
  createdAt: '2026-01-05T00:00:00.000Z',
};

test.describe('More Playwright tests (15)', () => {
  test('[24] Home shows Famous Treks section heading', async ({ page }) => {
    await setupMockApi(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Famous Treks/i })).toBeVisible();
  });

  test('[25] Home shows Recent Blog Articles heading', async ({ page }) => {
    await setupMockApi(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Recent Blog Articles/i })).toBeVisible();
  });

  test('[26] Home Explore Packages button navigates to /treks', async ({ page }) => {
    await setupMockApi(page);
    await page.goto('/');
    await page.getByRole('link', { name: /Explore Packages/i }).first().click();
    await expect(page).toHaveURL(/\/treks$/);
  });

  test('[27] Home footer quick links include Blog & Stories', async ({ page }) => {
    await setupMockApi(page);
    await page.goto('/');
    await expect(page.locator('footer').getByRole('link', { name: /Blog & Stories/i })).toBeVisible();
  });

  test('[28] About page shows all three value cards', async ({ page }) => {
    await setupMockApi(page);
    await page.goto('/about');
    await expect(page.getByRole('heading', { name: /Safety First/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Authentic Experiences/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Responsible Travel/i })).toBeVisible();
  });

  test('[29] Treks page difficulty filter options are visible', async ({ page }) => {
    await setupMockApi(page, { treks: [trekItem] });
    await page.goto('/treks');
    const filter = page.locator('select');
    await expect(filter).toBeVisible();
    const optionLabels = await filter.locator('option').allTextContents();
    expect(optionLabels).toEqual(expect.arrayContaining(['All Levels', 'Easy', 'Moderate', 'Hard']));
  });

  test('[30] Treks page empty state shows Try Again link', async ({ page }) => {
    await setupMockApi(page, { treks: [] });
    await page.goto('/treks');
    await expect(page.getByText(/No trek packages found/i)).toBeVisible();
    await page.getByRole('link', { name: /Try Again/i }).click();
    await expect(page).toHaveURL(/\/treks$/);
  });

  test('[31] Treks search query with no match shows empty state', async ({ page }) => {
    await setupMockApi(page, { treks: [trekItem] });
    await page.goto('/treks?search=nonexistent-place');
    await expect(page.getByText(/No trek packages found/i)).toBeVisible();
  });

  test('[32] Treks search query with match displays package card', async ({ page }) => {
    await setupMockApi(page, { treks: [trekItem] });
    await page.goto('/treks?search=everest');
    await expect(page.getByText('Everest View Trek')).toBeVisible();
  });

  test('[33] Blog empty state shows No Articles Found', async ({ page }) => {
    await setupMockApi(page, { blogs: [] });
    await page.goto('/blog');
    await expect(page.getByRole('heading', { name: /No Articles Found/i })).toBeVisible();
  });

  test('[34] Blog with data shows Featured Article badge', async ({ page }) => {
    await setupMockApi(page, { blogs: [blogItem] });
    await page.goto('/blog');
    await expect(page.getByText(/Featured Article/i)).toBeVisible();
  });

  test('[35] Blog topic filter renders tag button', async ({ page }) => {
    await setupMockApi(page, { blogs: [blogItem] });
    await page.goto('/blog');
    await expect(page.getByRole('button', { name: 'All Articles' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Safety' })).toBeVisible();
  });

  test('[36] Blog featured card click navigates to details route', async ({ page }) => {
    await setupMockApi(page, { blogs: [blogItem] });
    await page.goto('/blog');
    await page.getByRole('heading', { name: /High Altitude Basics/i }).first().click();
    await expect(page).toHaveURL(/\/blog\/b1$/);
  });

  test('[37] Login page Create account link navigates to register', async ({ page }) => {
    await setupMockApi(page);
    await page.goto('/auth/login');
    await page.getByRole('link', { name: /Create account/i }).click();
    await expect(page).toHaveURL(/\/auth\/register$/);
  });

  test('[38] Register page Sign in to account navigates to login', async ({ page }) => {
    await setupMockApi(page);
    await page.goto('/auth/register');
    await page.getByRole('link', { name: /Sign in to account/i }).click();
    await expect(page).toHaveURL(/\/auth\/login$/);
  });
});
