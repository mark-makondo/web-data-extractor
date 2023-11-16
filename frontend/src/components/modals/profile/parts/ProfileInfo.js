import React from 'react';

// sub parts
import InputGroup from './InputGroup.js';
import InputIcons from './InputIcons.js';

const ProfileInfo = ({
    user,
    nameInput,
    isEditFirstName,
    setIsEditFirstName,
    isEditLastName,
    setIsEditLastName,
    firstNameSaveClick,
    lastNameSaveClick,
    inputNameOnChange,
    setIsChangingPassword,
    isChangingPassword,
}) => {
    return (
        <div className="profile__body__info">
            <div className={`profile__body__info__firstname ${isEditFirstName && 'editable'}`}>
                <label htmlFor="firstname">first name: </label>
                <InputGroup
                    type="text"
                    name="firstname"
                    spanValue={user?.firstname}
                    inputValue={nameInput.firstname}
                    onChange={inputNameOnChange}
                />

                <InputIcons
                    editClick={setIsEditFirstName}
                    cancelClick={setIsEditFirstName}
                    saveClick={firstNameSaveClick}
                />
            </div>

            <div className={`profile__body__info__lastname ${isEditLastName && 'editable'}`}>
                <label htmlFor="lastname">last name: </label>
                <InputGroup
                    type="text"
                    name="lastname"
                    spanValue={user?.lastname}
                    inputValue={nameInput.lastname}
                    onChange={inputNameOnChange}
                />

                <InputIcons
                    editClick={setIsEditLastName}
                    cancelClick={setIsEditLastName}
                    saveClick={lastNameSaveClick}
                />
            </div>

            <span className="profile__body__info__loggedinas">
                Logged in as <strong>{user?.email}</strong>
            </span>

            <div className={`profile__body__info__password ${isChangingPassword && 'editable'}`}>
                <InputGroup
                    type="password"
                    name="password"
                    spanValue="password:"
                    inputValue="default password"
                    isReadOnly
                />

                <InputIcons editClick={setIsChangingPassword} cancelClick={setIsChangingPassword} includeSave={false} />
            </div>
        </div>
    );
};

export default ProfileInfo;
