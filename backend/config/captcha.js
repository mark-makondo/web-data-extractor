import Puppeteer from './puppeteer-new';

export const captchaSolver = async (userId, browserId, url, captcha) => {
    try {
        console.log('solver', browserId, url, captcha);
        const page_url = new URL(url);
        const puppeteer = new Puppeteer();
        // const browser = puppeteer.get('browser');
        const browser = await puppeteer.browserLaunch(userId, browserId);
        const browserPages = await browser.pages();
        const page = browserPages.filter((p) => p.url() === page_url.href)[0];
        if (page) {
            await page.bringToFront();

            // await page.evaluate((captcha) => {
            //     const textCaptcha = document.querySelector('body > form > input.t');
            //     textCaptcha.value = captcha;
            // }, captcha);
            const selector = 'body > form > input.t';
            await page.waitForSelector(selector);
            await page.click(selector, { clickCount: 3 });
            await page.type(selector, captcha, { delay: 100 });
            await page.waitForTimeout(500); // put delay

            await Promise.all([
                page.click('body > form > input.b'),
                page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 0 }),
            ]);

            return await page.title();
            // Promise.all([
            //     page.waitForNavigation(), // The promise resolves after navigation has finished
            //     page.click('body > form > input.b'), // Clicking the link will indirectly cause a navigation
            // ])
            //     .then((res) => {
            //         console.log('pageTitle', pageTitle);
            //         return true;
            //     })
            //     .catch((err) => console.log('promise error', err));
        }
    } catch (error) {
        console.log('captchaSolver error => ', error);
        return null;
    }
};
