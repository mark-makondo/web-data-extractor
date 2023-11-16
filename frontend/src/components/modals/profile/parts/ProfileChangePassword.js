import React from 'react';

// material ui
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

// sub parts
import InputGroup from './InputGroup.js';

const ProfileChangePassword = ({
	loading,
	changePassSubmitHandler,
	inputPasswordOnChange,
	isChangingPassword,
	passwordInput,
}) => {
	return (
		<form className='profile__body__change-password normal-3' onSubmit={(e) => changePassSubmitHandler(e)}>
			<div className='profile__body__change-password__wrapper'>
				<div className='profile__body__change-password__current'>
					<label className={`${!isChangingPassword && 'disabled'}`} htmlFor='currentPassword'>
						Current Password:
					</label>

					<InputGroup
						type='password'
						name='currentPassword'
						inputValue={passwordInput.currentPassword}
						onChange={inputPasswordOnChange}
						isRequired
						isDisabled={!isChangingPassword && true}
					/>
				</div>
				<div className='profile__body__change-password__new'>
					<label className={`${!isChangingPassword && 'disabled'}`} htmlFor='newPassword'>
						New Password:
					</label>

					<InputGroup
						type='password'
						name='newPassword'
						inputValue={passwordInput.newPassword}
						onChange={inputPasswordOnChange}
						isRequired
						isDisabled={!isChangingPassword && true}
					/>
				</div>
			</div>

			{loading ? (
				<CircularProgress sizes='small' className='profile-loading' disableShrink color='primary' />
			) : (
				<Button className='normal-4 active' type='submit' disabled={!isChangingPassword && true}>
					Update Password
				</Button>
			)}
		</form>
	);
};

export default ProfileChangePassword;
