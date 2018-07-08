import axios from 'axios';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, map, catchError, delay } from 'rxjs/operators';
import { API_PORT } from '../config';
import { FETCH_VOUCHINFO, FETCH_CHARTSDATA_FAILED } from '../actions/types';
import { fetchVouchInfoSucecess } from '../actions/vouchAction';
import vouchQuery from '../gql/vouch';

const vouchEpic = (action$, state$) =>
	action$.pipe(
		ofType(FETCH_VOUCHINFO),
		delay(500),
		mergeMap(action =>
			from(axios.post(`${API_PORT}/graphql`, { query: vouchQuery })).pipe(
				map(response => fetchVouchInfoSucecess(response.data.data.vouchInfo)),
				catchError(error =>
					of({
						type: FETCH_CHARTSDATA_FAILED,
						payload: error,
						error: true
					})
				)
			)
		)
	);

export default vouchEpic;
