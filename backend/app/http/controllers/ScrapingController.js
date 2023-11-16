import Puppeteer from 'config/puppeteer-new';
import { socketWatcher } from 'config/utils.js';

export const screenshot = () => {};

let toBeSearched = [];

export const fetchContent = async (req, res) => {
    const pup = new Puppeteer();
    let browser = null;
    try {
        let { _id } = req.user;
        const { url, followLinkPage, browserId: queryBrowserId } = req.query;
        // const pup = new Puppeteer();
        let browserId = queryBrowserId;
        browser = await pup.browserLaunch(_id, browserId);
        const page = await pup.newPage(browser, url, true);

        if (page) {
            if (!browserId) browserId = await pup.getBrowserId(browser);
            const content = await pup.getPageContent(page, url);
            const result = {
                content: content,
                browserId: browserId,
            };
            return res.status(200).send(result);
        } else {
            const result = {
                content:
                    'Something went wrong! Either site can’t be reached or site cannot able to load properly. Please try again later!',
                browserId: null,
            };

            if (browser) {
                console.log('page not loaded issue, closing browser...');
                await pup.browserClose(browser);
            }
            return res.status(200).send(result);
        }
    } catch (error) {
        console.log(error);
        if (browser) pup.browserClose(browser);
    }
};

export const scrapeData = async (req, res) => {
    const pup = new Puppeteer();
    let browser = null;
    try {
        let { _id } = req.user;
        const { url, selectors, resultNeeded, title, browserId } = req.query;
        // console.log('query', req.query);
        const { origin } = new URL(url);

        // const pup = new Puppeteer();
        browser = await pup.browserLaunch(_id, browserId);
        const page = await pup.newPage(browser, url, false, true);

        let data = {};
        if (page) {
            const result = await pup.getScrapeValues(page, url, selectors, resultNeeded); //scrape not related

            data = {
                origin: origin,
                title: title,
                savedDoc: result,
            };
        }

        return res.status(200).send(data);
    } catch (error) {
        console.log(error);
        if (browser) pup.browserClose(browser);
    }
};

export const exportData = async (req, res) => {
    try {
        const puppeteer = new Puppeteer();
        return puppeteer.exportData(req.body, res);
    } catch (error) {
        console.log(error);
    }
};

export const startScraping = async (req, res) => {
    try {
        const { nextPageSelector, groupSelector, total_pages, details } = req.query; //parameters

        const userActionDetails = JSON.parse(details);
        let { _id } = req.user;

        const mainScrape = await scrapeOnMain({ nextPageSelector, groupSelector, total_pages, userActionDetails, _id });
        const followLinkData = await scrapeOnFollowLinks(3, userActionDetails, _id); //TODO: pending details - user scrape actions
        Promise.all([mainScrape, followLinkData]).then((values) => {
            values[0].saveDoc = values[0].saveDoc.concat(values[1]);
            return res.status(200).send(values[0]);
        });
    } catch (error) {
        console.log('Start scraping: ', error);
    }
};

export const visitFollowLink = async (req, res) => {
    const pup = new Puppeteer();
    let browser = null;
    try {
        let { _id } = req.user;
        const { url, selectors, nextPageSelector, browserId } = req.query;
        // followedLinkSelectors = selectors;

        // const pup = new Puppeteer();
        browser = await pup.browserLaunch(_id, browserId);
        const page = await pup.newPage(browser, url);

        if (page) {
            const followLinkUrls = await pup.getScrapeValues(page, url, selectors, 'href');
            return res.status(200).send({ result: true, data: followLinkUrls });
        } else {
            return res.status(200).send({ result: false, data: [] });
        }
    } catch (error) {
        console.log(error);
        if (browser) pup.browserClose(browser);
        return res.status(200).send({ result: false, data: [] });
    }
};

//! private funtions

const scrapeOnMain = async ({ nextPageSelector, groupSelector, total_pages, userActionDetails, _id }) => {
    try {
        let result = [];
        if (nextPageSelector) {
            if (groupSelector) {
                console.log('multipage => related');
                result = await scrapeOnRelatedMultiPage(
                    nextPageSelector,
                    groupSelector,
                    total_pages,
                    userActionDetails,
                    _id
                );
            } else {
                console.log('multipage => non related');
                result = await scrapeOnNonRelatedMultiPage(nextPageSelector, total_pages, userActionDetails, _id);
            }
        } else {
            if (groupSelector) {
                console.log('single page => related');
                result = await scrapeOnRelatedSingle(groupSelector, userActionDetails, _id);
            } else {
                console.log('single page => non related');
                result = await scrapeOnNonRelatedSinglePage(userActionDetails, _id);
            }
        }
        return result;
    } catch (error) {
        console.log('Scrape on main: ', error);
    }
};

const scrapeOnNonRelatedSinglePage = async (details, _id) => {
    const pup = new Puppeteer();
    let browser = null;
    try {
        let result = [];
        const browserId = details.puppeteerBrowserReference;
        const url = details.mainUrl;
        const page_url = new URL(url);

        // const pup = new Puppeteer();
        browser = await pup.browserLaunch(_id, browserId);
        const page = await pup.newPage(browser, page_url.href, false, true);

        const actionDetails = details.data.filter((d) => !d.isFollowedLink);
        for (let details of actionDetails) {
            const scrapeResult = await pup.getScrapeValues(
                page,
                page_url.href,
                details.selectors,
                details.resultNeeded
            );

            const currentRecord = result.filter((res) => res.subTitle === details.subTitle)[0]; //get current record on array [data] specific on title
            if (!currentRecord) {
                const dataObj = {
                    subTitle: details.subTitle,
                    url: page_url.href,
                    data: scrapeResult,
                };
                result.push(dataObj);
            } else {
                currentRecord.data = currentRecord.data.concat(scrapeResult);
            }
        }

        // await pup.pageClose(page);
        // await pup.browserClose(browser);

        const structuredData = {
            title: 'general title',
            origin: page_url.origin,
            saveDoc: result,
            // status: status,
        };

        return structuredData;
    } catch (error) {
        console.log('Scrape non related single page', error);
        if (browser) pup.browserClose(browser);
    }
};

const scrapeOnRelatedSingle = async (groupSelector, details, _id) => {
    const pup = new Puppeteer();
    let browser = null;
    try {
        let result = [];
        const browserId = details.puppeteerBrowserReference;
        const url = details.mainUrl;
        const page_url = new URL(url);

        // const pup = new Puppeteer();
        browser = await pup.browserLaunch(_id, browserId);
        const page = await pup.newPage(browser, page_url.href, false, true);

        const actionDetails = details.data.filter((d) => !d.isFollowedLink);
        for (let details of actionDetails) {
            const scrapeResult = await pup.getGroupScrapeValues(
                page,
                page_url.href,
                groupSelector,
                details.selectors,
                details.resultNeeded
            );

            const currentRecord = result.filter((res) => res.subTitle === details.subTitle)[0]; //get current record on array [data] specific on title
            if (!currentRecord) {
                const dataObj = {
                    subTitle: details.subTitle,
                    url: page_url.href,
                    data: scrapeResult,
                };
                result.push(dataObj);
            } else {
                currentRecord.data = currentRecord.data.concat(scrapeResult);
            }
        }

        // await pup.pageClose(page);
        // await pup.browserClose(browser);

        const structuredData = {
            title: 'general title',
            origin: page_url.origin,
            saveDoc: result,
            // status: status,
        };

        return structuredData;
    } catch (error) {
        console.log('Scrape related single page', error);
        if (browser) pup.browserClose(browser);
    }
};

const scrapeOnNonRelatedMultiPage = async (nextPageSelector, total_pages, details, _id) => {
    const pup = new Puppeteer();
    let browser = null;
    try {
        let result = [];
        const browserId = details.puppeteerBrowserReference;
        const url = details.mainUrl;
        const page_url = new URL(url);

        // const pup = new Puppeteer();
        browser = await pup.browserLaunch(_id, browserId);
        const page = await pup.newPage(browser, page_url.href, true, false); //enable scroll and crawler test disabel crawler

        await pup.getMultiplePages(page, nextPageSelector, total_pages, async (currentPage, pageCounter) => {
            const actionDetails = details.data.filter((d) => !d.isFollowedLink);
            const currentUrl = await currentPage.url();

            //emit status of scraping
            socketWatcher.io.emit('scrape_status', {
                browserId: browserId,
                status: `Currently scraping on page ${pageCounter}`,
            });
            console.log(`Currently scraping on page ${pageCounter} `);

            //scroll on multi page
            await pup.scrollToBottom(currentPage);

            // console.log(currentUrl);
            for (let details of actionDetails) {
                const scrapeResult = await pup.getScrapeValues(
                    currentPage,
                    currentUrl,
                    details.selectors,
                    details.resultNeeded
                );

                const currentRecord = result.filter((res) => res.subTitle === details.subTitle)[0]; //get current record on array [data] specific on title
                if (!currentRecord) {
                    const dataObj = {
                        subTitle: details.subTitle,
                        url: currentUrl,
                        data: scrapeResult,
                    };
                    result.push(dataObj);
                } else {
                    currentRecord.data = currentRecord.data.concat(scrapeResult);
                }
            }

            //? adding new links for the next page
            if (pageCounter > 1) {
                const followLinksMultipleSelector = details.followLinksMultipleSelector;
                if (followLinksMultipleSelector !== '') {
                    const followLinkUrls = await pup.getScrapeValues(
                        currentPage,
                        currentUrl,
                        followLinksMultipleSelector,
                        'href'
                    );
                    details.followLinks.push(...followLinkUrls);
                }
            }
            //? adding new links for the next page
        });

        //after done go back to main page
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });

        // await pup.pageClose(page);
        // await pup.browserClose(browser);

        const structuredData = {
            title: 'general title',
            origin: page_url.origin,
            saveDoc: result,
            // status: status,
        };
        return structuredData;
    } catch (error) {
        console.log('Scrape non related multi page', error);
        if (browser) pup.browserClose(browser);
    }
};

const scrapeOnRelatedMultiPage = async (nextPageSelector, groupSelector, total_pages, details, _id) => {
    const pup = new Puppeteer();
    let browser = null;
    try {
        let result = [];
        const browserId = details.puppeteerBrowserReference;
        const url = details.mainUrl;
        const page_url = new URL(url);

        // const pup = new Puppeteer();
        browser = await pup.browserLaunch(_id, browserId);
        const page = await pup.newPage(browser, page_url.href, false, true);

        // const nextPageSelector = '.btn.btn-blue.btn-fullWidth.pagination--next';
        await pup.getMultiplePages(page, nextPageSelector, total_pages, async (currentPage, pageCounter) => {
            const actionDetails = details.data.filter((d) => !d.isFollowedLink);
            const currentUrl = await currentPage.url();

            //emit status of scraping
            socketWatcher.io.emit('scrape_status', {
                browserId: browserId,
                status: `Currently scraping on page ${pageCounter}`,
            });
            console.log(`Currently scraping on page ${pageCounter} `);

            //scroll on multi page
            await pup.scrollToBottom(currentPage);

            for (let details of actionDetails) {
                const scrapeResult = await pup.getGroupScrapeValues(
                    currentPage,
                    currentUrl,
                    groupSelector,
                    details.selectors,
                    details.resultNeeded
                );
                const currentRecord = result.filter((res) => res.subTitle === details.subTitle)[0]; //get current record on array [data] specific on title
                if (!currentRecord) {
                    const dataObj = {
                        subTitle: details.subTitle,
                        url: currentUrl,
                        data: scrapeResult,
                    };
                    result.push(dataObj);
                } else {
                    currentRecord.data = currentRecord.data.concat(scrapeResult);
                }
            }

            //? adding new links for the next page
            if (pageCounter > 1) {
                const followLinksMultipleSelector = details.followLinksMultipleSelector;
                if (followLinksMultipleSelector !== '') {
                    const followLinkUrls = await pup.getScrapeValues(
                        currentPage,
                        currentUrl,
                        followLinksMultipleSelector,
                        'href'
                    );
                    // user_scrape_history.followLinks.push(...followLinkUrls);
                    details.followLinks.push(...followLinkUrls);
                }
            }
            //? adding new links for the next page
        });

        // await pup.pageClose(page);
        // await pup.browserClose(browser);

        const structuredData = {
            title: 'general title',
            origin: page_url.origin,
            saveDoc: result,
            // status: status,
        };

        return structuredData;
    } catch (error) {
        console.log('Scrape related multi page', error);
        if (browser) pup.browserClose(browser);
    }
};

const scrapeOnFollowLinks = async (tabRequests = 2, details, _id) => {
    const pup = new Puppeteer();
    let browser = null;
    try {
        let userFollowLinks = details.followLinks;
        const groupTotal = Math.floor(userFollowLinks.length / tabRequests);
        let result = [];

        if (userFollowLinks.length === 0) return result;

        // const pup = new Puppeteer();
        browser = await pup.browserLaunch(_id, null); //new browser
        // const browser = await pup.browserLaunchWithProxy();

        for (let i = 0; i <= groupTotal; i++) {
            let requests = [];
            // const indexCounter = tabRequests *
            let fIndexStart = i * tabRequests;
            let fIndexEnd = fIndexStart + (tabRequests - 1);

            //?new using filter
            let currentFollowLinks = userFollowLinks.filter(
                (links) => userFollowLinks.indexOf(links) >= fIndexStart && userFollowLinks.indexOf(links) <= fIndexEnd
            );

            //? Multiple url open           ##okay
            currentFollowLinks.forEach((url, index) => {
                requests.push(scrapeOnUrl(pup, browser, url, index, details));
            });

            await Promise.all(requests).then((res) => {
                res.forEach((values) => {
                    for (let value of values) {
                        const currentRecord = result.filter((v) => v.subTitle === value.subTitle)[0];
                        if (currentRecord) {
                            currentRecord.data = currentRecord.data.concat(value.data);
                        } else {
                            result.push(value);
                        }
                    }
                });
            });
        }

        await pup.browserClose(browser);
        return result;
    } catch (error) {
        console.log('Scrape on follow links', error);
        if (browser) pup.browserClose(browser);
    }
};

const scrapeOnUrl = async (puppeteer, browser, followLinkUrl, index, details) => {
    try {
        let result = [];
        const pageProxy = await puppeteer.newPage(browser, followLinkUrl, true, true, index);
        // const pageProxy = await puppeteer.newPageWithProxy(browser, followLinkUrl);

        if (!pageProxy) return result; //? if page not found

        const actionDetails = details.data.filter((d) => d.isFollowedLink);

        //emit status of scraping
        // let browserId = await puppeteer.getBrowserId(browser);
        const browserId = details.puppeteerBrowserReference;
        socketWatcher.io.emit('scrape_status', {
            browserId: browserId,
            status: `Currently scraping on follow links ${followLinkUrl}`,
        });
        console.log(`Currently scraping on follow links ${followLinkUrl}`);

        //scrape on followed links
        for (let details of actionDetails) {
            const scrapeResult = await puppeteer.getGroupScrapeValues(
                pageProxy,
                details.url,
                'body',
                details.selectors,
                details.resultNeeded
            );

            const currentRecord = result.filter((res) => res.subTitle === details.subTitle)[0]; //get current record on array [data] specific on title
            if (!currentRecord) {
                const dataObj = {
                    subTitle: details.subTitle,
                    url: details.url,
                    data: scrapeResult,
                };
                result.push(dataObj);
            } else {
                currentRecord.data = currentRecord.data.concat(scrapeResult);
            }
        }
        await puppeteer.scrollToRandom(pageProxy); //random scroll

        const randomTimer = Math.floor(Math.random() * 2500) + 500; //timer between 500 to 3000 ms
        await pageProxy.waitForTimeout(randomTimer);

        await puppeteer.pageClose(pageProxy, true);

        return result;
    } catch (error) {
        console.log(error);
    }
};

export const searchKeywords = async (req, res) => {
    const pup = new Puppeteer();
    let browser = null;
    try {
        let { _id } = req.user;
        const { url, keywords, selectors, browserId } = req.query;
        // console.log('keywords', keywords);
        const [mainSearch, secondarySearch] = keywords;
        let firstSearch = mainSearch.split(',');
        let secondSearch = [];
        if (secondarySearch) secondSearch = secondarySearch.split(',');

        // const pup = new Puppeteer();
        browser = await pup.browserLaunch(_id, browserId);

        let searchValues = [];
        let renderedUrls = [];
        let renderedContent = '';
        let page = null;
        for (let [indexF, fValue] of firstSearch.entries()) {
            let searchUrl = url;
            searchValues[0] = fValue;
            if (secondSearch.length !== 0) {
                for (let [indexS, sValue] of secondSearch.entries()) {
                    searchValues[1] = sValue;
                    page = await pup.newPage(browser, searchUrl);
                    await pup.searchInPage(page, selectors, searchValues);
                    await page.waitForNavigation({ waitUntil: 'load' });
                    const currentUrl = await page.url();
                    renderedUrls.push(currentUrl);
                    if (indexF === 0 && indexS === 0) {
                        // console.log('current URL : ', currentUrl);
                        renderedContent = await pup.getPageContent(page, currentUrl);
                    }
                }
            } else {
                page = await pup.newPage(browser, searchUrl);
                await pup.searchInPage(page, selectors, searchValues);
                const currentUrl = await page.url();
                renderedUrls.push(currentUrl);
                if (indexF === 0) {
                    // console.log('current URL : ', currentUrl);
                    renderedContent = await pup.getPageContent(page, currentUrl);
                }
            }
        }

        const response = {
            content: renderedContent,
            urls: renderedUrls,
        };
        res.status(200).send(response);
    } catch (error) {
        console.log('Search keywords error', error);
        if (browser) pup.browserClose(browser);
    }
};

export const keywordCapture = async (req, res) => {
    const pup = new Puppeteer();
    let browser = null;
    try {
        let { _id } = req.user;
        const { url, selectors, resultNeeded, title, browserId, searchUrls } = req.query;
        const { origin } = new URL(url);

        // const pup = new Puppeteer();
        browser = await pup.browserLaunch(_id, browserId);

        let result = [];
        for (let currentUrl of searchUrls) {
            const page = await pup.newPage(browser, currentUrl, false, true);
            const currentResult = await pup.getScrapeValues(page, currentUrl, selectors, resultNeeded); //scrape not related
            result.push.apply(result, currentResult);
        }

        const data = {
            origin: origin,
            title: title,
            savedDoc: result,
            type: 'keyword',
        };

        return res.status(200).send(data);
    } catch (error) {
        console.log('Keyword capture error', error);
        if (browser) pup.browserClose(browser);
    }
};

export const startScrapingKeywords = async (req, res) => {
    const pup = new Puppeteer();
    let browser = null;
    try {
        let { _id } = req.user;
        const { details, searchUrls, browserId } = req.query; //parameters
        const userActionDetails = JSON.parse(details);
        let result = [];
        let page_url = null;

        // const pup = new Puppeteer();
        browser = await pup.browserLaunch(_id, browserId);

        for (let currentUrl of searchUrls) {
            page_url = new URL(currentUrl);
            const page = await pup.newPage(browser, currentUrl, false, true);
            const actionDetails = userActionDetails.data.filter((d) => !d.isFollowedLink);
            for (let details of actionDetails) {
                const scrapeResult = await pup.getScrapeValues(
                    page,
                    currentUrl,
                    details.selectors,
                    details.resultNeeded
                );

                // console.log('scrape result', scrapeResult);

                const currentRecord = result.filter((res) => res.subTitle === details.subTitle)[0]; //get current record on array [data] specific on title
                if (!currentRecord) {
                    const dataObj = {
                        subTitle: details.subTitle,
                        url: currentUrl,
                        data: scrapeResult,
                    };
                    result.push(dataObj);
                } else {
                    currentRecord.data = currentRecord.data.concat(scrapeResult);
                }
            } //? end of action details
        } //? end of searchUrls

        const structuredData = {
            title: 'general title',
            origin: page_url.origin,
            saveDoc: result,
        };

        res.status(200).send(structuredData);
    } catch (error) {
        console.log('Scrape keywords', error);
        if (browser) pup.browserClose(browser);
    }
};

//! private funtions
