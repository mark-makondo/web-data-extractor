import React from 'react';

// material ui
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// components
import GroupedInput from 'components/auth/groupedInput/GroupedInput.js';

const Form = ({ formClick, inputChange, input, loading, checkboxChange }) => {
    return (
        <form>
            <GroupedInput
                inputChange={inputChange}
                name="password"
                type="password"
                label="password"
                value={input.password}
                isRequired={true}
            />
            <GroupedInput
                inputChange={inputChange}
                name="confirmpassword"
                type="password"
                label="confirm password"
                value={input.confirmpassword}
                isRequired={true}
            />

            <div className="google-proceed__role">
                <input type="checkbox" id="role" name="role" onChange={(e) => checkboxChange(e)} />
                <label htmlFor="role"> Register as a Captcha Watcher</label>
            </div>

            {loading ? (
                <CircularProgress disableShrink />
            ) : (
                <Button onClick={(e) => formClick(e)} className="form-button normal-3" type="submit">
                    Proceed
                </Button>
            )}
        </form>
    );
};

export default Form;
