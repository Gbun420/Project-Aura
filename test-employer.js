import puppeteer from 'puppeteer';

(async () => {
  console.log('>>> CREATING DEFINITIVE EMPLOYER...');
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  try {
    const email = `real_emp_${Date.now()}@nova.mt`;
    const pass = 'Password123!';

    await page.goto('https://talentvault-446214.web.app/register', { waitUntil: 'networkidle2' });
    
    // Accept cookies
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('ACCEPT'));
      if (b) b.click();
    });

    console.log('Selecting Employer Role...');
    // Use click by class/index or text
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const emp = buttons.find(b => b.innerText.trim() === 'EMPLOYER');
      if (emp) emp.click();
    });

    await page.waitForSelector('input[placeholder="Division / Entity Name"]', { timeout: 5000 });
    
    await page.type('input[placeholder="operator@nova.mt"]', email);
    await page.type('input[type="password"]', pass);
    await page.type('input[placeholder="Division / Entity Name"]', 'Verified Employer Corp');

    console.log('Submitting...');
    await page.click('button[type="submit"]');
    await page.waitForFunction(() => document.body.innerText.includes('Check your email'), { timeout: 10000 });
    console.log('Registered as Employer.');

    // LOGIN
    await page.goto('https://talentvault-446214.web.app/login', { waitUntil: 'networkidle2' });
    await page.type('input[placeholder="operator@nova.mt"]', email);
    await page.type('input[type="password"]', pass);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    console.log('Landed on:', page.url());
    
    // Check Sidebar
    await new Promise(r => setTimeout(r, 5000));
    const sidebar = await page.evaluate(() => document.querySelector('aside')?.innerText);
    console.log('Sidebar:', sidebar?.slice(0, 100));

    if (sidebar?.includes('EMPLOYER PORTAL')) {
      console.log('✅ VERIFIED: Logged in as EMPLOYER.');
      
      // Navigate to Jobs
      await page.goto('https://talentvault-446214.web.app/portal/employer/jobs', { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 3000));
      
      const btn = await page.evaluate(() => {
        const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.includes('Deploy_Requirement'));
        if (b) {
          b.click();
          return true;
        }
        return false;
      });
      console.log('Deploy button clicked:', btn);

      if (btn) {
        await page.waitForSelector('#job-title-input', { timeout: 5000 });
        await page.type('#job-title-input', 'Employer Verification Job');
        await page.type('#job-description-input', 'Testing from a verified employer account.');
        await page.click('#gdpr-checkbox');
        await page.click('#reg-ack-checkbox');
        await page.click('#publish-vacancy-button');
        
        await new Promise(r => setTimeout(r, 8000));
        const res = await page.evaluate(() => document.body.innerText.includes('published') ? 'SUCCESS' : 'FAILED');
        console.log('Job Result:', res);
      }
    } else {
      console.log('❌ Still logged in as Candidate. Toggle failed.');
    }

    await page.screenshot({ path: 'audit-verified-employer.png' });

  } catch (err) {
    console.log('ERROR:', err.message);
  } finally {
    await browser.close();
  }
})();
