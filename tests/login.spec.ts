import { test } from '@playwright/test';
import { login } from './support/auth';

test('user can log in and switch projects on the board', async ({ page }) => {
  const projectBoardPage = await login(page);

  await projectBoardPage.expectSelectedProject('Web Application');
  await projectBoardPage.expectCardPresent('Web Application', 'To Do', 'Implement user authentication');

  await projectBoardPage.expectCardPresent('Mobile Application', 'To Do', 'Push notification system');
});