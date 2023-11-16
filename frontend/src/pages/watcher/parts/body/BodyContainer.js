import React, { useCallback, useContext, useEffect, useState } from 'react';

// modal
import CaptchaContainer from 'components/modals/captcha/CaptchaContainer';

// context
import Context from 'store/context/Context';
import { SocketContext } from 'store/context/SocketContext';
import { RemoveCaptchaData, EditCaptchaData } from 'store/actions/captchaActions';

// ui
import Body from './Body';

// helper
import { capitalize, tableSorter } from 'helper/functions.js';
import { Statistic } from 'antd';

const { Countdown } = Statistic;

const BodyContainer = () => {
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState({});

    const socket = useContext(SocketContext);

    const {
        captchaState: { captcha },
        captchaDispatch,
        userState: { user },
    } = useContext(Context);

    //** INITIAL DATA LOGIC **//

    const modifyContextCaptcha = useCallback(() => {
        let contextCaptcha = captcha.data;
        contextCaptcha && setRows([...contextCaptcha]);
    }, [captcha.data]);

    useEffect(() => {
        modifyContextCaptcha();

        return () => {
            modifyContextCaptcha();
        };
    }, [modifyContextCaptcha]);

    //** TIMEOUT LOGIC **//

    const Count = ({ record }) => {
        let { timeout, date } = record;

        let start = date + timeout * 1000;

        return (
            <Countdown
                format="HH:mm:ss"
                className="normal-3"
                valueStyle={{ fontSize: 16, fontWeight: 'bold', color: 'red' }}
                value={start}
                onFinish={() => handleTimeoutFinish(record.key)}
            />
        );
    };

    const handleTimeoutFinish = (key) => {
        RemoveCaptchaData(key)(captchaDispatch);
    };

    //** TABLE LOGIC **//

    const getTableColumns = useCallback((col) => {
        let tableColumnsHolder = [];

        col.forEach((title, i) => {
            title !== 'timeout' &&
                tableColumnsHolder.push({
                    key: i,
                    title: <h3 style={{ fontWeight: 'bolder' }}>{capitalize(title)}</h3>,
                    dataIndex: title,
                    ellipsis: true,
                    width: 100,
                    sorter: (a, b) => tableSorter(title, a, b),
                    sortDirections: ['descend', 'ascend'],
                    render: (text) => <div className="normal-2">{text}</div>,
                });

            title === 'timeout' &&
                tableColumnsHolder.push({
                    key: i,
                    title: <h3 style={{ fontWeight: 'bolder' }}>{capitalize(title)}</h3>,
                    dataIndex: title,
                    ellipsis: true,
                    width: 100,
                    sorter: (a, b) => tableSorter(title, a, b, 'timeout'),
                    sortDirections: ['descend', 'ascend'],
                    render: (text, record) => record.timeout && <Count record={record} />,
                });
        });

        return tableColumnsHolder;
    }, []);

    const populateTableWithCapturedData = useCallback(() => {
        let tableColumns, columnsHolder;

        columnsHolder = ['origin', 'status', 'timeout'];

        tableColumns = getTableColumns(columnsHolder);

        setColumns(tableColumns);
    }, [getTableColumns]);

    useEffect(() => {
        populateTableWithCapturedData();

        return () => {
            populateTableWithCapturedData();
        };
    }, [populateTableWithCapturedData]);

    const rowClick = (record) => {
        if (!!user.data) {
            const { _id, email } = user.data;

            if (record.inUse) return;

            setIsModalOpen(true);
            setSelectedRecord(record);

            const payload = {
                key: record.key,
                edit: {
                    status: `${email} is solving the captcha.`,
                    inUse: true,
                },
            };

            socket.emit('send_captcha_status_to_update', { ...payload, sentBy: { _id, email } });
            EditCaptchaData(payload)(captchaDispatch);
        }
    };

    //** MODAL LOGIC **//

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const onModalClose = () => {
        if (!!user.data) {
            const { _id, email } = user.data;

            const payload = {
                key: selectedRecord.key,
                edit: {
                    status: `Waiting for someone to solve.`,
                    inUse: false,
                },
            };

            socket.emit('send_captcha_status_to_update', { ...payload, sentBy: { _id, email } });
            EditCaptchaData(payload)(captchaDispatch);
        }
    };

    return (
        <>
            <Body columns={columns} data={rows} rowClick={rowClick} />
            <CaptchaContainer
                visible={isModalOpen}
                onClose={handleModalClose}
                setIsModalOpen={setIsModalOpen}
                selectedRecord={selectedRecord}
                onModalClose={onModalClose}
            />
        </>
    );
};

export default BodyContainer;
