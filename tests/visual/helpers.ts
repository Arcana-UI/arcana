import type { Page } from '@playwright/test';

/**
 * Switch the playground theme by setting the data-theme attribute.
 */
export async function switchTheme(page: Page, theme: string): Promise<void> {
  await page.evaluate((t) => {
    document.documentElement.setAttribute('data-theme', t);
  }, theme);
  // Allow CSS transitions to settle
  await page.waitForTimeout(300);
}

/**
 * Wait for the playground to fully load (fonts, images, etc.)
 */
export async function waitForPlaygroundReady(page: Page): Promise<void> {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);
}
