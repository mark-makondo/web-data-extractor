import React from 'react';

// antd
import { Table, Spin } from 'antd';

const Body = (props) => {
    let { columns, data, capturedData, loading, spinnerText } = props;

    let isCapturedDataExist = capturedData.length !== 0;

    return (
        <div style={{ width: '100%', margin: !isCapturedDataExist && 'auto' }} className="miner-body">
            <Spin style={{ width: '100%' }} spinning={loading} tip={spinnerText}>
                {isCapturedDataExist && <Table columns={columns} dataSource={data} size="small" bordered />}
            </Spin>
        </div>
    );
};

export default Body;
