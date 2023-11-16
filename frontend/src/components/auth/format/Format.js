import React from 'react';

const Format = ({ svg, children }) => {
	return (
		<div className='format'>
			<div className='format__left'>{children}</div>
			<div className='format__right'>{svg}</div>
		</div>
	);
};

export default Format;
