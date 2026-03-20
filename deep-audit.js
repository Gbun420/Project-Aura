import puppeteer from 'puppeteer';

(async () => {
  console.log('>>> DEEP AUDIT INITIATED...');
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.setDefaultNavigationTimeout(60000);
  
  page.on('console', msg => console.log(`[B]: ${msg.text()}`));
  page.on('requestfailed', request => {
    console.log(`[FAILED_REQ]: ${request.url()} - ${request.failure()?.errorText}`);
  });

  try {
    const email = 'debug_1774044753887@nova.mt';
    const pass = 'Password123!';

    console.log('1. Loading Login...');
    await page.goto('https://talentvault-446214.web.app/login', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'audit-1-login-loaded.png' });

    console.log('2. Authenticating...');
    await page.type('input[placeholder="operator@nova.mt"]', email);
    await page.type('input[type="password"]', pass);
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('3. Logged In. Current URL:', page.url());
    await page.screenshot({ path: 'audit-2-after-login.png' });

    console.log('4. Navigating to Jobs...');
    await page.goto('https://talentvault-446214.web.app/portal/employer/jobs', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'audit-3-jobs-loaded.png' });

    // Wait for content
    await new Promise(r => setTimeout(r, 10000));
    const body = await page.evaluate(() => document.body.innerText);
    console.log('Body State:', body.slice(0, 300));

    console.log('5. Clicking Deploy...');
    const clicked = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Deploy') || b.innerText.includes('Initialize'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    console.log('Clicked Deploy:', clicked);

    if (clicked) {
      await new Promise(r => setTimeout(r, 3000));
      await page.screenshot({ path: 'audit-4-modal-open.png' });
      
      await page.waitForSelector('#job-title-input');
      await page.type('#job-title-input', 'Final Audit Pass');
      await page.type('#job-description-input', 'Deep verification of the 2026 recruitment neural pathways.');
      
      await page.click('#gdpr-checkbox');
      await page.click('#reg-ack-checkbox');
      
      console.log('6. Publishing...');
      await page.click('#publish-vacancy-button');
      
      await new Promise(r => setTimeout(r, 10000));
      const finalNotice = await page.evaluate(() => {
        const divs = Array.from(document.querySelectorAll('div'));
        const n = divs.find(d => d.innerText.includes('published') || d.innerText.includes('Unable') || d.innerText.includes('is not valid JSON'));
        return n ? n.innerText : 'NO_NOTICE';
      });
      console.log('Final Outcome:', finalNotice);
    }

    await page.screenshot({ path: 'audit-5-final.png' });

  } catch (err) {
    console.log('CRITICAL_FAILURE:', err.message);
    await page.screenshot({ path: 'audit-error-deep.png' });
  } finally {
    await browser.close();
    console.log('>>> DEEP AUDIT ENDED.');
  }
})();
