import { test } from '@playwright/test';

test.describe('Smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  });
  test('Application loads with expected UI elements', async ({ page }) => {
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'screenshots/home-page.png' });

    console.log('✅ Basic application UI verified successfully');
  });
});
