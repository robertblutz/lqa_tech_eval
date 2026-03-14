import type { Page } from '@playwright/test';
import { ProjectBoardPage } from '../pages/project-board-page';

export async function login(page: Page): Promise<ProjectBoardPage> {
  const projectBoardPage = new ProjectBoardPage(page);
  await projectBoardPage.login();

  return projectBoardPage;
}