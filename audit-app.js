import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Capture console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER_ERROR:', msg.text());
    } else {
      console.log('BROWSER_LOG:', msg.text());
    }
  });

  await page.setViewport({ width: 1280, height: 800 });
  
  console.log('--- AURA: STARTING ERROR DIAGNOSTIC ---');
  await page.goto('https://project-aura-one.vercel.app/', { waitUntil: 'networkidle2' });

  // Give it a bit more time to crash and render the error boundary
  await new Promise(r => setTimeout(r, 5000));

  const textContent = await page.evaluate(() => document.body.innerText);
  console.log('FINAL_TEXT_SNIPPET:', textContent.substring(0, 500));

  await browser.close();
  console.log('--- AURA: DIAGNOSTIC COMPLETE ---');
})();
