import puppeteer from 'puppeteer';

(async () => {
  console.log('>>> DEBUGGING REGISTRATION FLOW...');
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log(`[BROWSER]: ${msg.text()}`));
  page.on('pageerror', err => console.log(`[BROWSER_ERROR]: ${err.message}`));

  try {
    await page.goto('https://talentvault-446214.web.app/register', { waitUntil: 'networkidle2' });
    
    // Accept cookies
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('ACCEPT'));
      if (b) b.click();
    });

    // Toggle Employer
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.trim() === 'EMPLOYER');
      if (b) b.click();
    });

    await page.waitForSelector('input[placeholder="Division / Entity Name"]');
    
    await page.type('input[placeholder="operator@nova.mt"]', `debug_${Date.now()}@nova.mt`);
    await page.type('input[type="password"]', 'Password123!');
    await page.type('input[placeholder="Division / Entity Name"]', 'Debug Corp');

    console.log('Clicking Establish Profile...');
    await page.click('button[type="submit"]');

    // Wait and check for ANY change or error message
    await new Promise(r => setTimeout(r, 10000));
    
    const body = await page.evaluate(() => document.body.innerText);
    console.log('--- Final Body State ---');
    console.log(body.slice(0, 1000));
    
    await page.screenshot({ path: 'audit-debug-registration.png' });

  } catch (err) {
    console.log('DEBUG_CRASH:', err.message);
  } finally {
    await browser.close();
  }
})();
