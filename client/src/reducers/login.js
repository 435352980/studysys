import { USER_LOGIN, USER_LOGIN_SUCCESS, USER_LOGIN_FAILED, USER_LOGOUT } from '../actions/types';

const loginReducer = (
	state = { loading: false, login: false, nickname: null, sex: null, error: null },
	action
) => {
	switch (action.type) {
		case USER_LOGIN:
			return { ...state, loading: true, error: null };
		case USER_LOGIN_SUCCESS:
			return { ...state, ...action.payload, loading: false, login: true, error: null };
		case USER_LOGIN_FAILED:
			return { ...state, loading: false, login: false, error: action.payload };
		case USER_LOGOUT:
			return { loading: false, login: false, error: null };
		default:
			return state;
	}
};

export default loginReducer;
