import puppeteer from 'puppeteer';

(async () => {
  console.log('>>> TESTING LOGIN & JOB POSTING (MODAL)...');
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log(`[BROWSER]: ${msg.text()}`));
  page.on('pageerror', err => console.log(`[BROWSER_ERROR]: ${err.message}`));

  try {
    const email = 'debug_1774044753887@nova.mt';
    const pass = 'Password123!';

    await page.goto('https://talentvault-446214.web.app/login', { waitUntil: 'networkidle2' });
    
    // Cookie Accept
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('ACCEPT'));
      if (b) b.click();
    });

    await page.type('input[placeholder="operator@nova.mt"]', email);
    await page.type('input[type="password"]', pass);
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 });
    console.log('Logged in.');

    await page.goto('https://talentvault-446214.web.app/portal/employer/jobs', { waitUntil: 'networkidle2' });
    console.log('At Jobs Page.');

    // Click "Deploy_Requirement" button to open modal
    console.log('Opening Job Modal...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Deploy_Requirement') || b.innerText.includes('Initialize_First_Vacancy'));
      if (btn) btn.click();
    });

    await page.waitForSelector('#job-title-input', { timeout: 10000 });
    console.log('Form Modal Open.');

    await page.type('#job-title-input', 'Stability Engineer');
    await page.type('#job-description-input', 'Ensuring consistent JSON responses across all neural pathways.');

    await page.click('#gdpr-checkbox');
    await page.click('#reg-ack-checkbox');

    console.log('Clicking Publish...');
    await page.click('#publish-vacancy-button');

    // Result Wait
    const result = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const check = () => {
          const divs = Array.from(document.querySelectorAll('div'));
          const notice = divs.find(d => 
            d.innerText.includes('published') || 
            d.innerText.includes('refresh') || 
            d.innerText.includes('Unable') ||
            d.innerText.includes('is not valid JSON')
          );
          if (notice) resolve(notice.innerText);
          else setTimeout(check, 500);
        };
        check();
        setTimeout(() => resolve('TIMEOUT_NO_NOTICE'), 15000);
      });
    });

    console.log('FINAL_RESULT:', result);
    await page.screenshot({ path: 'audit-publish-success.png' });

  } catch (err) {
    console.log('TEST_CRASH:', err.message);
    await page.screenshot({ path: 'audit-publish-crash.png' });
  } finally {
    await browser.close();
  }
})();
