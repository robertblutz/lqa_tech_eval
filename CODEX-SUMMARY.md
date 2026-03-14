# Codex Summary

## Overview

This repository was set up to run Playwright end-to-end tests in TypeScript against the application configured in `.env`.

The current test suite validates card presence and tags across the project board UI using a reusable page object model and a JSON-driven test dataset.

## Initial Setup

The following baseline Playwright project files were added:

- `package.json`
- `tsconfig.json`
- `playwright.config.ts`
- `.gitignore`

Dependencies installed:

- `@playwright/test`
- `typescript`
- `@types/node`
- `dotenv`

Chromium was installed for Playwright, and local test execution was verified with `npm.cmd test`.

## Environment Handling

Environment values are loaded from `.env` through `tests/support/env.ts`.

Required variables:

- `BASE_URL`
- `USERNAME`
- `PASSWORD`

The env loader uses `dotenv.config({ override: true, quiet: true })` so local `.env` values override conflicting host environment variables such as Windows `USERNAME`.

This same variable naming is used in GitHub Actions so repository secrets can be mapped directly.

## GitHub Actions

A workflow was added at `.github/workflows/playwright.yml`.

It:

- checks out the repository
- installs Node dependencies with `npm ci`
- installs Playwright Chromium with `npx playwright install --with-deps chromium`
- runs the test suite with `npm test`

The workflow expects GitHub repository secrets:

- `BASE_URL`
- `USERNAME`
- `PASSWORD`

## Reusable Login

A reusable login helper was added in `tests/support/auth.ts`.

That helper returns a page object after login succeeds, which keeps specs focused on behavior instead of selector details.

## Page Object Model

A reusable page object was added at `tests/pages/project-board-page.ts`.

It encapsulates:

- navigation to the app
- login
- project selection
- board loaded assertions
- card presence assertions
- card absence assertions
- tag retrieval
- description retrieval
- assignee retrieval
- date retrieval
- logout

The card access methods work by taking:

- `projectName`
- `columnName`
- `cardTitle`

This allows the same lookup logic to be reused across all board sections and columns.

## Test Evolution

The suite originally used individual spec files with repeated logic.

That was refactored into a data-driven structure:

- JSON dataset: `tests/data/card-checks.json`
- parameterized spec: `tests/card-checks.spec.ts`

Each JSON entry can define:

- `name`
- `projectName`
- `columnName`
- `cardTitle`
- `expectedTags` (optional)

The spec uses:

- `expectCardPresent(...)`
- `getCardTags(...)`

to execute all cases from the JSON file.

## Current Coverage

The current suite contains six JSON-driven test cases:

1. Web Application / To Do / Implement User Authentication / tags: Feature, High Priority
2. Web Application / To Do / Fix navigation bug
3. Web Application / In Progress / Design System Updates / tag: Design
4. Mobile Application / To Do / Push notification system / tag: Feature
5. Mobile Application / In Progress / Offline mode / tags: Feature, High Priority
6. Mobile Application / Done / App icon design / tag: Design

## Additional Implemented Support

Negative coverage support was also added to the page object through card absence assertions, although the final active suite is currently focused on the six requested positive checks.

## Verification

The final data-driven suite was run successfully with:

```powershell
npm.cmd test
```

At the end of this work, the suite passed with 6 tests green.
