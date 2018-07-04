import { FETCH_CHARTSDATA, FETCH_CHARTSDATA_SUCCESS, FETCH_CHARTSDATA_FAILED } from '../actions/types';

const chartsReducer = (
	state = { barChart: { category: [], data: [] }, pieChart: [], loading: false },
	action
) => {
	switch (action.type) {
		case FETCH_CHARTSDATA:
			return { ...state, loading: true };
		case FETCH_CHARTSDATA_SUCCESS:
			return { ...state, ...action.payload, loading: false };
		case FETCH_CHARTSDATA_FAILED:
			return { ...state, loading: false };
		default:
			return state;
	}
};

export default chartsReducer;
