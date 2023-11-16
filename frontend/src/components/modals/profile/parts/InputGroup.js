import React from 'react';

const InputGroup = ({
	type,
	name,
	spanValue = null,
	inputValue,
	onChange = null,
	isReadOnly = false,
	isRequired = false,
	isDisabled = false,
}) => {
	return (
		<div className='input-group'>
			{spanValue && <span>{spanValue}</span>}
			<input
				id={`profile-${name}`}
				className='normal-3'
				type={type}
				autoComplete={type === 'password' ? 'new-password' : 'off'}
				name={name}
				value={inputValue}
				onChange={(e) => onChange(e)}
				readOnly={isReadOnly ? 'readOnly' : ''}
				required={isRequired ? 'required' : ''}
				disabled={isDisabled ? 'disabled' : ''}
			/>
		</div>
	);
};

export default InputGroup;
