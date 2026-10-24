import { expect, test } from '@playwright/test';

test('supply chain workspace renders working capital and financing options', async ({ page }) => {
  await page.goto('/supply-chain');

  await expect(page.getByRole('heading', { name: 'Cash clarity. Supply resilience.' })).toBeVisible();
  await expect(page.getByText('Cash conversion cycle')).toBeVisible();
  await expect(page.getByText(/47\s*days/)).toBeVisible();

  await page.getByRole('button', { name: /Financing options/ }).click();
  await expect(page.getByRole('heading', { name: 'Compare mechanisms before selecting one' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Reverse factoring' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Dynamic discounting' })).toBeVisible();
});

test('invoice checklist remains local and tracks marked checks', async ({ page }) => {
  await page.goto('/supply-chain');

  await page.getByRole('button', { name: /Invoice controls/ }).click();
  await expect(page.getByRole('heading', { name: 'Confirm before approval' })).toBeVisible();
  await expect(page.getByText('0/5', { exact: true })).toBeVisible();

  await page.getByRole('checkbox', { name: /Purchase order and agreed terms match/ }).check();
  await expect(page.getByText('1/5', { exact: true })).toBeVisible();
  await expect(page.getByText(/does not approve an invoice or update a finance system/)).toBeVisible();
});
