const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    try {
        await page.goto('http://localhost:5173/login');

        await page.type('input[type="text"]', 'admin');
        await page.type('input[type="password"]', 'password123');

        await Promise.all([
            page.waitForNavigation(),
            page.click('button') // Assuming the sign in button is a button element
        ]);

        console.log('Logged in. Current URL:', page.url());

        // Wait for a bit to let the dashboard render (or fail)
        await new Promise(r => setTimeout(r, 5000));

        const content = await page.content();
        console.log('Page Content Length:', content.length);

    } catch (error) {
        console.error('Script Error:', error);
    } finally {
        await browser.close();
    }
})();
