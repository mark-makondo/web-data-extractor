import { CAPTCHA_ADD, CAPTCHA_GET, CAPTCHA_REMOVE, CAPTCHA_EDIT } from 'constants/ActionTypes.js';

const CaptureReducer = (state, { payload, type }) => {
    switch (type) {
        case CAPTCHA_GET:
            return {
                ...state,
                captcha: {
                    data: payload,
                },
            };

        case CAPTCHA_ADD:
            return {
                ...state,
                captcha: {
                    data: [...state.captcha.data, payload],
                },
            };

        case CAPTCHA_EDIT:
            let captchaIndex = state.captcha.data.findIndex((captcha) => captcha.key === payload.key);
            let holder = [...state.captcha.data];

            holder[captchaIndex] = { ...holder[captchaIndex], ...payload.edit };

            return {
                ...state,
                captcha: {
                    data: holder,
                },
            };

        case CAPTCHA_REMOVE:
            let filtered = state.captcha.data.filter((doc) => doc.key !== payload);

            return {
                ...state,
                captcha: {
                    data: [...filtered],
                },
            };

        default:
            return state;
    }
};

export default CaptureReducer;
