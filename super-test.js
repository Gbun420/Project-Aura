import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ 
    headless: "new"
  });
  const page = await browser.newPage();
  
  const results = [];
  const errors = [];

  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error' || text.toLowerCase().includes('error')) {
      errors.push(`[BROWSER_ERROR] ${text}`);
    }
    console.log(`[CONSOLE] [${msg.type()}] ${text}`);
  });

  page.on('pageerror', err => {
    errors.push(`[PAGE_ERROR] ${err.message}`);
    console.error(`[PAGE_ERROR] ${err.message}`);
  });

  page.on('requestfailed', request => {
    errors.push(`[REQUEST_FAILED] ${request.url()} - ${request.failure()?.errorText || 'Unknown Connection Error'}`);
    console.error(`[REQUEST_FAILED] ${request.url()}`);
  });

  const baseUrl = 'http://localhost:5174';
  const urlsToTest = [
    `${baseUrl}/`,
    `${baseUrl}/compliance`,
    `${baseUrl}/login`,
    `${baseUrl}/register`,
    `${baseUrl}/jobs`
  ];

  for (const url of urlsToTest) {
    console.log(`\n--- TESTING URL: ${url} ---`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      const title = await page.title();
      const content = await page.evaluate(() => document.body.innerText.substring(0, 500));
      
      const slug = url.split('/').pop() || 'home';
      await page.screenshot({ path: `screenshot-local-${slug}.png` });
      
      results.push({
        url,
        title,
        status: 'OK',
        snippet: content.replace(/\n/g, ' ').substring(0, 100) + '...'
      });
      
      // Check for common broken UI indicators
      const isNotFound = await page.evaluate(() => 
        document.body.innerText.includes('404') || 
        document.body.innerText.includes('Not Found') ||
        document.title.includes('404')
      );
      
      if (isNotFound) {
        errors.push(`[UI_ERROR] 404 detected at ${url}`);
      }
      
    } catch (err) {
      console.error(`Failed to load ${url}: ${err.message}`);
      errors.push(`[FAILED_LOAD] ${url}: ${err.message}`);
      results.push({ url, status: 'FAILED', error: err.message });
    }
  }

  // Check portal redirect
  console.log('\n--- TESTING PORTAL REDIRECT ---');
  try {
    await page.goto(`${baseUrl}/portal`, { waitUntil: 'networkidle2' });
    const finalUrl = page.url();
    console.log(`Portal redirected to: ${finalUrl}`);
    if (finalUrl.includes('/login')) {
      console.log('Redirect to login confirmed (Protected Route).');
    } else {
      errors.push(`[UNEXPECTED_REDIRECT] Portal did not redirect to login: ${finalUrl}`);
    }
  } catch (err) {
    errors.push(`[PORTAL_ERROR] ${err.message}`);
  }

  console.log('\n--- FINAL TEST SUMMARY ---');
  console.log('Tested URLs:', urlsToTest.length);
  console.log('Successes:', results.filter(r => r.status === 'OK').length);
  console.log('Identified Issues:', errors.length);
  
  const report = {
    testTime: new Date().toISOString(),
    results,
    errors
  };
  
  fs.writeFileSync('super-test-report.json', JSON.stringify(report, null, 2));
  console.log('REPORT_WRITTEN: super-test-report.json');

  await browser.close();
  process.exit(errors.length > 0 ? 1 : 0);
})();
