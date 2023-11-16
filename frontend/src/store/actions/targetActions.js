import { TARGET_GET, TARGET_RESET } from 'constants/ActionTypes.js';

import axiosInstance from 'helper/axiosInstance.js';

export const GetTarget = (input) => (targetDispatch) => {
    targetDispatch({
        type: TARGET_GET,
        payload: input,
    });
};

//
export const ResetTarget =
    (keysToNotRemove = []) =>
    async (targetDispatch) => {
        targetDispatch({
            type: TARGET_RESET,
            payload: keysToNotRemove,
        });

        // const params = {
        //     titles: 'all',
        // };
        // await axiosInstance().get('/webscrape-action/clear-user-actions', { params });
    };
