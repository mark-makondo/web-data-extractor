import React from 'react';

// antd
import { Button, InputNumber, Form, Input, Checkbox, Tooltip } from 'antd';
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';

const Header = (props) => {
    const {
        loading,
        title,
        onTitleChanged,
        titleValidateStatus,
        exportDataClick,
        pageNumberState,
        onPageNumberChanged,
        captureDataClick,
        onCheckBoxChanged,
        isCaptureAllChecked,
        capturedData,
        data,
    } = props;

    let isNextPageAvailable,
        isCheckBoxDisabled,
        isInputCanBeModified,
        isNumberOfPagesInputDisabled,
        isTitleEmpty,
        isCapturedDataEmpty,
        isExportDisabled;

    isTitleEmpty = title === '';
    isCapturedDataEmpty = capturedData.length === 0;

    isNextPageAvailable = !!data.nextPageSelector;
    isInputCanBeModified = isNextPageAvailable & !isCaptureAllChecked;

    isCheckBoxDisabled = !isNextPageAvailable ? 'disabled' : '';
    isNumberOfPagesInputDisabled = !!!isInputCanBeModified ? 'disabled' : '';
    isExportDisabled = isTitleEmpty || isCapturedDataEmpty ? 'disabled' : '';

    const MinerBasicOptions = () => {
        return (
            <div className="miner-header__basic miner-header--items">
                <span className="miner-header__btext">Basic</span>

                <div className="miner-header__basic-wrapper inside-wrappers">
                    <Button
                        loading={loading}
                        size="medium"
                        onClick={captureDataClick}
                        type="primary"
                        icon={<SaveOutlined />}
                    >
                        Capture
                    </Button>
                    <Button
                        size="medium"
                        onClick={exportDataClick}
                        type="primary"
                        icon={<DownloadOutlined />}
                        disabled={isExportDisabled}
                    >
                        Export
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="miner-header">
            <div className="miner-header__title ">
                <div className="miner-header__title-text">
                    <h1 className="normal-1">Captured Title:</h1>
                    <Tooltip title="Title is required for saving and exporting of Data">
                        <InfoCircleOutlined />
                    </Tooltip>
                </div>
                <Form.Item
                    style={{ width: '100%', marginBottom: 'unset' }}
                    hasFeedback
                    validateStatus={titleValidateStatus}
                >
                    <Input style={{ width: '100%' }} placeholder="Title..." value={title} onChange={onTitleChanged} />
                </Form.Item>
            </div>

            <div className="miner-header__functions">
                <MinerBasicOptions />

                <div className={`miner-header__drilling miner-header--items ${!isNextPageAvailable && 'disabled'}`}>
                    <div className="miner-header__btext">
                        <Checkbox onChange={onCheckBoxChanged} disabled={isCheckBoxDisabled}>
                            Capture All
                        </Checkbox>
                    </div>

                    <div className="miner-header__drilling-wrapper inside-wrappers">
                        <span className="title normal-3">Number of Pages to Scrape: </span>
                        <InputNumber
                            size="middle"
                            min={1}
                            defaultValue={1}
                            value={pageNumberState}
                            onChange={onPageNumberChanged}
                            disabled={isNumberOfPagesInputDisabled}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
