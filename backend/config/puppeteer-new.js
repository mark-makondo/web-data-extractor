import path from 'path';
const __dirname = path.resolve();
const commonPath = `${__dirname}/files`;
import excel from 'excel4node';
import { nanoid } from 'nanoid';
// import puppeteer from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import pluginStealth from 'puppeteer-extra-plugin-stealth';
import adblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import anonymizeUserAgent from 'puppeteer-extra-plugin-anonymize-ua';
import pluginBlockResources from 'puppeteer-extra-plugin-block-resources';
import { writeFile, readFile, socketWatcher } from './utils.js';
import { findWatcher } from 'app/http/controllers/CurrentUsersController.js';

puppeteer.use(pluginStealth());
puppeteer.use(anonymizeUserAgent());
puppeteer.use(adblockerPlugin()); //cannot use adblocker and block resources at the same time
const blockResourcesPlugin = pluginBlockResources();
// puppeteer.use(blockResourcesPlugin);

const TIMEOUT = 120;

class Puppeteer {
    #currentUser = null;
    #requestInterception = false;
    #defaultTimeout = TIMEOUT; //2 mins

    constructor() {
        //if already created instance - dont created again instead call previous instance #for singleton
        if (Puppeteer.instance instanceof Puppeteer) {
            return Puppeteer.instance;
        }

        //added singleton
        this.puppeteerObject = {
            browser: null,
            page: null,
            pages: [],
            browsers: [],
            users: [],
        };
        // Object.freeze(this.puppeteerObject);
        Object.freeze(this); //cant modified the instance that created #for singleton
        Puppeteer.instance = this; //global - key #for singleton
    }

    get(key) {
        return this.puppeteerObject[key];
    }

    set(key, value) {
        this.puppeteerObject[key] = value;
    }

    browserDisconnectListener = async (browser) => {
        const browserId = parseInt(await this.getBrowserId(browser));
        browser.on('disconnected', () => {
            this.puppeteerObject.browsers = this.puppeteerObject.browsers.filter((b) => b.browserId !== browserId);
            console.log(`browser ${browserId} disconnected`);
        });
    };

    async closeUserBrowsers(userId) {
        try {
            const browsers = this.get('browsers');
            const userBrowsers = browsers.filter((b) => b.userId === userId);
            for (let userBrowser of userBrowsers) {
                console.log(`Browser Proccess Id[${userBrowser.browserId}] disconnected.`);
                await this.browserClose(userBrowser.browser);
            }
        } catch (error) {
            console.log('close user browsers error', error);
        }
    }

    async setPageCookie(page, fileName) {
        const myCookies = readFile(fileName);
        if (myCookies) {
            await page.setCookie(...myCookies);
            return true;
        }
        return false;
    }

    async createPageCookie(page) {
        const { hostname } = new URL(page.url());
        console.log('new cookie created.');
        const cookies = await page.cookies();
        writeFile(hostname, JSON.stringify(cookies));
    }

    blockPuppeteerResourcesPlugins(setBlock = true, types = []) {
        //? add this before page.goto
        const listOfTypes = [
            'stylesheet',
            'image',
            'media',
            'font',
            'script',
            'texttrack',
            'xhr',
            'fetch',
            'eventsource',
            'websocket',
            'manifest',
            'other',
        ];

        listOfTypes.map((type) => blockResourcesPlugin.blockedTypes.delete(type)); //delete all first

        if (setBlock) {
            console.log('add blocks');
            if (!types.length) {
                types = listOfTypes;
            }
            types.map((type) => blockResourcesPlugin.blockedTypes.add(type));
        } else {
            console.log('remove blocks');
            if (!types.length) {
                types = listOfTypes;
            }
            types.map((type) => blockResourcesPlugin.blockedTypes.delete(type));
        }
    }

    async waitUntilPageTimeout(pageTimeout, page) {
        try {
            //promises to be added in Promise.race
            const pageNavigation = page.waitForNavigation({ timeout: 0 });
            const pageNavigationTimeout = new Promise((resolve) => {
                if (!findWatcher()) {
                    this.#defaultTimeout = 1;
                    console.log('no watcher: captcha timeout 1s');
                    resolve(null);
                } else {
                    this.#defaultTimeout = 120;
                    console.log('watcher found: captcha timeout 2mins');
                    setTimeout(() => {
                        resolve(null);
                    }, pageTimeout);
                }
            });
            const result = await Promise.race([pageNavigationTimeout, pageNavigation]);
            if (!result) {
                await this.pageClose(page);
                page = null;
            }
            return page;
        } catch (error) {
            console.log('waitUntilPageTimeout error', error);
            return null;
        }
    }

    async hasPageCaptcha(page, browser, indexPage) {
        try {
            //?second attempt
            let pageTitle = await page.title();
            const browserId = await browser.process().pid;

            if (!browser) {
                console.log('has captcha no browser found');
                return null;
            }

            while (pageTitle === 'Are you human?') {
                console.log('captcha found on yell');

                // this.#defaultTimeout = 10; //set to default 2 mins

                //? save image to directory

                if (indexPage === 0) {
                    const page_url = new URL(await page.url());
                    const captchaImgSrc = await page.evaluate(() =>
                        document.querySelector('body > form > img').getAttribute('src')
                    );

                    socketWatcher.io.emit('captcha', {
                        browserId: browserId,
                        key: nanoid(),
                        imgSrc: captchaImgSrc,
                        origin: page_url.href,
                        date: Date.now(),
                        timeout: this.#defaultTimeout,
                        status: 'Waiting for someone to solve.',
                        inUse: false,
                    });
                }

                page = await this.waitUntilPageTimeout(this.#defaultTimeout * 1000, page);

                let newPageTitle = '';
                if (page) {
                    await page.waitForTimeout(500);
                    newPageTitle = await page.title();
                    if (pageTitle !== newPageTitle) {
                        console.log('Captcha verified!');

                        this.#defaultTimeout = TIMEOUT; //set to default 2 mins

                        page.on('close', async () => {
                            const browserPages = await browser.pages();
                            if (browserPages) {
                                for (let p of browserPages) {
                                    if (p) await this.pageReload(p);
                                }
                            }
                        });
                    }
                }
                pageTitle = newPageTitle;
            }

            return page;
        } catch (error) {
            page = null;
            console.log('Check captcha error: ', error);
        }
    }

    async pageReload(page) {
        try {
            await page.reload({
                waitUntil: 'domcontentloaded',
            });
        } catch (error) {
            console.log('page reload error', error);
        }
    }

    async getBrowserId(browser) {
        try {
            return await browser.process().pid;
        } catch (error) {
            console.log('get browser id error', error);
        }
    }

    async browserLaunch(userId, browserId = null) {
        try {
            let browser = null;
            let currentBrowser = this.puppeteerObject.browsers.filter((b) => b.browserId == browserId)[0];

            if (currentBrowser) {
                browser = currentBrowser.browser;
            } else {
                const browserOptions = {
                    // headless: false,
                    // headless: true,
                    // devtools: true,
                    ignoreHTTPSErrors: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-infobars',
                        '--single-process',
                        '--no-zygote',
                        '--no-first-run',
                        '--window-size= 1280, 800',
                        '--window-position=0,0',
                        '--ignore-certificate-errors',
                        '--ignore-certificate-errors-skip-list',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--disable-gpu',
                        '--hide-scrollbars',
                        '--disable-notifications',
                        '--disable-background-timer-throttling',
                        '--disable-backgrounding-occluded-windows',
                        '--disable-breakpad',
                        '--disable-component-extensions-with-background-pages',
                        '--disable-extensions',
                        '--disable-features=TranslateUI,BlinkGenPropertyTrees',
                        '--disable-ipc-flooding-protection',
                        '--disable-renderer-backgrounding',
                        '--enable-features=NetworkService,NetworkServiceInProcess',
                        '--force-color-profile=srgb',
                        '--metrics-recording-only',
                        '--mute-audio',
                    ],
                };
                browser = await puppeteer.launch(browserOptions);
                browserId = await this.getBrowserId(browser);
                console.log('browser created with proccess id', browserId);
                this.puppeteerObject.browsers.push({ userId: userId, browserId: browserId, browser: browser });
                this.#defaultTimeout = TIMEOUT;
                await this.browserDisconnectListener(browser);
            }

            return browser;
        } catch (error) {
            console.log('Browser launch error: ', error);
        }
    }

    async waitForPageGoto(pageGotoTimeout, page, url, waitUntilOption = ['domcontentloaded']) {
        try {
            const pageGoto = page.goto(url, { waitUntil: waitUntilOption, timeout: 0 });
            const pageGotoTimeOut = new Promise((resolve) => {
                setTimeout(() => {
                    resolve(null);
                }, pageGotoTimeout);
            });
            const result = await Promise.race([pageGoto, pageGotoTimeOut]);
            if (!result) {
                await this.pageClose(page);
                page = null;
            }
            return page;
        } catch (error) {
            console.log('waitForPageGoto error', error);
            return null;
        }
    }

    async newPage(browser, url, enableScroll = false, crawler = false, index = 0) {
        let currentPage = null;
        try {
            const page_url = new URL(url);
            if (!browser) {
                return null;
            }

            const browserPages = await browser.pages();
            currentPage = browserPages.filter((p) => p.url() === page_url.href)[0];

            if (!currentPage) {
                currentPage = await browser.newPage();

                await currentPage.setJavaScriptEnabled(true);

                //await currentPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });
                //30 seconds timeout
                const pageTogo = await this.waitForPageGoto(30000, currentPage, url);
                if (!pageTogo) {
                    console.log('goto page timeout');
                    return null;
                }

                if (enableScroll) await this.scrollToBottom(currentPage);

                this.puppeteerObject.page = currentPage;
                this.puppeteerObject.pages.push({ page: currentPage, url: url });
            } else {
                currentPage.bringToFront();
                this.puppeteerObject.page = currentPage;
            }

            //? check captcha return empty array
            currentPage = await this.hasPageCaptcha(currentPage, browser, index);
            return currentPage;
        } catch (error) {
            console.log('New page launch error: ', error);
        }
    }

    async browserClose(browser, isProxy = false) {
        try {
            if (!isProxy) {
                this.set('browser', null);
            }
            if (browser) {
                await browser.close();
            }
        } catch (error) {
            console.log('browser close', error);
        }
    }

    async pageClose(page, isProxy = false) {
        try {
            if (!isProxy) {
                const pages = this.puppeteerObject.pages.filter((p) => p.url !== page.url());
                this.set('pages', pages);
            }
            await page.close();
        } catch (error) {
            console.log('page close', error);
        }
    }

    async getPageContent(page, url) {
        try {
            const _url = new URL(url);
            const base_url = _url.origin;
            const content = await page.content();
            const regexSrc = new RegExp('src="(?!http)(?!//)', 'g');
            const regexSrcSet = new RegExp('srcset="(?!http)(?!//)', 'g');
            const regexHref = new RegExp('href="(?!http)(?!//)', 'g');
            const fixedAllSrc = content.replaceAll(regexSrc, ` src="${base_url}`);
            const fixedAllSrcSet = fixedAllSrc.replaceAll(regexSrcSet, ` srcset="${base_url}`);
            const finalFixedContent = fixedAllSrcSet.replaceAll(regexHref, ` href="${base_url}`);
            return finalFixedContent;
        } catch (error) {
            console.log('Get Page Content: ', error);
        }
    }

    async getScrapeValues(page, url, selectors, resultNeeded) {
        try {
            const urlObj = new URL(url);
            const { origin: baseUrl } = urlObj;
            //query select document and return page object [keyword - evaluateHandle]
            const resultHandle = await page.evaluateHandle(
                (selectors) => document.querySelectorAll(selectors),
                selectors
            );

            //evalute the page using the handler
            const result = await page.evaluate(
                (elements, resultNeeded, baseUrl) =>
                    Array.from(elements).map((element) => {
                        switch (resultNeeded) {
                            case 'href':
                                return element?.href.startsWith('http') ? element?.href : `${baseUrl}${element?.href}`;
                            case 'img':
                                return element?.src.startsWith('http') ? element?.src : `${baseUrl}${element?.src}`;
                            default:
                                return element?.innerText;
                        }
                    }),
                resultHandle,
                resultNeeded,
                baseUrl
            );
            return result;
        } catch (error) {
            console.log('get scrape values error', error);
        }
    }

    async getGroupScrapeValues(page, url, groupSelectors, selectors, resultNeeded) {
        try {
            const urlObj = new URL(url);
            const { origin: baseUrl } = urlObj;
            const result = await page.$$eval(
                groupSelectors,
                (elements, selectors, resultNeeded, baseUrl) => {
                    //? get all container/group elements [loop through]
                    let elementValues = [];
                    for (let element of elements) {
                        const elementResult = element.querySelectorAll(selectors); //returns array - query select all current user-selected-element
                        let queryElementValues = [];
                        for (let queryElement of elementResult) {
                            let valueElement = '';
                            switch (resultNeeded) {
                                case 'href':
                                    valueElement = queryElement?.href.startsWith('http')
                                        ? queryElement?.href
                                        : `${baseUrl}${queryElement?.href}`;
                                    queryElementValues.push(valueElement);
                                    break;
                                case 'img':
                                    valueElement = queryElement?.src.startsWith('http')
                                        ? queryElement?.src
                                        : `${baseUrl}${queryElement?.src}`;
                                    queryElementValues.push(valueElement);
                                    break;
                                default:
                                    valueElement = queryElement?.innerText;
                                    queryElementValues.push(valueElement);
                                    break;
                            }
                        }
                        //if queryElementValues length 0=null/empty string, 1=string, 2/more=array
                        const resultValue =
                            queryElementValues.length === 0
                                ? ''
                                : queryElementValues.length === 1
                                ? queryElementValues[0]
                                : queryElementValues;
                        elementValues.push(resultValue);
                    }
                    return elementValues;
                },
                selectors,
                resultNeeded,
                baseUrl
            );
            return result;
        } catch (error) {
            console.log('Get group scrape values error', error);
        }
    }

    async getMultiplePages(page, nextPageSelector, setPage = 0, AsyncCallback) {
        try {
            //while there is a next page button available
            let pageCounter = 1;
            let nextPageAvailable;
            do {
                if (setPage > 0 && pageCounter > setPage) break; //get out on while loop
                console.log('next page...', pageCounter);

                //check captcha
                // await this.hasPageCaptcha(page);

                await AsyncCallback(page, pageCounter);

                nextPageAvailable = await page.$(nextPageSelector);

                if (nextPageAvailable) {
                    await Promise.all([
                        page.waitForSelector(nextPageSelector),
                        page.waitForNavigation({ waitUntil: 'load' }), // The promise resolves after navigation has finished
                        page.click(nextPageSelector), // Clicking the link will indirectly cause a navigation
                    ]);
                }
                pageCounter++;
            } while (nextPageAvailable);
            console.log('done scraping on multi page');
        } catch (error) {
            console.log('Get multiple pages: ', error);
        }
    }

    async searchKeywords(id, keywords) {
        await this.page.type(`.${id}`, keywords);
    }

    async exportData(scrapedData, response) {
        try {
            let workbook, worksheet, header, style;
            workbook = new excel.Workbook();
            worksheet = workbook.addWorksheet('Captured Data');

            header = workbook.createStyle({
                font: {
                    bold: true,
                    color: 'black',
                    size: 20,
                },
                border: {
                    bottom: {
                        style: 'medium',
                        color: '#808080',
                    },
                },
                alignment: {
                    horizontal: 'center',
                    vertical: 'center',
                },
            });

            style = workbook.createStyle({
                font: {
                    color: 'black',
                    size: 12,
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'left',
                    vertical: 'center',
                },
            });

            let column, row, isFromCapturer, isFromHistory, filename, title, isSingle;

            column = 1;

            isFromCapturer = scrapedData.type === 'capturer';
            isFromHistory = scrapedData.type === 'history';
            isSingle = scrapedData.type === 'single';

            if (isFromCapturer) {
                let initialRow = 2;

                scrapedData.saveDoc.map((doc) => {
                    worksheet.cell(1, column).string(doc.subTitle).style(header);
                    doc.data.map((item) => {
                        worksheet
                            .cell(initialRow++, column)
                            .string(!!!item ? '' : item.toString())
                            .style(style);
                    });
                    worksheet.column(column).setWidth(40);
                    column++;
                    initialRow = 2;
                });
                title = scrapedData?.title;

                filename = `${title}.xlsx`;
            } else if (isSingle) {
                let currentTitle, scrapedDataLength, initialRow;

                initialRow = 3;

                currentTitle = scrapedData.capturedData[0].title;
                scrapedDataLength = scrapedData.capturedData[0].savedDoc.length;

                worksheet
                    .cell(1, column, 1, column + scrapedDataLength - 1, true)
                    .string(currentTitle)
                    .style(header);

                scrapedData.capturedData[0].savedDoc.map((doc) => {
                    worksheet.cell(2, column).string(doc.subTitle).style(header);
                    doc.data.map((item) => {
                        worksheet
                            .cell(initialRow++, column)
                            .string(!!!item ? '' : item.toString())
                            .style(style);
                    });
                    worksheet.column(column).setWidth(40);
                    column++;
                    initialRow = 3;
                });

                title = scrapedData.capturedData[0].title;

                filename = `${title}.xlsx`;
            } else {
                scrapedData.capturedData.map((saved) => {
                    let currentTitle, scrapedDataLength, initialRow;

                    initialRow = 3;

                    currentTitle = saved.title;
                    scrapedDataLength = saved.savedDoc.length;

                    worksheet
                        .cell(1, column, 1, column + scrapedDataLength - 1, true)
                        .string(currentTitle)
                        .style(header);

                    saved.savedDoc.map((doc) => {
                        worksheet.cell(2, column).string(doc.subTitle).style(header);

                        doc.data.map((item) => {
                            worksheet
                                .cell(initialRow++, column)
                                .string(!!!item ? '' : item.toString())
                                .style(style);
                        });
                        worksheet.column(column).setWidth(40);
                        column++;
                        initialRow = 3;
                    });
                });

                title = scrapedData.capturedData.length + '-Combined-Data';

                filename = `${title}.xlsx`;
            }

            worksheet.row(1).setHeight(50);
            worksheet.row(1).freeze();
            workbook.write(filename, response);
        } catch (error) {
            console.error(error);
        }
    }

    // auto scroll content till there's nothing left
    async scrollToBottom(page, scrollStep = 100, scrollDelay = 100) {
        await page.evaluate(
            async (scrollStep, scrollDelay) => {
                try {
                    await new Promise((resolve, reject) => {
                        let totalHeight = 0;

                        let timer = setInterval(() => {
                            let scrollHeight = document.scrollingElement.scrollTop + window.innerHeight;

                            window.scrollBy(0, scrollStep);
                            totalHeight += scrollStep;

                            if (totalHeight >= scrollHeight) {
                                clearInterval(timer);
                                resolve();
                            }
                        }, scrollDelay);
                    });
                } catch (error) {
                    console.error(error);
                }
            },
            scrollDelay,
            scrollStep
        );
    }

    async scrollToRandom(page) {
        try {
            await page.evaluate((_) => {
                let scrollTop = window.scrollY;
                let docHeight = document.body.offsetHeight;
                let winHeight = window.innerHeight;
                let bottomHeight = docHeight - winHeight;
                const randomScroll = Math.floor(Math.random() * bottomHeight) + 0;
                window.scrollTo(0, randomScroll);
            });
        } catch (error) {
            console.log('Scroll to error');
        }
    }

    async searchInPage(page, selectors, searchValues) {
        try {
            for (let [index, selector] of selectors.entries()) {
                await page.click(selector, { clickCount: 3 });
                await page.type(selector, searchValues[index]);
                await page.focus(selector);
                await page.waitForTimeout(500); // put delay
            }
            await page.keyboard.press('Enter');
            await page.waitForTimeout(500); // Wait for the page to be fully loaded to get the current URL
            await page.keyboard.press('Enter'); //to be sure it was clicked
            await page.waitForTimeout(500); // Wait for the page to be fully loaded to get the current URL
        } catch (error) {
            console.log('search in page error', error);
        }
    }

    //! for proxy testing only
    async browserLaunchWithProxy() {
        try {
            const browserOptions = {
                headless: false,
                ignoreHTTPSErrors: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    `--proxy-server=http://${process.env.PROXY_SERVER}:${process.env.PROXY_SERVER_PORT}`,
                ],
            };
            const browser = await puppeteer.launch(browserOptions);
            return browser;
        } catch (error) {
            console.log('Proxy browser launch error: ', error);
        }
    }

    async newPageWithProxy(browser, url) {
        try {
            const browserPages = await browser.pages();
            let currentPage = browserPages.filter((p) => p.url() === url)[0];
            if (currentPage) {
                currentPage.bringToFront();
            } else {
                currentPage = await browser.newPage();
                await currentPage.authenticate({
                    username: process.env.PROXY_USERNAME,
                    password: process.env.PROXY_PASSWORD,
                });
            }
            await currentPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });
            return currentPage;
        } catch (error) {
            console.log('Proxy page launch error: ', error);
        }
    }
    //! for proxy testing only
}

export default Puppeteer;
