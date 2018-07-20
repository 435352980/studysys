import {
	VALI_SIGNIN,
	VALI_USERNAME,
	VALI_USERNAME_SUCCESS,
	VALI_USERNAME_FAILED,
	VALI_NICKNAME,
	VALI_NICKNAME_SUCCESS,
	VALI_NICKNAME_FAILED,
	VALI_EMAIL,
	VALI_EMAIL_SUCCESS,
	VALI_EMAIL_FAILED
} from '../actions/types';

const signInReducer = (
	state = {
		username: { loading: false, valid: false, error: null },
		nickname: { loading: false, valid: false, error: null },
		email: { loading: false, valid: false, error: null }
	},
	action
) => {
	switch (action.type) {
		case VALI_USERNAME:
			return { ...state, username: { loading: true, valid: false, error: null } };
		case VALI_USERNAME_SUCCESS:
			return { ...state, username: { loading: false, valid: true, error: null } };
		case VALI_USERNAME_FAILED:
			return { ...state, username: { loading: false, valid: false, error: action.payload } };

		case VALI_NICKNAME:
			return { ...state, nickname: { loading: true, valid: false, error: null } };
		case VALI_NICKNAME_SUCCESS:
			return { ...state, nickname: { loading: false, valid: true, error: null } };
		case VALI_NICKNAME_FAILED:
			return { ...state, nickname: { loading: false, valid: false, error: action.payload } };

		case VALI_EMAIL:
			return { ...state, email: { loading: true, valid: false, error: null } };
		case VALI_EMAIL_SUCCESS:
			return { ...state, email: { loading: false, valid: true, error: null } };
		case VALI_EMAIL_FAILED:
			return { ...state, email: { loading: false, valid: false, error: action.payload } };
		default:
			return state;
	}
};

export default signInReducer;
