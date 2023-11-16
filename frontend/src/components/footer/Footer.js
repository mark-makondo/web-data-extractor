import React from 'react';

// material icon
import GitHubIcon from '@material-ui/icons/GitHub';

// components
import Logo from '../logo/Logo.js';

// parts
import EmailHolder from './parts/EmailHolder.js';

const Footer = () => {
	return (
		<footer className='page-footer'>
			<div className='page-footer__left'>
				<div className='page-footer__left-group'>
					<a href='https://github.com/iSmeagol/web-data-extractor.git'>
						<GitHubIcon />
						<span>Github</span>
					</a>
				</div>
			</div>
			<div className='page-footer__middle'>
				<Logo showLogoTitle={true} />
			</div>
			<div className='page-footer__right'>
				<div className='page-footer__right-wrapper'>
					<EmailHolder email='markalbert.makondo@gmail.com' />
					<EmailHolder email='vandyke1906@gmail.com' />
					<EmailHolder email='cbenbinen1@gmail.com' />
				</div>
			</div>
		</footer>
	);
};

export default Footer;
