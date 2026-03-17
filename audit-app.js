import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log('BROWSER_LOG:', msg.text());
  });

  await page.setViewport({ width: 1280, height: 1000 });
  
  console.log('--- AURA: TESTING LOGIN HANG ---');
  await page.goto('https://project-aura-one.vercel.app/login', { waitUntil: 'networkidle2' });

  // Try logging in with random credentials
  await page.type('input[type="email"]', 'test-random-123@aura-jobs.com');
  await page.type('input[type="password"]', 'WrongPass123!');
  
  console.log('Clicking Authenticate...');
  await page.click('button[type="submit"]');

  // Wait to see if it hangs or shows error
  await new Promise(r => setTimeout(r, 5000));

  const text = await page.evaluate(() => document.body.innerText);
  const btnText = await page.evaluate(() => document.querySelector('button[type="submit"]').innerText);
  
  console.log('BUTTON_TEXT_AFTER_5S:', btnText);
  console.log('CONTAINS_ERROR_MSG:', text.includes('Invalid login credentials') || text.includes('error'));

  await page.screenshot({ path: 'login-test-result.png' });
  console.log('SCREENSHOT_CREATED: login-test-result.png');

  await browser.close();
  console.log('--- AURA: LOGIN TEST COMPLETE ---');
})();
