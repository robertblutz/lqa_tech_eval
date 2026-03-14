import { expect, test } from '@playwright/test';
import { login } from './support/auth';

test('mobile application in progress offline mode card has feature and high priority tags', async ({ page }) => {
  const projectBoardPage = await login(page);

  await projectBoardPage.expectCardPresent('Mobile Application', 'In Progress', 'Offline mode');

  const tags = await projectBoardPage.getCardTags('Mobile Application', 'In Progress', 'Offline mode');
  expect(tags).toEqual(expect.arrayContaining(['Feature', 'High Priority']));
});