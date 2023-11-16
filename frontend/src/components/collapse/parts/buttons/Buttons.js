import React from 'react';

// antd
import { Button, Space } from 'antd';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import PlayCircleOutlined from '@ant-design/icons/PlayCircleOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';

const Buttons = (props) => {
    const { capturedData, startCaptureClick, resetConfigClick, deleteClick, selected } = props;

    let isCapturedDataNotEmpty, isSelectedNotEmpty, capturedDataLength, selectedLength, disable, disableDelete;

    capturedDataLength = capturedData.length;
    selectedLength = selected.length;

    isCapturedDataNotEmpty = capturedDataLength !== 0;
    isSelectedNotEmpty = selectedLength !== 0;

    disable = isCapturedDataNotEmpty ? false : true;
    disableDelete = isSelectedNotEmpty ? false : true;

    return (
        <div className="collapse-header">
            <Space style={{ width: '100%', textAlign: 'center' }} direction="horizontal">
                <div className="buttons">
                    <Button
                        onClick={startCaptureClick}
                        type="primary"
                        size="middle"
                        icon={<PlayCircleOutlined />}
                        disabled={disable}
                    >
                        Start Capture
                    </Button>
                    <Button
                        onClick={resetConfigClick}
                        type="default"
                        size="middle"
                        icon={<SettingOutlined />}
                        disabled={disable}
                    >
                        Reset All Config
                    </Button>

                    <Button
                        onClick={deleteClick}
                        type="default"
                        size="middle"
                        icon={<DeleteOutlined />}
                        disabled={disableDelete}
                    >
                        {disableDelete ? 'Remove Selected' : `${selectedLength} selected`}
                    </Button>
                </div>
            </Space>
        </div>
    );
};

export default Buttons;
