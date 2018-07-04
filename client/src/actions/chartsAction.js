import { FETCH_CHARTSDATA, FETCH_CHARTSDATA_SUCCESS } from './types';

export const fetchChartsData = () => ({ type: FETCH_CHARTSDATA });
export const fetchChartsDataSucecess = payload => {
	return { type: FETCH_CHARTSDATA_SUCCESS, payload };
};
