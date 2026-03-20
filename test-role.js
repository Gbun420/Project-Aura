import puppeteer from 'puppeteer';

(async () => {
  console.log('>>> TESTING PORTAL ROLE & MODAL...');
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
    await new Promise(r => setTimeout(r, 1000));

    await page.type('input[placeholder="operator@nova.mt"]', email);
    await page.type('input[type="password"]', pass);
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('Landed on:', page.url());

    // Wait for role to sync
    await new Promise(r => setTimeout(r, 5000));

    const roleInfo = await page.evaluate(() => {
      const sidebar = document.querySelector('aside')?.innerText || 'NO_SIDEBAR';
      return { sidebar };
    });
    console.log('Sidebar Text:', roleInfo.sidebar);

    await page.goto('https://talentvault-446214.web.app/portal/employer/jobs', { waitUntil: 'networkidle2' });
    
    // Check if the button exists
    const buttonExists = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Deploy') || b.innerText.includes('Initialize'));
      return !!btn;
    });
    console.log('Post Job Button exists:', buttonExists);

    if (buttonExists) {
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Deploy') || b.innerText.includes('Initialize'));
        if (btn) btn.click();
      });
      await page.waitForSelector('#job-title-input', { timeout: 5000 });
      console.log('Modal opened successfully.');
      
      await page.type('#job-title-input', 'Audit Confirmed');
      await page.type('#job-description-input', 'Everything is working.');
      await page.click('#gdpr-checkbox');
      await page.click('#reg-ack-checkbox');
      await page.click('#publish-vacancy-button');
      
      await new Promise(r => setTimeout(r, 5000));
      const status = await page.evaluate(() => {
        const n = Array.from(document.querySelectorAll('div')).find(d => d.innerText.includes('published'));
        return n ? n.innerText : 'FAILED_TO_PUBLISH';
      });
      console.log('Job Result:', status);
    }

    await page.screenshot({ path: 'audit-final-visual.png' });

  } catch (err) {
    console.log('ERROR:', err.message);
  } finally {
    await browser.close();
  }
})();
