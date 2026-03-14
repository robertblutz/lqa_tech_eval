import { expect, test } from '@playwright/test';
import cardChecks from './data/card-checks.json';
import { login } from './support/auth';

type CardCheck = {
  name: string;
  projectName: string;
  columnName: string;
  cardTitle: string;
  expectedTags?: string[];
};

for (const cardCheck of cardChecks as CardCheck[]) {
  test(cardCheck.name, async ({ page }) => {
    const projectBoardPage = await login(page);

    await projectBoardPage.expectCardPresent(cardCheck.projectName, cardCheck.columnName, cardCheck.cardTitle);

    if (cardCheck.expectedTags && cardCheck.expectedTags.length > 0) {
      const tags = await projectBoardPage.getCardTags(cardCheck.projectName, cardCheck.columnName, cardCheck.cardTitle);
      expect(tags).toEqual(expect.arrayContaining(cardCheck.expectedTags));
    }
  });
}