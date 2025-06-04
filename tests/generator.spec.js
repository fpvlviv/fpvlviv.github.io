// Run via npm run test:full

import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs/promises';

test.setTimeout(5 * 60 * 1000);           // 5-minute safety net – change as needed

const downloadDir = path.join(__dirname, '../_test_downloads');

test.beforeAll(async () => {
  try {
    await fs.rm(downloadDir, { recursive: true, force: true }); // clean if exists
    await fs.mkdir(downloadDir, { recursive: true }); // create fresh
  } catch (e) {
    console.error('Error preparing download directory:', e);
  }
});

test.afterAll(async () => {
  try {
    await fs.rm(downloadDir, { recursive: true, force: true }); // clean up
  } catch (e) {
    console.error('Error cleaning up download directory:', e);
  }
});


// test('Test file gen', async ({ browser }) => {
//   const context = await browser.newContext({ acceptDownloads: true });
//   const page = await context.newPage();
//
//   await page.goto('http://localhost:3000/index.html');
//
//   await page.selectOption('#fc', 'SPEEDYBEEF405V3');
//   await page.selectOption('#frame', 'carbon_10Mark4V2');
//   await page.selectOption('#pid', 'R3115_900_Hq_9_10');
//   await page.selectOption('#vtx', 'akk_Ultra_25');
//   await page.selectOption('#rcmode', 'B41');
//
//   const [download] = await Promise.all([
//     page.waitForEvent('download'),
//     page.click('#genprofilebtn')
//   ]);
//
//   const downloadPath = path.resolve(__dirname, '../_test_downloads');
//   await fs.mkdir(downloadPath, { recursive: true });
//
//   const filePath = path.join(downloadPath, await download.suggestedFilename());
//   await download.saveAs(filePath);
//
//   const content = await fs.readFile(filePath, 'utf8');
//   const expectedContent = await fs.readFile(path.resolve(__dirname, '../_reference_data/SPEEDYBEEF405v3_btf443_carbon_10Mark4v2_R3115_900_Hq_9_10_akk_ultimate.txt'), 'utf8');
//
//   const expectedLines = expectedContent
//     .split('\n')
//     .map(line => line.trim())
//     .filter(line => line !== '')
//     .filter(line => !line.startsWith('#'))
//     .filter(line => line != 'signature')
//     .filter(line => !line.startsWith('aux '))
//     .filter(line => !line.startsWith('vtxtable '))
//     .filter(line => !line.startsWith('set acc_calibration '))
//     .filter(line => !line.startsWith('mcu_id '));
//
//   for (const line of expectedLines) {
//     expect(content).toContain(line);
//   }
// });


test('All permutations generate a non-empty file', async ({ browser }) => {
  const downloadsDir = path.resolve(__dirname, '../_test_downloads');
  await fs.mkdir(downloadsDir, { recursive: true });

  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/index.html');
  
  page.on('pageerror', (err) => console.error('Page error:', err));
  page.on('console', (msg) => console.log(`Console [${msg.type()}]: ${msg.text()}`));

  /** grabs option values of a <select> */
  const optionsOf = (id) =>
    page.$$eval(`#${id} option`, (opts) => opts.map((o) => o.value));

  /** selects value and waits until the next <select> has at least 1 option */
  const choose = async (id, value, nextId) => {
    await page.selectOption(`#${id}`, value);
    if (nextId) {
      await page.waitForFunction(
        (nid) => document.querySelectorAll(`#${nid} option`).length > 0,
        nextId
      );
    }
  };

  for (const fc of await optionsOf('fc')) {
    await choose('fc', fc, 'frame');

    for (const frame of await optionsOf('frame')) {
      await choose('frame', frame, 'pid');

      for (const pid of await optionsOf('pid')) {
        await choose('pid', pid, 'vtx');

        for (const vtx of await optionsOf('vtx')) {
          await choose('vtx', vtx, 'rcmode');

          for (const rcmode of await optionsOf('rcmode')) {
            await page.selectOption('#rcmode', rcmode);

            const label = `${fc} / ${frame} / ${pid} / ${vtx} / ${rcmode}`;
            console.log(`▶️  ${label}`);

            // trigger download with a 10-s safety timeout
            let download;
            try {
              [download] = await Promise.all([
                page.waitForEvent('download', { timeout: 1_000 }),
                page.click('#genprofilebtn'),
              ]);
            } catch (e) {
	            try {
	              [download] = await Promise.all([
	                page.waitForEvent('download', { timeout: 10_000 }),
	                page.click('#genprofilebtn'),
	              ]);
	            } catch (e) {
	              throw new Error(`⛔️ No download for: ${label}`);
	            }
            }

            const filePath = path.join(
              downloadsDir,
              await download.suggestedFilename()
            );
            await download.saveAs(filePath);

            const content = await fs.readFile(filePath, 'utf8');
            expect(
              content.trim().length,
              `Generated file is empty for: ${label}`
            ).toBeGreaterThan(0);

            await fs.unlink(filePath);          // clean up
          }
        }
      }
    }
  }
});
