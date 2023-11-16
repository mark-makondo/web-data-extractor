import React from 'react';

// antd
import { Content } from 'antd/lib/layout/layout';

// parts
import BodyContainer from './parts/body/BodyContainer';

const Watcher = () => {
    return (
        <Content style={{ overflowY: 'auto' }} className="watcher">
            <BodyContainer />
        </Content>
    );
};

export default Watcher;
