import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

// antd
import { Spin } from 'antd';
import { Content } from 'antd/lib/layout/layout';

// components
import NavbarContainer from 'components/navbar/NavbarContainer.js';
import FooterContainer from 'components/footer/FooterContainer.js';

// pages
import HomeContainer from 'pages/home/HomeContainer.js';

// context
import { SocketContext, socket } from 'store/context/SocketContext';

const DashboardBody = ({ routes, isUrlHistory, user, url, isUrlExtractor }) => {
    return (
        <>
            <NavbarContainer routes={routes} />

            <Content
                className="dashboard__body"
                style={{
                    overflowY: `${isUrlHistory ? 'auto' : 'hidden'}`,
                    justifyContent: `${routes.length === 0 ? 'center' : 'flex-start'}`,
                    width: '100%',
                }}
            >
                {routes.length !== 0 ? (
                    <>
                        <Switch>
                            <Route exact path={`${url}/`} component={HomeContainer} />

                            {routes.map((route, i) => (
                                <Route
                                    key={`${route.title}-${i}`}
                                    exact
                                    path={route.path}
                                    component={route.component}
                                />
                            ))}
                        </Switch>
                        {!isUrlExtractor && <FooterContainer />}
                    </>
                ) : (
                    <Spin />
                )}
            </Content>
        </>
    );
};

const Dashboard = ({ url, routes, user }) => {
    const { pathname } = useLocation();

    let pathExtractor = '/dashboard/extractor';
    let pathHistory = '/dashboard/history';

    let isUrlExtractor = pathname === pathExtractor;
    let isUrlHistory = pathname === pathHistory;

    return (
        <div className="dashboard">
            {!!user ? (
                <SocketContext.Provider value={socket}>
                    <DashboardBody
                        routes={routes}
                        isUrlHistory={isUrlHistory}
                        user={user}
                        url={url}
                        isUrlExtractor={isUrlExtractor}
                    />
                </SocketContext.Provider>
            ) : null}
        </div>
    );
};

export default Dashboard;
