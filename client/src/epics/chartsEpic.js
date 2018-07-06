import axios from 'axios';
import { of, from } from 'rxjs';
import { mergeMap, map, catchError, delay } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { fetchChartsDataSucecess } from '../actions/chartsAction';
import { FETCH_CHARTSDATA, FETCH_CHARTSDATA_FAILED } from '../actions/types';
import { API_PORT } from '../config';
import chartsQuery from '../gql/charts';

const chartsEpic = (action$, state$) =>
	action$.pipe(
		ofType(FETCH_CHARTSDATA),
		delay(500),
		mergeMap(action =>
			from(axios.post(`${API_PORT}/graphql`, { query: chartsQuery })).pipe(
				map(response => fetchChartsDataSucecess(response.data.data.charts)),
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

export default chartsEpic;
