import puppeteer from 'puppeteer';

(async () => {
  console.log('>>> FINAL VERIFICATION SEQUENCE...');
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

    await page.goto('https://talentvault-446214.web.app/portal/employer/jobs', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 3000));

    console.log('Clicking Deploy_Requirement...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.innerText.includes('Deploy_Requirement'));
      if (target) target.click();
    });

    await page.waitForSelector('#job-title-input', { timeout: 10000 });
    console.log('Form Ready.');

    await page.type('#job-title-input', 'Audit Confirmed v2');
    await page.type('#job-description-input', 'This confirms the JSON crash is resolved.');
    await page.click('#gdpr-checkbox');
    await page.click('#reg-ack-checkbox');

    console.log('Publishing...');
    await page.click('#publish-vacancy-button');

    // Wait for the success notice
    await new Promise(r => setTimeout(r, 8000));
    
    const notice = await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll('div'));
      const success = divs.find(d => d.innerText.includes('published'));
      const error = divs.find(d => d.innerText.includes('refresh') || d.innerText.includes('is not valid JSON'));
      return { success: !!success, error: !!error, text: (success || error)?.innerText || 'NONE' };
    });

    console.log('Result:', notice);

    if (notice.success) {
      console.log('✅ SYSTEM VERIFIED: Job Published Successfully.');
    } else if (notice.error) {
      console.log('❌ SYSTEM ERROR: JSON or Cache issue persists.');
    } else {
      console.log('⚠️ UNKNOWN STATE: Check screenshot.');
    }

    await page.screenshot({ path: 'audit-final-proof.png' });

  } catch (err) {
    console.log('ERROR:', err.message);
  } finally {
    await browser.close();
  }
})();
