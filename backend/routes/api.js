import { postGoogleLogin, postLogin, postRegister, userLogout } from 'app/http/controllers/AuthController.js';
import {
    getCurrent,
    putUpdate,
    putChangePassword,
    getScrapedData,
    postScrapedData,
    removeScrapedData,
} from 'app/http/controllers/UserController.js';

import {
    screenshot,
    fetchContent,
    scrapeData,
    exportData,
    searchKeywords,
    keywordCapture,
    startScraping,
    startScrapingKeywords,
    visitFollowLink,
} from 'app/http/controllers/ScrapingController';

import { saveCaptchaResult } from 'app/http/controllers/WatcherController';

export default [
    {
        middleware: 'guest',
        children: [
            ['POST', '/api/auth/user/register', postRegister],
            ['POST', '/api/auth/user/login', postLogin],
            ['POST', '/api/auth/user/google', postGoogleLogin],
        ],
    },
    {
        middleware: 'auth',
        children: [
            // user actions api
            ['GET', '/api/auth/user/current', getCurrent],
            ['PUT', '/api/auth/user/update', putUpdate],
            ['PUT', '/api/auth/user/change-password', putChangePassword],
            ['GET', '/api/auth/user/scraped-data/all', getScrapedData],
            ['POST', '/api/auth/user/scraped-data/new', postScrapedData],
            ['DELETE', '/api/auth/user/scraped-data', removeScrapedData],
            ['GET', '/api/auth/send-captcha', saveCaptchaResult],

            // web scraping actions related api
            ['GET', '/api/auth/webscrape-action/screenshot', screenshot],
            ['GET', '/api/auth/webscrape-action/fetch-content', fetchContent],
            ['GET', '/api/auth/webscrape-action/scrape-data', scrapeData],
            ['GET', '/api/auth/webscrape-action/visit-follow-link', visitFollowLink],
            ['GET', '/api/auth/webscrape-action/start-scraping', startScraping],
            ['GET', '/api/auth/webscrape-action/search-keywords', searchKeywords],
            ['GET', '/api/auth/webscrape-action/keyword-capture', keywordCapture],
            ['GET', '/api/auth/webscrape-action/start-scraping-keywords', startScrapingKeywords],
            ['POST', '/api/auth/webscrape-action/export-data', exportData],

            ['GET', '/api/auth/user/user-logout', userLogout],
        ],
    },
];
