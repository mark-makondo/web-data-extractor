import { USER_LOADING, USER_GET, USER_UPDATE, USER_ERROR } from '../../constants/ActionTypes.js';

const UserReducer = (state, { payload, type }) => {
	switch (type) {
		case USER_LOADING:
			return {
				...state,
				user: {
					...state.user,
					loading: true,
					error: false,
				},
			};
		case USER_GET:
			return {
				...state,
				user: {
					loading: false,
					error: false,
					data: payload,
				},
			};
		case USER_UPDATE:
			return {
				...state,
				user: {
					loading: false,
					error: false,
					data: { ...state.user.data, ...payload },
				},
			};
		case USER_ERROR:
			return {
				...state,
				user: {
					...state.user,
					loading: false,
					error: payload,
				},
			};
		default:
			return state;
	}
};

export default UserReducer;
