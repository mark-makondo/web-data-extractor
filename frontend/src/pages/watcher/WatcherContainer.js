import React, { useCallback, useContext, useEffect } from 'react';

// ui
import Watcher from './Watcher';

// context
import Context from 'store/context/Context';
import { AddCaptchaData, GetCaptchaData, EditCaptchaData, RemoveCaptchaData } from 'store/actions/captchaActions';
import { SocketContext } from 'store/context/SocketContext';

// custom hooks
import { UseLocalStorage } from 'hooks/UseLocalStorage';

const WatcherContainer = () => {
    const [captchas, setCaptchas] = UseLocalStorage([], 'captcha-storage');

    const socket = useContext(SocketContext);

    const {
        captchaDispatch,
        captchaState: {
            captcha: { data },
        },
    } = useContext(Context);

    let testImg = '';

    //** CAPTCHA UPDATE LISTENER FROM SOCKET **//

    useEffect(() => {
        socket.on('receive_captcha_status_to_update', (data) => {
            EditCaptchaData(data)(captchaDispatch);
        });

        return () => {
            socket.off('receive_captcha_status_to_update');
        };
    }, [socket, captchaDispatch]);

    useEffect(() => {
        socket.on('receive_captcha_to_remove', (data) => {
            const { key } = data;

            RemoveCaptchaData(key)(captchaDispatch);
        });

        return () => {
            socket.off('receive_captcha_to_remove');
        };
    }, [socket, captchaDispatch]);

    //** INITIALIZE CAPTCHA CONTEXT FROM STORAGE **//

    const init = useCallback(() => {
        GetCaptchaData(captchas)(captchaDispatch);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [captchaDispatch]);

    useEffect(() => {
        init();

        return () => {
            init();
        };
    }, [init]);

    //** PUT CAPTCHA TO STORAGE AND STATE**//

    const initializeCaptchas = useCallback(() => {
        let contextCaptcha = !!data && data;

        setCaptchas((old) => [...contextCaptcha]);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, captchaDispatch]);

    useEffect(() => {
        initializeCaptchas();

        return () => {
            initializeCaptchas();
        };
    }, [initializeCaptchas]);

    //** GET CAPTCHA FROM SOCKET IO *//

    useEffect(() => {
        socket.on('captcha', (data) => {
            AddCaptchaData(data)(captchaDispatch);
        });

        return () => {
            socket.off('captcha');
        };
    }, [socket, captchaDispatch]);

    return <Watcher img={testImg} />;
};

export default WatcherContainer;
