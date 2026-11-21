// AGT Playwright smoke test: launch the chromium add-on's browser,
// load a self-contained page (no network), read its title and a DOM
// element, screenshot it, and print a PASS marker only if every
// value matches. Run through `agt-playwright smoke`.
const { chromium } = require('playwright-core');

(async () => {
  const exe = process.env.AGT_CHROMIUM_BIN;
  if (!exe) {
    console.log('SMOKE-ERROR AGT_CHROMIUM_BIN not set');
    process.exit(2);
  }
  const headed = process.env.AGT_PW_HEADED === '1';
  const shot = process.env.AGT_PW_SHOT || 'pw-smoke.png';
  let browser;
  try {
    browser = await chromium.launch({
      executablePath: exe,
      headless: !headed,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();
    await page.goto('data:text/html,<title>AGT PW Smoke</title><h1 id="x">playwright-on-agt</h1>');
    const title = await page.title();
    const text = await page.textContent('#x');
    await page.screenshot({ path: shot });
    console.log('SMOKE title=' + title + ' text=' + text + ' shot=' + shot);
    if (title !== 'AGT PW Smoke' || text !== 'playwright-on-agt') {
      console.log('SMOKE-FAIL values did not match');
      process.exit(1);
    }
    console.log('SMOKE-PASS');
  } catch (e) {
    console.log('SMOKE-ERROR ' + e.message);
    process.exit(2);
  } finally {
    if (browser) await browser.close();
  }
})();
