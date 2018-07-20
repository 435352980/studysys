import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { API_PORT } from '../config';

import { USER_LOGIN } from '../actions/types';
import { login } from '../actions';

export const loginEpic = (actions$, state$, { axios }) =>
	actions$.pipe(
		ofType(USER_LOGIN),
		mergeMap(action =>
			from(axios.post(`${API_PORT}/login`, action.payload)).pipe(
				map(res => login.loginSuccess(res.data)),
				catchError(error => of(login.loginFailed(new Error('请求失败!'))))
			)
		)
	);
