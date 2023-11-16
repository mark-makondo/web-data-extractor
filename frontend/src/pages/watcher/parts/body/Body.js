import React from 'react';

import { Layout, Table } from 'antd';

const Body = (props) => {
    let { columns, data, rowClick } = props;

    return (
        <div className="watcher__body">
            <Table
                style={{ padding: '2rem' }}
                columns={columns}
                dataSource={data}
                size="middle"
                bordered
                onRow={(record) => ({
                    onClick: (_) => rowClick(record),
                })}
            />
        </div>
    );
};

export default Body;
