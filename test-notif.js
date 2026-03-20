import puppeteer from 'puppeteer';

(async () => {
  console.log('>>> TESTING NOTIFICATION LINK...');
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

    console.log('Testing Bell Icon...');
    // The bell icon is now a Link (a tag)
    const bellLink = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('header a'));
      const bell = links.find(l => l.querySelector('svg')?.classList.contains('lucide-bell') || l.getAttribute('aria-label')?.includes('notifications'));
      if (bell) {
        bell.click();
        return true;
      }
      return false;
    });

    console.log('Bell Link clicked:', bellLink);
    await new Promise(r => setTimeout(r, 3000));
    console.log('URL after bell click:', page.url());

    if (page.url().includes('notifications')) {
      console.log('✅ NOTIFICATIONS: Link is functional.');
    } else {
      console.log('❌ NOTIFICATIONS: Link failed.');
    }

    await page.screenshot({ path: 'audit-notif-check.png' });

  } catch (err) {
    console.log('ERROR:', err.message);
  } finally {
    await browser.close();
  }
})();
