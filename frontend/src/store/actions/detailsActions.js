import {
    DETAILS_ADD,
    DETAILS_REMOVE,
    DETAILS_ADD_FOLLOWLINKS,
    DETAILS_ADD_MULTIPLE_SELECTOR,
    DETAILS_ADD_FOLLOWLINKIDENTIFIER,
    DETAILS_REMOVE_ALL,
    DETAILS_PUPPETEER_BROWSER_REFERENCE_SET,
    DETAILS_PUPPETEER_MAIN_URL_SET,
    DETAILS_PUPPETEER_FOLLOWLINK_URL_SET,
    DETAILS_SET_SEARCHURLS,
} from 'constants/ActionTypes.js';

/**
 * @param {Object} input single object to be added in the context
 */
export const AddDetails = (input) => (detailsDispatch) => {
    detailsDispatch({
        type: DETAILS_ADD,
        payload: input,
    });
};

/**
 * @param {Array} input array of titles to be removed in the context
 */
export const RemoveDetails = (input) => (detailsDispatch) => {
    detailsDispatch({
        type: DETAILS_REMOVE,
        payload: input,
    });
};

/**
 * @param {Array} input array of titles to be removed in the context
 */
export const RemoveAllDetails = () => (detailsDispatch) => {
    detailsDispatch({
        type: DETAILS_REMOVE_ALL,
    });
};

/**
 * @param {Array} input array of url comming from the puppeteer to context
 */
export const AddFollowLinkIdentifier = (input) => (detailsDispatch) => {
    detailsDispatch({
        type: DETAILS_ADD_FOLLOWLINKIDENTIFIER,
        payload: input,
    });
};

/**
 * @param {Array} input array of url comming from the puppeteer to context
 */
export const AddFollowLinks = (input) => (detailsDispatch) => {
    detailsDispatch({
        type: DETAILS_ADD_FOLLOWLINKS,
        payload: input,
    });
};

/**
 * @param {String} input a selector for multiple
 */
export const AddSelectorForMultiple = (input) => (detailsDispatch) => {
    detailsDispatch({
        type: DETAILS_ADD_MULTIPLE_SELECTOR,
        payload: input,
    });
};

/**
 * @param {Object} input single object to be added in the context
 */
export const SetPuppeteerBrowserReference = (input) => (detailsDispatch) => {
    detailsDispatch({
        type: DETAILS_PUPPETEER_BROWSER_REFERENCE_SET,
        payload: input,
    });
};

/**
 * @param {Object} input single object to be added in the context
 */
export const SetMainUrl = (input) => (detailsDispatch) => {
    detailsDispatch({
        type: DETAILS_PUPPETEER_MAIN_URL_SET,
        payload: input,
    });
};

/**
 * @param {Object} input single object to be added in the context
 */
export const SetFollowLinkUrl = (input) => (detailsDispatch) => {
    detailsDispatch({
        type: DETAILS_PUPPETEER_FOLLOWLINK_URL_SET,
        payload: input,
    });
};

/**
 * @param {Object} input single object to be added in the context
 */
export const SetSearchUrls = (input) => (detailsDispatch) => {
    detailsDispatch({
        type: DETAILS_SET_SEARCHURLS,
        payload: input,
    });
};
