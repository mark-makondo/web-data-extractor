import React, { useContext, useState } from 'react';

// antd
import { Modal } from 'antd';

// ui
import Captcha from './Captcha';

// axios
import axiosInstance from 'helper/axiosInstance.js';

// components
import captchaNotification from 'components/notification/notification';

// context
import Context from 'store/context/Context';
import { SocketContext } from 'store/context/SocketContext';
import { RemoveCaptchaData } from 'store/actions/captchaActions';

const CaptchaContainer = (props) => {
    const { visible, onClose, setIsModalOpen, selectedRecord, onModalClose } = props;

    const [loading, setLoading] = useState(false);
    const [captchaValue, setCaptchaValue] = useState('');

    const socket = useContext(SocketContext);

    const {
        captchaDispatch,
        userState: { user: data },
    } = useContext(Context);

    const captchaSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const params = {
            browserId: selectedRecord.browserId,
            url: selectedRecord.origin,
            captcha: captchaValue,
        };

        let {
            data: { success, error },
        } = await axiosInstance()
            .get(`/send-captcha`, { params })
            .catch((err) => {
                if (err) setLoading(false);
                return captchaNotification('error', 'topLeft', 'Captcha Status', 'Someting is wrong!');
            });

        if (success || error) {
            const { key } = selectedRecord;

            !!data && socket.emit('send_captcha_to_remove', { key, sentBy: { _id: data._id, email: data.email } });

            RemoveCaptchaData(key)(captchaDispatch);
            setLoading(false);
            setCaptchaValue('');
        }

        setIsModalOpen(false);

        if (success)
            return captchaNotification('success', 'topLeft', 'Captcha Status', 'Captcha is successfully solved.');
        if (error)
            return captchaNotification('error', 'topLeft', 'Captcha Status', 'Incorrect input! captcha is not solved.');
    };

    const captchaTimeoutFinish = () => {
        setIsModalOpen(false);
        setCaptchaValue('');
    };

    return (
        <Modal
            className="ant-modal--captcha"
            title={<h2 style={{ color: 'white', fontWeight: '600' }}>Captcha Solver </h2>}
            centered={true}
            onCancel={onClose}
            visible={visible}
            footer={null}
            afterClose={onModalClose}
            destroyOnClose={true}
        >
            <Captcha
                selectedRecord={selectedRecord}
                captchaSubmit={captchaSubmit}
                captchaValue={captchaValue}
                setCaptchaValue={setCaptchaValue}
                captchaTimeoutFinish={captchaTimeoutFinish}
                loading={loading}
            />
        </Modal>
    );
};

export default CaptchaContainer;
