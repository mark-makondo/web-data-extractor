import React from 'react';
import { useRouteMatch } from 'react-router-dom';

// antd
import { Spin } from 'antd';
import { Content } from 'antd/lib/layout/layout';

// assets
import { ReactComponent as ExtractorBG } from '../../assets/svg/Extractor-bg.svg';
import { ReactComponent as AdminBG } from '../../assets/svg/Admin-bg.svg';
import { ReactComponent as ProfileBG } from '../../assets/svg/Profile-bg.svg';
import { ReactComponent as WatcherBG } from '../../assets/svg/Watcher-bg.svg';

// parts
import QuickActionItem from './parts/QuickActionItem.js';

const WatcherItem = ({ handleModalOpen, url }) => {
    return (
        <>
            <h2 className="normal-1">quick action</h2>
            <div className="home__item">
                <QuickActionItem name="watcher" svg={<WatcherBG />} isSelected={true} link={`${url}/watcher`} />
                <QuickActionItem name="profile" svg={<ProfileBG />} link="#" itemClick={handleModalOpen} />
            </div>
        </>
    );
};

const UserItem = ({ handleModalOpen, url }) => {
    return (
        <>
            <h2 className="normal-1">quick action</h2>
            <div className="home__item">
                <QuickActionItem name="extractor" svg={<ExtractorBG />} isSelected={true} link={`${url}/extractor`} />
                <QuickActionItem name="profile" svg={<ProfileBG />} link="#" itemClick={handleModalOpen} />
                <QuickActionItem name="history" svg={<AdminBG />} link={`${url}/history`} />
            </div>
        </>
    );
};

const Home = ({ handleModalOpen, user }) => {
    let match, url;

    match = useRouteMatch();
    url = match.url;

    return (
        <div className="home">
            <div className="home__body">
                <Content>
                    {user && !!user.role ? (
                        <div className="home__content">
                            {user.role === 'watcher' ? (
                                <WatcherItem handleModalOpen={handleModalOpen} url={url} />
                            ) : (
                                <UserItem handleModalOpen={handleModalOpen} url={url} />
                            )}
                        </div>
                    ) : (
                        <Spin size="middle" />
                    )}
                </Content>
            </div>
        </div>
    );
};

export default Home;
