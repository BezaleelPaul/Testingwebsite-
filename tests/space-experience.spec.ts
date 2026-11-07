import { expect, test } from '@playwright/test';

test('homepage links to the new interactive engineering destinations and closes with the final transmission', async ({ page }) => {
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
  await page.getByRole('slider', { name: 'Shoulder joint angle' }).evaluate((element) => {
    const slider = element as HTMLInputElement;
    slider.value = '35';
    slider.dispatchEvent(new Event('input', { bubbles: true }));
    slider.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page.getByText('35°', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'RESET' }).click();
  await expect(page.getByText('18°', { exact: true })).toBeVisible();
});

test('Spacekit route remains usable when the external engine is unavailable', async ({ page }) => {
  await page.route('https://typpo.github.io/spacekit/**', (route) => route.abort());
  await page.goto('/universe/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('THE UNIVERSE');
  await expect(page.getByText('FALLBACK MODE')).toBeVisible();
  await expect(page.getByText('The external astronomy engine could not load. The orbital preview remains available.')).toBeVisible();
});
