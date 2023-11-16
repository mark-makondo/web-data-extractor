import React from 'react';

// assets
import { ReactComponent as Extractor } from 'assets/svg/Auth-bg.svg';

// components
import Logo from 'components/logo/Logo.js';
import AuthFormat from 'components/auth/format/Format.js';

// parts
import Form from './parts/Form.js';

const Register = ({ formClick, inputChange, input, loading, error, checkboxChange }) => {
    return (
        <div className="register">
            <div className="register__body">
                <AuthFormat svg={<Extractor />}>
                    <Logo showLogoTitle={true} />

                    <Form
                        formClick={formClick}
                        inputChange={inputChange}
                        input={input}
                        loading={loading}
                        checkboxChange={checkboxChange}
                    />

                    <span className="goto-login normal-3">
                        <a href="/">
                            Already have an account? click here to <strong>Login</strong>.
                        </a>
                    </span>

                    {error && (
                        <div className="error normal-3">
                            Error:
                            <span>{` ${error}`}</span>
                        </div>
                    )}
                </AuthFormat>
            </div>
        </div>
    );
};

export default Register;
