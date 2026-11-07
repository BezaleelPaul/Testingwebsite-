import { expect, test } from '@playwright/test';

test('ATLAS prototype transforms between mech and rover configurations', async ({ page }) => {
  await page.goto('/lab/');
  await expect(page.getByRole('heading', { name: /mechanics in motion/i })).toBeVisible();
  await expect(page.getByText('ATLAS-01 / SHIFTER PROTOTYPE')).toBeVisible();
  await expect(page.locator('.robot-lab-viewport canvas')).toBeVisible();
  await page.getByRole('button', { name: /rover form/i }).click();
  await expect(page.locator('.robot-lab-viewport-meta')).toContainText('ROVER CONFIG');
  await page.getByRole('button', { name: /initiate transformation/i }).click();
  await expect(page.locator('.robot-lab-viewport-meta')).toContainText('BIPEDAL CONFIG');
  await page.getByRole('button', { name: /auto-calibrate/i }).click();
  await expect(page.getByText('CALIBRATION LOCKED â€” NICE WORK.')).toBeVisible();
});

test('planet dossiers select destinations and record mission waypoints', async ({ page }) => {
  await page.goto('/universe/');
  await expect(page.getByRole('heading', { name: /pick your next world/i })).toBeVisible();
  await page.getByRole('button', { name: /mars terrestrial/i }).click();
  await expect(page.locator('.planet-dossier-content h3')).toContainText('Mars');
  await page.getByRole('button', { name: /log this waypoint/i }).click();
  await expect(page.getByRole('button', { name: /waypoint logged/i })).toBeVisible();
  await expect(page.locator('.planet-deck-progress strong')).toCo¶»§q«^