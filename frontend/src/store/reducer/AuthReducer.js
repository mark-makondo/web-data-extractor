import {
	REGISTER_LOADING,
	REGISTER_SUCCESS,
	REGISTER_ERROR,
	LOGIN_LOADING,
	LOGIN_SUCCESS,
	LOGIN_ERROR,
	LOGOUT_LOADING,
	LOGOUT_SUCCESS,
	LOGOUT_ERROR,
} from '../../constants/ActionTypes.js';

const AuthReducer = (state, { payload, type }) => {
	switch (type) {
		case REGISTER_LOADING:
		case LOGOUT_LOADING:
		case LOGIN_LOADING:
			return {
				...state,
				auth: {
					...state.auth,
					error: false,
					loading: true,
				},
			};
		case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
		case LOGOUT_SUCCESS:
			return {
				...state,
				auth: {
					error: false,
					loading: false,
					user: payload,
				},
			};

		case REGISTER_ERROR:
		case LOGOUT_ERROR:
		case LOGIN_ERROR:
			return {
				...state,
				auth: {
					...state.auth,
					loading: false,
					error: payload,
				},
			};

		default:
			return state;
	}
};

export default AuthReducer;
