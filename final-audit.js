import puppeteer from 'puppeteer';

(async () => {
  console.log('>>> TESTING LOGIN WITH COOKIE BYPASS...');
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log(`[B]: ${msg.text()}`));

  try {
    const email = 'debug_1774044753887@nova.mt';
    const pass = 'Password123!';

    await page.goto('https://talentvault-446214.web.app/login', { waitUntil: 'networkidle2' });
    
    console.log('Dismissing Cookie Banner...');
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('ACCEPT'));
      if (b) b.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    await page.type('input[placeholder="operator@nova.mt"]', email);
    await page.type('input[type="password"]', pass);
    
    console.log('Clicking login...');
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 });
    console.log('Success! Landed on:', page.url());

    // Test Job Posting
    console.log('Navigating to Jobs...');
    await page.goto('https://talentvault-446214.web.app/portal/employer/jobs', { waitUntil: 'networkidle2' });
    
    // Open Modal
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Deploy') || x.innerText.includes('Initialize'));
      if (b) b.click();
    });

    await page.waitForSelector('#job-title-input');
    await page.type('#job-title-input', 'Final Audit Success');
    await page.type('#job-description-input', 'This vacancy confirms the system is fully functional.');
    
    await page.click('#gdpr-checkbox');
    await page.click('#reg-ack-checkbox');

    console.log('Publishing...');
    await page.click('#publish-vacancy-button');

    await new Promise(r => setTimeout(r, 10000));
    const result = await page.evaluate(() => {
      const notice = Array.from(document.querySelectorAll('div')).find(d => d.innerText.includes('published') || d.innerText.includes('refresh'));
      return notice ? notice.innerText : 'NO_NOTICE';
    });

    console.log('Final Job Status:', result);
    await page.screenshot({ path: 'final-success-audit.png', fullPage: true });

  } catch (err) {
    console.log('FAIL:', err.message);
    await page.screenshot({ path: 'final-fail-audit.png' });
  } finally {
    await browser.close();
  }
})();
