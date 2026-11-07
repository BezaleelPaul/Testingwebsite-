import { expect, test } from '@playwright/test';

test('resume exports as a styled, single-page A4 PDF without clipped columns', async ({ page }) => {
  await page.goto('/resume');
  await expect(page.getByRole('button', { name: /export the current website resume as an a4 pdf/i })).toBeVisible();

  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);

  const printLayout = await page.evaluate(() => {
    const article = document.querySelector<HTMLElement>('#resume-canvas');
    const aside = document.querySelector<HTMLElement>('.resume-dossier-aside');
    const main = document.querySelector<HTMLElement>('.resume-dossier-main');
    const accent = document.querySelector<HTMLElement>('.resume-dossier-main h3');
    const coursework = document.querySelector<HTMLElement>('.resume-dossier-aside section:last-child');
    if (!article || !aside || !main || !accent || !coursework) {
      throw new Error('Resume print layout is missing a required element.');
    }
    const bounds = article.getBoundingClientRect();
    return {
      width: bounds.width,
      height: bounds.height,
      articleOverflow: article.scrollHeight > article.clientHeight + 1,
      asideOverflow: aside.scrollHeight > aside.clientHeight + 1,
      mainOverflow: main.scrollHeight > main.clientHeight + 1,
      background: getComputedStyle(article).backgroundColor,
      accent: getComputedStyle(accent).color,
      lowPriorityCourseworkHidden: getComputedStyle(coursework).display === 'none',
    };
  });

  expect(printLayout.width).toBeCloseTo(793.7, 0);
  expect(printLayout.height).toBeCloseTo(1122.5, 0);
  expect(printLayout.articleOverflow).toBe(false);
  expect(printLayout.asideOverflow).toBe(false);
  expect(printLayout.mainOverflow).toBe(false);
  expect(printLayout.background).toBe('rgb(10, 10, 15)');
  expect(printLayout.accent).toBe('rgb(215, 255, 0)');
  expect(printLayout.lowPriorityCourseworkHidden).toBe(true);

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });
  const pdfSource = Buffer.from(pdf).toString('latin1');
  expect((pdfSource.match(/\/Type\s*\/Page\b/g) ?? []).length).toBe(1);
});
