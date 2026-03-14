import { expect, type Locator, type Page } from '@playwright/test';
import { testEnv } from '../support/env';

export class ProjectBoardPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(testEnv.baseUrl);
  }

  async login(): Promise<void> {
    await this.goto();
    await this.page.locator('#username').fill(testEnv.username);
    await this.page.locator('#password').fill(testEnv.password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();

    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Logout' })).toBeVisible();
  }

  async selectProject(projectName: string): Promise<void> {
    await this.projectButton(projectName).click();
    await this.expectSelectedProject(projectName);
  }

  async expectSelectedProject(projectName: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: projectName }).last()).toBeVisible();
  }

  async expectTaskVisible(taskName: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: new RegExp(`^${escapeRegExp(taskName)}$`, 'i') })).toBeVisible();
  }

  async expectCardPresent(projectName: string, columnName: string, cardTitle: string): Promise<void> {
    const card = await this.card(projectName, columnName, cardTitle);
    await expect(card.getByRole('heading', { name: this.exactTitlePattern(cardTitle) })).toBeVisible();
  }

  async getCardTags(projectName: string, columnName: string, cardTitle: string): Promise<string[]> {
    const card = await this.card(projectName, columnName, cardTitle);
    const tagLocator = card.locator('div.flex.flex-wrap.gap-2.mb-3 span');
    const tagCount = await tagLocator.count();
    const tags: string[] = [];

    for (let index = 0; index < tagCount; index += 1) {
      const tagText = (await tagLocator.nth(index).textContent())?.trim();
      if (tagText) {
        tags.push(tagText);
      }
    }

    return tags;
  }

  async getCardDescription(projectName: string, columnName: string, cardTitle: string): Promise<string> {
    const card = await this.card(projectName, columnName, cardTitle);
    const description = (await card.locator('p.text-sm.text-gray-600.mb-3').textContent())?.trim();

    if (!description) {
      throw new Error(`Description not found for card "${cardTitle}" in "${projectName}" / "${columnName}".`);
    }

    return description;
  }

  async getCardAssignee(projectName: string, columnName: string, cardTitle: string): Promise<string> {
    const card = await this.card(projectName, columnName, cardTitle);
    const assignee = (await card.locator('div.flex.items-center.gap-1 span').first().textContent())?.trim();

    if (!assignee) {
      throw new Error(`Assignee not found for card "${cardTitle}" in "${projectName}" / "${columnName}".`);
    }

    return assignee;
  }

  async getCardDate(projectName: string, columnName: string, cardTitle: string): Promise<string> {
    const card = await this.card(projectName, columnName, cardTitle);
    const date = (await card.locator('div.flex.items-center.gap-1 span').nth(1).textContent())?.trim();

    if (!date) {
      throw new Error(`Date not found for card "${cardTitle}" in "${projectName}" / "${columnName}".`);
    }

    return date;
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Logout' }).click();
    await expect(this.page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  }

  private async card(projectName: string, columnName: string, cardTitle: string): Promise<Locator> {
    await this.selectProject(projectName);

    const column = this.columnByHeading(columnName);
    const card = column.locator('div.bg-white').filter({
      has: this.page.getByRole('heading', { name: this.exactTitlePattern(cardTitle) })
    }).first();

    await expect(card).toBeVisible();

    return card;
  }

  private columnByHeading(columnName: string): Locator {
    return this.page.locator('div').filter({
      has: this.page.getByRole('heading', { name: new RegExp(`^${escapeRegExp(columnName)}( \\(|$)`, 'i') })
    }).last();
  }

  private exactTitlePattern(title: string): RegExp {
    return new RegExp(`^${escapeRegExp(title)}$`, 'i');
  }

  private projectButton(projectName: string): Locator {
    return this.page.getByRole('button', { name: new RegExp(projectName, 'i') });
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}