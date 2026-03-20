import puppeteer from 'puppeteer';

(async () => {
  console.log('>>> PROMOTED USER FINAL TEST...');
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  try {
    const email = 'debug_1774044753887@nova.mt';
    const pass = 'Password123!';

    await page.goto('https://talentvault-446214.web.app/login', { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('ACCEPT'));
      if (b) b.click();
    });
    await page.type('input[placeholder="operator@nova.mt"]', email);
    await page.type('input[type="password"]', pass);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    console.log('Landed on:', page.url());
    await new Promise(r => setTimeout(r, 5000));

    // Navigate to Jobs
    await page.goto('https://talentvault-446214.web.app/portal/employer/jobs', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 3000));

    console.log('Testing Job Modal...');
    const btnClicked = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Deploy_Requirement') || x.innerText.includes('Initialize'));
      if (b) {
        b.click();
        return true;
      }
      return false;
    });
    console.log('Modal Button Clicked:', btnClicked);

    if (btnClicked) {
      await page.waitForSelector('#job-title-input', { timeout: 5000 });
      await page.type('#job-title-input', 'Audit Confirmed Final');
      await page.type('#job-description-input', 'Verified 100% operational.');
      await page.click('#gdpr-checkbox');
      await page.click('#reg-ack-checkbox');
      await page.click('#publish-vacancy-button');
      
      await new Promise(r => setTimeout(r, 10000));
      const res = await page.evaluate(() => document.body.innerText);
      console.log('Result Snippet:', res.slice(0, 1000));
      
      if (res.includes('published')) {
        console.log('✅ SUCCESS: JOB PUBLISHED.');
      } else {
        console.log('❌ FAIL: ISSUE PERSISTS.');
      }
    }

    await page.screenshot({ path: 'audit-perfect-proof.png' });

  } catch (err) {
    console.log('ERROR:', err.message);
  } finally {
    await browser.close();
  }
})();
