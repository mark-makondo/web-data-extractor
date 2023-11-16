import React, { useState, useContext, useEffect } from 'react';

// antd
import { Modal, Button } from 'antd';

// ui
import Miner from './Miner.js';

// context
import Context from 'store/context/Context.js';
import { NewScrapeData } from 'store/actions/scrapingActions.js';

//socket
import { SocketContext } from 'store/context/SocketContext.js';

// component
import minerNotification from 'components/notification/notification';

const MinerContainer = (props) => {
    const { visible, onClose, setIsModalOpen } = props;

    const [title, setTitle] = useState('');
    const [titleValidateStatus, setTitleValidateStatus] = useState('warning');
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [capturedData, setCapturedData] = useState([]);
    const [spinnerText, setSpinnerText] = useState('Fetching Captured Data, Please Wait ...');

    const socket = useContext(SocketContext);
    const {
        targetState: { target },
        scrapeDispatch,
        detailsState,
    } = useContext(Context);

    //** INPUT TITLE LOGIC**//

    useEffect(() => {
        if (title) setTitleValidateStatus('success');
        else setTitleValidateStatus('error');
    }, [title]);

    const onTitleChanged = (e) => {
        let currentTargetValue = e.target.value;
        setTitle(currentTargetValue);
    };

    useEffect(() => {
        socket.on('scrape_status', (data) => {
            const browserId = detailsState.details.puppeteerBrowserReference;
            if (browserId === data.browserId) setSpinnerText(data.status);
        });
        return () => {
            socket.off('scrape_status');
        };
    }, [socket, detailsState.details.puppeteerBrowserReference]);

    //** BUTTONS **//

    const saveClick = async () => {
        try {
            setSaveLoading(true);

            let isCapturedDataEmpty;

            isCapturedDataEmpty = capturedData.length === 0;

            if (!isCapturedDataEmpty) {
                let toSave = {
                    ...capturedData,
                    title,
                };

                let res = await NewScrapeData(toSave)(scrapeDispatch);

                if (res.data) {
                    setSaveLoading(false);

                    minerNotification('success', 'topLeft', 'Success!', 'Captured data has been saved to history.');
                }
            }
        } catch (error) {
            setSaveLoading(false);

            minerNotification('error', 'topLeft', 'Error!', error);
        }
    };

    let isSaveDisabled = title === '' || capturedData.length === 0 ? 'disabled' : '';

    let footer = [
        <Button key="submit" type="primary" loading={saveLoading} onClick={saveClick} disabled={isSaveDisabled}>
            Save to History
        </Button>,
    ];

    return (
        <Modal
            title={<h2 style={{ color: 'white', fontWeight: '600' }}>Extractor Capturer </h2>}
            centered={true}
            onCancel={onClose}
            visible={visible}
            footer={footer}
            width="90vw"
            afterClose={null}
            closable={!loading}
            maskClosable={!loading}
        >
            <Miner
                titleValidateStatus={titleValidateStatus}
                onTitleChanged={onTitleChanged}
                title={title}
                loading={loading}
                setLoading={setLoading}
                target={target}
                setIsModalOpen={setIsModalOpen}
                setCapturedData={setCapturedData}
                capturedData={capturedData}
                spinnerText={spinnerText}
                setSpinnerText={setSpinnerText}
            />
        </Modal>
    );
};

export default MinerContainer;
