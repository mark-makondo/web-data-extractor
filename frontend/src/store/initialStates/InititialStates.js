let defaultFormat = {
    loading: false,
    error: false,
};

export const AuthInitialStates = {
    auth: {
        ...defaultFormat,
        user: null,
    },
};

export const UserInitialStates = {
    user: {
        ...defaultFormat,
        data: null,
    },
};

export const ScrapeInitialStates = {
    scrape: {
        ...defaultFormat,
        data: [],
    },
};

export const CaptureInitialStates = {
    capture: {
        ...defaultFormat,
        data: [],
    },
};

export const TargetInitialStates = {
    target: {
        data: {},
    },
};

export const CaptchaInitialStates = {
    captcha: {
        data: [],
    },
};

export const DetailsInitialStates = {
    details: {
        data: [],
        followLinks: [],
        followLinksMultipleSelector: '',
        isFollowedLinkIdentifier: false,
        puppeteerBrowserReference: null,
        mainUrl: null,
        followLinkUrl: null,
        searchUrls: [],
    },
};
