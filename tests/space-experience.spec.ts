import { expect, test } from '@playwright/test';

test('homepage exposes the universe, robotics lab and final transmission', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#engineering-lab')).toBeVisible();
  await expect(page.getByRole('link', { name: /ENTER THE UNIVERSE: The universe/i })).toHaveAttribute('href', '/universe/');
  await expect(page.getByRole('link', { name: /OPEN THE LAB: Robotics lab/i })).toHaveAttribute('href', '/lab/');
  await expect(page.getByText('Yet to learn.')).toBeVisible();
  await expect(page.getByText('Yet to explore.')).toBeVisible();
});

test('robotics lab exposes accessible joint controls', async ({ page }) => {
  await page.goto('/lab/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('MECHANICS');
  await expect(page.getByRole('slider', { name: 'Shoulder joint angle' })).toBeVisible();
  await expect(page.getByRole('slider', { name: 'Elbow joint angle' })).toBeVisible();
  await expect(page.getByRole('slider', { name: 'Wrist joint angle' })).toBeVisible();
});

test('Spacekit route remains usable when the external engine is unavailable', async ({ page }) => {
  await page.route('https://typpo.github.io/spacekit/**', (route) => route.abort());
  await page.goto('/universe/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('THE UNIVERSE');
  await expect(page.getByText('FALLBACK MODE')).toBeVisible();
});
