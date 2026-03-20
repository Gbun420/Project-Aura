import puppeteer from 'puppeteer';

(async () => {
  console.log('>>> TRACING AUTH REQUESTS...');
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log(`[BROWSER]: ${msg.text()}`));
  page.on('pageerror', err => console.log(`[JS_ERROR]: ${err.message}`));
  
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.url().includes('identitytoolkit') || request.url().includes('firestore')) {
      console.log(`[API_REQ]: ${request.url()}`);
    }
    request.continue();
  });

  try {
    const email = 'debug_1774044753887@nova.mt';
    const pass = 'Password123!';

    await page.goto('https://talentvault-446214.web.app/login', { waitUntil: 'networkidle2' });
    
    // Check if redirect already happened (maybe already logged in?)
    if (page.url().includes('portal')) {
       console.log('Already in portal, clearing session...');
       await page.evaluate(() => localStorage.clear());
       await page.goto('https://talentvault-446214.web.app/login', { waitUntil: 'networkidle2' });
    }

    await page.type('input[placeholder="operator@nova.mt"]', email);
    await page.type('input[type="password"]', pass);
    
    console.log('Clicking Establish Link...');
    await page.click('button[type="submit"]');

    // Wait for changes
    await new Promise(r => setTimeout(r, 10000));
    console.log('URL after 10s:', page.url());
    
    const body = await page.evaluate(() => document.body.innerText);
    console.log('Body snippet:', body.slice(0, 500));

    await page.screenshot({ path: 'audit-trace-auth.png' });

  } catch (err) {
    console.log('CRASH:', err.message);
  } finally {
    await browser.close();
  }
})();
