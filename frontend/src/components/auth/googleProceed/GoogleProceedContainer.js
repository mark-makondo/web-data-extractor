import React, { useContext, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';

// context
import Context from 'store/context/Context.js';
import { RegisterAction } from 'store/actions/authActions.js';

// ui
import GoogleProceed from './GoogleProceed.js';

const GoogleProceedContainer = () => {
    let tempUserData = localStorage.getItem('temp_user');
    let parsedData = JSON.parse(tempUserData);

    const [input, setInput] = useState({
        ...parsedData,
        password: '',
        confirmpassword: '',
        role: 'normal',
    });

    const {
        authState: {
            auth: { loading, error },
        },
        authDispatch,
    } = useContext(Context);

    let history = useHistory();

    const inputChange = (e) => {
        setInput({
            ...input,

            [e.target.name]: e.target.value,
        });
    };

    const checkboxChange = (e) => {
        let isChecked = e.target.checked;

        if (isChecked) {
            return setInput({
                ...input,
                role: 'watcher',
            });
        }

        return setInput({
            ...input,
            role: 'normal',
        });
    };

    const formClick = async (e) => {
        e.preventDefault();

        await RegisterAction(input, history, 'google-register')(authDispatch);
    };

    let isTempUser = !!localStorage.temp_user;
    if (!isTempUser) return <Redirect to="/" />;

    return (
        <GoogleProceed
            formClick={formClick}
            inputChange={inputChange}
            input={input}
            loading={loading}
            error={error}
            checkboxChange={checkboxChange}
        />
    );
};

export default GoogleProceedContainer;
