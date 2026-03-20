import puppeteer from 'puppeteer';

(async () => {
  console.log('>>> TRACING JOBS PAGE BUTTONS...');
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  try {
    const email = 'debug_1774044753887@nova.mt';
    const pass = 'Password123!';

    await page.goto('https://talentvault-446214.web.app/login', { waitUntil: 'networkidle2' });
    await page.type('input[placeholder="operator@nova.mt"]', email);
    await page.type('input[type="password"]', pass);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    await page.goto('https://talentvault-446214.web.app/portal/employer/jobs', { waitUntil: 'networkidle2' });
    
    // Wait for the sync spinner to disappear if it's there
    await new Promise(r => setTimeout(r, 5000));

    const info = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText);
      const body = document.body.innerText;
      return { buttons, body: body.slice(0, 500) };
    });

    console.log('Buttons found:', info.buttons);
    console.log('Body start:', info.body);

    await page.screenshot({ path: 'audit-trace-jobs.png' });

  } catch (err) {
    console.log('TRACE_CRASH:', err.message);
  } finally {
    await browser.close();
  }
})();
