import React, { useReducer } from 'react';

// context
import Context from './context/Context.js';

// initial states
import {
    AuthInitialStates,
    UserInitialStates,
    ScrapeInitialStates,
    CaptureInitialStates,
    TargetInitialStates,
    CaptchaInitialStates,
    DetailsInitialStates,
} from './initialStates/InititialStates.js';

// reducer
import AuthReducer from './reducer/AuthReducer.js';
import UserReducer from './reducer/UserReducer.js';
import ScrapeReducer from './reducer/ScrapeReducer.js';
import CaptureReducer from './reducer/CaptureReducer.js';
import TargetReducer from './reducer/TargetReducer.js';
import CaptchaReducer from './reducer/CaptchaReducer.js';
import DetailsReducer from './reducer/DetailsReducer.js';

const AppState = ({ children }) => {
    let { Provider } = Context;

    const [authState, authDispatch] = useReducer(AuthReducer, AuthInitialStates);
    const [userState, userDispatch] = useReducer(UserReducer, UserInitialStates);
    const [scrapeState, scrapeDispatch] = useReducer(ScrapeReducer, ScrapeInitialStates);
    const [captureState, captureDispatch] = useReducer(CaptureReducer, CaptureInitialStates);
    const [targetState, targetDispatch] = useReducer(TargetReducer, TargetInitialStates);
    const [captchaState, captchaDispatch] = useReducer(CaptchaReducer, CaptchaInitialStates);
    const [detailsState, detailsDispatch] = useReducer(DetailsReducer, DetailsInitialStates);

    // state and dispatch
    const global = {
        authState,
        authDispatch,

        userState,
        userDispatch,

        scrapeState,
        scrapeDispatch,

        captureState,
        captureDispatch,

        targetState,
        targetDispatch,

        captchaState,
        captchaDispatch,

        detailsState,
        detailsDispatch,
    };

    return <Provider value={global}>{children}</Provider>;
};

export default AppState;
