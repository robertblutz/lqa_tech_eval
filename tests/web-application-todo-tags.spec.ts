import { expect, test } from '@playwright/test';
import { login } from './support/auth';

test('web application to do item shows feature and high priority tags', async ({ page }) => {
  const projectBoardPage = await login(page);

  await projectBoardPage.expectCardPresent('Web Application', 'To Do', 'Implement User Authentication');

  const tags = await projectBoardPage.getCardTags('Web Application', 'To Do', 'Implement User Authentication');
  expect(tags).toEqual(expect.arrayContaining(['Feature', 'High Priority']));
});