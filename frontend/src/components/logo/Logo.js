import React from 'react';

import { ReactComponent as WDE } from '../../assets/svg/Logo-wde.svg';

const Logo = ({ showLogoTitle }) => {
	return (
		<div className='logo'>
			<WDE />
			{showLogoTitle && <span className='normal-2'> Web Data Extractor</span>}
		</div>
	);
};

export default Logo;
