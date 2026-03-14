import { expect, test } from '@playwright/test';
import { login } from './support/auth';

test('user can log in with configured credentials', async ({ page }) => {
  await login(page);

  await expect(page.getByText('Projects')).toBeVisible();
  await expect(page.getByText('Web Application').first()).toBeVisible();
});