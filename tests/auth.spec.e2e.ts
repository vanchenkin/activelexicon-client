import { test, expect } from '@playwright/test';

test.describe('Authentication flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto('/');
  });

  test('Login form should be visible', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: /login/i });
    await expect(loginButton).toBeVisible();
  });

  test('Invalid login should show error message', async ({ page }) => {
    await page.getByPlaceholder(/email/i).fill('invalid@example.com');
    await page.getByPlaceholder(/password/i).fill('wrongpassword');

    await page.getByRole('button', { name: /login/i }).click();

    await expect(
      page.getByText(/invalid credentials|incorrect password/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test('Registration flow should work', async ({ page }) => {
    await page.getByRole('link', { name: /register|sign up/i }).click();

    await expect(
      page.getByRole('heading', { name: /create account|register|sign up/i })
    ).toBeVisible();

    await page
      .getByPlaceholder(/email/i)
      .fill(`test_user_${Date.now()}@example.com`);
    await page.getByPlaceholder(/password/i).fill('TestPassword123!');

    const confirmPasswordField = page.getByPlaceholder(/confirm password/i);
    if (await confirmPasswordField.isVisible())
      await confirmPasswordField.fill('TestPassword123!');

    await page
      .getByRole('button', { name: /register|sign up|create account/i })
      .click();

    await expect(
      page.getByText(/welcome|account created|success/i)
    ).toBeVisible({ timeout: 10000 });
  });
});
