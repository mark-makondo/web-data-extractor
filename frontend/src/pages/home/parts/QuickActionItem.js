import React from 'react';

const QuickActionItem = ({ name, svg, isSelected, link, itemClick = undefined }) => {
	return (
		<div
			className={`home__content-item ${isSelected && 'selected'}`}
			onClick={(e) => (itemClick !== undefined ? itemClick(e) : '')}
		>
			<a href={link}>
				{svg}
				<span className='normal-2'>{name}</span>
			</a>
		</div>
	);
};
export default QuickActionItem;
