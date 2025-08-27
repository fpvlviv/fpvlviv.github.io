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

async function verifyProfile(browser, fc, frame, pid, vtx, rcmode, file) {
    const context = await browser.newContext({ acceptDownloads: true });
    const page = await context.newPage();

    await page.goto('http://localhost:3000/index.html');

    await page.selectOption('#fc', fc);
    await page.selectOption('#frame', frame);
    await page.selectOption('#pid', pid);
    await page.selectOption('#vtx', vtx);
    await page.selectOption('#rcmode', rcmode);

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('#genprofilebtn')
    ]);

    const downloadPath = path.resolve(__dirname, '../_test_downloads');
    await fs.mkdir(downloadPath, { recursive: true });

    const filePath = path.join(downloadPath, await download.suggestedFilename());
    await download.saveAs(filePath);

    const content = await fs.readFile(filePath, 'utf8');
    const expectedContent = await fs.readFile(path.resolve(__dirname, '../_reference_data/'+file), 'utf8');

    const expectedLines = expectedContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '')
      .filter(line => !line.startsWith('#'))
      .filter(line => !line.startsWith('set osd_'))
      .filter(line => line != 'signature')
      .filter(line => !line.startsWith('aux '))
      .filter(line => !line.startsWith('serial '))
      .filter(line => !line.startsWith('servo '))
      .filter(line => !line.startsWith('feature '))
      .filter(line => !line.startsWith('vtxtable '))
      .filter(line => !line.startsWith('vtx '))
      .filter(line => !line.startsWith('set acc_calibration '))
      .filter(line => !line.startsWith('mcu_id '));

    for (const line of expectedLines) {
		if (!!line) {
		  expect(content).toContain(line);
	  	}
    }
}

test('Verify YSIDO_OMNIBUSF4SD_carbon_10Mark4V2_BatS3115_900_Hq_9_10.txt', async ({ browser }) => {
  await verifyProfile(browser, 'YSIDO_OMNIBUSF4SD', 'carbon_10Mark4V2', 'BatS3115_900_Hq_9_10', 'akk_Ultra_25', 'Kraken', 'Peklo_Toy_ysido_btf451_carbon_10_mark4_bat3115_900_HQ10_akk_dominator_OMNIBUSF4SD.txt');
});

test('Verify SPEEDYBEEF405V3_carbon_8Mark4V2_BHAvenger2812_900_GF_8.txt', async ({ browser }) => {
  await verifyProfile(browser, 'SPEEDYBEEF405V3', 'carbon_8Mark4V2', 'BHAvenger2812_900_GF_8', 'akk_Ultra_25', 'Kraken', 'Gurkit_sb405v3_btf443_8frame_Avenger2812_900_gemfan8_akk_raice_ranger_LXband_2servo.txt');
});

test('Verify SPEEDYBEEF405V3_carbon_10Mark4V2_BatS3115_900_Hq_9_10.txt', async ({ browser }) => {
  await verifyProfile(browser, 'SPEEDYBEEF405V3', 'carbon_10Mark4V2', 'BatS3115_900_Hq_9_10', 'akk_Ultra_25', 'Kraken', 'Bdzhol_sb405v3_btf450_10frame_carbon_bat3115_900_Hq_9_10_akk_ultimate.txt');
});

test('Verify SPEEDYBEEF405V3_carbon_10Mark4V2_BatS3214_730_GF_1070.txt', async ({ browser }) => {
  await verifyProfile(browser, 'SPEEDYBEEF405V3', 'carbon_10Mark4V2', 'BatS3214_730_GF_1070', 'akk_Ultra_25', 'Kraken', 'Peklo_Toy_sb405v3_btf451_carbon_10_mark4v2_bat3214_730_HQ10_rushfpv33_6s3p.txt');
});

test('Verify SPEEDYBEEF405V3_carbon_10Mark4V2_hp3115_640_Hq_9_10.txt', async ({ browser }) => {
  await verifyProfile(browser, 'SPEEDYBEEF405V3', 'carbon_10Mark4V2', 'hp3115_640_Hq_9_10', 'akk_Ultra_25', 'Kraken', 'Bimber41_sb405v3_btf443_10frame_carbon_3115_640_Hq10_akk_ultimate_2servo.txt');
});

test('Verify SPEEDYBEEF405V3_carbon_10Mark4V2_KN3214_730_GF_1070.txt', async ({ browser }) => {
  await verifyProfile(browser, 'SPEEDYBEEF405V3', 'carbon_10Mark4V2', 'KN3214_730_GF_1070', 'rushfpv_maxsolo', 'Kraken', 'Peklo_Toy_sb405v3_btf451_carbon_10_mark4v2_KN3214_730_gemfan_1070_maxrushsolo_6s3p.txt');
});

test('Verify SPEEDYBEEF405V3_carbon_10Mark4V2_R3115_900_Hq_9_10.txt', async ({ browser }) => {
  await verifyProfile(browser, 'SPEEDYBEEF405V3', 'carbon_10Mark4V2', 'R3115_900_Hq_9_10', 'akk_Ultra_25', 'Kraken', 'Bdzhol_sb405v3_btf443_10frame_carbon_R3115_900_Hq_9_10_akk_ultimate.txt');
});

//

test('Verify SPEEDYBEEF405V3_carbon_10Mark4V2_xing2814_880_Hq_9_10.txt', async ({ browser }) => {
  await verifyProfile(browser, 'SPEEDYBEEF405V3', 'carbon_10Mark4V2', 'xing2814_880_Hq_9_10', 'rushfpv_maxsolo', 'Kraken', 'Peklo_Toy_sb405v3_btf451_carbon_10_mark4v2_xing2814_880_dialprop_9046_rashsolo_6s3p.txt');
});

test('Verify SPEEDYBEEF405V3_carbon_10Mark4V2_xing2814_1100_Hq_9_10.txt', async ({ browser }) => {
  await verifyProfile(browser, 'SPEEDYBEEF405V3', 'carbon_10Mark4V2', 'xing2814_1100_Hq_9_10', 'akk_dominator', 'Kraken', 'Bimber41_sb405v3_btf443_10frame_xing2814_1100_Hq9_10_akk_dominator_2servo.txt');
});

test('Verify SPEEDYBEEF405V3_carbon_10Mark4V2_xing3110_900_GF_9_10.txt', async ({ browser }) => {
  await verifyProfile(browser, 'SPEEDYBEEF405V3', 'carbon_10Mark4V2', 'xing3110_900_GF_9_10', 'Foxeer_Reaper_Extreme_3W_72Ch', 'Kraken', 'Peklo_Toy_sb405v3_btf451_carbon_10_mark4v2_xing3110_900_gemfan_1050_foxeer_reapeter_extreme_6s3p.txt');
});

test('Verify SPEEDYBEEF405V3_carbon_10Xframe_BatS3115_900_Hq_9.txt', async ({ browser }) => {
  await verifyProfile(browser, 'SPEEDYBEEF405V3', 'carbon_10Xframe', 'BatS3115_900_Hq_9', 'akk_Ultra_25', 'Kraken', 'Bdzhol_sb405v3_btf450_10_X_frame_carbon_bat3115_900_Hq_9_akk_ultimate_6s2p.txt');
});

test('Verify SPEEDYBEEF405V3_fiberglass_10Mark4V2_BatS3110_800_Hq_9_10.txt', async ({ browser }) => {
  await verifyProfile(browser, 'SPEEDYBEEF405V3', 'fiberglass_10Mark4V2', 'BatS3110_800_Hq_9_10', 'akk_dominator', 'Kraken', 'La_Bdzhola_sb405v3_btf443_10frame_tekstolit_bat3110_800_Hq9_10_akk_dominator.txt');
});

test('Verify SPEEDYBEEF405V3_fiberglass_10Mark4V2_BatS3115_900_Hq_9_10.txt', async ({ browser }) => {
  await verifyProfile(browser, 'SPEEDYBEEF405V3', 'fiberglass_10Mark4V2', 'BatS3115_900_Hq_9_10', 'akk_dominator', 'Kraken', 'La_Bdzhola_sb405v3_btf443_10frame_tekstolit_bat3115_900_Hq9_10_akk_dominator.txt');
});

test('Verify SPEEDYBEEF405V3_fiberglass_10Mark4V2_BHAvenger2812_900_Hq_9_10.txt', async ({ browser }) => {
  await verifyProfile(browser, 'SPEEDYBEEF405V3', 'fiberglass_10Mark4V2', 'BHAvenger2812_900_Hq_9_10', 'akk_dominator', 'Kraken', 'La_Bdzhola_sb405v3_btf443_10frame_tekstolit_avenger2812_900_Hq9_10_akk_dominator.txt');
});

test('Verify SPEEDYBEEF405V3_fiberglass_10Mark4V2_Emax2814_730_Hq_9_10.txt', async ({ browser }) => {
  await verifyProfile(browser, 'SPEEDYBEEF405V3', 'fiberglass_10Mark4V2', 'Emax2814_730_Hq_9_10', 'akk_dominator', 'Kraken', 'La_Bdzhola_sb405v3_btf443_10frame_tekstolit_emax2814_730_Hq9_10_akk_dominator.txt');
});

test('Verify SPEEDYBEEF405V4_carbon_10Mark4V2_BatS3214_730_HQ_1070.txt', async ({ browser }) => {
  await verifyProfile(browser, 'SPEEDYBEEF405V4', 'carbon_10Mark4V2', 'BatS3214_730_HQ_1070', 'Foxeer_Reaper_Extreme_3W_72Ch', 'Kraken', 'Peklo_Toy_sb405v4_btf451_carbon_10_mark4v2_bat3214_730_HQ10_rushfpv33_6s3p.txt');
});

test('Verify SPEEDYBEEF405V4_carbon_10Mark4V2_KN3214_730_GF_1070.txt', async ({ browser }) => {
  await verifyProfile(browser, 'SPEEDYBEEF405V4', 'carbon_10Mark4V2', 'KN3214_730_GF_1070', 'rushfpv_3G3_4W', 'Kraken', 'Peklo_Toy_sb405v4_btf451_carbon_10_mark4v2_bat3214_730_HQ10_rushfpv33_6s3p.txt');
});

test('Verify SPEEDYBEEF405V4_carbon_10Mark4V2_R3115_900_HQ_9_10.txt', async ({ browser }) => {
  await verifyProfile(browser, 'SPEEDYBEEF405V4', 'carbon_10Mark4V2', 'R3115_900_Hq_9_10', 'rushfpv_3G3_4W', 'Kraken', 'Peklo_Toy_sb405v4_btf451_carbon_10_mark4v2_R3115_900_HQ10_rushfpv_6s3p.txt');
});

test('Verify HALYCHYNA_V2_carbon_10Mark4V2_R3115_900_Hq_9_10.txt', async ({ browser }) => {
  await verifyProfile(browser, 'HALYCHYNA_V2', 'carbon_10Mark4V2', 'R3115_900_Hq_9_10', 'rushfpv_3G3_4W', 'Kraken', 'Peklo_Toy_galichv2_btf451_carbon_10_mark4v2_R3115_900_HQ10_rushfpv_6s3p.txt');
});

test('Verify MAMBA_F405MK2_carbon_10Mark4V2_BatS3214_730_Hq_9_10.txt', async ({ browser }) => {
  await verifyProfile(browser, 'MAMBA_F405MK2', 'carbon_10Mark4V2', 'BatS3214_730_Hq_9_10', 'rushfpv_3G3_4W', 'Kraken', 'Peklo_Toy_mamba_btf451_carbon_10_mark4v2_R3214_730_HQ10_rushfpv_6s3p.txt');
});

test('Verify SOLOGOODF722_carbon_10Mark4V2_BatS3214_730_Hq_9_10.txt', async ({ browser }) => {
  await verifyProfile(browser, 'SOLOGOODF722', 'carbon_10Mark4V2', 'BatS3214_730_Hq_9_10', 'rushfpv_3G3_4W', 'Kraken', 'Peklo_Toy_sologoodF722_btf452_carbon_10_mark4v2_R3214_730_HQ10_rushfpv_6s3p.txt');
});

test('Verify KARMA405V1_carbon_10Mark4V2_BatS3214_730_Hq_9_10.txt', async ({ browser }) => {
  await verifyProfile(browser, 'KARMA405V1', 'carbon_10Mark4V2', 'BatS3214_730_Hq_9_10', 'rushfpv_3G3_4W', 'Kraken', 'Peklo_Toy_karma_btf451_carbon_10_mark4v2_R3214_730_HQ10_rushfpv_33_6s4p.txt');
});

test('All permutations generate a non-empty file', async ({ browser }) => {
  const downloadsDir = path.resolve(__dirname, '../_test_downloads');
  await fs.mkdir(downloadsDir, { recursive: true });

  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/index.html');
  
  page.on('pageerror', (err) => console.error('Page error:', err));
  page.on('console', (msg) => console.log(`Console [${msg.type()}]: ${msg.text()}`));

  const optionsOf = (id) =>
    page.$$eval(`#${id} option`, (opts) => opts.map((o) => o.value));

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
