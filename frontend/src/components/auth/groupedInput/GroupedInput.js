import React from 'react';

const GroupedInput = ({ inputChange, name, type, label, value, isRequired }) => {
	return (
		<div className='grouped-input'>
			<input
				id={name}
				onChange={(e) => inputChange(e)}
				className='normal-3'
				type={type}
				autoComplete={type === 'password' ? 'new-password' : 'off'}
				name={name}
				value={value}
				required={isRequired ? 'required' : ''}
			/>
			<label className='normal-3' htmlFor={name}>
				{label}
			</label>
		</div>
	);
};

export default GroupedInput;
