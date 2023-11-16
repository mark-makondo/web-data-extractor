import React from 'react';

// antd
import { List } from 'antd';

const ScrapeData = ({ title, data, isSelected, itemPreviewClick }) => {
    return (
        <List
            style={{ border: isSelected(title) && '1px solid #2374de' }}
            size="small"
            header={<h2>{title}</h2>}
            bordered
            dataSource={data}
            onClick={(e) => itemPreviewClick(e, title)}
            renderItem={(item) => (
                <List.Item>
                    <span title={item}>{item}</span>
                </List.Item>
            )}
            pagination={{ pageSize: 5 }}
        />
    );
};

export default ScrapeData;
