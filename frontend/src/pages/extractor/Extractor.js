import React from 'react';

// antd
import { Input, Space, Switch, BackTop, Spin, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

// components
import CapturedDataContainer from './../../components/collapse/CapturedDataContainer';
import SiteContentContainer from './siteContent/SiteContentContainer';

const { Search } = Input;

const Extractor = ({
    pageLoading,
    urlState,
    setUrlState,
    htmlState,
    captureState,
    switchChange,
    onSearch,
    capturedData,
    setCapturedData,
    keywordsButton,
    setkeywordsButton,
    keywordSearch,
    finalKeywords,
    setFinalKeywords,
    setTargetInput,
    savedKeywords,
    setSavedKeywords,
    contentClickAlertOpen,
}) => {
    return (
        <div className="extractor">
            <div className="extractor__body">
                <Spin spinning={pageLoading} tip="Fetching website...">
                    <Search
                        placeholder="Enter url.."
                        value={urlState}
                        onSearch={(value) => onSearch(value)}
                        onChange={(e) => setUrlState(e.target.value)}
                        enterButton
                        disabled={captureState ? true : false}
                    />
                    {/* {JSON.stringify(capturedData)} */}
                    <Space>
                        <Switch
                            checkedChildren="Interact"
                            unCheckedChildren="Interact"
                            checked={captureState}
                            onChange={(value) => switchChange(value)}
                        />
                        <Button
                            disabled={keywordsButton}
                            onClick={keywordSearch}
                            type="primary"
                            icon={<SearchOutlined />}
                        >
                            Search
                        </Button>
                    </Space>

                    <SiteContentContainer
                        content={htmlState}
                        captureState={captureState}
                        urlState={urlState}
                        setUrlState={setUrlState}
                        capturedData={capturedData}
                        setCapturedData={setCapturedData}
                        onSearch={onSearch}
                        setkeywordsButton={setkeywordsButton}
                        finalKeywords={finalKeywords}
                        savedKeywords={savedKeywords}
                        setSavedKeywords={setSavedKeywords}
                        setFinalKeywords={setFinalKeywords}
                        setTargetInput={setTargetInput}
                        interactAlertOpen={contentClickAlertOpen}
                        // setCaptureState={setCaptureState}
                        // classesState={classesState}
                        // setClassesState={setClassesState}
                    />
                    {htmlState && (
                        <BackTop
                            target={() =>
                                document.querySelector(
                                    '.extractor__body .ant-spin-container .rendered_container.active'
                                )
                            }
                        />
                    )}
                </Spin>
                <CapturedDataContainer
                    capturedData={capturedData}
                    setCapturedData={setCapturedData}
                    setSavedKeywords={setSavedKeywords}
                />
            </div>
        </div>
    );
};

export default Extractor;
