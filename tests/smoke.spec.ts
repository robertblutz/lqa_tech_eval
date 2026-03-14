import { expect, test } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/netlify\.app/);
  await expect(page).toHaveTitle(/.+/);
});
