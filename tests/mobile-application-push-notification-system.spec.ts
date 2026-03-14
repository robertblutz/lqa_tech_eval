import { expect, test } from '@playwright/test';
import { login } from './support/auth';

test('mobile application to do push notification system card has feature tag', async ({ page }) => {
  const projectBoardPage = await login(page);

  await projectBoardPage.expectCardPresent('Mobile Application', 'To Do', 'Push notification system');

  const tags = await projectBoardPage.getCardTags('Mobile Application', 'To Do', 'Push notification system');
  expect(tags).toEqual(expect.arrayContaining(['Feature']));
});