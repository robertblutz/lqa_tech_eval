import { expect, test } from '@playwright/test';
import { login } from './support/auth';

test('marketing campaign email campaign card does not have medium priority tag', async ({ page }) => {
  const projectBoardPage = await login(page);

  await projectBoardPage.expectCardPresent('Marketing Campaign', 'In Progress', 'Email campaign');

  const tags = await projectBoardPage.getCardTags('Marketing Campaign', 'In Progress', 'Email campaign');
  expect(tags).toContain('Design');
  expect(tags).not.toContain('Medium Priority');
});