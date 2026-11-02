import { expect, test } from '@playwright/test';

const expectNoHorizontalOverflow = async (page: import('@playwright/test').Page) => {
  await expect.poll(() => page.evaluate(() => (
    document.documentElement.scrollWidth <= window.innerWidth
  ))).toBe(true);
};

test('homepage presents the core resume journey without runtime errors', async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/bezaleel/i);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Paul.');
  await expect(page.getByRole('link', { name: 'View selected work' })).toBeVisible();
  await expect(page.locator('#about')).toBeVisible();
  await expect(page.locator('#projects')).toBeVisible();
  await expect(page.locator('#experience')).toBeVisible();
  await expect(page.locator('#skills')).toBeVisible();
  await expect(page.locator('#github')).toBeVisible();
  await expect(page.locator('#contact')).toBeVisible();
  await expectNoHorizontalOverflow(page);
  expect(runtimeErrors).toEqual([]);
});

test('project case notes expand with native keyboard-accessible disclosures', async ({ page }) => {
  await page.goto('/');
  const firstDisclosure = page.locator('details').filter({ hasText: 'Read the case notes' }).first();
  await firstDisclosure.locator('summary').click();
  await expect(firstDisclosure).toHaveAttribute('open', '');
  await expect(page.getByText('The problem', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('The approach', { exact: true }).first()).toBeVisible();
});

test('mobile navigation opens, closes, and keeps the page within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Work' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});

test('project archive filters and searches accurately', async ({ page }) => {
  await page.goto('/projects/');
  await page.getByRole('button', { name: 'AI / ML', exact: true }).click();
  await expect(page.getByText('Showing 2 of 7 projects')).toBeVisible();
  await page.getByRole('searchbox', { name: 'Search projects by name, description, or technology' }).fill('NADICARE');
  await expect(page.getByText('Showing 1 of 7 projects')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'NADICARE Twin Engine' })).toBeVisible();
  await page.getByRole('searchbox', { name: 'Search projects by name, description, or technology' }).fill('no-such-project');
  await expect(page.getByRole('heading', { name: 'No matching projects.' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(page.getByText('Showing 7 of 7 projects')).toBeVisible();
});

test('activity chart exposes exact values through accessible day buttons', async ({ page }) => {
  await page.goto('/');
  const dayButton = page.getByRole('button', { name: '03 Oct: 0 commits', exact: true });
  await dayButton.click();
  await expect(dayButton).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('03 Oct · 0 commits', { exact: true })).toBeVisible();
});

test('default motion renders the lightweight 3D hero signal', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(1);
  await expect(page.locator('canvas')).toBeVisible();
});

test('reduced motion removes the decorative WebGL canvas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('resume actions and structured data modal are usable', async ({ page }) => {
  await page.goto('/resume/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/bezaleel/i);
  await page.getByRole('button', { name: 'Data (JSON)' }).click();
  await expect(page.getByText('Resume Data Source (resume.json)')).toBeVisible();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.getByText('Resume Data Source (resume.json)')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Download PDF' })).toHaveAttribute('href', '/resume.pdf');
});

test('resume actions remain accessible on a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/resume/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/bezaleel/i);
  await expect(page.getByRole('link', { name: 'Download PDF' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Data (JSON)' })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test('work atlas opens a real project and stays deep-linkable', async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));

  await page.goto('/atlas/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('The Work Atlas.');

  const projectButton = page.getByRole('button', { name: /NADICARE/ });
  await projectButton.click();
  await expect(projectButton).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: 'NADICARE Twin Engine' })).toBeVisible();
  await expect(page).toHaveURL(/project=nadicare-twin-engine/);

  await page.getByRole('button', { name: 'Close project details' }).click();
  await expect(page.getByRole('heading', { name: 'NADICARE Twin Engine' })).toHaveCount(0);
  await expect(page).not.toHaveURL(/project=/);
  expect(runtimeErrors).toEqual([]);
});

test('work atlas restores a deep-linked constellation', async ({ page }) => {
  await page.goto('/atlas/?project=drishti-ai');
  await expect(page.getByRole('heading', { name: 'Drishti-AI Vision System' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Drishti/ })).toHaveAttribute('aria-pressed', 'true');
});

test('work atlas falls back to a static map when motion is reduced', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/atlas/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('The Work Atlas.');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.getByText('Static map')).toBeVisible();
});
