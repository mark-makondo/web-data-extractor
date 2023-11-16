import {
    SCRAPING_LOADING,
    SCRAPING_NEW,
    SCRAPING_GET,
    SCRAPING_DELETE,
    SCRAPING_ERROR,
} from 'constants/ActionTypes.js';

const ScrapeReducer = (state, { payload, type }) => {
    switch (type) {
        case SCRAPING_LOADING:
            return {
                ...state,
                scrape: {
                    ...state.scrape,
                    loading: true,
                    error: false,
                },
            };

        case SCRAPING_NEW:
            return {
                ...state,
                scrape: {
                    loading: false,
                    error: false,
                    data: [...state.scrape.data, payload],
                },
            };

        case SCRAPING_GET:
            return {
                ...state,
                scrape: {
                    loading: false,
                    error: false,
                    data: payload,
                },
            };

        case SCRAPING_DELETE:
            let conditionalResult;

            if (payload === 'all') conditionalResult = [];
            else {
                conditionalResult = state.scrape.data.filter((scrape) => !payload.includes(scrape._id));
            }

            return {
                ...state,
                scrape: {
                    loading: false,
                    error: false,
                    data: conditionalResult,
                },
            };

        case SCRAPING_ERROR:
            return {
                ...state,
                scrape: {
                    ...state.scrape,
                    loading: false,
                    error: payload,
                },
            };

        default:
            return state;
    }
};

export default ScrapeReducer;
