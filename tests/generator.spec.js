import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs/promises';

test('Test file gen', async ({ browser }) => {
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/index.html');

  // Trigger the file download in your app
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#genprofilebtn') // Replace with your actual trigger
  ]);

  const downloadPath = path.resolve(__dirname, '../_test_downloads');
  await fs.mkdir(downloadPath, { recursive: true });

  const filePath = path.join(downloadPath, await download.suggestedFilename());
  await download.saveAs(filePath);

  const content = await fs.readFile(filePath, 'utf8');
  expect(content).toContain('a = b ');
});
