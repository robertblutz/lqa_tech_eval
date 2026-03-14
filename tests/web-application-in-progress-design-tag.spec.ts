import { expect, test } from '@playwright/test';
import { login } from './support/auth';

test('web application in progress design system updates card has design tag', async ({ page }) => {
  const projectBoardPage = await login(page);

  await projectBoardPage.expectCardPresent('Web Application', 'In Progress', 'Design System Updates');

  const tags = await projectBoardPage.getCardTags('Web Application', 'In Progress', 'Design System Updates');
  expect(tags).toEqual(expect.arrayContaining(['Design']));
});