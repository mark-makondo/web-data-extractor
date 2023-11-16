import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

// context
import Context from 'store/context/Context.js';
import { RegisterAction } from 'store/actions/authActions.js';

// ui
import Register from './Register.js';

const RegisterContainer = () => {
    const [input, setInput] = useState({
        firstname: '',
        lastname: '',
        avatar: '',
        email: '',
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

    const history = useHistory();

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

        await RegisterAction(input, history)(authDispatch);
    };

    return (
        <Register
            formClick={formClick}
            inputChange={inputChange}
            input={input}
            error={error}
            loading={loading}
            checkboxChange={checkboxChange}
        />
    );
};

export default RegisterContainer;
