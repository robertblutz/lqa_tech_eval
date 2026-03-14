import { expect, test } from '@playwright/test';
import { login } from './support/auth';

test('mobile application done app icon design card has design tag', async ({ page }) => {
  const projectBoardPage = await login(page);

  await projectBoardPage.expectCardPresent('Mobile Application', 'Done', 'App icon design');

  const tags = await projectBoardPage.getCardTags('Mobile Application', 'Done', 'App icon design');
  expect(tags).toEqual(expect.arrayContaining(['Design']));
});