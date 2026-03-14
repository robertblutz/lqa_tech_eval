import { test } from '@playwright/test';
import { login } from './support/auth';

test('web application to do contains fix navigation bug card', async ({ page }) => {
  const projectBoardPage = await login(page);

  await projectBoardPage.expectCardPresent('Web Application', 'To Do', 'Fix navigation bug');
});