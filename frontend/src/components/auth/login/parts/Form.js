import React from 'react';

// material ui
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// components
import GroupedInput from '../../groupedInput/GroupedInput.js';

const Form = ({ formClick, registerClick, inputChange, input, loading }) => {
	return (
		<form>
			<GroupedInput
				inputChange={inputChange}
				name='email'
				type='email'
				label='email'
				value={input.email}
				isRequired={true}
			/>
			<GroupedInput
				inputChange={inputChange}
				name='password'
				type='password'
				label='password'
				value={input.password}
				isRequired={true}
			/>

			<div className='buttons'>
				{loading ? (
					<CircularProgress disableShrink />
				) : (
					<>
						<Button onClick={(e) => formClick(e)} className='form-button normal-3' type='submit'>
							Login
						</Button>
						<Button onClick={(e) => registerClick(e)} className='register normal-3'>
							Signup
						</Button>
					</>
				)}
			</div>
		</form>
	);
};

export default Form;
