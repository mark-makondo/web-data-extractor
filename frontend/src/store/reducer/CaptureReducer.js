import { CAPTURE_LOADING, CAPTURE_REMOVE, CAPTURE_START, CAPTURE_ERROR, CAPTURE_RESET } from 'constants/ActionTypes.js';

const CaptureReducer = (state, { payload, type }) => {
    switch (type) {
        case CAPTURE_LOADING:
            return {
                ...state,
                capture: {
                    ...state.capture,
                    error: false,
                    loading: true,
                },
            };
        case CAPTURE_START:
            return {
                ...state,
                capture: {
                    error: false,
                    loading: false,
                    data: [...state.capture.data, payload],
                },
            };
        case CAPTURE_REMOVE:
            return {
                ...state,
                capture: {
                    error: false,
                    loading: false,
                    data: state.capture.data.filter((capture) => !payload.includes(capture.title)),
                },
            };
        case CAPTURE_ERROR:
            return {
                ...state,
                capture: {
                    ...state.capture,
                    error: false,
                    loading: false,
                },
            };
        case CAPTURE_RESET:
            return {
                ...state,
                capture: {
                    error: false,
                    loading: false,
                    data: payload,
                },
            };
        default:
            return state;
    }
};

export default CaptureReducer;
