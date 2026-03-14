import { expect, type Page } from '@playwright/test';
import { testEnv } from './env';

export async function login(page: Page): Promise<void> {
  await page.goto(testEnv.baseUrl);
  await page.locator('#username').fill(testEnv.username);
  await page.locator('#password').fill(testEnv.password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
}
