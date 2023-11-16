import React, { useCallback, useContext, useEffect, useState, forwardRef } from 'react';

// context
import Context from 'store/context/Context.js';
import { UpdateUserInfo, ChangeUserPassword } from 'store/actions/userActions.js';

// ui
import Profile from './Profile.js';

/**
 * we do forward ref because we are converting this component
 * to a modal using material ui.
 */
const ProfileContainer = forwardRef((props, ref) => {
    const [userInfo, setUserInfo] = useState();
    const [loading, setLoading] = useState();
    const [error, setError] = useState();
    const [isEditFirstName, setIsEditFirstName] = useState(false);
    const [isEditLastName, setIsEditLastName] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordInput, setPasswordInput] = useState({
        currentPassword: '',
        newPassword: '',
    });
    const [nameInput, setNameInput] = useState({
        firstname: '',
        lastname: '',
    });

    const {
        userState: { user },
        userDispatch,
    } = useContext(Context);

    const initializeData = useCallback(() => {
        setUserInfo(user?.data);
        setLoading(user?.loading);
        setError(user?.error);
    }, [user?.data, user?.loading, user?.error]);

    useEffect(() => {
        initializeData();
    }, [initializeData]);

    const inputNameOnChange = (e) => {
        setNameInput({
            ...nameInput,
            [e.target.name]: e.target.value,
        });
    };

    const inputPasswordOnChange = (e) => {
        setPasswordInput({
            ...passwordInput,
            [e.target.name]: e.target.value,
        });
    };

    const firstNameSaveClick = () => {
        UpdateUserInfo(nameInput, setIsEditFirstName)(userDispatch);
    };
    const lastNameSaveClick = () => {
        UpdateUserInfo(nameInput, setIsEditLastName)(userDispatch);
    };

    const changePassSubmitHandler = (e) => {
        e.preventDefault();

        ChangeUserPassword(passwordInput, setIsChangingPassword)(userDispatch);

        setPasswordInput({
            currentPassword: '',
            newPassword: '',
        });
    };

    const initializeName = useCallback(() => {
        if (!nameInput.firstname) nameInput.firstname = userInfo ? userInfo?.firstname : nameInput.firstname;
        if (!nameInput.lastname) nameInput.lastname = userInfo ? userInfo?.lastname : nameInput.lastname;
    }, [userInfo, nameInput]);

    useEffect(() => {
        initializeName();
    }, [initializeName]);

    return (
        <Profile
            userInfo={userInfo}
            loading={loading}
            error={error}
            nameInput={nameInput}
            isEditFirstName={isEditFirstName}
            setIsEditFirstName={setIsEditFirstName}
            isEditLastName={isEditLastName}
            setIsEditLastName={setIsEditLastName}
            firstNameSaveClick={firstNameSaveClick}
            lastNameSaveClick={lastNameSaveClick}
            inputNameOnChange={inputNameOnChange}
            passwordInput={passwordInput}
            isChangingPassword={isChangingPassword}
            setIsChangingPassword={setIsChangingPassword}
            changePassSubmitHandler={changePassSubmitHandler}
            inputPasswordOnChange={inputPasswordOnChange}
        />
    );
});

export default ProfileContainer;
