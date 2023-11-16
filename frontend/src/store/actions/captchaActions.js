import { CAPTCHA_ADD, CAPTCHA_REMOVE, CAPTCHA_GET, CAPTCHA_EDIT } from 'constants/ActionTypes.js';

export const GetCaptchaData = (input) => (captchaDispatch) => {
    captchaDispatch({
        type: CAPTCHA_GET,
        payload: input,
    });
};

/**
 * Input format: {key, edit: { key-value-pairs that you want to edit }}
 */
export const EditCaptchaData = (input) => (captchaDispatch) => {
    captchaDispatch({
        type: CAPTCHA_EDIT,
        payload: input,
    });
};

export const AddCaptchaData = (input) => (captchaDispatch) => {
    captchaDispatch({
        type: CAPTCHA_ADD,
        payload: input,
    });
};

export const RemoveCaptchaData = (input) => (captchaDispatch) => {
    captchaDispatch({
        type: CAPTCHA_REMOVE,
        payload: input,
    });
};
