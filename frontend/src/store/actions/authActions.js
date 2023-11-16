import axiosInstance from 'helper/axiosInstance.js';

import {
    LOGIN_LOADING,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT_LOADING,
    LOGOUT_SUCCESS,
    LOGOUT_ERROR,
    REGISTER_LOADING,
    REGISTER_SUCCESS,
    REGISTER_ERROR,
    COULD_NOT_CONNECT,
} from 'constants/ActionTypes.js';

export const RegisterAction =
    (input, history = null, type) =>
    async (authDispatch) => {
        try {
            authDispatch({
                type: REGISTER_LOADING,
            });
            let res, googleRegister;

            googleRegister = type === 'google-register';

            res = await axiosInstance().post('/user/register', { ...input, type });

            if (history) {
                if (googleRegister) {
                    if (res.status === 200) {
                        localStorage.jwt_token = res.data.jwt_token;
                        localStorage.removeItem('temp_user');
                        history.push('/dashboard');
                    }
                }

                if (res.status === 201) {
                    history.push('/');
                }
            }

            authDispatch({
                type: REGISTER_SUCCESS,
                payload: res.data,
            });
        } catch (err) {
            authDispatch({
                type: REGISTER_ERROR,
                payload: err.response ? err.response.data : COULD_NOT_CONNECT,
            });
        }
    };

export const LoginAction =
    (input, history = null, type) =>
    async (authDispatch) => {
        try {
            authDispatch({
                type: LOGIN_LOADING,
            });

            let res, normalLogin, googleLogin;

            normalLogin = type === 'normal-login';
            googleLogin = type === 'google-login';

            if (normalLogin) res = await axiosInstance().post('/user/login', input);
            else if (googleLogin) {
                res = await axiosInstance().post('/user/google', {
                    token: input.tokenId,
                });
                localStorage.temp_user = JSON.stringify(res.data);
            }

            if (history) {
                if (res.data.proceed) history.push('/google/proceed');
                else if (res.status === 200) {
                    localStorage.jwt_token = res.data.jwt_token;
                    localStorage.removeItem('temp_user');
                    history.push('/dashboard');
                }
            }

            authDispatch({
                type: LOGIN_SUCCESS,
                payload: res.data,
            });
        } catch (err) {
            authDispatch({
                type: LOGIN_ERROR,
                payload: err.response ? err.response.data : COULD_NOT_CONNECT,
            });
        }
    };

export const LogoutAction =
    (history = null) =>
    (authDispatch) => {
        try {
            authDispatch({
                type: LOGOUT_LOADING,
            });

            axiosInstance().get(`/user/user-logout`);

            localStorage.removeItem('jwt_token');
            history.push('/');

            authDispatch({
                type: LOGOUT_SUCCESS,
                payload: null,
            });
        } catch (err) {
            authDispatch({
                type: LOGOUT_ERROR,
                payload: err.response ? err.response.data : COULD_NOT_CONNECT,
            });
        }
    };
