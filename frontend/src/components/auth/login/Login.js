import React from 'react';
import GoogleLogin from 'react-google-login';

// config
import Config from '../../../constants/Config.js';

// assets
import { ReactComponent as AuthBG } from '../../../assets/svg/Auth-bg.svg';
import { ReactComponent as GoogleLogo } from '../../../assets/svg/google-square.svg';

// components
import Logo from '../../logo/Logo.js';
import AuthFormat from '../format/Format.js';

// parts
import Header from './parts/Header.js';
import Form from './parts/Form.js';

const Login = ({
	formClick,
	registerClick,
	inputChange,
	handleGoogleLogin,
	input,
	loading,
	error,
}) => {
	return (
		<div className='login'>
			<div className='login__body'>
				<AuthFormat svg={<AuthBG />}>
					<Logo showLogoTitle={true} />

					<Header />

					<Form
						formClick={formClick}
						registerClick={registerClick}
						inputChange={inputChange}
						input={input}
						loading={loading}
					/>

					<span className='login__or normal-2'>or</span>

					<GoogleLogin
						clientId={Config.google.CLIENT_ID}
						render={(renderProps) => (
							<figure
								onClick={renderProps.onClick}
								disabled={renderProps.disabled}
								className='google-button normal-3'
							>
								<GoogleLogo width='1.5rem' height='1.5rem' />
								<figcaption>Signup/login with Google</figcaption>
							</figure>
						)}
						buttonText='Login'
						onSuccess={handleGoogleLogin}
						onFailure={handleGoogleLogin}
						cookiePolicy={'single_host_origin'}
					/>

					{error && (
						<div className='error normal-3'>
							Error:
							<span>{` ${error}`}</span>
						</div>
					)}
				</AuthFormat>
			</div>
		</div>
	);
};

export default Login;
