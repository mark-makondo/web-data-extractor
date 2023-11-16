import axiosInstance from 'helper/axiosInstance.js';

import { USER_LOADING, USER_GET, USER_UPDATE, USER_ERROR, COULD_NOT_CONNECT } from 'constants/ActionTypes.js';

/**
 * get user informations.
 */
export const GetUserInfo = (history) => async (userDispatch) => {
	try {
		userDispatch({
			type: USER_LOADING,
		});

		let res = await axiosInstance(history).get(`/user/current`);

		userDispatch({
			type: USER_GET,
			payload: res.data,
		});
	} catch (err) {
		userDispatch({
			type: USER_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};

/**
 * update user informations.
 */
export const UpdateUserInfo = (input, setIsEditable) => async (userDispatch) => {
	try {
		userDispatch({
			type: USER_LOADING,
		});

		let res = await axiosInstance().put(`/user/update`, input);

		!!res.data && setIsEditable(false);

		userDispatch({
			type: USER_UPDATE,
			payload: input,
		});
	} catch (err) {
		userDispatch({
			type: USER_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};

/**
 * update user password.
 */
export const ChangeUserPassword = (input, setIsChangingPassword) => async (userDispatch) => {
	try {
		userDispatch({
			type: USER_LOADING,
		});

		let res = await axiosInstance().put(`/user/change-password`, input);

		!!res.data && setIsChangingPassword(false);

		userDispatch({
			type: USER_UPDATE,
			payload: res.data,
		});
	} catch (err) {
		userDispatch({
			type: USER_ERROR,
			payload: err.response ? err.response.data : COULD_NOT_CONNECT,
		});
	}
};
