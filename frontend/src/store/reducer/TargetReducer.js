import { TARGET_GET, TARGET_RESET } from '../../constants/ActionTypes.js';

const TargetReducer = (state, { payload, type }) => {
    switch (type) {
        case TARGET_GET:
            return {
                ...state,
                target: {
                    data: { ...state.target.data, ...payload },
                },
            };

        case TARGET_RESET:
            let currentData = state.target.data;

            Object.keys(currentData).forEach((key) => payload.includes(key) || delete currentData[key]);

            return {
                ...state,
                target: {
                    data: { ...currentData },
                },
            };
        default:
            return state;
    }
};

export default TargetReducer;
