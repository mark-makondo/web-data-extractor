import React from 'react';

// antd
import { Button, Drawer, Form, Input, Space, Spin, Tooltip, Switch } from 'antd';
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';

const { TextArea } = Input;

const DrawerFetchData = (props) => {
    const {
        showDrawer,
        selectedElementType,
        selectedElementText,
        title,
        onTitleChanged,
        titleValidateStatus,
        onCaptureInnerText,
        onCaptureHref,
        onCaptureImage,
        scrapeLoading,
        drawerMaskClosable,
        drawerClosable,
        setAsContainerClick,
        followLinkClick,
        nextPageClick,
        disableSetAsContainer,
        isToggleChecked,
        onToggleChange,
        disableToggleChecked,
        savedKeywords,
        targetElement,
        capturedData,
        onDrawerClose,
    } = props;

    let isTitleNotEmpty, isTitleSuccess, validTitle, isText, isImage, isUrl;
    let isCapturedDataNotEmpty, disableText, disableImage, disableUrl, disableFollowLink;

    isTitleNotEmpty = title !== '';
    isTitleSuccess = titleValidateStatus === 'success';
    validTitle = isTitleNotEmpty & isTitleSuccess;

    isCapturedDataNotEmpty = capturedData.length !== 0;

    isText = selectedElementType !== 'img';
    isImage = selectedElementType === 'img';
    isUrl = !!targetElement?.closest('a')?.href;

    // basic scraping options
    disableText = validTitle && isText ? '' : 'disable';
    disableImage = validTitle && isImage ? '' : 'disable';
    disableUrl = validTitle && isUrl ? '' : 'disable';

    disableFollowLink = isCapturedDataNotEmpty && isUrl ? '' : 'disable';

    return (
        <Drawer
            title="Captured Data Actions"
            placement="right"
            width={520}
            onClose={onDrawerClose}
            visible={showDrawer}
            maskClosable={drawerMaskClosable}
            closable={drawerClosable}
        >
            <Spin spinning={scrapeLoading} tip="Scraping now, please wait...">
                <Space style={{ width: '100%', textAlign: 'center' }} direction="vertical">
                    <div className="drawer-title">
                        <div className="drawer-title-text">
                            <h1 className="normal-1">Captured Preview Title:</h1>
                            <Tooltip title="Title must be unique. Check the captured preview if the same title already exists.">
                                <InfoCircleOutlined />
                            </Tooltip>
                        </div>
                        <Form.Item
                            style={{ marginBottom: 'unset', width: '100%' }}
                            hasFeedback
                            validateStatus={titleValidateStatus}
                        >
                            <Input placeholder="Title" value={title} onChange={onTitleChanged} />
                        </Form.Item>
                    </div>

                    <div className="drawer-textarea">
                        <h1 className="drawer-textarea__header normal-1">Selected Info:</h1>
                        <TextArea rows={8} value={selectedElementText} readOnly />
                    </div>

                    <div className="drawer-buttons">
                        {savedKeywords.length === 0 && (
                            <div className="drawer-buttons__relational">
                                <div className="drawer-buttons__header">
                                    <h1 className="normal-1">Relational Capture:</h1>
                                    <Tooltip title="Select a container first to enable relational capture.">
                                        <InfoCircleOutlined />
                                    </Tooltip>
                                    <Switch
                                        style={{ marginLeft: '.5rem' }}
                                        defaultChecked={false}
                                        checked={isToggleChecked}
                                        onChange={onToggleChange}
                                        checkedChildren="Enabled"
                                        unCheckedChildren="Disabled"
                                        disabled={disableToggleChecked}
                                    />
                                </div>

                                <div className="drawer-buttons__body">
                                    <Button
                                        type="primary"
                                        onClick={setAsContainerClick}
                                        disabled={disableSetAsContainer}
                                    >
                                        Set as Container
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="drawer-buttons__basic">
                            <h1 className="drawer-buttons__header normal-1">Basic Capture Options:</h1>
                            <div className="drawer-buttons__body">
                                <Button type="primary" onClick={onCaptureInnerText} disabled={disableText}>
                                    Capture Text
                                </Button>
                                <Button type="primary" onClick={onCaptureImage} disabled={disableImage}>
                                    Capture Image
                                </Button>
                                <Button type="primary" onClick={onCaptureHref} disabled={disableUrl}>
                                    Capture Target URL
                                </Button>
                            </div>
                        </div>

                        {savedKeywords.length === 0 && (
                            <div className="drawer-buttons__links">
                                <div className="drawer-buttons__header">
                                    <h1 className="normal-1">Other Capture Options:</h1>
                                    <Tooltip title="Title is not required here.">
                                        <InfoCircleOutlined />
                                    </Tooltip>
                                </div>
                                <div className="drawer-buttons__body">
                                    <Button
                                        type="primary"
                                        onClick={(e) => followLinkClick(e)}
                                        disabled={disableFollowLink}
                                    >
                                        Follow Link
                                    </Button>
                                    <Button type="primary" onClick={(e) => nextPageClick(e)}>
                                        Set as Next Page
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Space>
            </Spin>
        </Drawer>
    );
};

export default DrawerFetchData;
