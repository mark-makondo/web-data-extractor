import React from 'react';

// assets
import { ReactComponent as Proceed } from 'assets/svg/Proceed-bg.svg';

// components
import Logo from 'components/logo/Logo.js';
import AuthFormat from 'components/auth/format/Format.js';

// parts
import Header from './parts/Header.js';
import Form from './parts/Form.js';

const GoogleProceed = ({ formClick, inputChange, input, loading, error, checkboxChange }) => {
    return (
        <div className="google-proceed">
            <div className="google-proceed__body">
                <AuthFormat svg={<Proceed />}>
                    <Logo showLogoTitle={true} />

                    <Header />

                    <Form
                        formClick={formClick}
                        inputChange={inputChange}
                        input={input}
                        loading={loading}
                        checkboxChange={checkboxChange}
                    />

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

export default GoogleProceed;
