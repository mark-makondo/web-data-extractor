import React from 'react';

// material ui
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';

const InputIcons = ({ editClick = null, cancelClick = null, saveClick = null, includeSave = true }) => {
	return (
		<div className='input-icons'>
			<IconButton className='edit' size='small' onClick={() => editClick(true)} children={<EditIcon />} />
			<IconButton className='cancel' size='small' onClick={() => cancelClick(false)} children={<CancelIcon />} />
			{includeSave && (
				<IconButton className='save' size='small' onClick={(e) => saveClick(e)} children={<SaveIcon />} />
			)}
		</div>
	);
};

export default InputIcons;
