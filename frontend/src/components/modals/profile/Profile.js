import React, { forwardRef } from 'react';

// parts
import ProfileHeader from './parts/ProfileHeader.js';
import ProfileInfo from './parts/ProfileInfo.js';
import ProfileChangePassword from './parts/ProfileChangePassword.js';

const Profile = forwardRef((props, ref) => {
    let {
        userInfo,
        loading,
        error,

        nameInput,
        isEditFirstName,
        setIsEditFirstName,
        isEditLastName,
        setIsEditLastName,
        firstNameSaveClick,
        lastNameSaveClick,
        inputNameOnChange,

        passwordInput,
        changePassSubmitHandler,
        inputPasswordOnChange,
        isChangingPassword,
        setIsChangingPassword,
    } = props;

    return (
        <div tabIndex="-1" ref={ref} className="profile">
            <div className="profile__wrapper normal-3">
                <ProfileHeader user={userInfo} />

                <div className="profile__body normal-3">
                    <ProfileInfo
                        user={userInfo}
                        nameInput={nameInput}
                        isEditFirstName={isEditFirstName}
                        setIsEditFirstName={setIsEditFirstName}
                        isEditLastName={isEditLastName}
                        setIsEditLastName={setIsEditLastName}
                        firstNameSaveClick={firstNameSaveClick}
                        lastNameSaveClick={lastNameSaveClick}
                        inputNameOnChange={inputNameOnChange}
                        isChangingPassword={isChangingPassword}
                        setIsChangingPassword={setIsChangingPassword}
                    />
                    <ProfileChangePassword
                        loading={loading}
                        changePassSubmitHandler={changePassSubmitHandler}
                        inputPasswordOnChange={inputPasswordOnChange}
                        isChangingPassword={isChangingPassword}
                        setIsChangingPassword={setIsChangingPassword}
                        passwordInput={passwordInput}
                    />
                    {error && (
                        <div className="error normal-3">
                            Error:
                            <span>{` ${error}`}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default Profile;
