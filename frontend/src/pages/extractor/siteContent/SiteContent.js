import React from 'react';

// antd
import { Content } from 'antd/lib/layout/layout';

// components
import DrawerFetchDataContainer from 'components/drawer/DrawerFetchDataContainer';
import KeywordSearchContainer from 'components/modals/keywords/KeywordSearchContainer';

const SiteContent = ({
    title,
    content,
    urlState,
    capturedData,
    setCapturedData,
    showDrawer,
    finalKeywords,
    setkeywordsButton,
    setFinalKeywords,
    showModal,
    targetElement,
    setShowModal,
    setShowDrawer,
    selectedElementText,
    selectedElementType,
    selectedElementAttributes,
    targetClasses,
    contentOnClick,
    contentOnDoubleClick,
    contentOnMouseover,
    contentOnMouseout,
    savedKeywords,
    setSavedKeywords,
    onSearch,
}) => {
    return (
        <>
            <Content
                className={`rendered_container ${!!content ? 'active' : ''}`}
                id="html__content"
                onClick={contentOnClick}
                onDoubleClick={contentOnDoubleClick}
                onMouseOver={contentOnMouseover}
                onMouseOut={contentOnMouseout}
                dangerouslySetInnerHTML={{ __html: content }}
            ></Content>

            <DrawerFetchDataContainer
                drawerTitle={title}
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                selectedElementText={selectedElementText}
                selectedElementType={selectedElementType}
                selectedElementAttributes={selectedElementAttributes}
                urlState={urlState}
                targetClasses={targetClasses}
                savedKeywords={savedKeywords}
                setSavedKeywords={setSavedKeywords}
                finalKeywords={finalKeywords}
                targetElement={targetElement}
                onSearch={onSearch}
            />

            <KeywordSearchContainer
                showModal={showModal}
                setShowModal={setShowModal}
                finalKeywords={finalKeywords}
                setFinalKeywords={setFinalKeywords}
                targetElement={targetElement}
                capturedData={capturedData}
                setCapturedData={setCapturedData}
                setkeywordsButton={setkeywordsButton}
            />
        </>
    );
};

export default SiteContent;
