import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { debounceTime, catchError, mergeMap, map, filter } from 'rxjs/operators';
import { API_PORT } from '../config';
import { VALI_SIGNIN, VALI_USERNAME, VALI_NICKNAME, VALI_EMAIL } from '../actions/types';
import { isEmail } from '../lib/util';

import { signIn } from '../actions';

export const valiUserNameEpic = (actions$, state$, { axios }) =>
	actions$.pipe(
		ofType(VALI_USERNAME),
		debounceTime(1000),
		mergeMap(action => {
			const { username, callback } = action.payload;
			return from(axios.post(`${API_PORT}/valiusername`, { username })).pipe(
				map(res => {
					if (res.data.code === '200') {
						callback();
						return signIn.valiUserNameSuccess();
					} else {
						callback(res.data.message);
						return signIn.valiUserNameFailed(new Error(res.data.message));
					}
				}),
				catchError(error => {
					callback('网络错误,验证失败!');
					return of(signIn.valiUserNameFailed(new Error('网络错误,验证失败!')));
				})
			);
		})
	);

export const valiNicknameEpic = (actions$, state$, { axios }) =>
	actions$.pipe(
		ofType(VALI_NICKNAME),
		debounceTime(1000),
		mergeMap(action => {
			const { nickname, callback } = action.payload;
			return from(axios.post(`${API_PORT}/valinickname`, { nickname })).pipe(
				map(res => {
					if (res.data.code === '200') {
						callback();
						return signIn.valiNicknameSuccess();
					} else {
						callback(res.data.message);
						return signIn.valiNicknameFailed(new Error(res.data.message));
					}
				}),
				catchError(error => {
					callback('网络错误,验证失败!');
					return of(signIn.valiNicknameFailed(new Error('网络错误,验证失败!')));
				})
			);
		})
	);

export const valiEmailEpic = (actions$, state$, { axios }) =>
	actions$.pipe(
		ofType(VALI_EMAIL),
		debounceTime(1000),
		mergeMap(action => {
			const { email, callback } = action.payload;
			return from(axios.post(`${API_PORT}/valiemail`, { email })).pipe(
				map(res => {
					if (res.data.code === '200') {
						callback();
						return signIn.valiEmailSuccess();
					} else {
						callback(res.data.message);
						return signIn.valiEmailFailed(new Error(res.data.message));
					}
				}),
				catchError(error => {
					callback('网络错误,验证失败!');
					return of(signIn.valiEmailFailed(new Error('网络错误,验证失败!')));
				})
			);
		})
	);
