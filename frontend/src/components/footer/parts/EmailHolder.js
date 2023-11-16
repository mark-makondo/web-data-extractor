import React from 'react';

// material icon
import EmailIcon from '@material-ui/icons/Email';

const EmailHolder = ({ email }) => {
	return (
		<div className='page-footer__right-group'>
			<EmailIcon />
			<span>{email}</span>
		</div>
	);
};
export default EmailHolder;
