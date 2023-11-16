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

const DetailsReducer = (state, { payload, type }) => {
    switch (type) {
        case DETAILS_ADD:
            return {
                ...state,
                details: {
                    ...state.details,
                    data: [...state.details.data, payload],
                },
            };
        case DETAILS_REMOVE:
            return {
                ...state,
                details: {
                    ...state.details,
                    data: state.details.data.filter((detail) => !payload.includes(detail.title)),
                },
            };

        case DETAILS_REMOVE_ALL:
            return {
                ...state,
                details: {
                    ...state.details,
                    data: [],
                },
            };
        case DETAILS_ADD_FOLLOWLINKS:
            return {
                ...state,
                details: {
                    ...state.details,
                    followLinks: [...payload],
                },
            };
        case DETAILS_ADD_MULTIPLE_SELECTOR:
            return {
                ...state,
                details: {
                    ...state.details,
                    followLinksMultipleSelector: payload,
                },
            };
        case DETAILS_ADD_FOLLOWLINKIDENTIFIER:
            return {
                ...state,
                details: {
                    ...state.details,
                    isFollowedLinkIdentifier: payload,
                },
            };
        case DETAILS_PUPPETEER_BROWSER_REFERENCE_SET:
            return {
                ...state,
                details: {
                    ...state.details,
                    puppeteerBrowserReference: payload,
                },
            };
        case DETAILS_PUPPETEER_MAIN_URL_SET:
            return {
                ...state,
                details: {
                    ...state.details,
                    mainUrl: payload,
                },
            };
        case DETAILS_PUPPETEER_FOLLOWLINK_URL_SET:
            return {
                ...state,
                details: {
                    ...state.details,
                    followLinkUrl: payload,
                },
            };
        case DETAILS_SET_SEARCHURLS:
            return {
                ...state,
                details: {
                    ...state.details,
                    searchUrls: payload,
                },
            };
        default:
            return state;
    }
};

export default DetailsReducer;
