import { expect, test } from '@playwright/test';

test('command deck opens from keyboard, filters destinations, and navigates', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Where to next?' });
  await expect(dialog).toBeVisible();
  await page.getByRole('searchbox', { name: 'Search command deck' }).fill('universe');
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await expect(dialog.getByRole('option', { name: /The Universe/ })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/universe\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('THE UNIVERSE');
});

test('command deck closes with Escape and restores keyboard access', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /COMMAND DECK/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /COMMAND DECK/ })).toBeFocused();
});
