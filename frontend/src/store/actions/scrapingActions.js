import axiosInstance from 'helper/axiosInstance.js';

import {
    SCRAPING_LOADING,
    SCRAPING_NEW,
    SCRAPING_GET,
    SCRAPING_DELETE,
    SCRAPING_ERROR,
    COULD_NOT_CONNECT,
} from 'constants/ActionTypes.js';

// antd
import { notification } from 'antd';

export const NewScrapeData = (input) => async (scrapeDispatch) => {
    try {
        scrapeDispatch({
            type: SCRAPING_LOADING,
        });

        let res = await axiosInstance().post('/user/scraped-data/new', input);

        scrapeDispatch({
            type: SCRAPING_NEW,
            payload: res.data,
        });

        return res;
    } catch (err) {
        scrapeDispatch({
            type: SCRAPING_ERROR,
            payload: err.response ? err.response.data : COULD_NOT_CONNECT,
        });
    }
};

export const GetScrapeData = () => async (scrapeDispatch) => {
    try {
        scrapeDispatch({
            type: SCRAPING_LOADING,
        });

        let res = await axiosInstance().get('/user/scraped-data/all');

        scrapeDispatch({
            type: SCRAPING_GET,
            payload: res.data,
        });
    } catch (err) {
        scrapeDispatch({
            type: SCRAPING_ERROR,
            payload: err.response ? err.response.data : COULD_NOT_CONNECT,
        });
    }
};

/**
 * input value is either 'all' or an array of selected data _id.
 */
export const DeleteScrapeData = (input, setPage) => async (scrapeDispatch) => {
    try {
        let option = { data: { remove: input } };

        let res = await axiosInstance().delete(`/user/scraped-data`, option);

        if (res.data) input === 'all' && setPage(0);

        scrapeDispatch({
            type: SCRAPING_DELETE,
            payload: input,
        });
    } catch (err) {
        scrapeDispatch({
            type: SCRAPING_ERROR,
            payload: err.response ? err.response.data : COULD_NOT_CONNECT,
        });
    }
};

/**
 * this is not included on the scrape reducer.
 * input value must be an array of object that contains the captured scraped data.
 */
export const ExcelScrapedData = (input, type) => async () => {
    try {
        let res, headerLine, startFileNameIndex, endFileNameIndex, filename, url, link;

        res = await axiosInstance().post(
            '/webscrape-action/export-data',
            {
                ...input,
                type,
            },
            {
                responseType: 'blob',
            }
        );

        headerLine = res.headers['content-disposition'];

        startFileNameIndex = headerLine.indexOf('"') + 1;
        endFileNameIndex = headerLine.lastIndexOf('"');

        filename = headerLine.substring(startFileNameIndex, endFileNameIndex);

        url = window.URL.createObjectURL(
            new Blob([res.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })
        );

        link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);

        link.click();
        link.remove();

        res.data &&
            notification['success']({
                message: 'Success:',
                description: 'Exported successfully.',
            });
    } catch (err) {
        console.error(err);

        notification['error']({
            message: 'Error:',
            description: 'Something is wrong.',
        });
    }
};
