import React, { useContext, useState } from 'react';

// ui
import Buttons from './Buttons';

// modal
import MinerContainer from 'components/modals/miner/MinerContainer';

// context
import Context from 'store/context/Context';
import { DeleteCapturedData } from 'store/actions/captureActions';
import { RemoveDetails } from 'store/actions/detailsActions';

// helper
import { resetAllConfig } from 'helper/functions';

// component
import minerNotification from 'components/notification/notification';

const ButtonsContainer = ({ capturedData, selected, setSelected, setSavedKeywords }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { captureDispatch, targetDispatch, detailsDispatch } = useContext(Context);

    //** BUTTONS LOGIC **//

    const startCaptureClick = () => {
        setIsModalOpen(true);
    };

    const resetConfigClick = () => {
        resetAllConfig(captureDispatch, targetDispatch, detailsDispatch);
        setSavedKeywords('');

        minerNotification('warn', 'topLeft', 'Status', 'Config has been resetted.');
    };

    const deleteClick = () => {
        DeleteCapturedData(selected)(captureDispatch);
        RemoveDetails(selected)(detailsDispatch);

        setSelected([]);
    };

    //** MODAL LOGIC **//

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Buttons
                capturedData={capturedData}
                startCaptureClick={startCaptureClick}
                resetConfigClick={resetConfigClick}
                deleteClick={deleteClick}
                selected={selected}
            />

            <MinerContainer visible={isModalOpen} onClose={handleModalClose} setIsModalOpen={setIsModalOpen} />
        </>
    );
};

export default ButtonsContainer;
