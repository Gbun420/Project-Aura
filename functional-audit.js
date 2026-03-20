import puppeteer from 'puppeteer';

(async () => {
  console.log('>>> INITIATING ROBUST PUPPETEER AUDIT...');
  
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    const testEmail = `audit_emp_${Date.now()}@nova.mt`;
    const testPassword = 'Password123!';

    console.log('Step 1: Navigating to Register...');
    await page.goto('https://talentvault-446214.web.app/register', { waitUntil: 'networkidle2' });

    // Handle Cookie Consent if present
    console.log('Accepting cookies...');
    try {
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const acceptBtn = buttons.find(b => b.innerText.includes('ACCEPT SECURE MODE') || b.innerText.includes('Accept'));
        if (acceptBtn) acceptBtn.click();
      });
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.log('Cookie banner not found or already dismissed.');
    }

    console.log('Toggling to Employer...');
    // Reliable click on Employer button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const empBtn = buttons.find(b => b.innerText.trim() === 'EMPLOYER');
      if (empBtn) {
        empBtn.click();
      } else {
        console.log('Employer button not found by text');
      }
    });

    console.log('Waiting for Company input...');
    await page.waitForSelector('input[placeholder="Division / Entity Name"]', { timeout: 10000 });
    
    console.log('Filling Registration form...');
    await page.type('input[placeholder="operator@nova.mt"]', testEmail);
    await page.type('input[type="password"]', testPassword);
    await page.type('input[placeholder="Division / Entity Name"]', 'Stability Corp');

    await page.screenshot({ path: 'audit-step-1-filled.png' });
    
    console.log('Submitting...');
    await page.click('button[type="submit"]');
    
    await page.waitForFunction(() => document.body.innerText.includes('Check your email'), { timeout: 15000 });
    console.log('✅ Registration: SUCCESS');

    // --- LOGIN ---
    console.log('Step 2: Navigating to Login...');
    await page.goto('https://talentvault-446214.web.app/login', { waitUntil: 'networkidle2' });
    
    await page.type('input[placeholder="operator@nova.mt"]', testEmail);
    await page.type('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 });
    console.log(`Landed: ${page.url()}`);

    // --- JOB POSTING ---
    console.log('Step 3: Posting Vacancy...');
    await page.goto('https://talentvault-446214.web.app/portal/employer/jobs', { waitUntil: 'networkidle2' });
    
    await page.waitForSelector('#job-title-input');
    await page.type('#job-title-input', 'Audit Specialist 2026');
    await page.type('#job-description-input', 'Testing the core systems for valid JSON responses and PWA stability.');
    
    await page.click('#gdpr-checkbox');
    await page.click('#reg-ack-checkbox');

    console.log('Clicking Publish...');
    await page.click('#publish-vacancy-button');

    // Wait for either success or error notice
    const result = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const check = () => {
          const divs = Array.from(document.querySelectorAll('div'));
          const notice = divs.find(d => 
            d.innerText.includes('published') || 
            d.innerText.includes('refresh') || 
            d.innerText.includes('Unable to publish')
          );
          if (notice) resolve(notice.innerText);
          else setTimeout(check, 500);
        };
        check();
        setTimeout(() => resolve('TIMEOUT_NO_NOTICE'), 15000);
      });
    });

    console.log(`Publish Result: ${result}`);
    if (result.toString().includes('published')) {
      console.log('✅ Publish: SUCCESS');
    } else {
      console.log(`❌ Publish: FAIL - ${result}`);
    }

    await page.screenshot({ path: 'functional-audit-final.png', fullPage: true });
    console.log('Audit Summary saved: functional-audit-final.png');

  } catch (err) {
    console.error('AUDIT_CRASHED:', err.message);
    await page.screenshot({ path: 'audit-crash-report.png' });
  } finally {
    await browser.close();
    console.log('>>> AUDIT COMPLETE.');
  }
})();
