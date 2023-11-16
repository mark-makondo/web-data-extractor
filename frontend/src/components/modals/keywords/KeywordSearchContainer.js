import React, { useState, useEffect } from 'react';
import KeywordSearch from './KeywordSearch';

const KeywordSearchContainer = ({
    showModal,
    setShowModal,
    setFinalKeywords,
    targetElement,
    setkeywordsButton,
    finalKeywords,
}) => {
    const [keywords, setKeywords] = useState('');
    let array = [];

    useEffect(() => {
        setkeywordsButton(finalKeywords.length === 0);
    }, [finalKeywords]);

    const saveKeywords = (e) => {
        let currentTarget = e.target;
        setKeywords(currentTarget.value);
    };
    const handleOk = () => {
        setFinalKeywords((oldKeywords) => [...oldKeywords, keywords]);
        targetElement.value = keywords.split(',')[0];
        setShowModal(false);
        setKeywords('');
    };

    const handleCancel = () => {
        setShowModal(false);
        setKeywords('');
    };
    return (
        <KeywordSearch
            showModal={showModal}
            setShowModal={setShowModal}
            handleOk={handleOk}
            handleCancel={handleCancel}
            keywords={keywords}
            setKeywords={setKeywords}
            saveKeywords={saveKeywords}
        />
    );
};

export default KeywordSearchContainer;
