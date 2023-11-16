import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

// context
import Context from '../../../store/context/Context.js';
import { LoginAction } from '../../../store/actions/authActions.js';

// ui
import Login from './Login.js';

const LoginContainer = () => {
	const [input, setInput] = useState({
		email: '',
		password: '',
	});

	const {
		authState: {
			auth: { loading, error },
		},
		authDispatch,
	} = useContext(Context);

	let history = useHistory();

	/**
	 * input on change handler for login click
	 */
	const inputChange = (e) => {
		setInput({
			...input,
			[e.target.name]: e.target.value,
		});
	};

	/**
	 * login click handler
	 */
	const formClick = async (e) => {
		e.preventDefault();

		await LoginAction(input, history, 'normal-login')(authDispatch);
	};

	/**
	 * register click handler
	 */
	const registerClick = (e) => {
		e.preventDefault();
		history.push('/register');
	};

	/**
	 * google click handler
	 */
	const handleGoogleLogin = async (response) => {
		if (!response.error) {
			await LoginAction(response, history, 'google-login')(authDispatch);
		}
	};

	return (
		<Login
			formClick={formClick}
			registerClick={registerClick}
			inputChange={inputChange}
			handleGoogleLogin={handleGoogleLogin}
			input={input}
			loading={loading}
			error={error}
		/>
	);
};

export default LoginContainer;
