import { of, from } from 'rxjs';
import { mergeMap, map, catchError, debounceTime } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { charts as chartsAction } from '../actions';
import { FETCH_CHARTSDATA, FETCH_CHARTSDATA_FAILED } from '../actions/types';
import { API_PORT } from '../config';
import chartsQuery from '../gql/charts';

const chartsEpic = (action$, state$, { axios }) =>
	action$.pipe(
		ofType(FETCH_CHARTSDATA),
		debounceTime(500),
		mergeMap(action =>
			from(axios.post(`${API_PORT}/graphql`, { query: chartsQuery })).pipe(
				map(response => chartsAction.fetchChartsDataSucecess(response.data.data.charts)),
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

export default [ chartsEpic ];
