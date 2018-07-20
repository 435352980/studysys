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
} from './types';

export const valiUserName = (username, callback) => ({
	type: VALI_USERNAME,
	payload: { username, callback }
});
export const valiUserNameSuccess = () => ({ type: VALI_USERNAME_SUCCESS });
export const valiUserNameFailed = error => ({ type: VALI_USERNAME_FAILED, payload: error });

export const valiNickname = (nickname, callback) => ({
	type: VALI_NICKNAME,
	payload: { nickname, callback }
});
export const valiNicknameSuccess = () => ({ type: VALI_NICKNAME_SUCCESS });
export const valiNicknameFailed = error => ({ type: VALI_NICKNAME_FAILED, payload: error });

export const valiEmail = (email, callback) => ({ type: VALI_EMAIL, payload: { email, callback } });
export const valiEmailSuccess = () => ({ type: VALI_EMAIL_SUCCESS });
export const valiEmailFailed = error => ({ type: VALI_EMAIL_FAILED, payload: error });
