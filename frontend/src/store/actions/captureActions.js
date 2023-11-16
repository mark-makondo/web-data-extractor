import axiosInstance from 'helper/axiosInstance.js';

import {
    CAPTURE_LOADING,
    CAPTURE_ERROR,
    CAPTURE_START,
    CAPTURE_REMOVE,
    CAPTURE_RESET,
    COULD_NOT_CONNECT,
} from 'constants/ActionTypes.js';

export const StartCaptureData = (params) => async (captureDispatch) => {
    try {
        captureDispatch({
            type: CAPTURE_LOADING,
        });

        let res = await axiosInstance().get(`/webscrape-action/scrape-data`, { params });

        captureDispatch({
            type: CAPTURE_START,
            payload: res.data,
        });

        return res.data;
    } catch (err) {
        captureDispatch({
            type: CAPTURE_ERROR,
            payload: err.response ? err.response.data : COULD_NOT_CONNECT,
        });
    }
};

export const DeleteCapturedData = (input) => async (captureDispatch) => {
    try {
        captureDispatch({
            type: CAPTURE_LOADING,
        });

        captureDispatch({
            type: CAPTURE_REMOVE,
            payload: input,
        });
    } catch (err) {
        captureDispatch({
            type: CAPTURE_ERROR,
            payload: err.response ? err.response.data : COULD_NOT_CONNECT,
        });
    }
};

export const ResetCapturedData = () => (captureDispatch) => {
    captureDispatch({
        type: CAPTURE_RESET,
        payload: [],
    });
};

export const KeywordScrape = (params) => async (captureDispatch) => {
    try {
        captureDispatch({
            type: CAPTURE_LOADING,
        });

        let res = await axiosInstance().get('/webscrape-action/keyword-capture', { params });

        captureDispatch({
            type: CAPTURE_START,
            payload: res.data,
        });
        return (res = res.data);
    } catch (err) {
        captureDispatch({
            type: CAPTURE_ERROR,
            payload: err.response ? err.response.data : COULD_NOT_CONNECT,
        });
    }
};
