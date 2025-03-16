import { test, expect } from '@playwright/test';

test.describe('Authentication flows', () => {
  test.beforeEach(async ({ page }) => {
    // Clear token storage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Navigate to the login page
    await page.goto('/');
  });

  test('Login form should be visible', async ({ page }) => {
    // Wait for the login form to be visible
    const loginButton = page.getByRole('button', { name: /login/i });
    await expect(loginButton).toBeVisible();
  });

  test('Invalid login should show error message', async ({ page }) => {
    // Fill login form with invalid credentials
    await page.getByPlaceholder(/email/i).fill('invalid@example.com');
    await page.getByPlaceholder(/password/i).fill('wrongpassword');

    // Submit the form
    await page.getByRole('button', { name: /login/i }).click();

    // Check for error message
    await expect(
      page.getByText(/invalid credentials|incorrect password/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test('Registration flow should work', async ({ page }) => {
    // Navigate to registration page
    await page.getByRole('link', { name: /register|sign up/i }).click();

    // Verify we're on the registration page
    await expect(
      page.getByRole('heading', { name: /create account|register|sign up/i })
    ).toBeVisible();

    // Fill registration form with test data
    await page
      .getByPlaceholder(/email/i)
      .fill(`test_user_${Date.now()}@example.com`);
    await page.getByPlaceholder(/password/i).fill('TestPassword123!');

    // If there are other fields, fill them appropriately
    const confirmPasswordField = page.getByPlaceholder(/confirm password/i);
    if (await confirmPasswordField.isVisible())
      await confirmPasswordField.fill('TestPassword123!');

    // Submit the form
    await page
      .getByRole('button', { name: /register|sign up|create account/i })
      .click();

    // Check that we're redirected to the main app or success message
    await expect(
      page.getByText(/welcome|account created|success/i)
    ).toBeVisible({ timeout: 10000 });
  });
});
