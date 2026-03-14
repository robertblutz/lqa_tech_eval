import { test } from '@playwright/test';
import { login } from './support/auth';

test('marketing campaign done does not contain bribe journalists card', async ({ page }) => {
  const projectBoardPage = await login(page);

  await projectBoardPage.expectCardNotPresent('Marketing Campaign', 'Done', 'Bribe journalists');
});