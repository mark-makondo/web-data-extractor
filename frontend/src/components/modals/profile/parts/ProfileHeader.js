import React from 'react';

// material ui
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';

// helper
import { getNameInitials } from 'helper/functions.js';

const ProfileHeader = ({ user }) => {
	let initials = getNameInitials(user?.firstname, user?.lastname);

	return (
		<div className='profile__header'>
			<div className='profile__header-avatar'>
				{user ? (
					<Avatar className='profile__header-avatar-img' children={initials} src={user && user.avatar} />
				) : (
					<CircularProgress className='navbar-loading' disableShrink color='primary' />
				)}
			</div>
		</div>
	);
};

export default ProfileHeader;
