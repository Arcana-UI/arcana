import { expect, test } from '@playwright/test';
import { switchTheme, waitForPlaygroundReady } from './helpers';

test.describe('Playground — Default (Light) Theme', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPlaygroundReady(page);
  });

  test('default view', async ({ page }) => {
    await expect(page).toHaveScreenshot('playground-light-default.png');
  });
});

test.describe('Playground — Dark Theme', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPlaygroundReady(page);
    await switchTheme(page, 'dark');
  });

  test('dark theme view', async ({ page }) => {
    await expect(page).toHaveScreenshot('playground-dark-default.png');
  });
});

test.describe('Playground — Button Section', () => {
  test.beforeEach(async ({ page }) => {
    await waitForPlaygroundReady(page);
  });

  test('buttons in light theme', async ({ page }) => {
    // Scroll to the buttons section
    const buttons = page.locator('text=Buttons').first();
    if (await buttons.isVisible()) {
      await buttons.scrollIntoViewIfNeeded();
    }
    await expect(page).toHaveScreenshot('playground-buttons-light.png');
  });

  test('buttons in dark theme', async ({ page }) => {
    await switchTheme(page, 'dark');
    const buttons = page.locator('text=Buttons').first();
    if (await buttons.isVisible()) {
      await buttons.scrollIntoViewIfNeeded();
    }
    await expect(page).toHaveScreenshot('playground-buttons-dark.png');
  });
});
