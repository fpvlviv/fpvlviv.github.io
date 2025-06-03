import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs/promises';

test('Test file gen', async ({ browser }) => {
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/index.html');

  await page.selectOption('#fc', 'SPEEDYBEEF405V3');
  await page.selectOption('#frame', 'carbon_10Mark4V2');
  await page.selectOption('#pid', 'R3115_900_Hq_9_10');
  await page.selectOption('#vtx', 'akk_Ultra_25');
  await page.selectOption('#rcmode', 'B41');
  
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#genprofilebtn')
  ]);  

  const downloadPath = path.resolve(__dirname, '../_test_downloads');
  await fs.mkdir(downloadPath, { recursive: true });

  const filePath = path.join(downloadPath, await download.suggestedFilename());
  await download.saveAs(filePath);

  const content = await fs.readFile(filePath, 'utf8');
  const expectedContent = await fs.readFile(path.resolve(__dirname, '../_reference_data/SPEEDYBEEF405v3_btf443_carbon_10Mark4v2_R3115_900_Hq_9_10_akk_ultimate.txt'), 'utf8');
  
  const expectedLines = expectedContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '')
    .filter(line => !line.startsWith('#'))
    .filter(line => line != 'signature')
    .filter(line => !line.startsWith('aux '))
    .filter(line => !line.startsWith('vtxtable '))
    .filter(line => !line.startsWith('set acc_calibration '))
    .filter(line => !line.startsWith('mcu_id '));

  for (const line of expectedLines) {
    expect(content).toContain(line);
  }
});
