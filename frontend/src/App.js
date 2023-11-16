import React, { useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory, useLocation } from 'react-router-dom';

import AppState from './store/AppState.js';

// components
import LoginContainer from './components/auth/login/LoginContainer.js';
import RegisterContainer from './components/auth/register/RegisterContainer.js';
import GoogleProceedContainer from './components/auth/googleProceed/GoogleProceedContainer.js';

// pages
import DashboardContainer from './pages/dashboard/DashboardContainer.js';

const App = () => {
    const RenderRoute = () => {
        const history = useHistory();
        const { pathname } = useLocation();

        const dashboardAuthentication = useCallback(
            (isAuthenticated) => {
                let redirectToPathName;

                let pathBase = '/';
                let pathRegister = '/register';
                let pathGoogle = '/google/proceed';
                let pathDashboard = '/dashboard';
                let pathExtractor = '/dashboard/extractor';
                let pathHistory = '/dashboard/history';
                let pathWatcher = '/dashboard/watcher';

                let isCurrentPathBase = pathname === pathBase;
                let isCurrentPathRegister = pathname === pathRegister;
                let isCurrentPathGoogle = pathname === pathGoogle;
                let isCurrentPathDashboard = pathname === pathDashboard;
                let isCurrentPathExtractor = pathname === pathExtractor;
                let isCurrentPathHistory = pathname === pathHistory;
                let isCurrentPathWatcher = pathname === pathWatcher;

                let validPathBase = isCurrentPathBase && isAuthenticated;
                let validPathRegister = isCurrentPathRegister && isAuthenticated;
                let validPathGoogleProceed = isCurrentPathGoogle && isAuthenticated;
                let validPathDashboard = isCurrentPathDashboard && isAuthenticated;
                let validPathExtractor = isCurrentPathExtractor && isAuthenticated;
                let validPathHistory = isCurrentPathHistory && isAuthenticated;
                let validPathWatcher = isCurrentPathWatcher && isAuthenticated;

                if (validPathBase || validPathRegister || validPathGoogleProceed || validPathDashboard)
                    redirectToPathName = pathDashboard;
                else if (validPathExtractor) redirectToPathName = pathExtractor;
                else if (validPathHistory) redirectToPathName = pathHistory;
                else if (isCurrentPathRegister) redirectToPathName = pathRegister;
                else if (isCurrentPathGoogle) redirectToPathName = pathGoogle;
                else if (validPathWatcher) redirectToPathName = pathWatcher;
                else redirectToPathName = pathBase;

                return redirectToPathName;
            },
            [pathname]
        );

        useEffect(() => {
            let isAuthenticated, isTempUser, pathGoogle, path;

            isAuthenticated = !!localStorage.jwt_token;
            isTempUser = !!localStorage.temp_user;
            pathGoogle = '/google/proceed';

            if (isTempUser) path = pathGoogle;
            else path = dashboardAuthentication(isAuthenticated);

            history.push(path);
        }, [history, dashboardAuthentication]);

        return (
            <>
                <Route exact path="/" component={LoginContainer} />
                <Route path="/register" component={RegisterContainer} />
                <Route path="/google/proceed" component={GoogleProceedContainer} />
            </>
        );
    };

    return (
        <AppState>
            <Router>
                <div className="app">
                    <div className="app__body">
                        <Switch>
                            <RenderRoute />
                        </Switch>
                    </div>
                    <Route path="/dashboard" component={DashboardContainer} />
                </div>
            </Router>
        </AppState>
    );
};

export default App;
