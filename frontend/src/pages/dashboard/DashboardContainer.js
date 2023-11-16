import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Dashboard from './Dashboard';

// context
import Context from 'store/context/Context';
import { GetUserInfo } from 'store/actions/userActions';

// pages
import ExtractorContainer from 'pages/extractor/ExtractorContainer';
import HistoryContainer from 'pages/history/HistoryContainer';
import WatcherContainer from 'pages/watcher/WatcherContainer';

const DashboardContainer = () => {
    const [url, setUrl] = useState();
    const [routes, setRoutes] = useState([]);

    const {
        userState: {
            user: { data },
        },
        userDispatch,
    } = useContext(Context);

    let match = useRouteMatch();
    let history = useHistory();

    //** ROUTES LOGIC **//
    useEffect(() => {
        setUrl(match.url);
        GetUserInfo(history)(userDispatch);
    }, [match.url, userDispatch, history]);

    const conditionalRoutes = useCallback(() => {
        let currentUser = data;

        const userRoutes = [
            {
                path: `${url}/extractor`,
                component: ExtractorContainer,
                title: 'Extractor',
            },
            {
                path: `${url}/history`,
                component: HistoryContainer,
                title: 'History',
            },
        ];

        const watcherRoutes = [
            {
                path: `${url}/watcher`,
                component: WatcherContainer,
                title: 'Watcher',
            },
        ];

        if (!currentUser) return;

        let watcher = !!currentUser.role && currentUser.role === 'watcher';

        if (watcher) {
            return setRoutes(watcherRoutes);
        }
        return setRoutes(userRoutes);
    }, [url, data]);

    useEffect(() => {
        conditionalRoutes();

        return () => {
            conditionalRoutes();
        };
    }, [conditionalRoutes]);

    return <Dashboard url={url} routes={routes} user={data} />;
};

export default DashboardContainer;
