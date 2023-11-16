import React from 'react';

// parts
import BodyContainer from './parts/Body/BodyContainer.js';
import HeaderContainer from './parts/Header/HeaderContainer.js';

const Miner = (props) => {
    const {
        loading,
        setLoading,
        target,
        setIsModalOpen,
        capturedData,
        setCapturedData,
        titleValidateStatus,
        onTitleChanged,
        title,
        spinnerText,
        setSpinnerText,
    } = props;
    return (
        <div className="miner">
            <HeaderContainer
                loading={loading}
                setLoading={setLoading}
                target={target}
                setIsModalOpen={setIsModalOpen}
                setCapturedData={setCapturedData}
                capturedData={capturedData}
                titleValidateStatus={titleValidateStatus}
                onTitleChanged={onTitleChanged}
                title={title}
                setSpinnerText={setSpinnerText}
            />
            <BodyContainer loading={loading} capturedData={capturedData} spinnerText={spinnerText} />
        </div>
    );
};

export default Miner;
